import { reloadable } from "./lib/tstl-utils";

// Перечисление стадий игры
enum GameStage {
    INIT = 0,
    HERO_SELECTION = 1,
    ABILITY_SELECTION = 2,
    PRE_COMBAT = 3,
    COMBAT = 4
}

declare global {
    interface CDOTAGameRules {
        Addon: GameMode;
    }
}

@reloadable
export class GameMode {
    private currentStage: GameStage = GameStage.INIT;
    private playerTeams: Map<PlayerID, DotaTeam> = new Map();
    private playerHeroes: Map<PlayerID, CDOTA_BaseNPC_Hero> = new Map();
    public botCombatEnabled: boolean = false;
    private botAdded: boolean = false;
    private peaceMode: boolean = true;
    private readonly maxPlayers = 8;
    private readonly heroSelectionTime = 5;
    private readonly abilitySelectionTime = 5;
    private readonly preCombatTime = 10;

    // Пулы (потом вынесем в отдельный файл/kv)
    private readonly heroPool: string[] = [
        "npc_dota_hero_axe", "npc_dota_hero_juggernaut", "npc_dota_hero_sven",
        "npc_dota_hero_pudge", "npc_dota_hero_crystal_maiden", "npc_dota_hero_lina",
        "npc_dota_hero_invoker", "npc_dota_hero_mirana", "npc_dota_hero_antimage",
        "npc_dota_hero_phantom_assassin", "npc_dota_hero_sniper", "npc_dota_hero_drow_ranger"
    ];

    public static Precache(this: void, context: CScriptPrecacheContext) {
        // Важно: без прекеша в tools иногда получаем "nonresident asset" на моделях.
        // Прекешим хотя бы пул героев и временного форс-героя.
        PrecacheUnitByNameSync("npc_dota_hero_wisp", context);
        const heroPool = [
            "npc_dota_hero_axe", "npc_dota_hero_juggernaut", "npc_dota_hero_sven",
            "npc_dota_hero_pudge", "npc_dota_hero_crystal_maiden", "npc_dota_hero_lina",
            "npc_dota_hero_invoker", "npc_dota_hero_mirana", "npc_dota_hero_antimage",
            "npc_dota_hero_phantom_assassin", "npc_dota_hero_sniper", "npc_dota_hero_drow_ranger"
        ];
        for (const name of heroPool) {
            PrecacheUnitByNameSync(name, context);
        }
    }

    public static Activate(this: void) {
        GameRules.Addon = new GameMode();
    }

    constructor() {
        this.configure();

        ListenToGameEvent("game_rules_state_change", () => this.OnStateChange(), undefined);
        ListenToGameEvent("npc_spawned", event => this.OnNpcSpawned(event), undefined);
        ListenToGameEvent("player_connect_full", event => this.OnPlayerConnected(event), undefined);

        // События от UI
        CustomGameEventManager.RegisterListener("hero_selected", (_, data) => this.OnHeroSelected(data));
        CustomGameEventManager.RegisterListener("abilities_selected", (_, data) => this.OnAbilitiesSelected(data));
    }

    private configure(): void {
        print("=== Configuring GameMode ===");
        
        // Настройка правил игры
        GameRules.SetHeroRespawnEnabled(false);
        // Чтобы была "лавка со всеми предметами" даже на пустой карте
        GameRules.SetUseUniversalShopMode(true);
        GameRules.SetSameHeroSelectionEnabled(true);
        // Полностью пропускаем стандартный пик — герой будет выдан принудительно (см. ForceHero ниже)
        GameRules.SetHeroSelectionTime(0);
        GameRules.SetStrategyTime(0);
        GameRules.SetShowcaseTime(0);
        GameRules.SetPreGameTime(3);
        GameRules.SetCustomGameSetupAutoLaunchDelay(0);
        GameRules.SetCustomGameSetupTimeout(0);
        
        // Настройки игрового режима
        const gameMode = GameRules.GetGameModeEntity();
        gameMode.SetBuybackEnabled(false);
        gameMode.SetTopBarTeamValuesVisible(false);
        gameMode.SetAnnouncerDisabled(true);
        gameMode.SetKillingSpreeAnnouncerDisabled(true);
        gameMode.SetRecommendedItemsDisabled(true);
        gameMode.SetBotThinkingEnabled(false);

        // Экономика: чтобы магазин был удобен для тестов
        GameRules.SetStartingGold(2000);
        GameRules.SetGoldPerTick(2);
        GameRules.SetGoldTickTime(1.0);
        // Важно: без ForceHero движок может НЕ создать героя (и ReplaceHeroWith падает).
        // Выдаем временного героя, потом заменим на рандомного в нашей стадии выбора.
        gameMode.SetCustomGameForceHero("npc_dota_hero_wisp");
        
        // Команды: только CUSTOM_1..CUSTOM_8 (не GOODGUYS/BADGUYS/NEUTRALS)
        for (let i = 0; i < this.maxPlayers; i++) {
            const team = (DotaTeam.CUSTOM_1 + i) as DotaTeam;
            GameRules.SetCustomGameTeamMaxPlayers(team, 1);
        }

        gameMode.SetThink(() => this.OnThink(), this, "GameThink", 0.1);
        print("=== GameMode configured ===");
    }

