import { GameStage, StageChangedData } from "./types";
import { StageDisplay } from "./stage-display";
import { StageTimer } from "./stage-timer";

/**
 * Контроллер стадий (координирует display и timer)
 */
export class StageController {
    private display: StageDisplay;
    private timer: StageTimer;

    constructor() {
        this.display = new StageDisplay();
        this.timer = new StageTimer();
    }

    /**
     * Обработка смены стадии
     */
    onStageChanged(data: StageChangedData): void {
        $.Msg("==========================================================");
        $.Msg(`=== STAGE_CHANGED EVENT RECEIVED ===`);
        $.Msg(`Stage: ${data.stage}, Duration: ${data.duration}`);
        $.Msg("==========================================================");

        this.display.show(data.stage);

        if (data.duration > 0) {
            this.timer.start(data.duration);
            
            // Скрываем панель после таймера
            $.Schedule(data.duration, () => {
                if (data.stage !== GameStage.COMBAT) {
                    this.display.hide();
                } else {
                    // Для боя показываем коротко
                    $.Schedule(3, () => {
                        this.display.hide();
                    });
                }
            });
        } else if (data.stage === GameStage.COMBAT) {
            this.timer.clear();
            $.Schedule(3, () => {
                this.display.hide();
            });
        }
    }
}

