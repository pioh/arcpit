import { HERO_POOL } from "./hero-pool";
import { PlayerManager } from "../players/player-manager";
import { TeamAssignment } from "../players/team-assignment";
import { PeaceMode } from "../combat/peace-mode";
import { SpawnManager } from "../map/spawn-manager";
import { AbilityDraftManager } from "../abilities/ability-draft-manager";

type HeroOffer = {
    offerId: number;
    heroes: string[];
    picked: boolean;
};

/**
 * Индивидуальный драфт героя: 6 случайных героев на игрока, клик -> ВЫБОР героя.
 *
 * ВАЖНО: по текущему ТЗ мы НЕ спавним героя в момент клика.
 * Мы только фиксируем выбранного героя через PlayerResource.SetSelectedHero,
 * а дальше движок показывает стандартный экран аспектов (STRATEGY_TIME) и спавнит героя нормально.
 */
export class HeroDraftManager {
    private offers: Map<PlayerID, HeroOffer> = new Map();
    private offerSeq: number = 0;

    constructor(
        private playerManager: PlayerManager,
        private teamAssignment: TeamAssignment,
        private peaceMode: PeaceMode,
        private spawnManager: SpawnManager,
        private abilityDraft: AbilityDraftManager
    ) {}

    start(duration: number, useRealTime: boolean = false): void {
        this.offers.clear();

        const ids = this.playerManager.getAllValidPlayerIDs();
        for (const pid of ids) {
            const heroes = this.getRandomUniqueHeroes(6);
            const offerId = ++this.offerSeq;
            this.offers.set(pid, { offerId, heroes, picked: false });

            // ВАЖНО: не делаем массовый PrecacheUnitByNameSync на старте (это может крашить по лимитам ресурсов).
            // Вместо этого — best-effort асинхронно прекешим только героев из оффера.
            try {
                const precacheAsync = (globalThis as any).PrecacheUnitByNameAsync as
                    | ((unitName: string, cb: () => void, context?: any) => void)
                    | undefined;
                if (typeof precacheAsync === "function") {
                    for (const h of heroes) {
                        try {
                            precacheAsync(h, () => {});
                        } catch (e) {}
                    }
                }
            } catch (e) {}

            try {
                const isBot = PlayerResource.IsFakeClient(pid);
                print(`[arcpit][HeroDraft] offer -> pid=${pid} bot=${isBot ? 1 : 0} offerId=${offerId} heroes=${heroes.join(",")}`);
            } catch (e) {}

            // UI нужно только людям; у фейк-клиентов player-handle иногда отсутствует.
            const player = PlayerResource.GetPlayer(pid);
            if (player) {
                CustomGameEventManager.Send_ServerToPlayer(player, "arcpit_hero_draft_offer", {
                    playerID: pid,
                    offerId,
                    duration,
                    heroes,
                });
            }

            // Боты: кликают сразу случайного героя
            if (PlayerResource.IsFakeClient(pid)) {
                const delay = 0.25 + RandomFloat(0.0, 0.35);
                Timers.CreateTimer({
                    useGameTime: !useRealTime,
                    endTime: delay,
                    callback: () => {
                        const offer = this.offers.get(pid);
                        if (!offer || offer.picked) return undefined;
                        const pick = offer.heroes[RandomInt(0, offer.heroes.length - 1)];
                        this.pickHero(pid, offer.offerId, pick);
                        return undefined;
                    }
                });
            }
        }

        Timers.CreateTimer({
            useGameTime: !useRealTime,
            endTime: duration,
            callback: () => {
                this.finish();
                return undefined;
            }
        });
    }

    finish(): void {
        // Автопик тем, кто не успел
        for (const [pid, offer] of this.offers.entries()) {
            if (offer.picked) continue;
            const pick = offer.heroes[RandomInt(0, offer.heroes.length - 1)];
            this.pickHero(pid, offer.offerId, pick);
        }

        // После ReplaceHeroWith у ботов иногда остаются "лишние" npc_dota_hero_wisp на базе.
        // Мы их не предлагаем в пуле, поэтому можно безопасно удалить всех wisp-героев (best-effort).
        Timers.CreateTimer({
            useGameTime: false,
            endTime: 0.5,
            callback: () => {
                this.cleanupWispHeroes();
                return undefined;
            }
        });
    }

    onClientPick(playerID: PlayerID, offerId: number, heroName: string): void {
        this.pickHero(playerID, offerId, heroName);
    }

    /**
     * Фолбек для случаев, когда клиент не смог корректно определить playerID (panorama localPlayerID=-1 и т.п.)
     */
    getOfferOwnerByOfferId(offerId: number): PlayerID | undefined {
        for (const [pid, offer] of this.offers.entries()) {
            if (offer.offerId === offerId) return pid;
        }
        return undefined;
    }