    private OnPlayerConnected(event: PlayerConnectFullEvent): void {
        const playerID = event.PlayerID as PlayerID;
        print(`Player ${playerID} connected`);
        
        // Назначаем игроку уникальную команду
        const teamID = this.GetAvailableTeam();
        this.playerTeams.set(playerID, teamID);

        // Важно: назначаем реальную команду движку пока мы ещё в фазе сетапа,
        // иначе Dota будет считать игрока в дефолтной команде, и ломается камера/hero selection.
        const state = GameRules.State_Get();
        if (state <= GameState.CUSTOM_GAME_SETUP) {
            PlayerResource.SetCustomTeamAssignment(playerID, teamID);
            print(`Assigned player ${playerID} to team ${teamID} via SetCustomTeamAssignment`);
        } else {
            print(`WARNING: Player ${playerID} connected too late for team assignment (state=${state})`);
        }
    }

    private GetAvailableTeam(): DotaTeam {
        const usedTeams = new Set(this.playerTeams.values());
        for (let i = 0; i < this.maxPlayers; i++) {
            const team = (DotaTeam.CUSTOM_1 + i) as DotaTeam;
            if (!usedTeams.has(team)) {
                return team;
            }
        }
        return DotaTeam.CUSTOM_1;
    }

    public OnStateChange(): void {
        const state = GameRules.State_Get();
        print(`=== Game state changed to: ${state} ===`);

        if (state === GameState.CUSTOM_GAME_SETUP) {
            print("CUSTOM_GAME_SETUP state - auto finishing...");
            // Если в лобби 1 человек — добавим бота СРАЗУ (в этой фазе это безопаснее всего).
            if (!this.botAdded && this.GetHumanPlayerCount() === 1) {
                this.AddBot();
                this.botAdded = true;
            }

            Timers.CreateTimer(0.1, () => {
                print("Finishing custom game setup...");
                GameRules.FinishCustomGameSetup();
            });
        }

        if (state === GameState.PRE_GAME) {
            print("PRE_GAME state - starting custom game");
            Timers.CreateTimer(2, () => this.StartGame());
        }
    }

    private StartGame(): void {
        print("=== Game starting! ===");
        this.botCombatEnabled = false;
        this.peaceMode = true;
        
        // Проверяем количество игроков
        const humanPlayerCount = this.GetHumanPlayerCount();
        print(`Human players: ${humanPlayerCount}`);

        // Бот теперь создается в CUSTOM_GAME_SETUP (см. OnStateChange)
        
        // Сразу включаем "мирный режим": одна команда + запрет автоатаки.
        this.ApplyPeaceModeToAll();

        // Деньги игрокам (в tools/фейкклиентах иногда стартует с 0)
        for (let i = 0; i < 64; i++) {
            if (!PlayerResource.IsValidPlayerID(i)) continue;
            PlayerResource.SetGold(i as PlayerID, 2000, true);
        }

        // Запрещаем шэринг юнитов, чтобы игрок НЕ мог управлять ботом.
        for (let a = 0; a < 64; a++) {
            if (!PlayerResource.IsValidPlayerID(a)) continue;
            for (let b = 0; b < 64; b++) {
                if (!PlayerResource.IsValidPlayerID(b)) continue;
                if (a === b) continue;
                for (let f = 0; f < 32; f++) {
                    PlayerResource.SetUnitShareMaskForPlayer(a as PlayerID, b as PlayerID, f, false);
                }
            }
        }

        // Не удаляем дефолтного героя через RemoveSelf() — это часто ломает камеру/состояние.
        // Вместо этого на стадии выбора героя мы делаем ReplaceHeroWith.
        // Сохраняем текущего героя (force hero) на всякий случай.
        for (let i = 0; i < PlayerResource.GetPlayerCount(); i++) {
            if (PlayerResource.IsValidPlayerID(i)) {
                const hero = PlayerResource.GetSelectedHeroEntity(i);
                if (hero && IsValidEntity(hero)) {
                    this.playerHeroes.set(i as PlayerID, hero);
                }
            }
        }
        Timers.CreateTimer(0.5, () => this.StartHeroSelection());
    }

