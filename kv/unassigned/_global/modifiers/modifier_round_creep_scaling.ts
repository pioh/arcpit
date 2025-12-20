/**
 * Скейлинг крипов по раундам.
 * Каркас: базово усиливаем %хп и %урон. В будущем можно расширить бронёй/скоростью и т.д.
 */
import { BaseModifier, registerModifier } from "vscripts/lib/dota_ts_adapter";

@registerModifier()
export class modifier_round_creep_scaling extends BaseModifier {
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

    OnCreated(params: any): void {
        if (!IsServer()) return;
        const stacks = tonumber(params?.stacks) ?? 0;
        this.SetStackCount(math.max(0, stacks));
    }

    DeclareFunctions(): ModifierFunction[] {
        return [
            ModifierFunction.EXTRA_HEALTH_PERCENTAGE,
            ModifierFunction.BASEDAMAGEOUTGOING_PERCENTAGE,
        ];
    }

    GetModifierExtraHealthPercentage(): number {
        // +10% хп за раунд после 1-го
        return this.GetStackCount() * 10;
    }

    GetModifierBaseDamageOutgoing_Percentage(): number {
        // +6% урона за раунд после 1-го
        return this.GetStackCount() * 6;
    }
}


