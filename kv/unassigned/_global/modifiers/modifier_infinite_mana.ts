/**
 * Модификатор для безлимитной маны (для тестов)
 */

import { BaseModifier, registerModifier } from "vscripts/lib/dota_ts_adapter";

@registerModifier()
export class modifier_infinite_mana extends BaseModifier {
    IsHidden(): boolean {
        return false;
    }

    IsDebuff(): boolean {
        return false;
    }

    IsPurgable(): boolean {
        return true;
    }

    RemoveOnDeath(): boolean {
        return true;
    }

    DeclareFunctions(): ModifierFunction[] {
        return [
            ModifierFunction.ON_ABILITY_EXECUTED,
        ];
    }

    OnAbilityExecuted(event: ModifierAbilityEvent): void {
        if (!IsServer()) return;

        const hero = this.GetParent();
        if (event.unit !== hero) return;

        // Восстанавливаем ману после каста
        Timers.CreateTimer(0.1, () => {
            hero.SetMana(hero.GetMaxMana());
            return undefined;
        });
    }

    GetTexture(): string {
        return "item_arcane_boots";
    }
}


