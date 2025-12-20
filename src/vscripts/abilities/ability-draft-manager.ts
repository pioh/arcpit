import { PlayerManager } from "../players/player-manager";
import { ABILITY_POOL } from "./ability-pool";
import { AbilityCustomizer } from "./ability-customizer";

type AbilityOffer = {
    offerId: number;
    abilities: string[];
};

/**
 * Выбор способностей "по требованию":
 * сервер решает, доступен ли выбор (по уровню и счётчику выбранных),
 * и если доступен — генерит 8 случайных способностей и показывает UI.
 */
export class AbilityDraftManager {
    private offerSeq: number = 0;
    private activeOffer: Map<PlayerID, AbilityOffer> = new Map();
    private chosenCount: Map<PlayerID, number> = new Map();
    private pendingRetry: Map<PlayerID, number> = new Map();

    constructor(
        private playerManager: PlayerManager
    ) {}

    getChosenCount(playerID: PlayerID): number {
        return this.chosenCount.get(playerID) ?? 0;
    }

    maybeOffer(playerID: PlayerID): void {
        if (!PlayerResource.IsValidPlayerID(playerID)) return;

        // Не спамим, если уже есть активное меню
        if (this.activeOffer.has(playerID)) return;

        const hero = this.playerManager.getPlayerHero(playerID) ?? PlayerResource.GetSelectedHeroEntity(playerID);
        if (!hero || !IsValidEntity(hero)) return;

        const level = hero.GetLevel();
        const chosen = this.getChosenCount(playerID);
        const allowed = this.allowedForLevel(level);
        if (chosen >= allowed) return;

        const abilities = this.getRandomOfferAbilities(hero, 8);
        if (abilities.length <= 0) return;

        const isBot = PlayerResource.IsFakeClient(playerID);
        const player = PlayerResource.GetPlayer(playerID);

        // Для людей: если player-handle ещё не готов — не создаём activeOffer (иначе UI потеряется),
        // а просто ретраим чуть позже.
        if (!isBot && !player) {
            const tries = (this.pendingRetry.get(playerID) ?? 0) + 1;
            this.pendingRetry.set(playerID, tries);
            if (tries <= 25) {
                Timers.CreateTimer(0.2, () => {
                    this.maybeOffer(playerID);
                    return undefined;
                });
            } else {
                try { print(`[arcpit][AbilityDraft] WARNING: no Player handle for pid=${playerID} after retries, skipping offer`); } catch (e) {}
            }
            return;
        }

        this.pendingRetry.delete(playerID);

        const offerId = ++this.offerSeq;
        this.activeOffer.set(playerID, { offerId, abilities });

        try {
            print(`[arcpit][AbilityDraft] offer -> pid=${playerID} bot=${isBot ? 1 : 0} offerId=${offerId} level=${level} chosen=${chosen} allowed=${allowed} abilities=${abilities.join(",")}`);
        } catch (e) {}

        if (player) {
            CustomGameEventManager.Send_ServerToPlayer(player, "arcpit_ability_draft_offer", {
                playerID,
                offerId,
                abilities,
                chosenCount: chosen,
                allowedCount: allowed,
            });
        }

        // Боты: выбирают сами (вместо клиента)
        if (PlayerResource.IsFakeClient(playerID)) {
            Timers.CreateTimer(0.25 + RandomFloat(0.0, 0.35), () => {
                const o = this.activeOffer.get(playerID);
                if (!o || o.offerId !== offerId) return undefined;
                const pick = o.abilities[RandomInt(0, o.abilities.length - 1)];
                this.onClientPick(playerID, offerId, pick);
                return undefined;
            });
        }
    }

