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
let roundTimer: ScheduleID | null = null;
let roundPhase: "planning" | "round" = "planning";
let roundNumber: number = 1;

interface StageChangedData {
    stage: GameStage;
    duration: number;
}

interface RoundStateChangedData {
    phase: "planning" | "round";
    round: number;
    duration: number;
}

interface CameraFocusHeroData {
    entindex: EntityIndex;
    duration: number;
}

function renderRoundPanel(): void {
    const roundLabel = $("#RoundLabel") as LabelPanel;
    if (!roundLabel) return;
    roundLabel.text = `РАУНД ${roundNumber}`;
}

function stopRoundTimer(): void {
    if (roundTimer !== null) {
        $.CancelScheduled(roundTimer);
        roundTimer = null;
    }
}

function startRoundCountdown(seconds: number): void {
    const label = $("#RoundTimer") as LabelPanel;
    if (!label) return;
    stopRoundTimer();

    let timeLeft = seconds;
    const update = () => {
        if (timeLeft <= 0) {
            label.text = "0";
            roundTimer = null;
            return;
        }
        label.text = `${Math.ceil(timeLeft)}`;
        timeLeft -= 0.1;
        roundTimer = $.Schedule(0.1, update);
    };
    update();
}

function startRoundStopwatch(): void {
    const label = $("#RoundTimer") as LabelPanel;
    if (!label) return;
    stopRoundTimer();

    let t = 0;
    const update = () => {
        t += 0.1;
        label.text = `${Math.floor(t)}s`;
        roundTimer = $.Schedule(0.1, update);
    };
    update();
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
            titleText = "ПЛАНИРОВАНИЕ";
            break;
        case GameStage.COMBAT:
            titleText = "РАУНД";
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

GameEvents.Subscribe("stage_changed", (data: any) => {
    showStageScreen(data.stage as GameStage, data.duration as number);
    renderPlayersBar();
});

GameEvents.Subscribe("round_state_changed", (data: any) => {
    roundPhase = (data.phase as RoundStateChangedData["phase"]) ?? "planning";
    roundNumber = (data.round as number) ?? 1;
    renderRoundPanel();
    if (roundPhase === "planning") {
        startRoundCountdown((data.duration as number) ?? 0);
    } else {
        startRoundStopwatch();
    }
});

GameEvents.Subscribe("camera_focus_hero", (data: any) => {
    const entindex = data.entindex as EntityIndex;
    const duration = (data.duration as number) ?? 0.25;
    if (!entindex || entindex === -1) return;

    try {
        GameUI.SetCameraTarget(entindex);
        $.Schedule(duration, () => {
            try { GameUI.SetCameraTarget(-1 as any); } catch (e) {}
        });
    } catch (e) {}
});

$.Schedule(0.2, renderPlayersBar);
$.Schedule(1.2, renderPlayersBar);
$.Schedule(3.2, renderPlayersBar);

$.Msg("=== Arcpit HUD script end ===");
