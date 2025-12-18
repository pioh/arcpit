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

interface HeroDraftOfferData {
    playerID?: number;
    offerId: number;
    duration: number;
    heroes: string[];
}

interface AbilityDraftOfferData {
    playerID?: number;
    offerId: number;
    abilities: string[];
    chosenCount: number;
    allowedCount: number;
}

let heroPickTimer: ScheduleID | null = null;
let heroPickOfferId: number = 0;
let heroPicked: boolean = false;
let heroPickPlayerID: number = -1;

let abilityPickOfferId: number = 0;
let abilityPickPlayerID: number = -1;

function normalizeNetArray<T>(value: any): T[] {
    // Panorama network tables often come as objects with numeric keys ("1","2",...) instead of real JS arrays.
    if (!value) return [];
    if (Array.isArray(value)) return value as T[];
    if (typeof value !== "object") return [];

    const keys = Object.keys(value)
        .filter(k => k !== "length")
        .filter(k => /^\d+$/.test(k))
        .map(k => Number(k))
        .sort((a, b) => a - b);

    const out: T[] = [];
    for (const k of keys) {
        out.push((value as any)[k] as T);
    }
    return out;
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

        // Как в дефолтном UI: двойной клик фокусирует камеру.
        // Важно: НЕ выбираем юнита, чтобы не давать управление чужими героями.
        slot.SetPanelEvent("ondblclick", () => {
            if (heroEntIndex && heroEntIndex !== -1) {
                try {
                    GameUI.SetCameraTarget(heroEntIndex);
                    $.Schedule(0.35, () => {
                        try { GameUI.SetCameraTarget(-1 as any); } catch (e) {}
                    });
                } catch (e) {}
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

function localizeHeroName(heroName: string): string {
    // В локализации Dota: токены героев обычно вида "#npc_dota_hero_axe"
    try {
        const token = heroName.startsWith("#") ? heroName : `#${heroName}`;
        const loc = $.Localize(token);
        if (loc && loc !== token) return loc;
    } catch (e) {}
    return heroName;
}

function localizeAbilityName(abilityName: string): string {
    // Обычно "#DOTA_Tooltip_ability_axe_berserkers_call"
    try {
        const token = `#DOTA_Tooltip_ability_${abilityName}`;
        const loc = $.Localize(token);
        if (loc && loc !== token) return loc;
    } catch (e) {}
    return abilityName;
}

function stopHeroPickTimer(): void {
    if (heroPickTimer !== null) {
        $.CancelScheduled(heroPickTimer);
        heroPickTimer = null;
    }
}

function showHeroPick(offer: HeroDraftOfferData): void {
    const overlay = $("#HeroPickOverlay");
    const grid = $("#HeroPickGrid");
    const timerLabel = $("#HeroPickTimer") as LabelPanel;
    if (!overlay || !grid || !timerLabel) return;

    heroPicked = false;
    heroPickOfferId = offer.offerId;
    heroPickPlayerID = (offer as any).playerID ?? -1;

    grid.RemoveAndDeleteChildren();

    const heroes = normalizeNetArray<string>((offer as any).heroes);
    if (heroes.length <= 0) {
        $.Msg("[HeroPick] ERROR: heroes list is empty/invalid", offer as any);
        return;
    }

    for (const heroName of heroes) {
        const card = $.CreatePanel("Panel", grid, "");
        card.AddClass("HeroCard");

        const portrait = $.CreatePanel("DOTAHeroImage", card, "") as any;
        portrait.AddClass("HeroPortrait");
        portrait.heroname = heroName;
        portrait.heroimagestyle = "portrait";

        const name = $.CreatePanel("Label", card, "") as LabelPanel;
        name.AddClass("HeroName");
        name.text = localizeHeroName(heroName);

        // Тултип героя
        card.SetPanelEvent("onmouseover", () => {
            try { $.DispatchEvent("DOTAShowHeroTooltip", card, heroName); } catch (e) {}
        });
        card.SetPanelEvent("onmouseout", () => {
            try { $.DispatchEvent("DOTAHideHeroTooltip", card); } catch (e) {}
        });

        card.SetPanelEvent("onactivate", () => {
            if (heroPicked) return;
            heroPicked = true;
            overlay.style.visibility = "collapse";
            stopHeroPickTimer();

            GameEvents.SendCustomGameEventToServer("arcpit_hero_pick", {
                offerId: heroPickOfferId,
                heroName,
                playerID: heroPickPlayerID
            } as any);
        });
    }

    overlay.style.visibility = "visible";

    // Таймер (5 секунд)
    stopHeroPickTimer();
    let timeLeft = Math.max(0, offer.duration ?? 0);
    const update = () => {
        if (timeLeft <= 0) {
            timerLabel.text = "0";
            heroPickTimer = null;
            overlay.style.visibility = "collapse";
            return;
        }
        timerLabel.text = `${Math.ceil(timeLeft)}`;
        timeLeft -= 0.1;
        heroPickTimer = $.Schedule(0.1, update);
    };
    update();
}

function showAbilityPick(offer: AbilityDraftOfferData): void {
    const overlay = $("#AbilityPickOverlay");
    const grid = $("#AbilityPickGrid");
    const progress = $("#AbilityPickProgress") as LabelPanel;
    if (!overlay || !grid || !progress) return;

    abilityPickOfferId = offer.offerId;
    abilityPickPlayerID = (offer as any).playerID ?? -1;
    grid.RemoveAndDeleteChildren();

    progress.text = `${offer.chosenCount}/${offer.allowedCount}`;

    const abilities = normalizeNetArray<string>((offer as any).abilities);
    if (abilities.length <= 0) {
        $.Msg("[AbilityPick] ERROR: abilities list is empty/invalid", offer as any);
        return;
    }

    for (const abilityName of abilities) {
        const card = $.CreatePanel("Panel", grid, "");
        card.AddClass("AbilityCard");

        const icon = $.CreatePanel("DOTAAbilityImage", card, "") as any;
        icon.AddClass("AbilityIcon");
        icon.abilityname = abilityName;

        const meta = $.CreatePanel("Panel", card, "");
        meta.AddClass("AbilityMeta");

        const title = $.CreatePanel("Label", meta, "") as LabelPanel;
        title.AddClass("AbilityName");
        title.text = localizeAbilityName(abilityName);

        const hint = $.CreatePanel("Label", meta, "") as LabelPanel;
        hint.AddClass("AbilityHintLine");
        hint.text = "Наведите для описания";

        card.SetPanelEvent("onmouseover", () => {
            try { $.DispatchEvent("DOTAShowAbilityTooltip", card, abilityName); } catch (e) {}
        });
        card.SetPanelEvent("onmouseout", () => {
            try { $.DispatchEvent("DOTAHideAbilityTooltip", card); } catch (e) {}
        });

        card.SetPanelEvent("onactivate", () => {
            overlay.style.visibility = "collapse";
            GameEvents.SendCustomGameEventToServer("arcpit_ability_pick", {
                offerId: abilityPickOfferId,
                abilityName,
                playerID: abilityPickPlayerID
            } as any);
        });
    }

    overlay.style.visibility = "visible";
}

GameEvents.Subscribe("stage_changed", (data: any) => {
    showStageScreen(data.stage as GameStage, data.duration as number);
    renderPlayersBar();
});

GameEvents.Subscribe("arcpit_hero_draft_offer", (data: any) => {
    showHeroPick(data as HeroDraftOfferData);
});

GameEvents.Subscribe("arcpit_ability_draft_offer", (data: any) => {
    showAbilityPick(data as AbilityDraftOfferData);
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
