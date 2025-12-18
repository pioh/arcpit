import { reloadable } from "./lib/tstl-utils";
import { precacheHeroes } from "./heroes/hero-pool";
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
import { AbilitySelectionStage } from "./game-stages/ability-selection";
import { PreCombatStage } from "./game-stages/pre-combat";
import { CombatStage } from "./game-stages/combat";
import { ScenarioManager } from "./scenarios/main";
import { RoundController } from "./rounds/round-controller";
import { GAME_CONSTANTS } from "./config/game-constants";
import { AiTakeoverController } from "./bots/ai-takeover-controller";
import { LightingManager } from "./map/lighting-manager";

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
    private spawnManager!: SpawnManager;
    private shopkeeperManager!: ShopkeeperManager;
    private stageManager!: StageManager;
    private scenarioManager!: ScenarioManager;
    private roundController!: RoundController;
    private aiTakeover!: AiTakeoverController;
    private lighting!: LightingManager;

    private botsFilled: boolean = false;
    private thinkDtAcc: number = 0;

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
        
        // Управление героями и способностями
        this.heroManager = new HeroManager(this.playerManager, this.teamAssignment, this.peaceMode);
        this.abilityManager = new AbilityManager(this.playerManager);
        
        // Карта
        this.spawnManager = new SpawnManager(this.peaceMode);
        this.shopkeeperManager = new ShopkeeperManager();

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
            this.heroManager,
            this.spawnManager,
            this.playerManager.getAllPlayerHeroes()
        );
        const abilitySelectionStage = new AbilitySelectionStage(this.abilityManager);
        const preCombatStage = new PreCombatStage(
            this.spawnManager,
            this.shopkeeperManager,
            this.playerManager.getAllPlayerHeroes()
        );
        const combatStage = new CombatStage(this.roundController);
        
        this.stageManager = new StageManager(
            heroSelectionStage,
            abilitySelectionStage,
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

        // События от UI
        CustomGameEventManager.RegisterListener("hero_selected", (_, data) => this.onHeroSelected(data));
        CustomGameEventManager.RegisterListener("abilities_selected", (_, data) => this.onAbilitiesSelected(data));
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

        if (state === GameState.PRE_GAME) {
            print("PRE_GAME state - starting custom game");
            Timers.CreateTimer(2, () => {
                this.startGame();
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

            print("Finishing custom game setup...");
            GameRules.FinishCustomGameSetup();
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
            // Мирный режим нужен только вне активного раунда (планирование/нейтралка).
            // В бою, особенно при респавне, не должны автоматически вешать disarm/peace-эффекты,
            // иначе герой (и бот) перестает атаковать.
            if (!this.isRoundActive && this.peaceMode?.isEnabled()) {
                const hero = unit as CDOTA_BaseNPC_Hero;
                this.peaceMode.applyToHero(hero);
            }

            // Бакеты временного интеллекта должны быть у каждого героя всегда
            const hero = unit as CDOTA_BaseNPC_Hero;
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
        }
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
        return 0.1;
    }

    /**
     * Перезагрузка скрипта
     */
    public Reload() {
        print("Script reloaded!");
    }
}
