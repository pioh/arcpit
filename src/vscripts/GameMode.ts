import { reloadable } from "./lib/tstl-utils";
import { HERO_POOL, precacheHeroes } from "./heroes/hero-pool";
import { configureGameRules, configureGameMode, configureTeams } from "./config/game-rules";
import { TeamAssignment } from "./players/team-assignment";
import { PlayerManager } from "./players/player-manager";
import { BotManager } from "./bots/bot-manager";
import { PeaceMode } from "./combat/peace-mode";
import { HeroManager } from "./heroes/hero-manager";
import { AbilityManager } from "./abilities/ability-manager";
import { SpawnManager } from "./map/spawn-manager";
import { ShopkeeperManager } from "./map/shopkeeper";
import { StageManager } from "./game-stages/stage-manager";
import { HeroSelectionStage } from "./game-stages/hero-selection";
import { PreCombatStage } from "./game-stages/pre-combat";
import { CombatStage } from "./game-stages/combat";
import { ScenarioManager } from "./scenarios/main";
import { RoundController } from "./rounds/round-controller";
import { GAME_CONSTANTS } from "./config/game-constants";
import { AiTakeoverController } from "./bots/ai-takeover-controller";
import { LightingManager } from "./map/lighting-manager";
import { HeroDraftManager } from "./heroes/hero-draft-manager";
import { AbilityDraftManager } from "./abilities/ability-draft-manager";
import "./kv_generated/autoload";

declare global {
    interface CDOTAGameRules {
        Addon: GameMode;
    }
}

/**
 * Главный класс игрового режима
 * Координирует работу всех подсистем
 */
@reloadable
export class GameMode {
    // Подсистемы
    private teamAssignment!: TeamAssignment;
    private playerManager!: PlayerManager;
    private botManager!: BotManager;
    private peaceMode!: PeaceMode;
    private heroManager!: HeroManager;
    private abilityManager!: AbilityManager;
    private abilityDraft!: AbilityDraftManager;
    private heroDraft!: HeroDraftManager;
    private spawnManager!: SpawnManager;
    private shopkeeperManager!: ShopkeeperManager;
    private stageManager!: StageManager;
    private scenarioManager!: ScenarioManager;
    private roundController!: RoundController;
    private aiTakeover!: AiTakeoverController;
    private lighting!: LightingManager;

    private botsFilled: boolean = false;
    private thinkDtAcc: number = 0;
    private clearedDefaultAbilities: Map<PlayerID, boolean> = new Map();
    private controlEnforceAcc: number = 0;

    // Флаг для доступа из бот AI
    public botCombatEnabled: boolean = false;
    // Флаги для RoundController / bot AI
    public isRoundActive: boolean = false;
    public currentRound: number = 0;

    /**
     * Прекеш ресурсов
     */
    public static Precache(this: void, context: CScriptPrecacheContext) {
        precacheHeroes(context);

        // В tools/локалке некоторые hero-model ресурсы могут отсутствовать в session-manifest,
        // что приводит к assert "Serialized nonresident asset ...".
        // Best-effort: форсим прекеш базовых моделей героев из npc_heroes.txt (и фолбэк пути).
        try {
            const kv: any = (LoadKeyValues("scripts/npc/npc_heroes.txt") as any) ?? {};
            const precacheRes = (globalThis as any).PrecacheResource;
            if (typeof precacheRes === "function") {
                for (const unitName of HERO_POOL) {
                    let model: string | undefined;
                    try {
                        const entry = kv[unitName];
                        if (entry && typeof entry === "object") {
                            const m = entry["Model"];
                            if (typeof m === "string" && m.length > 0) model = m;
                        }
                    } catch (e) {}
                    if (!model) {
                        const short = unitName.replace("npc_dota_hero_", "");
                        if (short && short.length > 0) model = `models/heroes/${short}/${short}.vmdl`;
                    }
                    if (model && model.length > 0) {
                        try { precacheRes("model", model, context); } catch (e) {}
                    }
                }
            }
        } catch (e) {}
    }

