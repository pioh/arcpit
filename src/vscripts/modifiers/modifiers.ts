/**
 * Центральный файл для импорта всех модификаторов
 * Это гарантирует что модификаторы будут зарегистрированы
 */

// Импортируем все модификаторы чтобы декоратор @registerModifier() сработал
import "./modifier_temp_int_buckets";
import "./modifier_glaives_temp_int_handler";
import "./modifier_infinite_mana";
import "./modifier_round_creep_scaling";
import "./modifier_lina_dragon_slave_burn";
import "./modifier_arcpit_neutral_regen";
import "./modifier_arcpit_neutral_mana_regen";
import "./modifier_arcpit_bot_fun_hunt";
import "./modifier_arcpit_bot_fun_wander";

// Экспортируем для использования в других местах
export * from "./modifier_temp_int_buckets";
export * from "./modifier_glaives_temp_int_handler";
export * from "./modifier_infinite_mana";
export * from "./modifier_round_creep_scaling";
export * from "./modifier_lina_dragon_slave_burn";
export * from "./modifier_arcpit_neutral_regen";
export * from "./modifier_arcpit_neutral_mana_regen";
export * from "./modifier_arcpit_bot_fun_hunt";
export * from "./modifier_arcpit_bot_fun_wander";

