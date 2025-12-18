/**
 * Центральный файл для импорта всех модификаторов
 * Это гарантирует что модификаторы будут зарегистрированы
 */

// Импортируем все модификаторы чтобы декоратор @registerModifier() сработал
import "./modifier_temp_int_buckets";
import "./modifier_glaives_temp_int_handler";
import "./modifier_infinite_mana";

// Экспортируем для использования в других местах
export * from "./modifier_temp_int_buckets";
export * from "./modifier_glaives_temp_int_handler";
export * from "./modifier_infinite_mana";

