$.Msg("=== Arcpit HUD script START ===");

// Panorama НЕ поддерживает ES-модули (import/export) в runtime.
// Поэтому hud.ts должен быть самодостаточным (без import).

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

function renderPlayersBar(): void {
    const bar = $("#PlayersBar");
    if (!bar) return;

    bar.RemoveAndDeleteChildren();

    const playerIDs = Game.GetAllPlayerIDs();
    for (const pid of playerIDs) {
        const slot = $.CreatePanel("Panel", bar, "");
        slot.AddClass("PlayerSlot");

        const heroName = Players.GetPlayerSelectedHero(pid);
        const heroEntIndex = Players.GetPlayerHeroEntityIndex(pid);

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

function showStageScreen(stage: GameStage, duration: number) {
    const stagePanel = $("#StagePanel");
    if (!stagePanel) return;

    const titleLabel = $("#StageTitle") as LabelPanel;
    const timerLabel = $("#StageTimer") as LabelPanel;
    if (!titleLabel || !timerLabel) return;

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

    titleLabel.text = titleText;
    stagePanel.style.visibility = "visible";

    const startTimer = (seconds: number) => {
        if (currentTimer !== null) $.CancelScheduled(currentTimer);
        let timeLeft = seconds;
        const update = () => {
            if (timeLeft <= 0) {
                timerLabel.text = "0";
                currentTimer = null;
                return;
            }
            timerLabel.text = Math.ceil(timeLeft).toString();
            timeLeft -= 0.1;
            currentTimer = $.Schedule(0.1, update);
        };
        update();
    };

    if (duration > 0) {
        startTimer(duration);
        $.Schedule(duration, () => {
            stagePanel.style.visibility = "collapse";
        });
    } else {
        timerLabel.text = "";
        // COMBAT показываем коротко и скрываем
        if (stage === GameStage.COMBAT) {
            $.Schedule(1.5, () => {
                stagePanel.style.visibility = "collapse";
            });
        }
    }
}

GameEvents.Subscribe("stage_changed", (data: NetworkedData<StageChangedData>) => {
    showStageScreen(data.stage, data.duration);
    renderPlayersBar();
});

$.Schedule(0.2, renderPlayersBar);
$.Schedule(1.2, renderPlayersBar);
$.Schedule(3.2, renderPlayersBar);

$.Msg("=== Arcpit HUD script end ===");
