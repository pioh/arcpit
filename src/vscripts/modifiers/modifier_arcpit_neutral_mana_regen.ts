/**
 * Мана-реген в нейтральной расширенной зоне (unsafe ring): только мана, без HP.
 */

import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";

@registerModifier()
export class modifier_arcpit_neutral_mana_regen extends BaseModifier {
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
        return "item_void_stone";
    }

    DeclareFunctions(): ModifierFunction[] {
        return [
            ModifierFunction.MANA_REGEN_CONSTANT,
        ];
    }

    GetModifierConstantManaRegen(): number {
        return 100;
    }
}


