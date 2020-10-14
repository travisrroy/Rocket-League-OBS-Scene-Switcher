import { GoalScored, MatchEnded } from "./types";
declare class App {
    private OBSHostname;
    private sceneList;
    private obsClient;
    private gameState;
    private replayWillEnd;
    private rocketLeagueHostname;
    private wsClient;
    constructor();
    init: () => void;
    initOBSWebSocket: () => void;
    initRocketLeagueWebsocket: () => void;
    goal_scored: (data: GoalScored) => void;
    replay_will_end: () => void;
    replay_end: () => void;
    match_ended: (data: MatchEnded) => void;
    updateScene: (sceneName: string, sceneDelay: number) => void;
}
export default App;
