import { GAME_CONSTANTS } from "../config/game-constants";
import { PlayerManager } from "../players/player-manager";

// runtime flags for ability behavior (см. bot AI)
declare const DOTA_ABILITY_BEHAVIOR_NO_TARGET: number;
declare const DOTA_ABILITY_BEHAVIOR_UNIT_TARGET: number;
declare const DOTA_ABILITY_BEHAVIOR_POINT: number;

/**
 * AI takeover для героев людей, которые дисконнектнулись.
 * Важно: НЕ создаёт новых bot-слотов — просто отдаёт приказы герою.
 */
export class AiTakeoverController {
    private tickAccumulator = 0;

    constructor(
        private playerManager: PlayerManager
    ) {}

    tick(dt: number, isRoundActive: boolean): void {
        this.tickAccumulator += dt;
        if (this.tickAccumulator < 0.25) return;
        this.tickAccumulator = 0;

        for (const pid of this.playerManager.getAllValidPlayerIDs()) {
            const isBot = PlayerResource.IsFakeClient(pid);

            // Для людей: takeover только если игрок реально отключился (нет Player object).
            // Для ботов: работаем всегда (это наш универсальный server-side AI).
            if (!isBot) {
                const connected = PlayerResource.GetPlayer(pid) !== undefined;
                if (connected) continue;
            }

            const hero = this.playerManager.getPlayerHero(pid) ?? PlayerResource.GetSelectedHeroEntity(pid);
            if (!hero || !IsValidEntity(hero)) continue;
            if (!hero.IsAlive()) continue;

            if (!isRoundActive) continue;

            this.think(hero);
        }
    }

    private think(hero: CDOTA_BaseNPC_Hero): void {
        const team = hero.GetTeamNumber();
        const o = hero.GetAbsOrigin();
        const origin = Vector(o.x, o.y, o.z);

        const enemies = FindUnitsInRadius(
            team,
            origin,
            undefined,
            GAME_CONSTANTS.BOT_SEARCH_RADIUS,
            UnitTargetTeam.ENEMY,
            UnitTargetType.BASIC,
            UnitTargetFlags.NONE,
            FindOrder.CLOSEST,
            false
        );

        if (enemies.length <= 0) return;
        const target = enemies[0];

        // попытка кастнуть что-то простое
        for (let i = 0; i < hero.GetAbilityCount(); i++) {
            const ab = hero.GetAbilityByIndex(i);
            if (!ab) continue;
            if (ab.GetLevel() <= 0) continue;
            if (ab.IsCooldownReady() !== true) continue;
            if (ab.IsFullyCastable() !== true) continue;
            if (ab.IsPassive && ab.IsPassive()) continue;

            const behavior = ab.GetBehavior() as unknown as number;
            if ((behavior & DOTA_ABILITY_BEHAVIOR_NO_TARGET) !== 0) {
                ExecuteOrderFromTable({
                    UnitIndex: hero.entindex(),
                    OrderType: UnitOrder.CAST_NO_TARGET,
                    AbilityIndex: ab.entindex(),
                });
                return;
            }
            if ((behavior & DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) !== 0) {
                ExecuteOrderFromTable({
                    UnitIndex: hero.entindex(),
                    OrderType: UnitOrder.CAST_TARGET,
                    TargetIndex: target.entindex(),
                    AbilityIndex: ab.entindex(),
                });
                return;
            }
            if ((behavior & DOTA_ABILITY_BEHAVIOR_POINT) !== 0) {
                const to = target.GetAbsOrigin();
                ExecuteOrderFromTable({
                    UnitIndex: hero.entindex(),
                    OrderType: UnitOrder.CAST_POSITION,
                    Position: Vector(to.x, to.y, to.z),
                    AbilityIndex: ab.entindex(),
                });
                return;
            }
        }

        ExecuteOrderFromTable({
            UnitIndex: hero.entindex(),
            OrderType: UnitOrder.ATTACK_TARGET,
            TargetIndex: target.entindex(),
        });
    }
}


