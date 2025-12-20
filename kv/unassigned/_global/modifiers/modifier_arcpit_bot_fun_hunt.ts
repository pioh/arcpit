/**
 * "Баловство" ботов в нейтральной зоне: охота за случайным героем (игроком или ботом).
 * Длительность: обычно 5 сек, вешается периодически сервером.
 */

import { BaseModifier, registerModifier } from "vscripts/lib/dota_ts_adapter";

// Behavior flags доступны как глобальные числовые константы в VScript runtime
declare const DOTA_ABILITY_BEHAVIOR_NO_TARGET: number;
declare const DOTA_ABILITY_BEHAVIOR_UNIT_TARGET: number;
declare const DOTA_ABILITY_BEHAVIOR_POINT: number;
declare const DOTA_ABILITY_BEHAVIOR_TOGGLE: number;

@registerModifier()
export class modifier_arcpit_bot_fun_hunt extends BaseModifier {
    private targetEntIndex: EntityIndex | undefined;

    IsHidden(): boolean {
        return true;
    }

    IsDebuff(): boolean {
        return false;
    }

    IsPurgable(): boolean {
        return false;
    }

    RemoveOnDeath(): boolean {
        return true;
    }

    OnCreated(): void {
        if (!IsServer()) return;
        this.pickTarget();
        this.StartIntervalThink(0.35);
    }

    OnRefresh(): void {
        if (!IsServer()) return;
        // При рефреше можно сменить цель, чтобы было "хаотичнее"
        if (RandomInt(1, 100) <= 40) {
            this.pickTarget();
        }
    }

    OnIntervalThink(): void {
        if (!IsServer()) return;

        const parent = this.GetParent() as CDOTA_BaseNPC_Hero;
        if (!parent || !IsValidEntity(parent)) return;
        if (!parent.IsAlive()) return;

        // если цели нет/умерла — выбираем новую
        let target: CDOTA_BaseNPC_Hero | undefined;
        if (this.targetEntIndex !== undefined) {
            const e = EntIndexToHScript(this.targetEntIndex);
            if (e && IsValidEntity(e) && (e as CDOTA_BaseNPC).IsRealHero() && (e as CDOTA_BaseNPC).IsAlive()) {
                target = e as CDOTA_BaseNPC_Hero;
            }
        }
        if (!target) {
            this.pickTarget();
            if (this.targetEntIndex !== undefined) {
                const e2 = EntIndexToHScript(this.targetEntIndex);
                if (e2 && IsValidEntity(e2) && (e2 as CDOTA_BaseNPC).IsRealHero() && (e2 as CDOTA_BaseNPC).IsAlive()) {
                    target = e2 as CDOTA_BaseNPC_Hero;
                }
            }
        }
        if (!target || !IsValidEntity(target)) return;

        // 1) иногда пытаемся кастануть способность в цель / по позиции / no-target
        if (RandomInt(1, 100) <= 70) {
            if (this.tryCastAnyAbility(parent, target)) return;
        }

        // 2) иначе просто атакуем
        ExecuteOrderFromTable({
            UnitIndex: parent.entindex(),
            OrderType: UnitOrder.ATTACK_TARGET,
            TargetIndex: target.entindex(),
        });
    }

    private pickTarget(): void {
        const parent = this.GetParent() as CDOTA_BaseNPC_Hero;
        if (!parent || !IsValidEntity(parent)) return;

        const o = parent.GetAbsOrigin();
        const origin = Vector(o.x, o.y, o.z);

        // Ищем ЛЮБЫХ героев вокруг (и игроков и ботов), кроме себя
        const units = FindUnitsInRadius(
            parent.GetTeamNumber(),
            origin,
            undefined,
            4000,
            UnitTargetTeam.BOTH,
            UnitTargetType.HERO,
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false
        ) as CDOTA_BaseNPC[];

        const heroes: CDOTA_BaseNPC_Hero[] = [];
        for (const u of units) {
            if (!u || !IsValidEntity(u)) continue;
            if (!u.IsRealHero()) continue;
            if (u.entindex() === parent.entindex()) continue;
            heroes.push(u as CDOTA_BaseNPC_Hero);
        }

        if (heroes.length <= 0) {
            this.targetEntIndex = undefined;
            return;
        }

        const pick = heroes[RandomInt(0, heroes.length - 1)];
        this.targetEntIndex = pick.entindex();
    }

    private tryCastAnyAbility(caster: CDOTA_BaseNPC_Hero, target: CDOTA_BaseNPC_Hero): boolean {
        for (let i = 0; i < caster.GetAbilityCount(); i++) {
            const ab = caster.GetAbilityByIndex(i);
            if (!ab) continue;
            if (ab.GetLevel() <= 0) continue;
            if (ab.IsPassive && ab.IsPassive()) continue;
            if (ab.IsCooldownReady() !== true) continue;
            if (ab.IsFullyCastable() !== true) continue;

            const behavior = (ab.GetBehavior() as unknown as number) ?? 0;
            if ((behavior & DOTA_ABILITY_BEHAVIOR_TOGGLE) !== 0) continue;

            if ((behavior & DOTA_ABILITY_BEHAVIOR_NO_TARGET) !== 0) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: UnitOrder.CAST_NO_TARGET,
                    AbilityIndex: ab.entindex(),
                });
                return true;
            }

            if ((behavior & DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) !== 0) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: UnitOrder.CAST_TARGET,
                    TargetIndex: target.entindex(),
                    AbilityIndex: ab.entindex(),
                });
                return true;
            }

            if ((behavior & DOTA_ABILITY_BEHAVIOR_POINT) !== 0) {
                const to = target.GetAbsOrigin();
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: UnitOrder.CAST_POSITION,
                    Position: Vector(to.x + RandomInt(-120, 120), to.y + RandomInt(-120, 120), to.z),
                    AbilityIndex: ab.entindex(),
                });
                return true;
            }
        }
        return false;
    }
}