    private pickHero(playerID: PlayerID, offerId: number, heroName: string): void {
        const offer = this.offers.get(playerID);
        if (!offer) {
            try { print(`[arcpit][HeroDraft] pick IGNORE pid=${playerID} (no offer) offerId=${offerId} hero=${heroName}`); } catch (e) {}
            return;
        }
        if (offer.picked) {
            try { print(`[arcpit][HeroDraft] pick IGNORE pid=${playerID} (already picked) offerId=${offerId} hero=${heroName}`); } catch (e) {}
            return;
        }
        if (offer.offerId !== offerId) {
            try { print(`[arcpit][HeroDraft] pick IGNORE pid=${playerID} (offerId mismatch got=${offerId} expected=${offer.offerId}) hero=${heroName}`); } catch (e) {}
            return;
        }
        if (!offer.heroes.includes(heroName)) {
            try { print(`[arcpit][HeroDraft] pick IGNORE pid=${playerID} (hero not in offer) offerId=${offerId} hero=${heroName} offered=${offer.heroes.join(",")}`); } catch (e) {}
            return;
        }

        offer.picked = true;
        this.offers.set(playerID, offer);

        try { print(`[arcpit][HeroDraft] PICK pid=${playerID} offerId=${offerId} hero=${heroName}`); } catch (e) {}

        // Фиксируем выбор для движка через PlayerController.SetSelectedHero(heroName).
        // Важно: это НЕ PlayerResource.SetSelectedHero(pid, ...), а метод у PlayerResource.GetPlayer(pid).
        const player = PlayerResource.GetPlayer(playerID);
        if (player) {
            try { (player as any).SetSelectedHero(heroName); } catch (e) {}
        } else {
            // У фейк-клиентов player-handle может отсутствовать — для них ниже делаем ReplaceHeroWith.
            try { print(`[arcpit][HeroDraft] WARNING: no Player handle for pid=${playerID}, cannot SetSelectedHero(${heroName})`); } catch (e) {}
        }

        // Боты создаются через AddBotPlayerWithEntityScript и уже имеют героя (часто Io).
        // Для них SetSelectedHero недостаточно — нужно реально заменить героя на выбранного.
        if (PlayerResource.IsFakeClient(playerID)) {
            try {
                const replaced = PlayerResource.ReplaceHeroWith(playerID, heroName, 0, 0);
                if (replaced && IsValidEntity(replaced)) {
                    this.playerManager.setPlayerHero(playerID, replaced);
                    // Мирный режим до старта раунда
                    this.peaceMode.applyToHero(replaced);
                    // Жёстко: контроль только своему владельцу
                    for (const pid of this.playerManager.getAllValidPlayerIDs()) {
                        replaced.SetControllableByPlayer(pid, false);
                    }
                    replaced.SetControllableByPlayer(playerID, true);
                    print(`[arcpit][HeroDraft] bot hero replaced pid=${playerID} -> ${heroName}`);
                } else {
                    print(`[arcpit][HeroDraft] WARNING: bot ReplaceHeroWith returned undefined for pid=${playerID} hero=${heroName}`);
                }
            } catch (e) {
                print(`[arcpit][HeroDraft] ERROR: bot ReplaceHeroWith failed pid=${playerID} hero=${heroName}`);
            }
        }
    }

    private getRandomUniqueHeroes(n: number): string[] {
        const pool = [...HERO_POOL];
        // Не предлагаем wisp как "плейсхолдер"
        const filtered = pool.filter(h => h !== "npc_dota_hero_wisp");
        const src = filtered.length >= n ? filtered : pool;

        const out: string[] = [];
        const used = new Set<string>();
        const tries = 200;
        for (let t = 0; t < tries && out.length < n; t++) {
            const pick = src[RandomInt(0, src.length - 1)];
            if (used.has(pick)) continue;
            used.add(pick);
            out.push(pick);
        }
        return out;
    }

    private cleanupWispHeroes(): void {
        try {
            const wisps = (Entities.FindAllByClassname("npc_dota_hero_wisp") as any) as CDOTA_BaseNPC_Hero[];
            let removed = 0;
            for (const w of wisps) {
                if (!w || !IsValidEntity(w)) continue;
                if (!w.IsRealHero()) continue;
                if (w.GetUnitName() !== "npc_dota_hero_wisp") continue;
                // best-effort remove
                try { w.ForceKill(false); } catch (e) {}
                try { (globalThis as any).UTIL_Remove(w); } catch (e) {}
                try { (w as any).RemoveSelf(); } catch (e) {}
                removed++;
            }
            if (removed > 0) {
                print(`[arcpit][HeroDraft] cleaned up ${removed} leftover wisp heroes`);
            }
        } catch (e) {}
    }

}


