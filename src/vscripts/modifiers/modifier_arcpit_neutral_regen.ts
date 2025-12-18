/**
 * Реген в нейтральной зоне (база).
 * Требования: +100 мана/сек (constant), +200 хп/сек (constant).
 */

import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";

@registerModifier()
export class modifier_arcpit_neutral_regen extends BaseModifier {
    IsHidden(): boolean {
        return false;
    }

    IsDebuff(): boolean {
        return false;
    }

    IsPurgable(): boolean {
        return false;
    }

    RemoveOnDeath(): boolean {
        return false;
    }

    GetTexture(): string {
        return "item_ring_of_health";
    }

    DeclareFunctions(): ModifierFunction[] {
        return [
            ModifierFunction.HEALTH_REGEN_CONSTANT,
            ModifierFunction.MANA_REGEN_CONSTANT,
        ];
    }

    GetModifierConstantHealthRegen(): number {
        return 200;
    }

    GetModifierConstantManaRegen(): number {
        return 100;
    }
}


