import { GAME_CONSTANTS } from "../config/game-constants";
import { PlayerManager } from "../players/player-manager";
import { SpawnManager } from "../map/spawn-manager";
import { PeaceMode } from "../combat/peace-mode";
import { buildLayout, Layout } from "../shared/arena-layout";

type StageManagerLike = {
    startPreCombat: (duration: number) => void;
};

type RoundPhase = "planning" | "round";

type PlayerRoundState = {
    arenaId: number;
    finished: boolean;
    creeps: EntityIndex[];
    lastCombatPos?: Vector;
    pendingRespawnPos?: Vector;
    arenaCenter?: Vector;
    combatTeam?: DotaTeam;
};

/**
 * Контроллер бесконечных раундов PvE (каждый игрок на своей арене vs крипы).
 * Это каркас: дальше сюда можно наращивать логику (награды, предметы, спец-правила и т.д.).
 */
export class RoundController {
    private layout: Layout | null = null;

    private nextRoundNumber: number = 1;
    private activeRoundNumber: number | null = null;
    private activeRoundStartedAt: number | null = null;

    private playerStates: Map<PlayerID, PlayerRoundState> = new Map();

    private roundPollTimerName = "RoundController_Poll";
    private neutralPollTimerName = "RoundController_NeutralPeacePoll";
    private botFunNextAt: Map<PlayerID, number> = new Map();

    private stageManager: StageManagerLike | null = null;

    constructor(
        private playerManager: PlayerManager,
        private spawnManager: SpawnManager,
        private peaceMode: PeaceMode
    ) {}

    setStageManager(stageManager: StageManagerLike): void {
        this.stageManager = stageManager;
    }

    /**
     * Для UI: какой следующий раунд готовится
     */
    getNextRoundNumber(): number {
        return this.nextRoundNumber;
    }

    /**
     * Вызывается StageManager'ом при входе в "planning" (PRE_COMBAT).
     */
    onPlanningStageStarted(duration: number): void {
        this.ensureLayout();
        this.preparePlayerStates();
        this.sendRoundState("planning", this.nextRoundNumber, duration);
        try {
            (GameRules as any).Addon.isRoundActive = false;
            (GameRules as any).Addon.currentRound = this.nextRoundNumber;
        } catch (e) {}

        // Во время планирования держим всех в нейтрали и disarm (а также следим за нейтральной зоной постоянно)
        this.startNeutralZoneEnforcer();
    }

    /**
     * Вызывается CombatStage'ом при входе в COMBAT (то есть старт раунда).
     */
    onCombatStageStarted(): void {
        if (this.activeRoundNumber !== null) return;

        this.ensureLayout();
        this.activeRoundNumber = this.nextRoundNumber;
        this.activeRoundStartedAt = GameRules.GetGameTime();

        const round = this.activeRoundNumber;
        print(`=== RoundController: старт раунда ${round} ===`);
        try {
            (GameRules as any).Addon.isRoundActive = true;
            (GameRules as any).Addon.currentRound = round;
        } catch (e) {}

        this.sendRoundState("round", round, 0);
        this.startRound(round);
    }

    /**
     * Хук из GameMode.onNpcSpawned: нужен для "респавн там же".
     */
    onNpcSpawned(unit: CDOTA_BaseNPC): void {
        if (!unit.IsRealHero()) return;

        const hero = unit as CDOTA_BaseNPC_Hero;
        const pid = hero.GetPlayerID();
        if (pid === undefined) return;

        const st = this.playerStates.get(pid);
        if (!st?.pendingRespawnPos) return;

        // Если герой только что зареспавнился — телепортируем обратно.
        // Нормализуем Vector (на всякий случай).
        const p = st.pendingRespawnPos;
        const pos = Vector(p.x, p.y, p.z);
        hero.SetAbsOrigin(pos);
        FindClearSpaceForUnit(hero, pos, true);
        st.pendingRespawnPos = undefined;

        // После ручного RespawnHero движок часто даёт защиту/инвулн.
        // Нам нужно сразу вернуться в бой (без "стояния в неуязвимости").
        this.stripSpawnProtection(hero);
        this.enforceExclusiveControl(hero);
        this.forceAutoAttack(pid, hero);

        // Камеру подтянем к герою (только реальному клиенту; для ботов PlayerResource.GetPlayer может быть undefined).
        this.focusCameraOnHero(pid, hero);
    }

