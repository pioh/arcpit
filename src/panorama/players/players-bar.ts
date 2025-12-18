/**
 * Панель с отображением игроков
 */
export class PlayersBar {
    private barPanel: Panel | null = null;

    constructor() {
        this.barPanel = $("#PlayersBar");
    }

    /**
     * Отрисовать панель игроков
     */
    render(): void {
        if (!this.barPanel) {
            $.Msg("PlayersBar panel not found");
            return;
        }

        this.barPanel.RemoveAndDeleteChildren();

        const playerIDs = Game.GetAllPlayerIDs();
        for (const pid of playerIDs) {
            this.createPlayerSlot(pid);
        }
    }

    /**
     * Создать слот для игрока
     */
    private createPlayerSlot(playerID: PlayerID): void {
        if (!this.barPanel) return;

        const slot = $.CreatePanel("Panel", this.barPanel, "");
        slot.AddClass("PlayerSlot");

        const heroName = Players.GetPlayerSelectedHero(playerID);
        const heroEntIndex = Players.GetPlayerHeroEntityIndex(playerID);

        // Иконка героя
        const heroImg = $.CreatePanel("DOTAHeroImage", slot, "");
        heroImg.style.width = "100%";
        heroImg.style.height = "100%";
        (heroImg as any).heroname = heroName;
        (heroImg as any).heroimagestyle = "icon";

        // Двойной клик — фокус камеры, без выбора юнита.
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