    /**
     * Активация игрового режима
     */
    public static Activate(this: void) {
        GameRules.Addon = new GameMode();
    }

    constructor() {
        print("=== Initializing GameMode ===");
        
        // Инициализация подсистем
        this.initializeSystems();
        
        // Настройка игры
        this.configure();
        
        // Подписка на события
        this.setupEventListeners();
        
        print("=== GameMode initialized ===");
    }

    /**
     * Инициализация всех подсистем
     */
    private initializeSystems(): void {
        // Базовые системы
        this.teamAssignment = new TeamAssignment();
        this.playerManager = new PlayerManager(this.teamAssignment);
        this.botManager = new BotManager(this.teamAssignment);
        this.peaceMode = new PeaceMode();
        
        // Карта
        this.spawnManager = new SpawnManager(this.peaceMode);
        this.shopkeeperManager = new ShopkeeperManager();
        
        // Управление героями и способностями
        this.heroManager = new HeroManager(this.playerManager, this.teamAssignment, this.peaceMode);
        this.abilityManager = new AbilityManager(this.playerManager);
        this.abilityDraft = new AbilityDraftManager(this.playerManager);
        this.heroDraft = new HeroDraftManager(
            this.playerManager,
            this.teamAssignment,
            this.peaceMode,
            this.spawnManager,
            this.abilityDraft
        );

        // Раунды (PvE)
        this.roundController = new RoundController(
            this.playerManager,
            this.spawnManager,
            this.peaceMode
        );

        // AI takeover для ливнувших игроков
        this.aiTakeover = new AiTakeoverController(this.playerManager);

        // Освещение (best-effort)
        this.lighting = new LightingManager();
        
        // Стадии игры
        const heroSelectionStage = new HeroSelectionStage(
            this.heroDraft
        );
        const preCombatStage = new PreCombatStage(
            this.spawnManager,
            this.shopkeeperManager,
            this.playerManager.getAllPlayerHeroes()
        );
        const combatStage = new CombatStage(this.roundController);
        
        this.stageManager = new StageManager(
            heroSelectionStage,
            preCombatStage,
            combatStage,
            this.roundController
        );
        this.roundController.setStageManager(this.stageManager);
        
        // Менеджер сценариев (для тестов и основной игры)
        this.scenarioManager = new ScenarioManager(
            this.playerManager,
            this.spawnManager,
            this.heroManager,
            this.abilityManager,
            this.peaceMode,
            this.stageManager
        );
    }

    /**
     * Настройка игры
     */
    private configure(): void {
        print("=== Configuring Game ===");
        
        configureGameRules();
        configureGameMode();
        configureTeams();
        
        // Основной цикл
        const gameMode = GameRules.GetGameModeEntity();
        gameMode.SetThink(() => this.onThink(), this, "GameThink", 0.1);
    }

    /**
     * Подписка на события
     */
    private setupEventListeners(): void {
        ListenToGameEvent("game_rules_state_change", () => this.onStateChange(), undefined);
        ListenToGameEvent("npc_spawned", event => this.onNpcSpawned(event), undefined);
        ListenToGameEvent("player_connect_full", event => this.onPlayerConnected(event), undefined);
        ListenToGameEvent("entity_killed", event => this.onEntityKilled(event), undefined);
        ListenToGameEvent("dota_player_gained_level", event => this.onPlayerGainedLevel(event as any), undefined);

        // События от UI
        CustomGameEventManager.RegisterListener("hero_selected", (_, data) => this.onHeroSelected(data));
        CustomGameEventManager.RegisterListener("abilities_selected", (_, data) => this.onAbilitiesSelected(data));
        CustomGameEventManager.RegisterListener("arcpit_hero_pick", (src, data) => this.onHeroPick(src as PlayerID, data));
        CustomGameEventManager.RegisterListener("arcpit_ability_pick", (src, data) => this.onAbilityPick(src as PlayerID, data));
    }