    /**
     * Хук из entity_killed (его повесим в GameMode): респавн через 2 сек.
     */
    onEntityKilled(event: EntityKilledEvent): void {
        if (event.entindex_killed === undefined) return;
        const killed = EntIndexToHScript(event.entindex_killed);
        if (!killed || !IsValidEntity(killed)) return;
        if (!(killed as CDOTA_BaseNPC).IsRealHero()) return;

        const hero = killed as CDOTA_BaseNPC_Hero;
        const pid = hero.GetPlayerID();
        if (pid === undefined) return;

        const st = this.playerStates.get(pid);
        if (!st) return;

        // Сохраняем позицию "где умер" (в арене) и респавним вручную через 3 сек.
        const o = hero.GetAbsOrigin();
        st.pendingRespawnPos = Vector(o.x, o.y, o.z);

        Timers.CreateTimer(3, () => {
            if (!IsValidEntity(hero)) return undefined;
            if (hero.IsAlive()) return undefined;
            hero.RespawnHero(false, false);
            return undefined;
        });
    }

    // ---------------------------
    // Round core
    // ---------------------------

    private startRound(round: number): void {
        this.preparePlayerStates();

        // телепорт на арены + снятие мирного режима
        for (const pid of this.playerManager.getAllValidPlayerIDs()) {
            const hero = this.playerManager.getPlayerHero(pid) ?? PlayerResource.GetSelectedHeroEntity(pid);
            if (!hero || !IsValidEntity(hero)) continue;

            const st = this.playerStates.get(pid);
            if (!st) continue;

            const slot = this.layout!.byId[st.arenaId];

            // Снимаем мирный режим (в арене должны бить крипов)
            this.peaceMode.removeFromHero(hero);

            // Телепорт в центр арены
            // ВАЖНО: никаких маркеров на карте не требуется — используем вычисляемый layout.
            const arenaCenter = Vector(slot.center.x, slot.center.y, slot.center.z);
            const spawn = Vector(slot.spawn.x, slot.spawn.y, slot.spawn.z);
            hero.SetAbsOrigin(spawn);
            FindClearSpaceForUnit(hero, spawn, true);
            st.arenaCenter = Vector(arenaCenter.x, arenaCenter.y, arenaCenter.z);

            // Камера на героя при телепорте
            this.focusCameraOnHero(pid, hero);

            // Боты: апаем уровень и автокачаем
            if (PlayerResource.IsFakeClient(pid)) {
                this.ensureBotLevelAndAutoSkills(hero);
            }

            // Спавн крипов и агр
            const creeps = this.spawnCreepsForHero(round, { x: arenaCenter.x, y: arenaCenter.y, z: arenaCenter.z }, hero);
            st.creeps = creeps.map(c => c.entindex());
            st.finished = false;
            const ho = hero.GetAbsOrigin();
            st.lastCombatPos = Vector(ho.x, ho.y, ho.z);
        }

        // стартуем опрос завершения
        this.startRoundPoll(round);
    }

    private endRound(round: number): void {
        print(`=== RoundController: раунд ${round} завершён (все игроки справились) ===`);

        this.activeRoundNumber = null;
        this.activeRoundStartedAt = null;
        this.nextRoundNumber++;
        try {
            (GameRules as any).Addon.isRoundActive = false;
            (GameRules as any).Addon.currentRound = this.nextRoundNumber;
        } catch (e) {}

        // Переходим в планирование следующего раунда (10 сек)
        if (!this.stageManager) {
            print("RoundController WARNING: stageManager is not set, cannot transition to planning");
            return;
        }
        this.stageManager.startPreCombat(GAME_CONSTANTS.BETWEEN_ROUNDS_PLANNING_TIME);
    }

