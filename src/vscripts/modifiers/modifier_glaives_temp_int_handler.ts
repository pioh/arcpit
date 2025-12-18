/**
 * Обработчик глейвов: на ударе добавляет временный INT через бакеты.
 *
 * ВАЖНО:
 * - НЕ уменьшает интеллект цели (особенно крипов) — только бафф на атакующем.
 * - Кол-во INT = уровень способности (как ты просил).
 * - Длительность = фиксированная (можно легко вынести в константу/настройку).
 */

import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";

const GLAIVES_DURATION_SEC = 10; // максимум 180 поддерживается бакетами

@registerModifier()
export class modifier_glaives_temp_int_handler extends BaseModifier {
    IsHidden(): boolean { return true; }
    IsDebuff(): boolean { return false; }
    IsPurgable(): boolean { return false; }
    RemoveOnDeath(): boolean { return false; }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_ATTACK_LANDED];
    }

    OnAttackLanded(event: ModifierAttackEvent): void {
        if (!IsServer()) return;

        const parent = this.GetParent() as CDOTA_BaseNPC;
        if (event.attacker !== parent) return;

        if (!parent.IsRealHero()) return;
        const hero = parent as CDOTA_BaseNPC_Hero;

        const target = event.target;
        if (!target || !IsValidEntity(target)) return;

        const glaives = hero.FindAbilityByName("silencer_glaives_of_wisdom");
        if (!glaives) return;
        const level = glaives.GetLevel();
        if (level <= 0) return; // пока не изучена — эффекта нет

        // Чтобы не прокало от любой тычки: только когда включен autocast
        if (!glaives.GetAutoCastState()) return;

        // INT = уровень способности
        const amount = level;
        if (amount <= 0) return;

        // Берём бакет-модификатор с героя (он должен быть всегда)
        const bucket = hero.FindModifierByName("modifier_temp_int_buckets") as any;
        if (bucket && bucket.addTempInt) {
            bucket.addTempInt(amount, GLAIVES_DURATION_SEC);
        }
    }
}


