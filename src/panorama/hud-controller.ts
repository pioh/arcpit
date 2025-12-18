import { StageController } from "./game-stages/stage-controller";
import { PlayersBar } from "./players/players-bar";
import { StageChangedData } from "./game-stages/types";

/**
 * Главный контроллер HUD
 */
export class HudController {
    private stageController: StageController;
    private playersBar: PlayersBar;

    constructor() {
        $.Msg("=== Initializing HUD Controller ===");
        
        this.stageController = new StageController();
        this.playersBar = new PlayersBar();
        
        this.setupEventListeners();
        this.scheduleInitialRenders();
        
        $.Msg("=== HUD Controller initialized ===");
    }

    /**
     * Подписка на события
     */
    private setupEventListeners(): void {
        GameEvents.Subscribe("stage_changed", (data: NetworkedData<StageChangedData>) => {
            this.stageController.onStageChanged(data);
            this.playersBar.render();
        });
    }

    /**
     * Запланировать начальную отрисовку
     */
    private scheduleInitialRenders(): void {
        // Рендерим панель игроков несколько раз с задержкой
        // (иногда данные подгружаются не сразу)
        $.Schedule(0.2, () => this.playersBar.render());
        $.Schedule(1.2, () => this.playersBar.render());
        $.Schedule(3.2, () => this.playersBar.render());
    }
}