    private startRoundPoll(round: number): void {
        Timers.RemoveTimer(this.roundPollTimerName);
        Timers.CreateTimer(this.roundPollTimerName, {
            endTime: 0.2,
            callback: () => {
                if (this.activeRoundNumber !== round) return undefined;

                // Таймаут раунда: если крипы живы слишком долго — удаляем и засчитываем как победу.
                const startedAt = this.activeRoundStartedAt ?? GameRules.GetGameTime();
                const elapsed = GameRules.GetGameTime() - startedAt;
                if (elapsed >= 80) {
                    this.forceFinishRoundByTimeout();
                }

                // Защитный фикс: если у бота есть живые крипы, но он не на своей арене — возвращаем.
                this.enforceBotsOnArenas();

                let allFinished = true;
                for (const pid of this.playerManager.getAllValidPlayerIDs()) {
                    const st = this.playerStates.get(pid);
                    if (!st) continue;
                    if (st.finished) continue;

                    // Проверяем живые ли крипы
                    const alive = st.creeps.some((idx) => {
                        const ent = EntIndexToHScript(idx);
                        return ent && IsValidEntity(ent) && (ent as CDOTA_BaseNPC).IsAlive();
                    });

                    if (!alive) {
                        st.finished = true;
                        this.returnPlayerToNeutral(pid);
                    } else {
                        allFinished = false;
                    }
                }

                if (allFinished) {
                    this.endRound(round);
                    return undefined;
                }

                return 0.2;
            }
        });
    }

    private returnPlayerToNeutral(pid: PlayerID): void {
        const hero = this.playerManager.getPlayerHero(pid) ?? PlayerResource.GetSelectedHeroEntity(pid);
        if (!hero || !IsValidEntity(hero)) return;

        const spawn = this.spawnManager.getNeutralCenter();
        const dx = RandomInt(-200, 200);
        const dy = RandomInt(-200, 200);
        const pos = Vector(spawn.x + dx, spawn.y + dy, spawn.z);

        hero.SetAbsOrigin(pos);
        FindClearSpaceForUnit(hero, pos, true);

        // В нейтрали disarm
        this.peaceMode.applyToHero(hero);
        this.focusCameraOnHero(pid, hero);
    }

    private preparePlayerStates(): void {
        this.ensureLayout();

        const playerIDs = this.playerManager.getAllValidPlayerIDs().sort((a, b) => a - b);
        for (let i = 0; i < playerIDs.length; i++) {
            const pid = playerIDs[i];
            const arenaId = math.min(8, i + 1); // 1..8

            const existing = this.playerStates.get(pid);
            if (existing) {
                existing.arenaId = arenaId;
                existing.finished = false;
                existing.creeps = [];
            } else {
                this.playerStates.set(pid, { arenaId, finished: false, creeps: [] });
            }
        }
    }

    private ensureLayout(): void {
        if (this.layout) return;

        // Для публикации debug должен быть выключен (иначе spam print + просадки).
        this.layout = buildLayout({ debug: false, logPrefix: "[arena-layout]" });
    }

