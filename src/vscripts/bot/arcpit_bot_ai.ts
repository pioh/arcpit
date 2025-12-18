/**
 * AI для бота - EntityScript для GameRules.AddBotPlayerWithEntityScript
 * Движок выполняет этот файл в контексте созданного героя (thisEntity).
 */

import { GAME_CONSTANTS } from "../config/game-constants";
import { buildLayout } from "../shared/arena-layout";

declare const thisEntity: CDOTA_BaseNPC_Hero;

// В typings некоторые enum'ы существуют только как type.
// В runtime Dota VScript доступны глобальные числовые константы вида DOTA_ABILITY_BEHAVIOR_NO_TARGET и т.п.
declare const DOTA_ABILITY_BEHAVIOR_NO_TARGET: number;
declare const DOTA_ABILITY_BEHAVIOR_UNIT_TARGET: number;
declare const DOTA_ABILITY_BEHAVIOR_POINT: number;
declare const DOTA_ABILITY_BEHAVIOR_TOGGLE: number;

declare function GetItemCost(itemName: string): number;

const layout = buildLayout({ debug: false, logPrefix: "[arena-layout]" });
// "Нейтралка" для ботов = extended зона (safe + unsafeZone рамка)
const neutralBounds = layout.neutral.extendedBounds;
const isInNeutral = (unit: CDOTA_BaseNPC): boolean => {
    try {
        const o = unit.GetAbsOrigin();
        const x = o.x;
        const y = o.y;
        return x >= neutralBounds.mins.x && x <= neutralBounds.maxs.x && y >= neutralBounds.mins.y && y <= neutralBounds.maxs.y;
    } catch (e) {}
    return false;
};

// Тик-ограничители, чтобы не спамить ордерами
let nextShopThinkAt = 0;
let nextUseItemAt = 0;
let nextFunCastAt = 0;

const CHEAP_ITEMS = [
    "item_branches",
    "item_magic_stick",
    "item_magic_wand",
    "item_boots",
    "item_wind_lace",
    "item_ring_of_health",
    "item_void_stone",
    "item_energy_booster",
    "item_cloak",
    "item_blight_stone",
];

const MID_ITEMS = [
    "item_power_treads",
    "item_phase_boots",
    "item_arcane_boots",
    "item_blink",
    "item_force_staff",
    "item_glimmer_cape",
    "item_euls",
    "item_rod_of_atos",
    "item_urn_of_shadows",
    "item_spirit_vessel",
    "item_echo_sabre",
    "item_desolator",
    "item_maelstrom",
];

const LATE_ITEMS = [
    "item_black_king_bar",
    "item_assault",
    "item_shivas_guard",
    "item_heart",
    "item_octarine_core",
    "item_sheepstick",
    "item_bloodthorn",
    "item_mjollnir",
    "item_butterfly",
    "item_satanic",
    "item_abyssal_blade",
];

function now(): number {
    // GameRules.GetGameTime() бывает странным на ранних стадиях; fallback на 0.
    try {
        const t = GameRules.GetGameTime();
        if (typeof t === "number") return t;
    } catch (e) {}
    return 0;
}

function countMainInventory(hero: CDOTA_BaseNPC_Hero): number {
    let c = 0;
    for (let i = 0; i <= 5; i++) {
        const it = hero.GetItemInSlot(i);
        if (it) c++;
    }
    return c;
}

function hasItemByName(hero: CDOTA_BaseNPC_Hero, name: string): boolean {
    for (let i = 0; i <= 5; i++) {
        const it = hero.GetItemInSlot(i);
        if (!it) continue;
        try {
            if (it.GetAbilityName() === name) return true;
        } catch (e) {}
    }
    return false;
}

function getCheapestItem(hero: CDOTA_BaseNPC_Hero): { item: CDOTA_Item; cost: number } | undefined {
    let best: { item: CDOTA_Item; cost: number } | undefined = undefined;
    for (let i = 0; i <= 5; i++) {
        const it = hero.GetItemInSlot(i);
        if (!it) continue;
        const name = it.GetAbilityName();
        if (!name) continue;
        // не трогаем TP/варды/нейтральные (best-effort)
        if (name === "item_tpscroll") continue;
        if (name.startsWith("item_recipe_")) continue;
        let cost = 0;
        try { cost = GetItemCost(name); } catch (e) { cost = 0; }
        if (!best || cost < best.cost) best = { item: it, cost };
    }
    return best;
}

function tryPurchase(hero: CDOTA_BaseNPC_Hero, itemName: string): void {
    ExecuteOrderFromTable({
        UnitIndex: hero.entindex(),
        OrderType: UnitOrder.PURCHASE_ITEM,
        ShopItemName: itemName,
    } as any);
}

function trySell(hero: CDOTA_BaseNPC_Hero, item: CDOTA_Item): void {
    ExecuteOrderFromTable({
        UnitIndex: hero.entindex(),
        OrderType: UnitOrder.SELL_ITEM,
        TargetIndex: item.entindex(),
    } as any);
}

