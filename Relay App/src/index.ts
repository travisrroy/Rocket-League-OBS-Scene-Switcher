import { Config, GameState, GoalScored, MatchEnded } from "./types"
import WebSocket = require("ws");
import OBSWebSocket = require("obs-websocket-js");
import * as fsNode from "fs";
import path from "path"
const { success, error, warn } = require ("cli-msg");
import _ = require("lodash");

const fs = fsNode.promises;
const configPath = path.resolve(".", "./configuration.json");



/**
 * @function parseVariableName
 * @description Parses the variable name from the user's input and replaces it with what is contained in that variable
 * https://regex101.com/r/X9YMp2/2
 */
const parseVariableName = (configVal: string, replaceVal: string, replaceKey: string = "teamName"): string => {
  const re = new RegExp(`\{${replaceKey}\}`)
  return configVal.replace(re, replaceVal);
}



class App {
  private config: Config;                 // Config from configuration.json
  
  private OBSHostname: string;            // Hostname for the OBS websocket
  private OBSAuth: string;                // Password for the OBS websocket
  private sceneList: string[];            // List of scenes from OBS
  private obsClient: OBSWebSocket | null; // The OBS websocket client

  private rocketLeagueHostname: string;   // Hostname for the Rocket League websocket
  private gameState: GameState;           // The gameState from Rocket League
  private replayWillEnd: boolean;         // Tracks if the replay was skipped before replay_will_end event was fired
  private wsClient: WebSocket | null;     // The websocket client for the SOS plugin for Rocket League

  private lastUpdate: number;             // Milliseconds since the last update from the config file has occured



  constructor() {
    try {
      // Read from JSON configuration file
      this.config = JSON.parse(fsNode.readFileSync(configPath, "utf-8"));
    }
    catch (e) {
      error.wb(e);
      process.exit(1);
    }

    // OBS Websocket
    this.OBSHostname = this.config.connections.OBSHostname;
    this.OBSAuth = this.config.connections.OBSAuth;
    this.sceneList = [];
    this.obsClient = null;

    // Rocket League SOS Websocket
    this.rocketLeagueHostname = this.config.connections.RocketLeagueHostname;
    this.wsClient = null;
    this.gameState = {};
    this.replayWillEnd = false;

    this.lastUpdate = new Date().getTime();
  }



  /**
   * @method init
   * @description Initializes and connects to the OBS websocket and Rocket League websocket
   */
  init = () => {
    warn.wb("Please ensure that you have set the configuration with the configuration tool!");
    this.initOBSWebSocket();
    this.initRocketLeagueWebsocket();
  }



  /**
   * @method initOBSWebSocket
   * @description Connects to the OBS websocket with credentials from config 
   * and retrieves the list of OBS scenes
   */
  initOBSWebSocket = () => {
    this.obsClient = new OBSWebSocket();

    this.obsClient.connect({
      address: this.OBSHostname,
      password: this.OBSAuth
    })
    .then(() => {
      success.wb("Connected to OBS on " + this.OBSHostname);

      return this.obsClient?.send("GetSceneList");
    })
    .then((data: any) => { // Promise from send GetSceneList
      data.scenes.map((scene: any) => {
        this.sceneList.push(scene.name)
      });
    })
    .catch(err => { // Promise convention dicates you have a catch on every chain.
      if(err.code !== "CONNECTION_ERROR"){
        error.wb("Fatal error occurred: " + err.description);
      }
    });

    this.obsClient.on("ConnectionClosed", () => {
      this.initOBSWebSocket();
      warn.wb("OBS WebSocket Server Closed. Attempting to reconnect");
    });
  }



