/**
 * AI для бота - EntityScript для GameRules.AddBotPlayerWithEntityScript
 * Движок выполняет этот файл в контексте созданного героя (thisEntity).
 */

import { GAME_CONSTANTS } from "../config/game-constants";

declare const thisEntity: CDOTA_BaseNPC_Hero;

// В typings некоторые enum'ы существуют только как type.
// В runtime Dota VScript доступны глобальные числовые константы вида DOTA_ABILITY_BEHAVIOR_NO_TARGET и т.п.
declare const DOTA_ABILITY_BEHAVIOR_NO_TARGET: number;
declare const DOTA_ABILITY_BEHAVIOR_UNIT_TARGET: number;
declare const DOTA_ABILITY_BEHAVIOR_POINT: number;

function BotThink(): number {
    if (!thisEntity || !IsValidEntity(thisEntity)) return 0.5;
    if (!thisEntity.IsAlive()) return 0.5;

    // Не деремся до старта раунда
    const addon = (GameRules as any).Addon as { isRoundActive?: boolean } | undefined;
    if (!addon?.isRoundActive) {
        return 0.5;
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