    /**
     * Обработка смены состояния игры
     */
    private onStateChange(): void {
        const state = GameRules.State_Get();
        print(`=== Game state changed to: ${state} ===`);

        if (state === GameState.CUSTOM_GAME_SETUP) {
            this.handleCustomGameSetup();
        }

        if (state === GameState.GAME_IN_PROGRESS) {
            // В этот момент герой уже должен быть определён выбором + аспектами.
            print("[arcpit] GAME_IN_PROGRESS: starting scenario + initial ability offers");
            Timers.CreateTimer(0.25, () => {
                this.startGame();
                if (GAME_CONSTANTS.CLEAR_DEFAULT_ABILITIES_IN_CODE) {
                    // Герои могли заспавниться раньше (до GAME_IN_PROGRESS), поэтому чистим дефолтные способности принудительно.
                    for (const pid of this.playerManager.getAllValidPlayerIDs()) {
                        if (this.clearedDefaultAbilities.get(pid)) continue;
                        const hero = this.playerManager.getPlayerHero(pid) ?? PlayerResource.GetSelectedHeroEntity(pid);
                        if (!hero || !IsValidEntity(hero)) continue;
                        this.clearedDefaultAbilities.set(pid, true);
                        this.clearAllHeroAbilities(hero);
                        try { print(`[arcpit][Abilities] cleared default abilities on GAME_IN_PROGRESS pid=${pid} hero=${hero.GetUnitName()}`); } catch (e) {}
                    }
                }
                // Первые 2 способности на 1 уровне должны быть доступны сразу
                for (const pid of this.playerManager.getAllValidPlayerIDs()) {
                    this.abilityDraft.maybeOffer(pid);
                }
                return undefined;
            });
        }
    }

    /**
     * Обработка фазы CUSTOM_GAME_SETUP
     */
    private handleCustomGameSetup(): void {
        print("CUSTOM_GAME_SETUP state - auto finishing...");

        Timers.CreateTimer(0.1, () => {
            // В CUSTOM_GAME_SETUP добиваем недостающих игроков ботами (как отдельные player-slot'ы).
            // Считаем РЕАЛЬНЫХ подключенных людей по списку валидных PlayerID.
            if (!this.botsFilled) {
                const connectedHumans = this.playerManager.getConnectedHumanPlayerIDs();
                this.botManager.ensureBotsToFillFromConnectedHumans(GAME_CONSTANTS.MAX_PLAYERS, connectedHumans);
                this.botsFilled = true;
            }

            // Кастомный пик героев должен быть самым первым экраном (до аспектов и до старта игры).
            // Поэтому держим CUSTOM_GAME_SETUP ещё HERO_SELECTION_TIME секунд, показываем оффер и только потом продолжаем.
            print(`[arcpit] CUSTOM_GAME_SETUP: starting custom hero draft for ${GAME_CONSTANTS.HERO_SELECTION_TIME}s`);
            // В CUSTOM_GAME_SETUP gameTime может не тикать, поэтому используем real-time таймеры.
            this.heroDraft.start(GAME_CONSTANTS.HERO_SELECTION_TIME, true);

            Timers.CreateTimer({
                useGameTime: false,
                endTime: GAME_CONSTANTS.HERO_SELECTION_TIME + 0.35,
                callback: () => {
                    print("Finishing custom game setup...");
                    GameRules.FinishCustomGameSetup();
                    return undefined;
                }
            });
            return undefined;
        });
    }