    private GetHumanPlayerCount(): number {
        let count = 0;
        for (let i = 0; i < PlayerResource.GetPlayerCount(); i++) {
            if (PlayerResource.IsValidPlayerID(i) && !PlayerResource.IsFakeClient(i)) {
                count++;
            }
        }
        return count;
    }

    private AddBot(): void {
        // Tutorial.AddBot в кастомках не доступен. Используем GameRules.AddBotPlayerWithEntityScript.
        const team = this.GetAvailableTeam();

        print(`Adding bot player on team ${team}...`);
        const botHero = GameRules.AddBotPlayerWithEntityScript(
            "npc_dota_hero_wisp", // временный, потом заменим на рандомного в AutoSelectHeroes
            "ArcpitBot",
            team as unknown as DOTATeam_t,
            "bot/arcpit_bot_ai.lua",
            false
        );

        if (!botHero) {
            print("✗ Failed to create bot player via AddBotPlayerWithEntityScript");
            return;
        }

        // Найдём ID бота и сохраним команду
        const botPlayerID = botHero.GetPlayerID();
        if (botPlayerID !== undefined) {
            this.playerTeams.set(botPlayerID, team);
            // Назначать команду можно только в CUSTOM_GAME_SETUP
            const state = GameRules.State_Get();
            if (state <= GameState.CUSTOM_GAME_SETUP) {
                PlayerResource.SetCustomTeamAssignment(botPlayerID, team);
            }
            print(`✓ Bot created. PlayerID=${botPlayerID}, team=${team}`);
        } else {
            print("WARNING: Bot hero has no PlayerID");
        }

        // Мирный режим — на всякий случай сразу после спавна
        this.ApplyPeaceModeToAll();
    }

    private StartHeroSelection(): void {
        print("=== Starting hero selection phase ===");
        this.currentStage = GameStage.HERO_SELECTION;
        this.peaceMode = true;
        this.ApplyPeaceModeToAll();

        // Отправляем событие на клиент
        print(`Sending stage_changed event: stage=${GameStage.HERO_SELECTION}, duration=${this.heroSelectionTime}`);
        CustomGameEventManager.Send_ServerToAllClients("stage_changed", {
            stage: GameStage.HERO_SELECTION,
            duration: this.heroSelectionTime
        });

        // Автоматический выбор через 5 секунд
        Timers.CreateTimer(this.heroSelectionTime, () => {
            this.AutoSelectHeroes();
            return undefined;
        });
    }