function botShopThink(hero: CDOTA_BaseNPC_Hero): void {
    // Покупаем только когда герой жив и в нейтрали (чтобы не мешать бою/телепортам)
    if (!isInNeutral(hero)) return;

    const gold = hero.GetGold();
    const invCount = countMainInventory(hero);

    // Если инвентарь забит и денег много — продаём самый дешёвый слот, чтобы апгрейдиться.
    if (invCount >= 6 && gold >= 4500) {
        const cheapest = getCheapestItem(hero);
        if (cheapest && cheapest.cost <= 1000) {
            trySell(hero, cheapest.item);
            return;
        }
    }

    // Если есть слот — покупаем что-то доступное по деньгам.
    if (invCount < 6) {
        const pool = gold >= 6500 ? LATE_ITEMS : (gold >= 2500 ? MID_ITEMS : CHEAP_ITEMS);
        // пробуем несколько раз найти то, чего ещё нет и что по карману
        for (let k = 0; k < 6; k++) {
            const name = pool[RandomInt(0, pool.length - 1)];
            if (!name) continue;
            if (hasItemByName(hero, name)) continue;
            let cost = 0;
            try { cost = GetItemCost(name); } catch (e) { cost = 0; }
            if (cost <= 0 || cost > gold) continue;
            tryPurchase(hero, name);
            return;
        }
    }
}

function findRandomUnitNear(hero: CDOTA_BaseNPC_Hero, radius: number): CDOTA_BaseNPC | undefined {
    const team = hero.GetTeamNumber();
    const o = hero.GetAbsOrigin();
    const origin = Vector(o.x, o.y, o.z);
    const units = FindUnitsInRadius(
        team,
        origin,
        undefined,
        radius,
        UnitTargetTeam.BOTH,
        UnitTargetType.HERO + UnitTargetType.BASIC,
        UnitTargetFlags.NONE,
        FindOrder.ANY,
        false
    );
    if (!units || units.length <= 0) return undefined;
    return units[RandomInt(0, units.length - 1)];
}

function tryUseActiveItems(hero: CDOTA_BaseNPC_Hero): boolean {
    const target = findRandomUnitNear(hero, 900);

    for (let i = 0; i <= 5; i++) {
        const it = hero.GetItemInSlot(i);
        if (!it) continue;
        if (it.IsCooldownReady() !== true) continue;
        if (it.IsFullyCastable() !== true) continue;

        const behavior = (it.GetBehavior() as unknown as number) ?? 0;
        if ((behavior & DOTA_ABILITY_BEHAVIOR_TOGGLE) !== 0) continue;

        // no target
        if ((behavior & DOTA_ABILITY_BEHAVIOR_NO_TARGET) !== 0) {
            ExecuteOrderFromTable({
                UnitIndex: hero.entindex(),
                OrderType: UnitOrder.CAST_NO_TARGET,
                AbilityIndex: it.entindex(),
            });
            return true;
        }

        // unit target
        if (target && (behavior & DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) !== 0) {
            ExecuteOrderFromTable({
                UnitIndex: hero.entindex(),
                OrderType: UnitOrder.CAST_TARGET,
                TargetIndex: target.entindex(),
                AbilityIndex: it.entindex(),
            });
            return true;
        }

        // point
        if ((behavior & DOTA_ABILITY_BEHAVIOR_POINT) !== 0) {
            const to = (target ?? hero).GetAbsOrigin();
            ExecuteOrderFromTable({
                UnitIndex: hero.entindex(),
                OrderType: UnitOrder.CAST_POSITION,
                Position: Vector(to.x + RandomInt(-120, 120), to.y + RandomInt(-120, 120), to.z),
                AbilityIndex: it.entindex(),
            });
            return true;
        }
    }

    return false;
}

function tryFunCastAbilities(hero: CDOTA_BaseNPC_Hero): boolean {
    // Кастуем "по приколу" только в нейтрали и только иногда
    if (!isInNeutral(hero)) return false;
    if (RandomInt(1, 100) > 35) return false;

    const target = findRandomUnitNear(hero, 900) ?? hero;

    for (let i = 0; i < hero.GetAbilityCount(); i++) {
        const ab = hero.GetAbilityByIndex(i);
        if (!ab) continue;
        if (ab.GetLevel() <= 0) continue;
        if (ab.IsCooldownReady() !== true) continue;
        if (ab.IsFullyCastable() !== true) continue;
        if (ab.IsPassive && ab.IsPassive()) continue;

        const behavior = ab.GetBehavior() as unknown as number;
        if ((behavior & DOTA_ABILITY_BEHAVIOR_TOGGLE) !== 0) continue;

        // no target
        if ((behavior & DOTA_ABILITY_BEHAVIOR_NO_TARGET) !== 0) {
            ExecuteOrderFromTable({
                UnitIndex: hero.entindex(),
                OrderType: UnitOrder.CAST_NO_TARGET,
                AbilityIndex: ab.entindex(),
            });
            return true;
        }

        // unit target
        if ((behavior & DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) !== 0) {
            ExecuteOrderFromTable({
                UnitIndex: hero.entindex(),
                OrderType: UnitOrder.CAST_TARGET,
                TargetIndex: target.entindex(),
                AbilityIndex: ab.entindex(),
            });
            return true;
        }

        // point
        if ((behavior & DOTA_ABILITY_BEHAVIOR_POINT) !== 0) {
            const to = target.GetAbsOrigin();
            ExecuteOrderFromTable({
                UnitIndex: hero.entindex(),
                OrderType: UnitOrder.CAST_POSITION,
                Position: Vector(to.x + RandomInt(-200, 200), to.y + RandomInt(-200, 200), to.z),
                AbilityIndex: ab.entindex(),
            });
            return true;
        }
    }

    return false;
}

