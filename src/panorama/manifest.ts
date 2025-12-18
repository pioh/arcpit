$.Msg("Arcpit UI manifest loaded");

// Отключаем стандартные элементы UI
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_TEAMS, false);
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_GAME_NAME, false);
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_CLOCK, false);
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_HEADER, false);
// ВАЖНО: strategy UI оставляем включённым — именно там игрок выбирает аспект/фасет (5 сек по rules).

// Прячем дефолтный top bar, чтобы не было "силы света/тьмы" и стандартного счёта
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_HEROES, false);
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR, false);
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR_BACKGROUND, false);
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR_RADIANT_TEAM, false);
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR_DIRE_TEAM, false);
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR_SCORE, false);

// ---------------------------------------------------------
// Hide default hero picker UI completely (we use only custom hero draft)
// ---------------------------------------------------------
function FindDotaHudElement(id: string): Panel | null {
    let p: Panel | null = $.GetContextPanel();
    while (p && p.GetParent()) p = p.GetParent();
    if (!p) return null;
    return p.FindChildTraverse(id);
}

function collapsePanel(p: Panel | null, why: string): void {
    if (!p) return;
    try { p.style.visibility = "collapse"; } catch (e) {}
    try { (p as any).hittest = false; } catch (e) {}
    try { (p as any).enabled = false; } catch (e) {}
    // $.Msg(`[ArcpitUI] collapsed ${p.id} (${why})`);
}

function hideDefaultHeroSelection(): void {
    // Скрываем дефолтный hero picker ТОЛЬКО на стадии HERO_SELECTION.
    // Иначе можно случайно спрятать Strategy UI (аспекты).
    try {
        // 4 = DOTA_GAMERULES_STATE_HERO_SELECTION
        if (Game.GetState() !== 4) return;
    } catch (e) {}

    // Names vary between patches; we try a few common roots.
    const candidates = [
        "HeroSelection",
        "HeroPicker",
        "HeroPickScreen",
        "HeroPick",
        "HeroSelectionRoot",
    ];
    for (const id of candidates) {
        const p = FindDotaHudElement(id);
        if (p) collapsePanel(p, id);
    }
    // Also try known leaf panels (if root name differs)
    collapsePanel(FindDotaHudElement("HeroSelectionTeams"), "HeroSelectionTeams");
    collapsePanel(FindDotaHudElement("HeroSelectionHeader"), "HeroSelectionHeader");
}

$.Schedule(0.2, hideDefaultHeroSelection);
$.Schedule(1.0, hideDefaultHeroSelection);
$.Schedule(2.0, hideDefaultHeroSelection);
$.Schedule(3.0, hideDefaultHeroSelection);

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
    // Не должны блокировать дефолтный HUD (тултипы способностей/предметов и т.п.)
    try { (container as any).hittest = false; } catch (e) {}
    container.BLoadLayout("file://{resources}/layout/custom_game/hud.xml", false, false);
}

$.Schedule(0.1, ensureArcpitHudLoaded);
$.Schedule(1.0, ensureArcpitHudLoaded);