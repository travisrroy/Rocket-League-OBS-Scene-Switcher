import * as fsNode from "fs";
import path from "path";
import _ = require("lodash");

import RocketLeagueConnection from "./classes/RocketLeagueConnection";
import OBSConnection from "./classes/OBSConnection";
import { GameStateEvent } from "./constants";
import { parseVariableName } from "./utils";

import type { Config, GameState, GoalScored, MatchEnded } from "./types";

const fs = fsNode.promises;
const configPath = path.resolve(".", "./src/config.json");

class App {
  private config: Config;
  private obsConn: OBSConnection;
  private rlConn: RocketLeagueConnection;
  
  private gameState: GameState;
  private replayWillEnd: boolean;
  private lastUpdate: number;

  constructor() {
    try {
      // Read from JSON configuration file
      this.config = JSON.parse(fsNode.readFileSync(configPath, "utf-8"));
    }
    catch (e) {
      console.log(e);
      process.exit(1);
    }

    this.obsConn = new OBSConnection();
    this.rlConn = new RocketLeagueConnection(this.updateCallback);
    this.gameState = {};
    this.replayWillEnd = false;
    this.lastUpdate = new Date().getTime();
  }

  init = () => {
    this.obsConn.init();
    this.rlConn.init();

    setTimeout(async() => {
      console.log(await this.obsConn.getScenes());
    }, 5000);
  }

  updateCallback = (event: string, data: any) => {
    switch(event) {
      case GameStateEvent.Initialized:
        this.obsConn.setScene(this.config.scenes.initialized, this.config.delays.initialized);
        break;
      case GameStateEvent.UpdateState:
        this.update_state(data);
        break;
      case GameStateEvent.GoalScored:
        if (this.config.enable.goal_scored)
          this.goal_scored(data);
        break;
      case GameStateEvent.ReplayWillEnd:
        if (this.config.enable.replay_will_end) 
          this.replay_will_end();
        break;
      case GameStateEvent.ReplayEnd:
        if (this.config.enable.replay_end) 
          this.replay_end();
        break;
      case GameStateEvent.MatchEnded:
        if (this.config.enable.match_ended) 
          this.match_ended(data);
        break;
      case GameStateEvent.PodiumStart:
        if (this.config.enable.podium_start) 
          this.obsConn.setScene(this.config.scenes.podium_start, this.config.delays.podium_start);
        break;
      case GameStateEvent.MatchDestroyed:
        if (this.config.enable.match_destroyed) 
          this.obsConn.setScene(this.config.scenes.match_destroyed, this.config.delays.match_destroyed);
        break;
      default:
        //
    }
  }

  /**
   * @method update_state
   * @description Updates the internal gamestate with the state tick from the server and
   * determines when the next config update should occur
   */
   update_state = (data: GameState) => {
    this.gameState = data;

    // Updating from the config every 2500ms
    if (new Date().getTime() - this.lastUpdate >= 2500) {
      this.read_config();
      this.lastUpdate = new Date().getTime();
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

    const scene: string = parseVariableName(this.config.scenes.goal_scored, teamName);
    this.obsConn.setScene(scene, this.config.delays.goal_scored);
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
      this.obsConn.setScene(this.config.scenes.replay_will_end, this.config.delays.replay_will_end);
    }
  }



  /**
   * @method replay_end
   * @description Handles the event if the replay is skipped by everyone before 
   * the replay_will_end event is fired
   */
  replay_end = () => {
    if (!this.replayWillEnd) {
      this.obsConn.setScene(this.config.scenes.replay_end, this.config.delays.replay_end);
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
    this.obsConn.setScene(scene, this.config.delays.match_ended);
  }
}

const app = new App();
app.init();
// app.list();

export default App;