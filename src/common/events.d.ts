// Events sent from server to client
interface CustomGameEventDeclarations {
    stage_changed: {
        stage: number;
        duration: number;
    };
    hero_selected: {
        PlayerID: number;
        heroName: string;
    };
    abilities_selected: {
        PlayerID: number;
        abilities: string[];
    };

    /**
     * Новый герой-пик (сервер -> конкретному игроку)
     */
    arcpit_hero_draft_offer: {
        playerID: number;
        offerId: number;
        duration: number;
        heroes: string[];
    };

    /**
     * Новый выбор способности (сервер -> конкретному игроку)
     */
    arcpit_ability_draft_offer: {
        playerID: number;
        offerId: number;
        abilities: string[];
        chosenCount: number;
        allowedCount: number;
    };

    /**
     * Клиент -> сервер: выбор героя
     */
    arcpit_hero_pick: {
        playerID?: number;
        offerId: number;
        heroName: string;
    };

    /**
     * Клиент -> сервер: выбор способности
     */
    arcpit_ability_pick: {
        playerID?: number;
        offerId: number;
        abilityName: string;
    };

    round_state_changed: {
        phase: "planning" | "round";
        round: number;
        duration: number;
    };

    camera_focus_hero: {
        entindex: EntityIndex;
        duration: number;
    };
}