    private startNeutralZoneEnforcer(): void {
        this.ensureLayout();
        Timers.RemoveTimer(this.neutralPollTimerName);
        Timers.CreateTimer(this.neutralPollTimerName, {
            endTime: 0.25,
            callback: () => {
                const safeBounds = this.layout!.neutral.bounds;
                const extBounds = this.layout!.neutral.extendedBounds;
                for (const pid of this.playerManager.getAllValidPlayerIDs()) {
                    const hero = this.playerManager.getPlayerHero(pid) ?? PlayerResource.GetSelectedHeroEntity(pid);
                    if (!hero || !IsValidEntity(hero)) continue;

                    // Автодоставка покупок: если предмет попал в stash, переносим его в свободный слот инвентаря/рюкзака.
                    // Это делает "универсальный магазин" реально удобным — предметы доступны сразу, а не только после смерти/респавна у фонтана.
                    this.autoDeliverStashItems(hero);

                    const o = hero.GetAbsOrigin();
                    const p = { x: o.x, y: o.y, z: o.z };
                    const inSafe =
                        p.x >= safeBounds.mins.x &&
                        p.x <= safeBounds.maxs.x &&
                        p.y >= safeBounds.mins.y &&
                        p.y <= safeBounds.maxs.y;
                    const inExtended =
                        p.x >= extBounds.mins.x &&
                        p.x <= extBounds.maxs.x &&
                        p.y >= extBounds.mins.y &&
                        p.y <= extBounds.maxs.y;

                    if (inSafe) {
                        // Safe: мягкие ограничения на авто-агр + полный реген
                        this.peaceMode.applyToHero(hero);
                        if (!hero.HasModifier("modifier_arcpit_neutral_regen")) {
                            hero.AddNewModifier(hero, undefined, "modifier_arcpit_neutral_regen", {});
                        }
                        if (hero.HasModifier("modifier_arcpit_neutral_mana_regen")) {
                            hero.RemoveModifierByName("modifier_arcpit_neutral_mana_regen");
                        }

                        // Боты на базе "балуються": каждые 5 сек выдаём на 5 сек случайный модификатор поведения.
                        if (PlayerResource.IsFakeClient(pid)) {
                            this.applyBotBaseFun(pid, hero);
                        }
                    } else if (inExtended) {
                        // Unsafe ring: без HP-регена, но с маной и с фановыми модификаторами (иначе боты там тупят).
                        this.peaceMode.removeFromHero(hero);
                        if (hero.HasModifier("modifier_arcpit_neutral_regen")) {
                            hero.RemoveModifierByName("modifier_arcpit_neutral_regen");
                        }
                        if (!hero.HasModifier("modifier_arcpit_neutral_mana_regen")) {
                            hero.AddNewModifier(hero, undefined, "modifier_arcpit_neutral_mana_regen", {});
                        }
                        if (PlayerResource.IsFakeClient(pid)) {
                            this.applyBotBaseFun(pid, hero);
                        }
                    } else {
                        // Вне нейтрали можно драться с крипами
                        this.peaceMode.removeFromHero(hero);
                        if (hero.HasModifier("modifier_arcpit_neutral_regen")) {
                            hero.RemoveModifierByName("modifier_arcpit_neutral_regen");
                        }
                        if (hero.HasModifier("modifier_arcpit_neutral_mana_regen")) {
                            hero.RemoveModifierByName("modifier_arcpit_neutral_mana_regen");
                        }

                        // Если бот вышел из нейтрали — сбрасываем таймер, чтобы при возврате быстро начал снова.
                        if (PlayerResource.IsFakeClient(pid)) {
                            this.botFunNextAt.delete(pid);
                        }
                    }
                }
                return 0.25;
            }
        });
    }

    private enforceBotsOnArenas(): void {
        if (this.activeRoundNumber === null) return;
        if (!this.layout) return;

        for (const pid of this.playerManager.getAllValidPlayerIDs()) {
            if (!PlayerResource.IsFakeClient(pid)) continue;

            const st = this.playerStates.get(pid);
            if (!st || st.finished) continue;

            // Если крипов уже нет — нечего чинить
            const hasAliveCreeps = st.creeps.some((idx) => {
                const ent = EntIndexToHScript(idx);
                return ent && IsValidEntity(ent) && (ent as CDOTA_BaseNPC).IsAlive();
            });
            if (!hasAliveCreeps) continue;

            const hero = this.playerManager.getPlayerHero(pid) ?? PlayerResource.GetSelectedHeroEntity(pid);
            if (!hero || !IsValidEntity(hero)) continue;

            const slot = this.layout.byId[st.arenaId];
            const ho = hero.GetAbsOrigin();
            const hpos = Vector(ho.x, ho.y, ho.z);

            // Если герой мёртв — гарантируем, что респавн будет в арене
            if (!hero.IsAlive()) {
                st.pendingRespawnPos = Vector(slot.spawn.x, slot.spawn.y, slot.spawn.z);
                continue;
            }

            // Если герой жив, но вне своей арены — телепортируем назад и даём автоатаку
            const inArena = slot.contains2D({ x: hpos.x, y: hpos.y, z: hpos.z } as any);
            if (!inArena) {
                const spawn = Vector(slot.spawn.x, slot.spawn.y, slot.spawn.z);
                hero.SetAbsOrigin(spawn);
                FindClearSpaceForUnit(hero, spawn, true);
                st.lastCombatPos = Vector(spawn.x, spawn.y, spawn.z);
                this.enforceExclusiveControl(hero);
                this.forceAutoAttack(pid, hero);
            }
        }
    }

