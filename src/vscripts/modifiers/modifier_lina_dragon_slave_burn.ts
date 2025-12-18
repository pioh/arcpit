/**
 * Заглушка для modifier_lina_dragon_slave_burn.
 *
 * В некоторых сборках/патчах базовая способность Lina `lina_dragon_slave` пытается создать этот модификатор.
 * Если движок не находит модификатор в скриптовом реестре, в логах появляется:
 *   "Attempted to create unknown modifier type modifier_lina_dragon_slave_burn!"
 *
 * Мы регистрируем минимальный модификатор, чтобы не было ошибок и потенциальных побочных эффектов для ботов.
 */
import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";

@registerModifier()
export class modifier_lina_dragon_slave_burn extends BaseModifier {
    IsHidden(): boolean {
        return false;
    }

    IsDebuff(): boolean {
        return true;
    }

    IsPurgable(): boolean {
        return true;
    }

    RemoveOnDeath(): boolean {
        return true;
    }
}


