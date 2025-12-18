import { GameStage } from "./types";

/**
 * Отображение информации о стадии
 */
export class StageDisplay {
    private stagePanel: Panel | null = null;
    private titleLabel: LabelPanel | null = null;

    constructor() {
        this.findPanels();
    }

    private findPanels(): void {
        this.stagePanel = $("#StagePanel");
        this.titleLabel = $("#StageTitle") as LabelPanel;
    }

    /**
     * Показать экран стадии
     */
    show(stage: GameStage): void {
        if (!this.stagePanel || !this.titleLabel) {
            $.Msg("ERROR: Stage panels not found!");
            return;
        }

        const titleText = this.getStageName(stage);
        $.Msg(`Setting title to: ${titleText}`);
        
        this.titleLabel.text = titleText;
        this.stagePanel.style.visibility = "visible";
    }

    /**
     * Скрыть экран стадии
     */
    hide(): void {
        if (this.stagePanel) {
            this.stagePanel.style.visibility = "collapse";
        }
    }

    /**
     * Получить название стадии
     */
    private getStageName(stage: GameStage): string {
        switch (stage) {
            case GameStage.HERO_SELECTION:
                return "ВЫБОР ГЕРОЯ";
            case GameStage.ABILITY_SELECTION:
                return "ВЫБОР СПОСОБНОСТЕЙ";
            case GameStage.PRE_COMBAT:
                return "ПОДГОТОВКА К БОЮ";
            case GameStage.COMBAT:
                return "БОЙ НАЧАЛСЯ!";
            default:
                return "";
        }
    }
}

