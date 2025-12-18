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
    
    // Флоу как в ТЗ:
    // 1) CUSTOM_GAME_SETUP: показываем только НАШ кастомный пик героев (5 сек) и после него делаем FinishCustomGameSetup()
    // 2) STRATEGY_TIME: стандартный экран аспектов/фасетов (5 сек)
    // 3) GAME_IN_PROGRESS: сразу стартуем наш PRE_COMBAT (5 сек) и затем первый раунд
    // Важно: HeroSelectionTime=0, чтобы движок не показывал стандартный экран пика героев.
    GameRules.SetHeroSelectionTime(0);
    GameRules.SetStrategyTime(5);
    GameRules.SetShowcaseTime(0);
    GameRules.SetPreGameTime(0);
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

    // Нейтральная зона (база) — "фановый PvP":
    // - касты/атаки/предметы разрешены всегда, пока юнит в нейтралке
    // - но урона, станов, дебаффов и любых "боевых" модификаторов быть не должно (режем фильтрами)
    const layout = buildLayout({ debug: false, logPrefix: "[arena-layout]" });
    const safeB = layout.neutral.bounds;
    const extB = layout.neutral.extendedBounds;
    const inNeutralSafe2D = (pos: Vector): boolean =>
        pos.x >= safeB.mins.x && pos.x <= safeB.maxs.x && pos.y >= safeB.mins.y && pos.y <= safeB.maxs.y;
    const inNeutralExtended2D = (pos: Vector): boolean =>
        pos.x >= extB.mins.x && pos.x <= extB.maxs.x && pos.y >= extB.mins.y && pos.y <= extB.maxs.y;

    gameMode.SetExecuteOrderFilter((keys: any) => {
        try {
            const units: EntityIndex[] = keys.units;
            if (!units || units.length <= 0) return true;

            // Запрещаем игроку отдавать приказы героям, которыми он не владеет.
            // Выделять/кликать можно (это клиентское), но исполнение ордеров режем здесь.
            const issuerPid = keys.issuer_player_id_const as PlayerID | undefined;
            if (issuerPid !== undefined && PlayerResource.IsValidPlayerID(issuerPid)) {
                for (const idx of units) {
                    const ent = EntIndexToHScript(idx);
                    if (!ent || !IsValidEntity(ent)) continue;
                    const u2 = ent as CDOTA_BaseNPC;
                    if (!u2.IsHero || !u2.IsHero()) continue;
                    const owner = (u2 as CDOTA_BaseNPC_Hero).GetPlayerID();
                    // Если у героя нет owner (undefined) — запрещаем ордера, иначе человек сможет управлять "лишними" героями.
                    if (owner === undefined) return false;
                    if (owner !== issuerPid) return false;
                }
            }

            const unit = EntIndexToHScript(units[0]);
            if (!unit || !IsValidEntity(unit)) return true;
            const u = unit as CDOTA_BaseNPC;
            if (!u.IsHero || !u.IsHero()) return true;

            const o = u.GetAbsOrigin();
            const pos = Vector(o.x, o.y, o.z);
            const order = keys.order_type as number;

            // ---------
            // ВАЖНО: фикс “предмет лежит в лавке и нельзя забрать”.
            // На кастомных картах без корректных shop zones движок часто отправляет покупку в stash/лавку,
            // и игрок не может её получить. Решение: перехватываем PURCHASE_ITEM и выдаём предмет сразу герою.
            // ---------
            if (order === UnitOrder.PURCHASE_ITEM) {
                const itemName = String((keys.shop_item_name ?? keys.ShopItemName ?? "") as any);
                if (!itemName || itemName.length <= 0) return false;

                const hero = u as CDOTA_BaseNPC_Hero;
                if (!hero || !IsValidEntity(hero)) return false;

                // Проверяем золото и списываем
                let cost = 0;
                try {
                    const getCost = (globalThis as any).GetItemCost as ((n: string) => number) | undefined;
                    if (typeof getCost === "function") cost = Number(getCost(itemName) ?? 0);
                } catch (e) { cost = 0; }

                const gold = hero.GetGold();
                if (cost > 0 && gold < cost) {
                    return false;
                }

                try {
                    if (cost > 0) {
                        // reason: best-effort, чтобы просто работало
                        hero.SpendGold(cost, 0 as any);
                    }
                } catch (e) {}

                // Создаём предмет и кладём в инвентарь/рюкзак (движок сам выберет слот)
                try {
                    const create = (globalThis as any).CreateItem as ((name: string, owner: CDOTA_BaseNPC, purchaser: CDOTA_BaseNPC) => CDOTA_Item) | undefined;
                    if (typeof create === "function") {
                        const item = create(itemName, hero, hero);
                        if (item !== undefined && item !== null) {
                            hero.AddItem(item);
                            return false;
                        }
                    }
                } catch (e) {}

                // Fallback: AddItemByName (если CreateItem недоступен)
                try {
                    const h: any = hero as any;
                    if (typeof h.AddItemByName === "function") {
                        h.AddItemByName(itemName);
                        return false;
                    }
                } catch (e) {}

                return false;
            }

            // Дальше логика нейтралки
            // В нейтрали (safe + unsafe ring) НЕ блокируем боевые приказы — это "фановый PvP" (касты/атаки разрешены).
            // (ownership check выше остаётся, чтобы нельзя было управлять чужими героями)
            if (!inNeutralExtended2D(pos)) return true;
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

            // В SAFE части нейтрали не проходит ЛЮБОЙ урон по героям (включая AoE/тики).
            if (inNeutralSafe2D(vpos)) return false;

            // Также не даём наносить урон ИЗ нейтрали (чтобы нельзя было "кастовать с базы" по тем, кто снаружи).
            if (a && a.IsHero && a.IsHero()) {
                const ao = a.GetAbsOrigin();
                const apos = Vector(ao.x, ao.y, ao.z);
                if (inNeutralSafe2D(apos)) return false;
            }
        } catch (e) {}
        return true;
    }, gameMode as any);

    gameMode.SetModifierGainedFilter((keys: any) => {
        try {
            const modifierName = String(keys.name_const ?? "");
            const parentIdx = keys.entindex_parent_const as EntityIndex | undefined;
            if (parentIdx === undefined) return true;
            const parent = EntIndexToHScript(parentIdx);
            if (!parent || !IsValidEntity(parent)) return true;

            const p = parent as CDOTA_BaseNPC;
            if (!p.IsHero || !p.IsHero()) return true;

            const po = p.GetAbsOrigin();
            const ppos = Vector(po.x, po.y, po.z);
            const parentInNeutralSafe = inNeutralSafe2D(ppos);

            // Наши регены в нейтрали всегда разрешены (вешаем сервером по координатам).
            if (modifierName === "modifier_arcpit_neutral_regen") {
                return true;
            }
            if (modifierName === "modifier_arcpit_neutral_mana_regen") {
                return true;
            }

            // Если модификатор навешивается НА героя в нейтрали — разрешаем только self-cast (чтобы не было станов/дебаффов).
            if (parentInNeutralSafe) {
                const casterIdx = keys.entindex_caster_const as EntityIndex | undefined;
                if (casterIdx !== undefined) {
                    const caster = EntIndexToHScript(casterIdx);
                    if (caster && IsValidEntity(caster) && caster === parent) {
                        return true;
                    }
                }
                return false;
            }

            // Если кастер находится в нейтрали — не даём ему навешивать модификаторы на других снаружи.
            const casterIdx = keys.entindex_caster_const as EntityIndex | undefined;
            if (casterIdx !== undefined) {
                const caster = EntIndexToHScript(casterIdx);
                if (caster !== undefined && caster !== null && IsValidEntity(caster)) {
                    const c = caster as CDOTA_BaseNPC;
                    if (c.GetAbsOrigin !== undefined && c.GetAbsOrigin !== null) {
                        const co = c.GetAbsOrigin();
                        const cpos = Vector(co.x, co.y, co.z);
                        if (inNeutralSafe2D(cpos)) {
                            return false;
                        }
                    }
                }
            }
        } catch (e) {}
        return true;
    }, gameMode as any);
    
    // ВАЖНО: НЕ форсим героя плейсхолдером.
    // Герой должен определяться только нашим кастомным пиком в HERO_SELECTION,
    // чтобы не было "заглушек" на старте и не приходилось заменять героя криво.

    // В tools/локалке Source2 часто ловит assert на "Serialized nonresident asset ..." из-за косметики/персон,
    // которые отсутствуют в манифесте сессии. Лучшее решение — вообще отключить wearables/косметику.
    // Best-effort: команды могут отсутствовать/быть запрещены на некоторых окружениях.
    try {
        const send = (globalThis as any).SendToServerConsole;
        if (typeof send === "function") {
            send("dota_npc_disable_wearables 1");
            send("dota_disable_cosmetics 1");
        }
    } catch (e) {}
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

