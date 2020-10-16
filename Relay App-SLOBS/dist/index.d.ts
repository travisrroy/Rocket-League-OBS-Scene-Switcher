import { GameState, GoalScored, MatchEnded } from "./types";
declare class App {
    private config;
    private OBSHostname;
    private OBSAuth;
    private sceneList;
    private obsClient;
    private rocketLeagueHostname;
    private gameState;
    private replayWillEnd;
    private wsClient;
    private lastUpdate;
    constructor();
    /**
     * @method init
     * @description Initializes and connects to the OBS websocket and Rocket League websocket
     */
    init: () => void;
    /**
     * @method initOBSWebSocket
     * @description Connects to the OBS websocket with credentials from config
     * and retrieves the list of OBS scenes
     */
    initOBSWebSocket: () => void;
    /**
     * @method initRocketLeagueWebsocket
     * @description Connects to the OBS websocket with ip and port from config
     * and creates an event callback for every message
     */
    initRocketLeagueWebsocket: () => void;
    /**
     * @method update_state
     * @description Updates the internal gamestate with the state tick from the server and
     * determines when the next config update should occur
     */
    update_state: (data: GameState) => void;
    /**
     * @method read_config
     * @description Updates the internal gamestate with the state tick from the server and
     * determines when the next config update should occur
     */
    read_config: () => Promise<void>;
    /**
     * @method goal_scored
     * @description Processing a goal that is scored and changing scene
     * to a team specific scene of the team that scored
     */
    goal_scored: (data: GoalScored) => void;
    /**
     * @method replay_will_end
     * @description When the goal is scored in the replay, the replay_will_end event is fired.
     * This allows us to have a nice transition back to the proper scene after the replay ends
     */
    replay_will_end: () => void;
    /**
     * @method replay_end
     * @description Handles the event if the replay is skipped by everyone before
     * the replay_will_end event is fired
     */
    replay_end: () => void;
    /**
     * @method match_ended
     * @description Gets the winning team and changes the scene to the proper winning scene
     */
    match_ended: (data: MatchEnded) => void;
    /**
     * @method updateScene
     * @description Checks if the scene exists in OBS and sets a timeout of sceneDelay length
     * and changes the scene once the timeout is over
     */
    updateScene: (sceneName: string, sceneDelay: number) => void;
}
export default App;