    private forceFinishRoundByTimeout(): void {
        if (this.activeRoundNumber === null) return;

        for (const pid of this.playerManager.getAllValidPlayerIDs()) {
            const st = this.playerStates.get(pid);
            if (!st || st.finished) continue;

            // Удаляем оставшихся крипов
            for (const idx of st.creeps) {
                const ent = EntIndexToHScript(idx);
                if (!ent || !IsValidEntity(ent)) continue;
                const creep = ent as CDOTA_BaseNPC;
                if (!creep.IsAlive()) continue;
                try {
                    // best-effort: RemoveSelf существует у большинства entities
                    (creep as any).RemoveSelf?.();
                } catch (e) {}
                try {
                    (globalThis as any).UTIL_Remove?.(creep);
                } catch (e) {}
            }

            st.finished = true;
            this.returnPlayerToNeutral(pid);
        }
    }

    private applyBotBaseFun(pid: PlayerID, hero: CDOTA_BaseNPC_Hero): void {
        // если уже действует один из fun-модификаторов — ничего не делаем
        if (hero.HasModifier("modifier_arcpit_bot_fun_hunt") || hero.HasModifier("modifier_arcpit_bot_fun_wander")) {
            return;
        }

        const now = GameRules.GetGameTime();
        const prev = this.botFunNextAt.get(pid);
        const nextAt = prev !== undefined ? prev : 0;
        if (now < nextAt) return;

        // каждые 5 секунд, модификатор на 5 секунд
        this.botFunNextAt.set(pid, now + 5.0);

        const roll = RandomInt(1, 100);
        const name = roll <= 50 ? "modifier_arcpit_bot_fun_hunt" : "modifier_arcpit_bot_fun_wander";
        hero.AddNewModifier(hero, undefined, name, { duration: 5.0 });
    }

    /**
     * Переносит предметы из stash (обычно слоты 9..14) в свободные слоты инвентаря/рюкзака (0..8).
     * Best-effort: индексы слотов и наличие SwapItems зависят от окружения/биндингов.
     */
    private autoDeliverStashItems(hero: CDOTA_BaseNPC_Hero): void {
        // слоты: 0..5 inventory, 6..8 backpack, 9..14 stash (стандартный порядок в Dota VScript)
        const MAIN_AND_BACKPACK = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        const STASH = [9, 10, 11, 12, 13, 14];

        // Собираем свободные слоты (куда можно положить предмет)
        const free: number[] = [];
        for (const s of MAIN_AND_BACKPACK) {
            const it = hero.GetItemInSlot(s);
            if (!it) free.push(s);
        }
        if (free.length <= 0) return;

        // Перетаскиваем предметы из stash в свободные слоты
        let moved = 0;
        let freeIdx = 0;
        for (const stashSlot of STASH) {
            if (freeIdx >= free.length) break;
            const it = hero.GetItemInSlot(stashSlot);
            if (!it) continue;

            const dst = free[freeIdx];
            freeIdx++;

            // SwapItems — самый безопасный способ перемещения между слотами
            let swapped = false;
            try {
                const h: any = hero as any;
                if (typeof h.SwapItems === "function") {
                    h.SwapItems(stashSlot, dst);
                    swapped = true;
                }
            } catch (e) {
                swapped = false;
            }
            if (swapped) {
                moved++;
            }
        }

        // Если что-то сдвинули — всё, выходим. (Если SwapItems отсутствует, просто молча ничего не делаем)
        if (moved > 0) {
            // noop
        }
    }