    onClientPick(playerID: PlayerID, offerId: number, abilityName: string): void {
        const offer = this.activeOffer.get(playerID);
        if (!offer) {
            try { print(`[arcpit][AbilityDraft] pick IGNORE pid=${playerID} (no offer) offerId=${offerId} ability=${abilityName}`); } catch (e) {}
            return;
        }
        if (offer.offerId !== offerId) {
            try { print(`[arcpit][AbilityDraft] pick IGNORE pid=${playerID} (offerId mismatch got=${offerId} expected=${offer.offerId}) ability=${abilityName}`); } catch (e) {}
            return;
        }
        if (!offer.abilities.includes(abilityName)) {
            try { print(`[arcpit][AbilityDraft] pick IGNORE pid=${playerID} (ability not in offer) offerId=${offerId} ability=${abilityName} offered=${offer.abilities.join(",")}`); } catch (e) {}
            return;
        }

        // Закрываем оффер (даже если выдача неудачна — чтобы не залипнуть)
        this.activeOffer.delete(playerID);

        const hero = this.playerManager.getPlayerHero(playerID) ?? PlayerResource.GetSelectedHeroEntity(playerID);
        if (!hero || !IsValidEntity(hero)) return;

        // Если уже есть — просто попробуем предложить снова (на случай гонки)
        if (hero.FindAbilityByName(abilityName)) {
            Timers.CreateTimer(0.05, () => {
                this.maybeOffer(playerID);
                return undefined;
            });
            return;
        }

        const ab = hero.AddAbility(abilityName);
        if (!ab) {
            // Не удалось добавить (например, лимит слотов) — попробуем ещё раз позже другим оффером
            Timers.CreateTimer(0.2, () => {
                this.maybeOffer(playerID);
                return undefined;
            });
            return;
        }

        // Не прокачиваем — игрок сам качает
        try { ab.SetLevel(0); } catch (e) {}
        AbilityCustomizer.setupAbility(hero, abilityName);

        // Инкремент выбранных способностей
        const next = (this.chosenCount.get(playerID) ?? 0) + 1;
        this.chosenCount.set(playerID, next);

        try {
            const level = hero.GetLevel();
            const allowed = this.allowedForLevel(level);
            print(`[arcpit][AbilityDraft] PICK pid=${playerID} offerId=${offerId} ability=${abilityName} -> chosen=${next}/${allowed} level=${level}`);
        } catch (e) {}

        // Если всё ещё можно выбирать — покажем следующий выбор (новый набор 8)
        Timers.CreateTimer(0.05, () => {
            this.maybeOffer(playerID);
            return undefined;
        });

        // Боты: после добавления способности сразу тратим пойнты, чтобы не висели десятки очков на 30 уровне
        if (PlayerResource.IsFakeClient(playerID)) {
            Timers.CreateTimer(0.05, () => {
                this.autoLevelBotNow(hero);
                return undefined;
            });
        }
    }

    getOfferOwnerByOfferId(offerId: number): PlayerID | undefined {
        for (const [pid, offer] of this.activeOffer.entries()) {
            if (offer.offerId === offerId) return pid;
        }
        return undefined;
    }

    private autoLevelBotNow(hero: CDOTA_BaseNPC_Hero): void {
        try {
            let points = hero.GetAbilityPoints();
            if (points <= 0) return;

            const abil: CDOTABaseAbility[] = [];
            const talents: CDOTABaseAbility[] = [];
            for (let i = 0; i < hero.GetAbilityCount(); i++) {
                const a = hero.GetAbilityByIndex(i);
                if (!a) continue;
                const name = a.GetAbilityName();
                if (!name) continue;
                if (a.GetMaxLevel() <= 0) continue;
                if (name.startsWith("special_bonus_")) talents.push(a);
                else abil.push(a);
            }

            let guard = 0;
            let idx = 0;
            while (points > 0 && guard++ < 2000 && abil.length > 0) {
                const a = abil[idx % abil.length];
                idx++;
                if (!a) continue;
                if (a.GetLevel() >= a.GetMaxLevel()) continue;
                a.SetLevel(a.GetLevel() + 1);
                points = hero.GetAbilityPoints();
                hero.SetAbilityPoints(math.max(0, points - 1));
                points = hero.GetAbilityPoints();
            }

            let tguard = 0;
            let tidx = 0;
            while (points > 0 && tguard++ < 256 && talents.length > 0) {
                const t = talents[tidx % talents.length];
                tidx++;
                if (!t) continue;
                if (t.GetLevel() >= t.GetMaxLevel()) continue;
                t.SetLevel(t.GetLevel() + 1);
                points = hero.GetAbilityPoints();
                hero.SetAbilityPoints(math.max(0, points - 1));
                points = hero.GetAbilityPoints();
            }
        } catch (e) {}
    }

    /**
     * Таблица правил:
     * - уровень >=1 и выбранных <2
     * - уровень >=3 и выбранных <3
     * - >=4 и <4
     * - >=5 и <5
     * - >=6 и <6
     * - >=20 и <7
     */
    private allowedForLevel(level: number): number {
        if (level >= 20) return 7;
        if (level >= 6) return 6;
        if (level >= 5) return 5;
        if (level >= 4) return 4;
        if (level >= 3) return 3;
        if (level >= 1) return 2;
        return 0;
    }

    private getRandomOfferAbilities(hero: CDOTA_BaseNPC_Hero, n: number): string[] {
        const out: string[] = [];
        const used = new Set<string>();
        const tries = 400;

        for (let t = 0; t < tries && out.length < n; t++) {
            const pick = ABILITY_POOL[RandomInt(0, ABILITY_POOL.length - 1)];
            if (used.has(pick)) continue;
            used.add(pick);

            // Не предлагаем то, что уже есть у героя
            if (hero.FindAbilityByName(pick)) continue;

            out.push(pick);
        }
        return out;
    }
}


