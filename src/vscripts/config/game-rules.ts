import { GAME_CONSTANTS } from "./game-constants";
import { buildLayout } from "../shared/arena-layout";

/**
 * Настройка правил игры
 */
export function configureGameRules(): void {
    print("=== Configuring GameRules ===");
    
    // Основные правила
    GameRules.SetHeroRespawnEnabled(false);
    GameRules.SetUseUniversalShopMode(true);
    GameRules.SetSameHeroSelectionEnabled(true);
    
    // Пропускаем стандартный пик героев
    GameRules.SetHeroSelectionTime(0);
    GameRules.SetStrategyTime(0);
    GameRules.SetShowcaseTime(0);
    GameRules.SetPreGameTime(3);
    GameRules.SetCustomGameSetupAutoLaunchDelay(0);
    GameRules.SetCustomGameSetupTimeout(0);
    
    // Экономика
    GameRules.SetStartingGold(GAME_CONSTANTS.STARTING_GOLD);
    GameRules.SetGoldPerTick(GAME_CONSTANTS.GOLD_PER_TICK);
    GameRules.SetGoldTickTime(GAME_CONSTANTS.GOLD_TICK_TIME);
    
    print("=== GameRules configured ===");
}

/**
 * Настройка игрового режима
 */
export function configureGameMode(): void {
    const gameMode = GameRules.GetGameModeEntity();
    
    gameMode.SetBuybackEnabled(false);
    gameMode.SetTopBarTeamValuesVisible(false);
    gameMode.SetAnnouncerDisabled(true);
    gameMode.SetKillingSpreeAnnouncerDisabled(true);
    gameMode.SetRecommendedItemsDisabled(true);
    gameMode.SetBotThinkingEnabled(false);
    
    // Всегда видна вся карта (убрать fog of war)
    gameMode.SetFogOfWarDisabled(true);
    gameMode.SetUnseenFogOfWarEnabled(false);

    // Нейтральная зона (база): полный safe-zone.
    // Требования: нельзя атаковать/кастовать/таргетить, и не должны проходить урон/дебаффы (станы/сало/AoE и т.д.).
    const layout = buildLayout({ debug: false, logPrefix: "[arena-layout]" });
    const nb = layout.neutral.bounds;
    const inNeutral2D = (pos: Vector): boolean => pos.x >= nb.mins.x && pos.x <= nb.maxs.x && pos.y >= nb.mins.y && pos.y <= nb.maxs.y;

    gameMode.SetExecuteOrderFilter((keys: any) => {
        try {
            const units: EntityIndex[] = keys.units;
            if (!units || units.length <= 0) return true;

            // Запрещаем игроку отдавать приказы героям, которыми он не владеет.
            // При этом выделять (select) можно — это чисто клиентская штука, фильтр режет именно исполнения приказов.
            const issuerPid = keys.issuer_player_id_const as PlayerID | undefined;
            if (issuerPid !== undefined && PlayerResource.IsValidPlayerID(issuerPid)) {
                for (const idx of units) {
                    const ent = EntIndexToHScript(idx);
                    if (!ent || !IsValidEntity(ent)) continue;
                    const u = ent as CDOTA_BaseNPC;
                    if (!u.IsHero || !u.IsHero()) continue;
                    const owner = (u as CDOTA_BaseNPC_Hero).GetPlayerID();
                    if (owner !== undefined && owner !== issuerPid) {
                        return false;
                    }
                }
            }

            const unit = EntIndexToHScript(units[0]);
            if (!unit || !IsValidEntity(unit)) return true;
            const u = unit as CDOTA_BaseNPC;
            if (!u.IsHero || !u.IsHero()) return true;

            const o = u.GetAbsOrigin();
            const pos = Vector(o.x, o.y, o.z);
            if (!inNeutral2D(pos)) return true;

            const order = keys.order_type as number;

            // Запрещаем любые атакующие/кастовые приказы в safe-zone.
            // (движок может отдавать разные DOTA_UNIT_ORDER_*; мы блокируем основные типы)
            const blocked = new Set<number>([
                UnitOrder.ATTACK_TARGET,
                UnitOrder.ATTACK_MOVE,
                UnitOrder.CAST_TARGET,
                UnitOrder.CAST_POSITION,
                UnitOrder.CAST_NO_TARGET,
                UnitOrder.CAST_TOGGLE,
                UnitOrder.CAST_TOGGLE_AUTO,
                UnitOrder.CAST_RUNE,
                UnitOrder.CAST_TARGET_TREE,
            ]);

            if (blocked.has(order)) {
                return false;
            }
        } catch (e) {}
        return true;
    }, gameMode as any);

    gameMode.SetDamageFilter((keys: any) => {
        try {
            // Важно: сначала проверяем индексы, иначе будет spam "expected integer but got void".
            const vIdx = keys.entindex_victim_const as EntityIndex | undefined;
            const aIdx = keys.entindex_attacker_const as EntityIndex | undefined;
            if (vIdx === undefined || aIdx === undefined) return true;

            const victim = EntIndexToHScript(vIdx);
            const attacker = EntIndexToHScript(aIdx);
            if (!victim || !attacker) return true;

            const v = victim as CDOTA_BaseNPC;
            const a = attacker as CDOTA_BaseNPC;
            if (!v.IsHero || !v.IsHero()) return true;

            const vo = v.GetAbsOrigin();
            const vpos = Vector(vo.x, vo.y, vo.z);

            // В базе не проходит ЛЮБОЙ урон по героям (включая AoE/случайные тики).
            if (inNeutral2D(vpos)) {
                return false;
            }
        } catch (e) {}
        return true;
    }, gameMode as any);

    gameMode.SetModifierGainedFilter((keys: any) => {
        try {
            const parentIdx = keys.entindex_parent_const as EntityIndex | undefined;
            if (parentIdx === undefined) return true;
            const parent = EntIndexToHScript(parentIdx);
            if (!parent || !IsValidEntity(parent)) return true;

            const p = parent as CDOTA_BaseNPC;
            if (!p.IsHero || !p.IsHero()) return true;

            const po = p.GetAbsOrigin();
            const ppos = Vector(po.x, po.y, po.z);
            if (!inNeutral2D(ppos)) return true;

            // В safe-zone запрещаем любые модификаторы от "внешних" источников (станы/сайленсы/руты и т.д.).
            // Самонаклад (caster==parent) тоже блокируем, т.к. в базе "нельзя способности".
            return false;
        } catch (e) {}
        return true;
    }, gameMode as any);
    
    // Временный герой для форс-спавна
    gameMode.SetCustomGameForceHero("npc_dota_hero_wisp");
}

/**
 * Настройка команд
 */
export function configureTeams(): void {
    // Только CUSTOM_1..CUSTOM_8, по 1 игроку/боту на команду
    for (let i = 0; i < GAME_CONSTANTS.MAX_PLAYERS; i++) {
        const team = (DotaTeam.CUSTOM_1 + i) as DotaTeam;
        GameRules.SetCustomGameTeamMaxPlayers(team, 1);
    }
}