    // ---------------------------
    // Creeps
    // ---------------------------

    private spawnCreepsForHero(round: number, center: { x: number; y: number; z: number }, hero: CDOTA_BaseNPC_Hero): CDOTA_BaseNPC[] {
        const creeps: CDOTA_BaseNPC[] = [];

        const countBase = 6;
        const count = countBase + math.floor((round - 1) * 0.75) + RandomInt(0, 2);

        const creepPool = [
            "npc_dota_creep_badguys_melee",
            "npc_dota_creep_badguys_ranged",
        ];

        for (let i = 0; i < count; i++) {
            const unitName = creepPool[RandomInt(0, creepPool.length - 1)];
            const dx = RandomInt(-450, 450);
            const dy = RandomInt(-450, 450);
            const pos = Vector(center.x + dx, center.y + dy, center.z);

            const creep = CreateUnitByName(unitName, pos, true, undefined, undefined, DotaTeam.BADGUYS);
            if (!creep) continue;
            FindClearSpaceForUnit(creep, pos, true);

            this.applyCreepScaling(creep, round);

            // Агрим на героя.
            // Важно: ATTACK_TARGET требует, чтобы цель была "видима" для стороны, которая отдаёт приказ.
            // Если приказ проваливается, дефолтные крипы могут уйти по лейну в центр карты — отсюда баг "все бегут в центр".
            // Поэтому сначала даём ATTACK_MOVE в позицию героя (не требует видимости), а дальше крипы добьют через IdleAcquire.
            creep.SetIdleAcquire(true);
            creep.SetAcquisitionRange(2500);
            const ho = hero.GetAbsOrigin();
            const heroPos = Vector(ho.x, ho.y, ho.z);
            ExecuteOrderFromTable({
                UnitIndex: creep.entindex(),
                OrderType: UnitOrder.ATTACK_MOVE,
                Position: heroPos,
            });

            creeps.push(creep);
        }

        return creeps;
    }

    private stripSpawnProtection(hero: CDOTA_BaseNPC_Hero): void {
        // Список best-effort: разные патчи/режимы используют разные названия.
        const toRemove = [
            "modifier_invulnerable",
            "modifier_fountain_invulnerability",
            "modifier_fountain_aura_buff",
            "modifier_respawn_protection",
        ];
        for (const name of toRemove) {
            while (hero.HasModifier(name)) {
                hero.RemoveModifierByName(name);
            }
        }

        // На всякий случай возвращаем авто-агр.
        hero.SetIdleAcquire(true);
        hero.SetAcquisitionRange(GAME_CONSTANTS.DEFAULT_ACQUISITION_RANGE);
    }

    private enforceExclusiveControl(hero: CDOTA_BaseNPC_Hero): void {
        const owner = hero.GetPlayerID();
        if (owner === undefined) return;
        // На всякий случай: после ReplaceHeroWith/RespawnHero движок иногда "расшаривает" controllable.
        for (let p = 0; p < 64; p++) {
            if (!PlayerResource.IsValidPlayerID(p)) continue;
            hero.SetControllableByPlayer(p as PlayerID, false);
        }
        hero.SetControllableByPlayer(owner, true);
    }

    private forceAutoAttack(pid: PlayerID, hero: CDOTA_BaseNPC_Hero): void {
        // Ищем ближайшего вражеского крипа и приказываем атаковать.
        const o = hero.GetAbsOrigin();
        const origin = Vector(o.x, o.y, o.z);

        const enemies = FindUnitsInRadius(
            hero.GetTeamNumber(),
            origin,
            undefined,
            GAME_CONSTANTS.BOT_SEARCH_RADIUS,
            UnitTargetTeam.ENEMY,
            UnitTargetType.BASIC,
            UnitTargetFlags.NONE,
            FindOrder.CLOSEST,
            false
        );

        if (enemies.length > 0) {
            ExecuteOrderFromTable({
                UnitIndex: hero.entindex(),
                OrderType: UnitOrder.ATTACK_TARGET,
                TargetIndex: enemies[0].entindex(),
            });
            return;
        }

        // Если крипы еще не подлетели — остаёмся в пределах арены (не бежим в (0,0)).
        const st = this.playerStates.get(pid);
        const center = st?.arenaCenter ?? st?.lastCombatPos;
        if (center) {
            ExecuteOrderFromTable({
                UnitIndex: hero.entindex(),
                OrderType: UnitOrder.ATTACK_MOVE,
                Position: center,
            });
        }
    }

