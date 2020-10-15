import { GameState, GoalScored, MatchEnded } from "./types";
declare class App {
    private config;
    private OBSHostname;
    private OBSAuth;
    private sceneList;
    private obsClient;
    private gameState;
    private replayWillEnd;
    private rocketLeagueHostname;
    private wsClient;
    private lastUpdate;
    constructor();
    init: () => void;
    initOBSWebSocket: () => void;
    initRocketLeagueWebsocket: () => void;
    update_state: (data: GameState) => void;
    read_config: () => Promise<void>;
    goal_scored: (data: GoalScored) => void;
    replay_will_end: () => void;
    replay_end: () => void;
    match_ended: (data: MatchEnded) => void;
    updateScene: (sceneName: string, sceneDelay: number) => void;
}
export default App;