    /**
     * Старт игры
     */
    private startGame(): void {
        print("=== Game starting! ===");
        // Пытаемся включить яркий omnidirectional свет в нейтралке и аренах.
        this.lighting.ensureLights();
        
        this.botManager.disableBotCombat();
        // Боты должны быть добавлены в CUSTOM_GAME_SETUP; тут только safety-net (например, при script_reload)
        if (!this.botsFilled) {
            const connectedHumans = this.playerManager.getConnectedHumanPlayerIDs();
            this.botManager.ensureBotsToFillFromConnectedHumans(GAME_CONSTANTS.MAX_PLAYERS, connectedHumans);
            this.botsFilled = true;
        }
        
        // Запускаем выбранный сценарий (основная игра или тест)
        // Меняй сценарий в scenarios/main.ts
        this.scenarioManager.startSelectedScenario();
    }

    /**
     * Обработка подключения игрока
     */
    private onPlayerConnected(event: PlayerConnectFullEvent): void {
        this.playerManager.onPlayerConnected(event.PlayerID as PlayerID);
    }

    /**
     * Обработка спавна NPC
     */
    private onNpcSpawned(event: NpcSpawnedEvent): void {
        if (event.entindex === undefined) return;
        const unit = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC;
        
        if (unit.IsRealHero()) {
            print(`Hero spawned: ${unit.GetUnitName()}`);

            // Важно: в tools/локалке часто падаем на "Serialized nonresident asset ..." из-за косметики/персон.
            // Срезаем wearables сразу после спавна (best-effort), чтобы движок не пытался сериализовать модели.
            const hero = unit as CDOTA_BaseNPC_Hero;
            Timers.CreateTimer(0.0, () => {
                try { this.stripWearables(hero); } catch (e) {}
                try { this.forceDefaultHeroModel(hero); } catch (e) {}
                return undefined;
            });
            // Иногда движок/GC применяет модель/персону после первого тика — повторим.
            Timers.CreateTimer(0.2, () => {
                try { this.stripWearables(hero); } catch (e) {}
                try { this.forceDefaultHeroModel(hero); } catch (e) {}
                return undefined;
            });

            // Мирный режим нужен только вне активного раунда (планирование/нейтралка).
            // В бою, особенно при респавне, не должны автоматически вешать disarm/peace-эффекты,
            // иначе герой (и бот) перестает атаковать.
            if (!this.isRoundActive && this.peaceMode?.isEnabled()) {
                this.peaceMode.applyToHero(hero);
            }

            // Бакеты временного интеллекта должны быть у каждого героя всегда
            if (!hero.HasModifier("modifier_temp_int_buckets")) {
                hero.AddNewModifier(hero, undefined, "modifier_temp_int_buckets", {});
            }

            // Хук для раундов: "респавн там же"
            this.roundController?.onNpcSpawned(hero);

            // Жёстко: герой должен быть controllable только своим владельцем (даже если его можно "выбрать" кликом).
            const pid = hero.GetPlayerID();
            if (pid !== undefined) {
                for (let p = 0; p < 64; p++) {
                    if (!PlayerResource.IsValidPlayerID(p)) continue;
                    hero.SetControllableByPlayer(p as PlayerID, false);
                }
                hero.SetControllableByPlayer(pid, true);
            }

            // ВАЖНО по ТЗ: после старта игры герой должен быть БЕЗ дефолтных способностей.
            // Делать это в HERO_SELECTION/STRATEGY нельзя (там игрок выбирает аспект), поэтому чистим после появления героя,
            // но только один раз на PlayerID.
            if (pid !== undefined && PlayerResource.IsValidPlayerID(pid)) {
                const state = GameRules.State_Get();
                if (GAME_CONSTANTS.CLEAR_DEFAULT_ABILITIES_IN_CODE && state >= GameState.GAME_IN_PROGRESS && !this.clearedDefaultAbilities.get(pid)) {
                    this.clearedDefaultAbilities.set(pid, true);
                    this.clearAllHeroAbilities(hero);
                    try { print(`[arcpit][Abilities] cleared default abilities for pid=${pid} hero=${hero.GetUnitName()}`); } catch (e) {}
                }
            }

            // ВАЖНО: выбор способностей на 1 уровне должен появляться сразу после появления героя.
            // Иначе он может "съезжать" до второго уровня, если оффер попытались дать до спавна.
            if (pid !== undefined && PlayerResource.IsValidPlayerID(pid)) {
                const state = GameRules.State_Get();
                if (state >= GameState.GAME_IN_PROGRESS) {
                    Timers.CreateTimer(0.35, () => {
                        this.abilityDraft.maybeOffer(pid);
                        return undefined;
                    });
                }
            }
        }
    }

