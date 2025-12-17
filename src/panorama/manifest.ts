$.Msg("Arcpit UI manifest loaded");

// Отключаем стандартные элементы UI
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_TEAMS, false);
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_GAME_NAME, false);
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_CLOCK, false);
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_HEADER, false);
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_PREGAME_STRATEGYUI, false);

// Прячем дефолтный top bar, чтобы не было "силы света/тьмы" и стандартного счёта
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_HEROES, false);
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR, false);
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR_BACKGROUND, false);
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR_RADIANT_TEAM, false);
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR_DIRE_TEAM, false);
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR_SCORE, false);

// Иногда CustomUIElement(Hud) не создаётся/не успевает в tools — подгружаем hud.xml принудительно.
function getRootPanel(): Panel {
    let p: Panel = $.GetContextPanel();
    while (p.GetParent()) {
        p = p.GetParent()!;
    }
    return p;
}

function findHudRoot(): Panel {
    const root = getRootPanel();
    return root.FindChildTraverse("Hud") ?? root.FindChildTraverse("DotaHud") ?? root;
}

function ensureArcpitHudLoaded(): void {
    const hudRoot = findHudRoot();
    if (!hudRoot) return;

    // Не грузим дважды
    if (hudRoot.FindChildTraverse("ArcpitHudContainer")) return;

    $.Msg("Arcpit: injecting HUD layout (hud.xml)");
    const container = $.CreatePanel("Panel", hudRoot, "ArcpitHudContainer");
    container.BLoadLayout("file://{resources}/layout/custom_game/hud.xml", false, false);
}

$.Schedule(0.1, ensureArcpitHudLoaded);
$.Schedule(1.0, ensureArcpitHudLoaded);