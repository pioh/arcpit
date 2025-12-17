$.Msg("=== Arcpit HUD script START ===");

enum GameStage {
    INIT = 0,
    HERO_SELECTION = 1,
    ABILITY_SELECTION = 2,
    PRE_COMBAT = 3,
    COMBAT = 4
}

let currentTimer: ScheduleID | null = null;

interface StageChangedData {
    stage: GameStage;
    duration: number;
}

function RenderPlayersBar(): void {
    const bar = $("#PlayersBar");
    if (!bar) return;

    bar.RemoveAndDeleteChildren();

    const playerIDs = Game.GetAllPlayerIDs();
    for (const pid of playerIDs) {
        const slot = $.CreatePanel("Panel", bar, "");
        slot.AddClass("PlayerSlot");

        const heroName = Players.GetPlayerSelectedHero(pid);
        const heroEntIndex = Players.GetPlayerHeroEntityIndex(pid);

        // DOTAHeroImage сам корректно подставляет иконку по имени npc_dota_hero_*
        const heroImg = $.CreatePanel("DOTAHeroImage", slot, "");
        heroImg.style.width = "100%";
        heroImg.style.height = "100%";
        (heroImg as any).heroname = heroName;
        (heroImg as any).heroimagestyle = "icon";

        slot.SetPanelEvent("onactivate", () => {
            if (heroEntIndex && heroEntIndex !== -1) {
                GameUI.SelectUnit(heroEntIndex, false);
                GameUI.SetCameraTarget(heroEntIndex);
            }
        });
    }
}

// Проверяем что панель загрузилась
function CheckPanels() {
    $.Msg("=== Checking panels ===");
    const rootPanel = $.GetContextPanel();
    $.Msg(`Root panel: ${rootPanel.id}`);
    
    const stagePanel = $("#StagePanel");
    const titleLabel = $("#StageTitle");
    const timerLabel = $("#StageTimer");
    
    if (stagePanel) {
        $.Msg("✓ StagePanel found");
        stagePanel.style.visibility = "collapse";
    } else {
        $.Msg("✗ StagePanel NOT found!");
    }
    
    if (titleLabel) {
        $.Msg("✓ StageTitle found");
    } else {
        $.Msg("✗ StageTitle NOT found!");
    }
    
    if (timerLabel) {
        $.Msg("✓ StageTimer found");
    } else {
        $.Msg("✗ StageTimer NOT found!");
    }
}

// Проверяем несколько раз
$.Schedule(0.1, CheckPanels);
$.Schedule(1, CheckPanels);
$.Schedule(3, CheckPanels);
$.Schedule(0.2, RenderPlayersBar);
$.Schedule(1.2, RenderPlayersBar);
$.Schedule(3.2, RenderPlayersBar);

// Обработчик смены стадии
$.Msg("=== Subscribing to stage_changed event ===");
GameEvents.Subscribe("stage_changed", (data: NetworkedData<StageChangedData>) => {
    $.Msg("==========================================================");
    $.Msg(`=== STAGE_CHANGED EVENT RECEIVED ===`);
    $.Msg(`Stage: ${data.stage}, Duration: ${data.duration}`);
    $.Msg("==========================================================");
    
    ShowStageScreen(data.stage, data.duration);
    RenderPlayersBar();
});
$.Msg("=== Subscribed to stage_changed ===");

function ShowStageScreen(stage: GameStage, duration: number) {
    $.Msg(`ShowStageScreen called: stage=${stage}, duration=${duration}`);
    
    const stagePanel = $("#StagePanel");
    if (!stagePanel) {
        $.Msg("ERROR: StagePanel not found!");
        return;
    }

    const titleLabel = $("#StageTitle");
    const timerLabel = $("#StageTimer");

    if (!titleLabel || !timerLabel) {
        $.Msg("ERROR: Title or Timer label not found!");
        return;
    }

    // Устанавливаем текст в зависимости от стадии
    let titleText = "";
    switch (stage) {
        case GameStage.HERO_SELECTION:
            titleText = "ВЫБОР ГЕРОЯ";
            break;
        case GameStage.ABILITY_SELECTION:
            titleText = "ВЫБОР СПОСОБНОСТЕЙ";
            break;
        case GameStage.PRE_COMBAT:
            titleText = "ПОДГОТОВКА К БОЮ";
            break;
        case GameStage.COMBAT:
            titleText = "БОЙ НАЧАЛСЯ!";
            break;
    }

    $.Msg(`Setting title to: ${titleText}`);
    (titleLabel as LabelPanel).text = titleText;
    stagePanel.style.visibility = "visible";
    $.Msg("Panel visibility set to visible");

    // Запускаем таймер
    if (duration > 0) {
        StartTimer(duration, timerLabel);
        
        // Скрываем панель после окончания таймера
        $.Schedule(duration, () => {
            if (stage !== GameStage.COMBAT) {
                stagePanel.style.visibility = "collapse";
                $.Msg("Panel hidden after timer");
            } else {
                // Для боевой стадии показываем коротко и скрываем
                $.Schedule(3, () => {
                    stagePanel.style.visibility = "collapse";
                    $.Msg("Combat panel hidden");
                });
            }
        });
    } else if (stage === GameStage.COMBAT) {
        (timerLabel as LabelPanel).text = "";
        $.Schedule(3, () => {
            stagePanel.style.visibility = "collapse";
        });
    }
}

function StartTimer(duration: number, label: Panel) {
    if (currentTimer !== null) {
        $.CancelScheduled(currentTimer);
    }

    let timeLeft = duration;
    const labelPanel = label as LabelPanel;
    
    function UpdateTimer() {
        if (timeLeft <= 0) {
            labelPanel.text = "0";
            currentTimer = null;
            return;
        }
        
        labelPanel.text = Math.ceil(timeLeft).toString();
        timeLeft -= 0.1;
        
        currentTimer = $.Schedule(0.1, UpdateTimer);
    }
    
    UpdateTimer();
}

$.Msg("=== Arcpit HUD script end ===");