    private clearAllHeroAbilities(hero: CDOTA_BaseNPC_Hero): void {
        try {
            for (let j = hero.GetAbilityCount() - 1; j >= 0; j--) {
                const ab = hero.GetAbilityByIndex(j);
                if (!ab) continue;
                const name = ab.GetAbilityName();
                if (!name || name.length <= 0) continue;
                try { hero.RemoveAbility(name); } catch (e) {}
            }
        } catch (e) {}
    }

    /**
     * В tools окружении у некоторых косметик/персон отсутствуют нужные attachments (например attach_attack1),
     * что приводит к крашу при создании projectile/particles. Форсим дефолтную модель героя из KV ("Model").
     */
    private forceDefaultHeroModel(hero: CDOTA_BaseNPC_Hero): void {
        if (!hero || !IsValidEntity(hero)) return;

        const unitName = hero.GetUnitName();

        // 1) Пытаемся взять дефолтную модель из npc_heroes.txt (она не должна зависеть от персон/косметики).
        let defaultModel: string | undefined;
        try {
            const kv: any = (LoadKeyValues("scripts/npc/npc_heroes.txt") as any) ?? {};
            const entry = kv[unitName];
            if (entry && typeof entry === "object") {
                const m = entry["Model"];
                if (typeof m === "string" && m.length > 0) defaultModel = m;
            }
        } catch (e) {}

        // 2) Фолбек: если KV не прочитался — пробуем типичный путь models/heroes/<short>/<short>.vmdl
        if (!defaultModel) {
            const short = unitName.replace("npc_dota_hero_", "");
            if (short && short.length > 0) {
                defaultModel = `models/heroes/${short}/${short}.vmdl`;
            }
        }
        if (!defaultModel || defaultModel.length <= 0) return;

        let current: string | undefined;
        try { current = hero.GetModelName(); } catch (e) { current = undefined; }
        if (current === defaultModel) return;

        // Применяем как original + current model (best-effort)
        try { hero.SetOriginalModel(defaultModel); } catch (e) {}
        try { hero.SetModel(defaultModel); } catch (e) {}
    }

    /**
     * Best-effort удалить косметические носимые предметы (wearables), чтобы не ловить engine assert
     * на "Serialized nonresident asset ..." в tools окружении.
     */
    private stripWearables(hero: CDOTA_BaseNPC_Hero): void {
        if (!hero || !IsValidEntity(hero)) return;

        const h: any = hero as any;
        let child: any = undefined;

        try { child = h.FirstMoveChild ? h.FirstMoveChild() : undefined; } catch (e) { child = undefined; }

        // Ограничим число итераций, чтобы случайно не уйти в цикл
        let guard = 0;
        while (child && guard++ < 512) {
            let next: any = undefined;
            try { next = child.NextMovePeer ? child.NextMovePeer() : undefined; } catch (e) { next = undefined; }

            try {
                const cn = child.GetClassname ? child.GetClassname() : "";
                if (cn === "dota_item_wearable") {
                    // Сначала пробуем engine helper, потом RemoveSelf (по ситуации)
                    try { (globalThis as any).UTIL_Remove(child); } catch (e) {}
                    try { child.RemoveSelf(); } catch (e) {}
                }
            } catch (e) {}

            child = next;
        }
    }

    private onPlayerGainedLevel(event: any): void {
        const pid = event.player_id as PlayerID | undefined;
        if (pid === undefined || !PlayerResource.IsValidPlayerID(pid)) return;
        this.abilityDraft.maybeOffer(pid);
    }