    private applyCreepScaling(creep: CDOTA_BaseNPC, round: number): void {
        const stacks = math.max(0, round - 1);
        if (stacks <= 0) return;
        creep.AddNewModifier(creep, undefined, "modifier_round_creep_scaling", { stacks });
    }

    // ---------------------------
    // Bots progression
    // ---------------------------

    private ensureBotLevelAndAutoSkills(hero: CDOTA_BaseNPC_Hero): void {
        // Апнем до нужного уровня без авто-раскидки
        const target = GAME_CONSTANTS.BOT_START_LEVEL;
        const cur = hero.GetLevel();
        if (cur < target) {
            for (let i = cur; i < target; i++) {
                hero.HeroLevelUp(false);
            }
        }

        // Равномерно качаем все доступные способности
        this.autoLevelAbilitiesEvenly(hero);
    }

    private autoLevelAbilitiesEvenly(hero: CDOTA_BaseNPC_Hero): void {
        let points = hero.GetAbilityPoints();
        if (points <= 0) return;

        // собираем список прокачиваемых абилок
        const abil: CDOTABaseAbility[] = [];
        const talents: CDOTABaseAbility[] = [];
        for (let i = 0; i < hero.GetAbilityCount(); i++) {
            const a = hero.GetAbilityByIndex(i);
            if (!a) continue;
            const name = a.GetAbilityName();
            if (!name) continue;
            if (a.GetMaxLevel() <= 0) continue;
            if (name.startsWith("special_bonus_")) {
                talents.push(a);
            } else {
                abil.push(a);
            }
        }
        if (abil.length === 0 && talents.length === 0) return;

        let guard = 0;
        let idx = 0;
        while (points > 0 && guard < 5000) {
            guard++;
            if (abil.length <= 0) break;
            const a = abil[idx % abil.length];
            idx++;
            if (!a) continue;
            if (a.GetLevel() >= a.GetMaxLevel()) continue;

            // Пытаемся поднять уровень и списать 1 пойнт (как в тестах)
            const newLevel = a.GetLevel() + 1;
            a.SetLevel(newLevel);
            points = hero.GetAbilityPoints();
            hero.SetAbilityPoints(math.max(0, points - 1));
            points = hero.GetAbilityPoints();
        }

        // Если остались пойнты (часто из-за отсутствия дефолтных абилок) — потратим их на таланты.
        if (points > 0 && talents.length > 0) {
            let tguard = 0;
            let tidx = 0;
            while (points > 0 && tguard < 256) {
                tguard++;
                const t = talents[tidx % talents.length];
                tidx++;
                if (!t) continue;
                if (t.GetLevel() >= t.GetMaxLevel()) continue;
                t.SetLevel(t.GetLevel() + 1);
                points = hero.GetAbilityPoints();
                hero.SetAbilityPoints(math.max(0, points - 1));
                points = hero.GetAbilityPoints();
            }
        }
    }

    // ---------------------------
    // UI / Camera
    // ---------------------------

    private sendRoundState(phase: RoundPhase, round: number, duration: number): void {
        CustomGameEventManager.Send_ServerToAllClients("round_state_changed", {
            phase,
            round,
            duration,
        });
    }

    private focusCameraOnHero(pid: PlayerID, hero: CDOTA_BaseNPC_Hero): void {
        const player = PlayerResource.GetPlayer(pid);
        if (!player) return;
        CustomGameEventManager.Send_ServerToPlayer(player, "camera_focus_hero", {
            entindex: hero.entindex(),
            duration: 0.35,
        });
    }
}