  /**
   * @method initOBSWebSocket
   * @description Connects to the OBS websocket with ip and port from config 
   * and creates an event callback for every message
   */
  initRocketLeagueWebsocket = () => {
    this.wsClient = new WebSocket("ws://" + this.rocketLeagueHostname);

    this.wsClient.onopen = () => {
        success.wb("Connected to Rocket League on " + this.rocketLeagueHostname);
    }

    // Callback to process every message event sent from the websocket server
    this.wsClient.on("message", (d: string) => {
      try {
        const { event, data } = JSON.parse(d);

        /* List of Rocket League SOS Events:
        *  match_created, initialized, pre_countdown_begin, post_countdown_begin
        *  update_state, statfeed_event, goal_scored, replay_start, replay_will_end
        *  replay_end, match_ended, podium_start, match_destroyed
        */
          switch(event) {
          case "game:initialized":
            if (this.config.enable.initialized) 
              this.updateScene(this.config.scenes.initialized, this.config.delays.initialized);
            break;
          case "game:update_state":
            this.update_state(data);
            break;
          case "game:goal_scored":
            if (this.config.enable.goal_scored) 
              this.goal_scored(data);
            break;
          case "game:replay_will_end":
            if (this.config.enable.replay_will_end) 
              this.replay_will_end();
            break;
          case "game:replay_end":
            if (this.config.enable.replay_end) 
              this.replay_end();
            break;
          case "game:match_ended":
            if (this.config.enable.match_ended) 
              this.match_ended(data);
            break;
          case "game:podium_start":
            if (this.config.enable.podium_start) 
              this.updateScene(this.config.scenes.podium_start, this.config.delays.podium_start);
            break;
          case "game:match_destroyed":
            if (this.config.enable.match_destroyed) 
              this.updateScene(this.config.scenes.match_destroyed, this.config.delays.match_destroyed);
            break;
          default:
            // Events not needed
        }
      }
      catch(e) {
        error.wb("Error processing event message: " + e);
      }
    });

    this.wsClient.on("close", () => {
      if(this.wsClient?.readyState === WebSocket.CLOSED) {
        this.initRocketLeagueWebsocket();
        warn.wb("Rocket League WebSocket Server Closed. Attempting to reconnect");
      }
    })

    this.wsClient.on("error", () => {
      this.initRocketLeagueWebsocket();

      error.wb(`Error connecting to Rocket League on host "` +
      `${this.rocketLeagueHostname}"\nIs the plugin loaded into ` +
      `Rocket League? Run the command "plugin load sos" from the ` +
      `BakkesMod console to make sure`);
    });
  }



  /**
   * @method update_state
   * @description Updates the internal gamestate with the state tick from the server and
   * determines when the next config update should occur
   */
  update_state = (data: GameState) => {
    this.gameState = data;

    // Checking if time passed is greater than 2500ms since last update
    if (new Date().getTime() - this.lastUpdate >= 2500) {
      this.read_config();
    }
  }



  /**
   * @method read_config
   * @description Updates the internal gamestate with the state tick from the server and
   * determines when the next config update should occur
   */
  read_config = async() => {
    const rawData: string = await fs.readFile(configPath, "utf-8");
    this.config = JSON.parse(rawData);
  }



  /**
   * @method goal_scored
   * @description Processing a goal that is scored and changing scene 
   * to a team specific scene of the team that scored
   */
  goal_scored = (data: GoalScored) => {
    const { teamnum } = data.scorer; //0 = left, 1 = right
    const teamObject = this.gameState.game?.teams[teamnum];
    const teamName = _.capitalize(teamObject?.name);

    const scene: string = parseVariableName(this.config.scenes.goal_scored, teamName)
    this.updateScene(scene, this.config.delays.goal_scored);
  }



  /**
   * @method replay_will_end
   * @description When the goal is scored in the replay, the replay_will_end event is fired.
   * This allows us to have a nice transition back to the proper scene after the replay ends
   */
  replay_will_end = () => {
    this.replayWillEnd = true;

    // Zero second goal is scored or game is in Overtime, we don"t want this scene
    if (this.gameState.game?.time !== 0 && !this.gameState.game?.isOT) {
      this.updateScene(this.config.scenes.replay_will_end, this.config.delays.replay_will_end);
    }
  }



  /**
   * @method replay_end
   * @description Handles the event if the replay is skipped by everyone before 
   * the replay_will_end event is fired
   */
  replay_end = () => {
    if (!this.replayWillEnd) {
      this.updateScene(this.config.scenes.replay_end, this.config.delays.replay_end);
    }
    this.replayWillEnd = false;
  }



  /**
   * @method match_ended
   * @description Gets the winning team and changes the scene to the proper winning scene
   */
  match_ended = (data: MatchEnded) => {
    const teamObject = this.gameState.game?.teams[data.winner_team_num];
    const teamName = _.capitalize(teamObject?.name);
    
    const scene: string = parseVariableName(this.config.scenes.match_ended, teamName)
    this.updateScene(scene, this.config.delays.match_ended);
  }



  /**
   * @method updateScene
   * @description Checks if the scene exists in OBS and sets a timeout of sceneDelay length
   * and changes the scene once the timeout is over
   */
  updateScene = (sceneName: string, sceneDelay: number) => {
    if(this.sceneList.includes(sceneName)){
      setTimeout(() => { 
        this.obsClient?.send("SetCurrentScene", {
          "scene-name": sceneName
        });
      }, sceneDelay);
    }
    else {
      warn.wb("Scene does not exist in OBS: " + sceneName);
    }
  }
}



// Main entry of the application
const app = new App();
app.init();

export default App;