    private AutoSelectHeroes(): void {
        print("=== Auto-selecting heroes for all players ===");
        const allHeroes = this.heroPool;

        // Важно: боты иногда не имеют CONNECTED в момент вызова, поэтому не фильтруем по connectionState.
        // Делаем ретраи, пока у игрока не появится текущий герой для ReplaceHeroWith.
        let pending = 0;
        for (let i = 0; i < 64; i++) {
            if (PlayerResource.IsValidPlayerID(i)) {
                const current = PlayerResource.GetSelectedHeroEntity(i);
                if (!current || !IsValidEntity(current)) {
                    pending++;
                    continue;
                }
                const randomHero = allHeroes[RandomInt(0, allHeroes.length - 1)];
                const team = this.playerTeams.get(i as PlayerID) || (DotaTeam.CUSTOM_1 + i) as DotaTeam;

                print(`Replacing hero with ${randomHero} for player ${i} on team ${team}`);

                // ReplaceHeroWith корректно обновляет SelectedHero/камеру/контроллер
                const hero = PlayerResource.ReplaceHeroWith(i, randomHero, 0, 0);
                if (hero) {
                    // До старта боя все друзья
                    hero.SetTeam(DotaTeam.CUSTOM_1);
                    hero.SetControllableByPlayer(i, true);
                    this.playerHeroes.set(i as PlayerID, hero);
                    print(`✓ Hero replaced successfully for player ${i}, saved to map`);
                    this.ApplyPeaceModeToHero(hero);
                } else {
                    print(`✗ Failed to ReplaceHeroWith for player ${i}`);
                }
            }
        }

        if (pending > 0) {
            print(`AutoSelectHeroes: pending players without current hero = ${pending}, retrying...`);
            Timers.CreateTimer(0.25, () => {
                this.AutoSelectHeroes();
                return undefined;
            });
            return;
        }

        // Даем движку тик чтобы SelectedHeroEntity точно появился
        Timers.CreateTimer(0.5, () => {
            for (let i = 0; i < 64; i++) {
                if (PlayerResource.IsValidPlayerID(i)) {
                    const selected = PlayerResource.GetSelectedHeroEntity(i);
                    if (selected && IsValidEntity(selected)) {
                        this.playerHeroes.set(i as PlayerID, selected);
                    }
                }
            }
            this.StartAbilitySelection();
            return undefined;
        });
    }

    private StartAbilitySelection(): void {
        print("=== Starting ability selection phase ===");
        this.currentStage = GameStage.ABILITY_SELECTION;
        this.peaceMode = true;
        this.ApplyPeaceModeToAll();

        print(`Sending stage_changed event: stage=${GameStage.ABILITY_SELECTION}, duration=${this.abilitySelectionTime}`);
        CustomGameEventManager.Send_ServerToAllClients("stage_changed", {
            stage: GameStage.ABILITY_SELECTION,
            duration: this.abilitySelectionTime
        });

        Timers.CreateTimer(this.abilitySelectionTime, () => {
            this.AutoSelectAbilities();
            return undefined;
        });
    }

    private AutoSelectAbilities(): void {
        print("=== Auto-selecting abilities for all players ===");

        // Список всех базовых способностей героев
        const allAbilities = [
            "axe_berserkers_call", "axe_battle_hunger", "axe_counter_helix", "axe_culling_blade",
            "juggernaut_blade_fury", "juggernaut_healing_ward", "juggernaut_blade_dance", "juggernaut_omni_slash",
            "sven_storm_bolt", "sven_great_cleave", "sven_warcry", "sven_gods_strength",
            "pudge_meat_hook", "pudge_rot", "pudge_flesh_heap", "pudge_dismember",
            "crystal_maiden_crystal_nova", "crystal_maiden_frostbite", "crystal_maiden_brilliance_aura", "crystal_maiden_freezing_field",
            "lina_dragon_slave", "lina_light_strike_array", "lina_fiery_soul", "lina_laguna_blade"
        ];

        for (let i = 0; i < 64; i++) {
            if (PlayerResource.IsValidPlayerID(i)) {
                // Используем сохраненную ссылку на героя
                let hero = this.playerHeroes.get(i as PlayerID);
                if (!hero || !IsValidEntity(hero)) {
                    const selected = PlayerResource.GetSelectedHeroEntity(i);
                    if (selected && IsValidEntity(selected)) {
                        hero = selected;
                        this.playerHeroes.set(i as PlayerID, hero);
                    }
                }
                if (hero && IsValidEntity(hero)) {
                    print(`Processing abilities for player ${i}, hero: ${hero.GetUnitName()}`);
                    
                    // Удаляем все текущие способности
                    for (let j = hero.GetAbilityCount() - 1; j >= 0; j--) {
                        const ability = hero.GetAbilityByIndex(j);
                        if (ability) {
                            const abilityName = ability.GetAbilityName();
                            print(`  Removing ability: ${abilityName}`);
                            hero.RemoveAbility(abilityName);
                        }
                    }

                    // Добавляем 5 случайных способностей
                    const selectedAbilities = this.GetRandomAbilities(allAbilities, 5);
                    print(`  Selected abilities: ${selectedAbilities.join(", ")}`);
                    
                    for (let j = 0; j < selectedAbilities.length; j++) {
                        const abilityName = selectedAbilities[j];
                        const ability = hero.AddAbility(abilityName);
                        if (ability) {
                            ability.SetLevel(1);
                            print(`  ✓ Added ability: ${abilityName}`);
                        } else {
                            print(`  ✗ Failed to add ability: ${abilityName}`);
                        }
                    }
                } else {
                    print(`✗ No hero found for player ${i} in saved map`);
                }
            }
        }

        Timers.CreateTimer(1, () => {
            this.StartPreCombat();
            return undefined;
        });
    }