function BotThink(): number {
    if (!thisEntity || !IsValidEntity(thisEntity)) return 0.5;
    if (!thisEntity.IsAlive()) return 0.5;

    // В нейтралке боты "балуються" всегда, независимо от стадии (даже пока другие добивают крипов).
    const addon = (GameRules as any).Addon as { isRoundActive?: boolean } | undefined;
    const roundActive = addon?.isRoundActive === true;

    const t = now();
    if (!roundActive || isInNeutral(thisEntity)) {
        if (t >= nextShopThinkAt) {
            nextShopThinkAt = t + 2.0;
            botShopThink(thisEntity);
        }
        if (t >= nextUseItemAt) {
            nextUseItemAt = t + 0.9;
            if (tryUseActiveItems(thisEntity)) return 0.25;
        }
        if (t >= nextFunCastAt) {
            nextFunCastAt = t + 0.75;
            if (tryFunCastAbilities(thisEntity)) return 0.25;
        }
        return 0.35;
    }

    const team = thisEntity.GetTeamNumber();

    // Ищем ближайшего вражеского крипа
    const enemies = FindUnitsInRadius(
        team,
        // Нормализуем origin (иногда возвращается vectorws)
        (() => {
            const o = thisEntity.GetAbsOrigin();
            return Vector(o.x, o.y, o.z);
        })(),
        undefined,
        GAME_CONSTANTS.BOT_SEARCH_RADIUS,
        UnitTargetTeam.ENEMY,
        UnitTargetType.BASIC,
        UnitTargetFlags.NONE,
        FindOrder.CLOSEST,
        false
    );

    if (enemies.length > 0) {
        const target = enemies[0];

        // Простая попытка кастнуть любые "простые" способности (не идеальный AI, но уже похоже на игрока)
        for (let i = 0; i < thisEntity.GetAbilityCount(); i++) {
            const ab = thisEntity.GetAbilityByIndex(i);
            if (!ab) continue;
            if (ab.GetLevel() <= 0) continue;
            if (ab.IsCooldownReady() !== true) continue;
            if (ab.IsFullyCastable() !== true) continue;
            if (ab.IsPassive && ab.IsPassive()) continue;

            const behavior = ab.GetBehavior() as unknown as number;
            if ((behavior & DOTA_ABILITY_BEHAVIOR_TOGGLE) !== 0) continue;
            // no target
            if ((behavior & DOTA_ABILITY_BEHAVIOR_NO_TARGET) !== 0) {
                ExecuteOrderFromTable({
                    UnitIndex: thisEntity.entindex(),
                    OrderType: UnitOrder.CAST_NO_TARGET,
                    AbilityIndex: ab.entindex(),
                });
                return 0.35;
            }

            // unit target
            if ((behavior & DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) !== 0) {
                ExecuteOrderFromTable({
                    UnitIndex: thisEntity.entindex(),
                    OrderType: UnitOrder.CAST_TARGET,
                    TargetIndex: target.entindex(),
                    AbilityIndex: ab.entindex(),
                });
                return 0.35;
            }

            // point
            if ((behavior & DOTA_ABILITY_BEHAVIOR_POINT) !== 0) {
                const to = target.GetAbsOrigin();
                ExecuteOrderFromTable({
                    UnitIndex: thisEntity.entindex(),
                    OrderType: UnitOrder.CAST_POSITION,
                    Position: Vector(to.x, to.y, to.z),
                    AbilityIndex: ab.entindex(),
                });
                return 0.35;
            }
        }

        // Параллельно пытаемся жать активки предметов в бою
        if (RandomInt(1, 100) <= 25) {
            if (tryUseActiveItems(thisEntity)) return 0.25;
        }

        ExecuteOrderFromTable({
            UnitIndex: thisEntity.entindex(),
            OrderType: UnitOrder.ATTACK_TARGET,
            TargetIndex: target.entindex(),
        });
        return 0.25;
    }

    return 0.5;
}

// Запускаем think
if (thisEntity && IsValidEntity(thisEntity)) {
    thisEntity.SetContextThink("ArcpitBotThink", BotThink, 0.5);
}


