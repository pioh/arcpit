# Исправления от 17.12.2025

## Проблемы которые были исправлены

### 1. Стандартный выбор героев отключен
**Проблема:** Игра показывала стандартный экран выбора героев с таймером  
**Решение:**
- Установлен минимальный `HeroSelectionTime` (0.01)
- Установлен минимальный `StrategyTime` и `ShowcaseTime`
- Убрана принудительная установка героя через `SetCustomGameForceHero("")`

### 2. Исправлена ошибка с Tutorial API
**Проблема:** `attempt to index global 'Tutorial' (a nil value)`  
**Решение:** 
- Tutorial API не доступен в кастомных играх
- Убрана попытка добавить бота через Tutorial
- Добавлено сообщение что игра будет с одним игроком

### 3. Герои теперь создаются правильно
**Проблема:** Стандартный герой удалялся, но новый не создавался  
**Решение:**
- Изменен порядок: сначала удаляем стандартного героя, потом создаем нового
- Используется `CreateHeroForPlayer` вместо `ReplaceHeroWith`
- Добавлены подробные логи создания героев

### 4. Добавлены отладочные логи в UI
**Проблема:** Не было понятно загружается ли UI и получает ли он события  
**Решение:**
- Добавлены логи при загрузке HUD
- Добавлены логи при получении событий `stage_changed`
- Добавлена функция проверки панелей которая запускается несколько раз

## Что должно работать сейчас

1. **Автоматический пропуск стандартного выбора героев**
2. **Создание случайного героя для игрока**
3. **Удаление всех стандартных способностей**
4. **Добавление 5 случайных способностей**
5. **Три стадии с UI:**
   - Выбор героя (5 сек) - затемненный экран с текстом "ВЫБОР ГЕРОЯ" и таймером
   - Выбор способностей (5 сек) - затемненный экран с текстом "ВЫБОР СПОСОБНОСТЕЙ" и таймером
   - Подготовка к бою (10 сек) - все игроки в центре карты как союзники
6. **Боевая стадия** - все становятся врагами

## Как проверить что работает

### В логах (консоль vconsole2) должны быть:

**При запуске игры:**
```
[VScript]: === Configuring GameMode ===
[VScript]: === GameMode configured ===
```

**При старте:**
```
[VScript]: === Game state changed to: 8 ===
[VScript]: PRE_GAME state - starting custom game
[VScript]: === Game starting! ===
[VScript]: Human players: 1
[VScript]: Removing default hero for player 0: npc_dota_hero_XXX
```

**При выборе героя:**
```
[VScript]: === Starting hero selection phase ===
[VScript]: Sending stage_changed event: stage=1, duration=5
[VScript]: === Auto-selecting heroes for all players ===
[VScript]: Creating hero npc_dota_hero_XXX for player 0 on team 2
[VScript]: ✓ Hero created successfully for player 0
```

**При выборе способностей:**
```
[VScript]: === Starting ability selection phase ===
[VScript]: Sending stage_changed event: stage=2, duration=5
[VScript]: === Auto-selecting abilities for all players ===
[VScript]: Processing abilities for player 0, hero: npc_dota_hero_XXX
[VScript]:   Selected abilities: ability1, ability2, ability3, ability4, ability5
[VScript]:   ✓ Added ability: ability1
...
```

**В Panorama (клиентские логи):**
```
[PanoramaScript]: === Arcpit HUD script START ===
[PanoramaScript]: === Subscribing to stage_changed event ===
[PanoramaScript]: === Subscribed to stage_changed ===
[PanoramaScript]: === Checking panels ===
[PanoramaScript]: ✓ StagePanel found
[PanoramaScript]: ✓ StageTitle found
[PanoramaScript]: ✓ StageTimer found
```

**При получении события:**
```
[PanoramaScript]: ==========================================================
[PanoramaScript]: === STAGE_CHANGED EVENT RECEIVED ===
[PanoramaScript]: Stage: 1, Duration: 5
[PanoramaScript]: ==========================================================
```

## Известные ограничения

1. **Боты не добавляются автоматически** - Tutorial API недоступен в кастомных играх
   - Для тестирования с несколькими игроками используйте лобби
   
2. **Нет ручного выбора героев** - пока только случайный выбор
   - Это будет добавлено в следующих версиях

3. **UI может не показываться** - если custom_ui_manifest.xml не загрузился
   - Проверьте логи Panorama на наличие сообщений о загрузке

## Следующие шаги для тестирования

1. Запустите игру: `bun run launch`
2. Следите за консолью (vconsole2)
3. Проверьте что:
   - Герой создается случайным образом
   - У героя 5 случайных способностей
   - Способности работают
   - На экране показываются стадии (затемненный экран с текстом)

## Если UI не показывается

Проверьте в логах:
1. Есть ли сообщение "Arcpit HUD script START"
2. Нашлись ли панели (StagePanel, StageTitle, StageTimer)
3. Приходят ли события stage_changed

Если панели не найдены - возможно проблема с custom_ui_manifest.xml.
Проверьте нет ли ошибок компиляции XML в логах.