    private GetRandomAbilities(abilities: string[], count: number): string[] {
        // НЕЛЬЗЯ использовать Array.sort(() => Math.random() - 0.5) под TSTL:
        // в Lua comparator должен возвращать boolean, а не number → падение "invalid order function for sorting".
        const pool = [...abilities];
        const result: string[] = [];

        while (result.length < count && pool.length > 0) {
            const idx = RandomInt(0, pool.length - 1);
            result.push(pool[idx]);
            // swap-remove
            pool[idx] = pool[pool.length - 1];
            pool.pop();
        }

        return result;
    }

    private StartPreCombat(): void {
        print("=== Starting pre-combat phase ===");
        this.currentStage = GameStage.PRE_COMBAT;
        this.botCombatEnabled = false;
        this.peaceMode = true;

        // Спавним всех героев в центре карты
        const spawnPoint = Entities.FindByClassname(undefined, "info_player_start_dota");
        let spawnLocation = Vector(0, 0, 128);
        
        if (spawnPoint) {
            spawnLocation = spawnPoint.GetAbsOrigin();
            print(`Spawn location found: ${spawnLocation.x}, ${spawnLocation.y}, ${spawnLocation.z}`);
        } else {
            print("Warning: No spawn point found, using default location");
        }

        // Делаем всех союзниками временно и телепортируем в центр
        for (let i = 0; i < 64; i++) {
            if (PlayerResource.IsValidPlayerID(i)) {
                const hero = this.playerHeroes.get(i as PlayerID);
                if (hero && IsValidEntity(hero)) {
                    hero.SetAbsOrigin(spawnLocation);
                    FindClearSpaceForUnit(hero, spawnLocation, true);
                    hero.SetTeam(DotaTeam.CUSTOM_1); // Все друзья на время стадий
                    this.ApplyPeaceModeToHero(hero);
                    print(`Player ${i} hero moved to spawn point and set to PEACE team`);
                } else {
                    print(`✗ Hero not found for player ${i} during spawn`);
                }
            }
        }

        CustomGameEventManager.Send_ServerToAllClients("stage_changed", {
            stage: GameStage.PRE_COMBAT,
            duration: this.preCombatTime
        });

        // Спавним "торговца" рядом со стартовой точкой (на случай если захочешь визуальную лавку).
        // Даже без него universal shop уже включен.
        this.EnsureShopkeeper(spawnLocation);

        Timers.CreateTimer(this.preCombatTime, () => {
            this.StartCombat();
            return undefined;
        });
    }

    private EnsureShopkeeper(spawnLocation: Vector): void {
        // У нас включен universal shop, так что магазин функционально уже есть.
        // Но чтобы "лавка" была видна на пустой карте — ставим статичную модель торговца.
        // (npc_dota_shop_keeper не является юнитом npc_units, поэтому CreateUnitByName часто падает.)

        const existing = Entities.FindAllByName("arcpit_shopkeeper");
        if (existing && existing.length > 0) return;

        const pos = Vector(spawnLocation.x + 300, spawnLocation.y, spawnLocation.z);

        // Best-effort: пробуем создать ent_dota_shop (может отсутствовать в tools окружении)
        try {
            const shopEnt = SpawnEntityFromTableSynchronous("ent_dota_shop", {
                targetname: "arcpit_shop",
                origin: `${pos.x} ${pos.y} ${pos.z}`,
            });
            if (shopEnt && IsValidEntity(shopEnt)) {
                print("✓ ent_dota_shop spawned");
            }
        } catch (e) {
            // ignore
        }
    }

