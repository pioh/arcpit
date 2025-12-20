/**
 * "Баловство" ботов в нейтральной зоне: убегает в случайную сторону.
 * Длительность: обычно 5 сек, вешается периодически сервером.
 */

import { BaseModifier, registerModifier } from "vscripts/lib/dota_ts_adapter";

@registerModifier()
export class modifier_arcpit_bot_fun_wander extends BaseModifier {
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
        this.StartIntervalThink(0.75);
        this.issueRunOrder();
    }

    OnIntervalThink(): void {
        if (!IsServer()) return;
        this.issueRunOrder();
    }

    private issueRunOrder(): void {
        const parent = this.GetParent() as CDOTA_BaseNPC_Hero;
        if (!parent || !IsValidEntity(parent)) return;
        if (!parent.IsAlive()) return;

        const o = parent.GetAbsOrigin();
        const origin = Vector(o.x, o.y, o.z);

        // "Убегать" в случайную сторону на ~1000..1600 units
        const dx = RandomInt(-1, 1) === 0 ? RandomInt(-1400, -900) : RandomInt(900, 1400);
        const dy = RandomInt(-1, 1) === 0 ? RandomInt(-1400, -900) : RandomInt(900, 1400);
        const pos = Vector(origin.x + dx, origin.y + dy, origin.z);

        ExecuteOrderFromTable({
            UnitIndex: parent.entindex(),
            OrderType: UnitOrder.MOVE_TO_POSITION,
            Position: pos,
        });
    }
}


