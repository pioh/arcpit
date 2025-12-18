/**
 * Универсальный "бакет" для временного интеллекта на герое.
 *
 * Требования:
 * - Есть у КАЖДОГО героя (даже если нет способностей).
 * - Максимальная длительность хранения = 180 секунд (кольцевой буфер).
 * - Каждую секунду проверяем текущий индекс, если там есть число:
 *   зануляем, уменьшаем суммарный украденный INT.
 * - НЕ трогаем base stats. Даем бонус через STATS_INTELLECT_BONUS.
 * - Храним lastExpireTime, чтобы корректно показывать прогресс/длительность баффа.
 */

import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";

const BUCKET_WINDOW_SECONDS = 180;

@registerModifier()
export class modifier_temp_int_buckets extends BaseModifier {
    // buckets[0..179] хранит "сколько INT снять" в секунду index
    private buckets: number[] = [];
    private total: number = 0;
    private lastExpireTime: number = 0;

    IsDebuff(): boolean { return false; }
    IsPurgable(): boolean { return false; }
    RemoveOnDeath(): boolean { return false; }

    // Иконка должна появляться только когда есть временный INT
    IsHidden(): boolean {
        return this.GetStackCount() <= 0;
    }

    GetTexture(): string {
        // Пока используем иконку глейвов (как ты просил "видно что INT сворован").
        return "silencer_glaives_of_wisdom";
    }

    DeclareFunctions(): ModifierFunction[] {
        return [
            ModifierFunction.STATS_INTELLECT_BONUS,
        ];
    }

    GetModifierBonusStats_Intellect(): number {
        return this.GetStackCount();
    }

    OnCreated(): void {
        if (!IsServer()) return;
        // 1..180 в lua удобнее, но мы работаем с 0..179 индексом по формуле
        for (let i = 0; i < BUCKET_WINDOW_SECONDS; i++) this.buckets[i] = 0;
        this.StartIntervalThink(1.0);
        this.SetStackCount(0);
    }

    /**
     * Добавить временный интеллект на durationSec секунд.
     * amount может быть любым числом (например, уровень способности).
     */
    public addTempInt(amount: number, durationSec: number): void {
        if (!IsServer()) return;
        if (amount <= 0) return;
        if (durationSec <= 0) return;

        const now = GameRules.GetGameTime();
        const expire = now + math.min(durationSec, BUCKET_WINDOW_SECONDS);

        // индекс по "остатку от деления времени на 180"
        // используем floor, чтобы срабатывало ровно по секундам
        const idx = (math.floor(expire) % BUCKET_WINDOW_SECONDS) as number;

        this.buckets[idx] = (this.buckets[idx] || 0) + amount;
        this.total += amount;
        this.SetStackCount(this.total);

        if (expire > this.lastExpireTime) this.lastExpireTime = expire;

        // Показываем прогресс до последнего истечения
        const remaining = this.lastExpireTime - now;
        if (remaining > 0) {
            this.SetDuration(remaining, true);
        }
    }

    OnIntervalThink(): void {
        if (!IsServer()) return;

        const now = GameRules.GetGameTime();
        const idx = (math.floor(now) % BUCKET_WINDOW_SECONDS) as number;

        const due = this.buckets[idx] || 0;
        if (due > 0) {
            this.buckets[idx] = 0;
            this.total -= due;
            if (this.total < 0) this.total = 0;
            this.SetStackCount(this.total);
        }

        // Если всё истекло — чистим lastExpireTime/длительность
        if (this.total <= 0) {
            this.lastExpireTime = 0;
            // маленькая длительность, чтобы бафф схлопнулся
            this.SetDuration(0.1, true);
            return;
        }

        // Обновляем длительность по lastExpireTime, чтобы прогресс шёл корректно
        const remaining = this.lastExpireTime - now;
        if (remaining > 0) {
            this.SetDuration(remaining, true);
        } else {
            // если почему-то ушло в минус — сбросим
            this.lastExpireTime = 0;
            this.SetDuration(0.1, true);
        }
    }
}