    private StartCombat(): void {
        print("=== Starting combat phase - everyone is now enemies! ===");
        this.currentStage = GameStage.COMBAT;
        this.botCombatEnabled = true;
        this.peaceMode = false;

        // Возвращаем всех в свои команды - становятся врагами
        for (let i = 0; i < 64; i++) {
            if (PlayerResource.IsValidPlayerID(i)) {
                const hero = this.playerHeroes.get(i as PlayerID);
                const team = this.playerTeams.get(i as PlayerID) || (DotaTeam.CUSTOM_1 + i) as DotaTeam;
                if (hero && IsValidEntity(hero)) {
                    hero.SetTeam(team);
                    this.RemovePeaceModeFromHero(hero);
                    print(`Player ${i} set to team ${team} - now enemies!`);
                } else {
                    print(`✗ Hero not found for player ${i} during combat start`);
                }
            }
        }

        // Старт боя: заставляем всех "вступить в драку" автоматически
        const center = Entities.FindByClassname(undefined, "info_player_start_dota")?.GetAbsOrigin() ?? Vector(0, 0, 128);
        for (let i = 0; i < 64; i++) {
            if (!PlayerResource.IsValidPlayerID(i)) continue;
            const hero = this.playerHeroes.get(i as PlayerID);
            if (!hero || !IsValidEntity(hero) || !hero.IsAlive()) continue;

            const enemies = FindUnitsInRadius(
                hero.GetTeamNumber(),
                hero.GetAbsOrigin(),
                undefined,
                8000,
                UnitTargetTeam.ENEMY,
                UnitTargetType.HERO,
                UnitTargetFlags.NONE,
                FindOrder.CLOSEST,
                false
            );

            if (enemies.length > 0) {
                ExecuteOrderFromTable({
                    UnitIndex: hero.entindex(),
                    OrderType: UnitOrder.ATTACK_TARGET,
                    TargetIndex: enemies[0].entindex(),
                });
            } else {
                ExecuteOrderFromTable({
                    UnitIndex: hero.entindex(),
                    OrderType: UnitOrder.ATTACK_MOVE,
                    Position: center,
                });
            }
        }

        CustomGameEventManager.Send_ServerToAllClients("stage_changed", {
            stage: GameStage.COMBAT,
            duration: 0
        });
    }

    private OnHeroSelected(data: any): void {
        // Будет использоваться позже для ручного выбора
        print(`Player ${data.PlayerID} selected hero`);
    }

    private OnAbilitiesSelected(data: any): void {
        // Будет использоваться позже для ручного выбора
        print(`Player ${data.PlayerID} selected abilities`);
    }

    private OnNpcSpawned(event: NpcSpawnedEvent): void {
        const unit = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC;
        
        if (unit.IsRealHero()) {
            // Дополнительная настройка героя при спавне
            print(`Hero spawned: ${unit.GetUnitName()}`);
        }
    }

    private ApplyPeaceModeToHero(hero: CDOTA_BaseNPC_Hero): void {
        // Запрещаем автоатаку/подхват целей
        hero.SetIdleAcquire(false);
        hero.SetAcquisitionRange(0);
        // На всякий случай — запретить атаки вообще
        hero.AddNewModifier(hero, undefined, "modifier_disarmed", {});
    }

    private RemovePeaceModeFromHero(hero: CDOTA_BaseNPC_Hero): void {
        hero.RemoveModifierByName("modifier_disarmed");
        hero.SetIdleAcquire(true);
        // Дефолтный acquisition range (можно будет считать из KV позже)
        hero.SetAcquisitionRange(800);
    }

    private ApplyPeaceModeToAll(): void {
        for (let i = 0; i < 64; i++) {
            if (!PlayerResource.IsValidPlayerID(i)) continue;
            const hero = PlayerResource.GetSelectedHeroEntity(i);
            if (hero && IsValidEntity(hero)) {
                hero.SetTeam(DotaTeam.CUSTOM_1);
                this.ApplyPeaceModeToHero(hero);
            }
        }
    }

    private OnThink(): number {
        // Основной игровой цикл
        return 0.1;
    }

    public Reload() {
        print("Script reloaded!");
    }
}
