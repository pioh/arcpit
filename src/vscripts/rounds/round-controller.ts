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
};

/**
 * Контроллер бесконечных раундов PvE (каждый игрок на своей арене vs крипы).
 * Это каркас: дальше сюда можно наращивать логику (награды, предметы, спец-правила и т.д.).
 */
export class RoundController {
    private layout: Layout | null = null;

    private nextRoundNumber: number = 1;
    private activeRoundNumber: number | null = null;

    private playerStates: Map<PlayerID, PlayerRoundState> = new Map();

    private roundPollTimerName = "RoundController_Poll";
    private neutralPollTimerName = "RoundController_NeutralPeacePoll";

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

        // Камеру подтянем к герою (только реальному клиенту; для ботов PlayerResource.GetPlayer может быть undefined).
        this.focusCameraOnHero(pid, hero);
    }

    /**
     * Хук из entity_killed (его повесим в GameMode): респавн через 2 сек.
     */
    onEntityKilled(event: EntityKilledEvent): void {
        const killed = EntIndexToHScript(event.entindex_killed);
        if (!killed || !IsValidEntity(killed)) return;
        if (!(killed as CDOTA_BaseNPC).IsRealHero()) return;

        const hero = killed as CDOTA_BaseNPC_Hero;
        const pid = hero.GetPlayerID();
        if (pid === undefined) return;

        const st = this.playerStates.get(pid);
        if (!st) return;

        // Сохраняем позицию "где умер" (в арене) и респавним вручную через 2 сек.
        const o = hero.GetAbsOrigin();
        st.pendingRespawnPos = Vector(o.x, o.y, o.z);

        Timers.CreateTimer(2, () => {
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
            const spawn = Vector(slot.spawn.x, slot.spawn.y, slot.spawn.z);
            hero.SetAbsOrigin(spawn);
            FindClearSpaceForUnit(hero, spawn, true);

            // Камера на героя при телепорте
            this.focusCameraOnHero(pid, hero);

            // Боты: апаем уровень и автокачаем
            if (PlayerResource.IsFakeClient(pid)) {
                this.ensureBotLevelAndAutoSkills(hero);
            }

            // Спавн крипов и агр
            const creeps = this.spawnCreepsForHero(round, slot.center, hero);
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
            endTime: 0.25,
            callback: () => {
                if (this.activeRoundNumber !== round) return undefined;

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

                return 0.25;
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
                const neutralBounds = this.layout!.neutral.bounds;
                for (const pid of this.playerManager.getAllValidPlayerIDs()) {
                    const hero = this.playerManager.getPlayerHero(pid) ?? PlayerResource.GetSelectedHeroEntity(pid);
                    if (!hero || !IsValidEntity(hero)) continue;

                    const o = hero.GetAbsOrigin();
                    const p = { x: o.x, y: o.y, z: o.z };
                    const inNeutral =
                        p.x >= neutralBounds.mins.x &&
                        p.x <= neutralBounds.maxs.x &&
                        p.y >= neutralBounds.mins.y &&
                        p.y <= neutralBounds.maxs.y;

                    if (inNeutral) {
                        this.peaceMode.applyToHero(hero);
                    } else {
                        // Вне нейтрали можно драться с крипами
                        this.peaceMode.removeFromHero(hero);
                    }
                }
                return 0.25;
            }
        });
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

            // агрим на героя
            creep.SetIdleAcquire(true);
            creep.SetAcquisitionRange(2500);
            ExecuteOrderFromTable({
                UnitIndex: creep.entindex(),
                OrderType: UnitOrder.ATTACK_TARGET,
                TargetIndex: hero.entindex(),
            });

            creeps.push(creep);
        }

        return creeps;
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
        for (let i = 0; i < hero.GetAbilityCount(); i++) {
            const a = hero.GetAbilityByIndex(i);
            if (!a) continue;
            const name = a.GetAbilityName();
            if (!name) continue;
            if (name.startsWith("special_bonus_")) continue;
            if (a.GetMaxLevel() <= 0) continue;
            abil.push(a);
        }
        if (abil.length === 0) return;

        let guard = 0;
        let idx = 0;
        while (points > 0 && guard < 5000) {
            guard++;
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


