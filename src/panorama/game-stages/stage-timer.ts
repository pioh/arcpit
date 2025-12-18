/**
 * Таймер стадии
 */
export class StageTimer {
    private currentTimer: ScheduleID | null = null;
    private timerLabel: LabelPanel | null = null;

    constructor() {
        this.timerLabel = $("#StageTimer") as LabelPanel;
    }

    /**
     * Запустить таймер
     */
    start(duration: number): void {
        if (!this.timerLabel) {
            $.Msg("ERROR: Timer label not found!");
            return;
        }

        this.stop();

        let timeLeft = duration;
        
        const updateTimer = () => {
            if (timeLeft <= 0) {
                this.timerLabel!.text = "0";
                this.currentTimer = null;
                return;
            }
            
            this.timerLabel!.text = Math.ceil(timeLeft).toString();
            timeLeft -= 0.1;
            
            this.currentTimer = $.Schedule(0.1, updateTimer);
        };
        
        updateTimer();
    }

    /**
     * Остановить таймер
     */
    stop(): void {
        if (this.currentTimer !== null) {
            $.CancelScheduled(this.currentTimer);
            this.currentTimer = null;
        }
    }

    /**
     * Очистить таймер
     */
    clear(): void {
        this.stop();
        if (this.timerLabel) {
            this.timerLabel.text = "";
        }
    }
}