    private onHeroPick(playerID: PlayerID, data: any): void {
        const offerId = Number(data.offerId ?? 0);
        const heroName = String(data.heroName ?? "");
        if (!heroName) return;
        const pidFromData = Number(data.playerID ?? -1) as PlayerID;
        let pid: PlayerID | undefined = PlayerResource.IsValidPlayerID(pidFromData) ? (pidFromData as PlayerID) : undefined;
        if (pid === undefined) {
            const fromOffer = this.heroDraft.getOfferOwnerByOfferId(offerId);
            if (fromOffer !== undefined) pid = fromOffer;
        }
        if (pid === undefined) pid = playerID;
        try {
            print(`[arcpit][HeroPick] src=${playerID} dataPid=${data.playerID} -> pid=${pid} offerId=${offerId} heroName=${heroName}`);
        } catch (e) {}
        this.heroDraft.onClientPick(pid, offerId, heroName);
    }

    private onAbilityPick(playerID: PlayerID, data: any): void {
        const offerId = Number(data.offerId ?? 0);
        const abilityName = String(data.abilityName ?? "");
        if (!abilityName) return;
        const pidFromData = Number(data.playerID ?? -1) as PlayerID;
        let pid: PlayerID | undefined = PlayerResource.IsValidPlayerID(pidFromData) ? (pidFromData as PlayerID) : undefined;
        if (pid === undefined) {
            const fromOffer = this.abilityDraft.getOfferOwnerByOfferId(offerId);
            if (fromOffer !== undefined) pid = fromOffer;
        }
        if (pid === undefined) pid = playerID;
        try {
            print(`[arcpit][AbilityPick] src=${playerID} dataPid=${data.playerID} -> pid=${pid} offerId=${offerId} abilityName=${abilityName}`);
        } catch (e) {}
        this.abilityDraft.onClientPick(pid, offerId, abilityName);
    }

    private onEntityKilled(event: EntityKilledEvent): void {
        this.roundController?.onEntityKilled(event);
    }

    /**
     * Выбор героя (пока не используется)
     */
    private onHeroSelected(data: any): void {
        print(`Player ${data.PlayerID} selected hero`);
    }

    /**
     * Выбор способностей (пока не используется)
     */
    private onAbilitiesSelected(data: any): void {
        print(`Player ${data.PlayerID} selected abilities`);
    }

    /**
     * Основной игровой цикл
     */
    private onThink(): number {
        // Обновляем флаг для бот AI
        this.botCombatEnabled = this.botManager.isBotCombatEnabled();

        // AI takeover: периодически проверяем, кто дисконнектнулся, и берём героя под контроль
        this.thinkDtAcc += 0.1;
        this.aiTakeover.tick(0.1, this.isRoundActive);

        // Жёстко: чтобы игрок точно не мог управлять чужими героями (ботами),
        // периодически переустанавливаем controllable flags.
        this.controlEnforceAcc += 0.1;
        if (this.controlEnforceAcc >= 1.0) {
            this.controlEnforceAcc = 0;
            this.enforceExclusiveControlAll();
        }
        return 0.1;
    }

    private enforceExclusiveControlAll(): void {
        const ids = this.playerManager.getAllValidPlayerIDs();
        for (const pid of ids) {
            const hero = this.playerManager.getPlayerHero(pid) ?? PlayerResource.GetSelectedHeroEntity(pid);
            if (!hero || !IsValidEntity(hero)) continue;
            if (!hero.IsRealHero()) continue;
            const owner = (hero as CDOTA_BaseNPC_Hero).GetPlayerID();
            for (const p of ids) {
                hero.SetControllableByPlayer(p, false);
            }
            if (owner !== undefined) {
                hero.SetControllableByPlayer(owner, true);
            }
        }
    }

    /**
     * Перезагрузка скрипта
     */
    public Reload() {
        print("Script reloaded!");
    }
}
