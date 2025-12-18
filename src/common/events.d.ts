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
