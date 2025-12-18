/**
 * Тест: Glaives of Wisdom против крипов
 * 
 * Сценарий:
 * 1. Рандом героев и способностей
 * 2. Основному игроку даем Glaives
 * 3. Апаем уровень до 5
 * 4. Спавним 10 крипов которые атакуют игрока
 */

import { SceneBuilder } from "./scene-builder";
import { PlayerManager } from "../players/player-manager";
import { PeaceMode } from "../combat/peace-mode";
import { HeroManager } from "../heroes/hero-manager";
import { AbilityManager } from "../abilities/ability-manager";

export class TestGlaivesVsCreeps {
    constructor(
        private sceneBuilder: SceneBuilder,
        private playerManager: PlayerManager,
        private peaceMode: PeaceMode,
        private heroManager: HeroManager,
        private abilityManager: AbilityManager
    ) {}

    /**
     * Запустить тестовый сценарий
     */
    start(): void {
        print("=== Starting TEST: Glaives vs Creeps ===");
        
        // Подготовка: сразу мирный режим и одна команда, чтобы не было ранних ударов
        this.peaceMode.enable();
        this.playerManager.giveGoldToAll(9999);
        this.playerManager.disableUnitSharing();
        this.playerManager.saveCurrentHeroes();
        
        this.peaceMode.applyToAll();

        // Быстрый тест без StageManager (иначе PreCombat снова вешает disarm)
        Timers.CreateTimer(0.1, () => {
            this.heroManager.autoSelectForAllPlayers(() => {
                this.abilityManager.autoSelectForAllPlayers(() => {
                    this.setupTest();
                });
            });
            return undefined;
        });
    }

    /**
     * Настройка теста после выбора героев
     */
    private setupTest(): void {
        print("=== Setting up Glaives test ===");
        
        // Получаем главного игрока
        const player = this.sceneBuilder.getMainPlayer();
        if (!player) {
            print("✗ Main player not found!");
            return;
        }
        
        const { hero } = player;
        print(`✓ Main player hero: ${hero.GetUnitName()}`);

        // ВАЖНО: в тесте мы РАНДОМИМ героев/способности, поэтому ничего не чистим.
        // Если глейвов нет — добавляем их В КОНЕЦ НАБОРА, но НЕ КАЧАЕМ (level 0).
        let glaives = hero.FindAbilityByName("silencer_glaives_of_wisdom");
        if (!glaives) {
            this.sceneBuilder.giveAbility(hero, "silencer_glaives_of_wisdom", 0);
            glaives = hero.FindAbilityByName("silencer_glaives_of_wisdom");
        }

        // Для теста: изучаем глейвы на 1 уровень и включаем autocast,
        // остальные способности остаются НЕ прокачанными.
        if (glaives) {
            if (glaives.GetLevel() < 1) {
                glaives.SetLevel(1);
                // тратим 1 пойнт, чтобы не было "бесплатной" прокачки
                const pts = hero.GetAbilityPoints();
                hero.SetAbilityPoints(math.max(0, pts - 1));
            }
            if (!glaives.GetAutoCastState()) {
                glaives.ToggleAutoCast();
            }
            print("✓ Glaives learned to level 1 + autocast enabled (test only)");
        }

        
        // Апаем уровень до 5
        this.sceneBuilder.setHeroLevel(hero, 5);
        
        // Хилим героя
        this.sceneBuilder.healHero(hero);
        
        // Даем безлимитную ману для удобства теста
        this.sceneBuilder.giveUnlimitedMana(hero);
        
        // Телепортируем в центр
        const spawnPoint = this.sceneBuilder.getSpawnPoint();
        this.sceneBuilder.teleportHero(hero, spawnPoint);
        
        // Разрешаем бой (убираем мирный режим)
        this.sceneBuilder.enableCombat(hero);
        // И отключаем глобальный мирный режим, чтобы GameMode.onNpcSpawned больше не перевешивал disarm.
        this.peaceMode.disable();

        // В тесте создаем player-bot (как в обычном режиме), чтобы можно было его бить
        // Делаем бот вражеским: CUSTOM_2 против CUSTOM_1 (у нас до боя все были CUSTOM_1)
        const enemyTeam = DotaTeam.CUSTOM_2;
        const bot = this.sceneBuilder.addPlayerBot("TestBot", enemyTeam);
        if (bot) {
            // делаем врагом и ставим рядом
            bot.SetTeam(enemyTeam);
            this.sceneBuilder.teleportHero(bot, Vector(spawnPoint.x + 250, spawnPoint.y, spawnPoint.z));
            this.sceneBuilder.enableCombat(bot);
            // включаем для bot AI (он читает GameRules.Addon.botCombatEnabled)
            (GameRules as any).Addon.botCombatEnabled = true;
            print("✓ Player-bot spawned for test");
        }
        
        // Спавним крипов
        Timers.CreateTimer(1, () => {
            this.spawnTestCreeps(hero, spawnPoint);
            return undefined;
        });
    }

    /**
     * Заспавнить тестовых крипов
     */
    private spawnTestCreeps(hero: CDOTA_BaseNPC_Hero, center: Vector): void {
        print("=== Spawning test creeps ===");
        
        // Позиция для спавна крипов (вокруг игрока)
        const creepPosition = Vector(center.x + 500, center.y, center.z);
        
        // // Спавним 10 средних крипов
        const creeps = this.sceneBuilder.spawnCreeps(
            "npc_dota_creep_badguys_melee",
            5,
            creepPosition,
            DotaTeam.BADGUYS
        );
        this.sceneBuilder.makeCreepsAggressive(creeps, hero);
        
        // Делаем их агрессивными
        // this.sceneBuilder.makeCreepsAggressive(creeps, hero);
       
    }
}

