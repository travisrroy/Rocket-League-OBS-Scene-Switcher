/**
 * File:          SceneManager.ts
 * Author:        Travis Roy
 * Date Created:  May 29, 2023
 * Date Modified: May 31, 2023
 * Description:   The main class that controls the OBS scenes based on Rocket League events
 */

import _ = require("lodash");
import * as fsNode from "fs";

import RocketLeagueConnection from "./RocketLeagueConnection";
import OBSConnection from "./OBSConnection";
import { GameStateEvent } from "../constants";
import { parseVariableName } from "../utils";

import type { Config, GameState, GoalScored, MatchEnded } from "../types";

/**
 * @class SceneManager
 */
export default class SceneManager {
  private _config: Config;
  private _configPath: string;
  private _obsConn: OBSConnection;
  private _rlConn: RocketLeagueConnection;
  
  private _gameState: GameState;
  private _replayWillEnd: boolean;
  private _lastUpdate: number;

  constructor(configPath: string) {
    try {
      // Read from JSON configuration file
      this._config = JSON.parse(fsNode.readFileSync(configPath, "utf-8"));
    }
    catch (e) {
      console.log(e);
      process.exit(1);
    }

    this._configPath = configPath;
    this._obsConn = new OBSConnection(configPath);
    this._rlConn = new RocketLeagueConnection(configPath, this.update_callback);
    this._gameState = {};
    this._replayWillEnd = false;
    this._lastUpdate = new Date().getTime();
  }

  get config() {
    return this._config
  }

  get configPath() {
    return this._configPath;
  }

  get obsConn() {
    return this._obsConn;
  }

  get rlConn() {
    return this._rlConn;
  }

  get gameState() {
    return this._gameState;
  }

  get replayWillEnd() {
    return this._replayWillEnd;
  }

  set replayWillEnd(value: boolean) {
    this._replayWillEnd = value;
  }

  get lastUpdate() {
    return this._lastUpdate;
  }
  
  

  /**
   * @method init
   * @description Main entrypoint
   */
  init = () => {
    this._obsConn.init();
    this._rlConn.init();
  }



  /**
   * @method update_callback
   * @description Called each time a message from Rocket League is received
   * @param event - The game state event from Rocket League
   * @param data - The data attached to game state event
   */
  update_callback = (event: GameStateEvent, data: any) => {
    switch(event) {
      case GameStateEvent.Initialized:
        if (this._config.enable.initialized) {
          this._obsConn.setScene(this._config.scenes.initialized, this._config.delays.initialized);
        }
        break;
      case GameStateEvent.UpdateState:
        this.update_state(data);
        break;
      case GameStateEvent.GoalScored:
        if (this._config.enable.goal_scored) {
          this.goal_scored(data);
        }
        break;
      case GameStateEvent.ReplayWillEnd:
        if (this._config.enable.replay_will_end)  {
          this.replay_will_end();
        }
        break;
      case GameStateEvent.ReplayEnd:
        if (this._config.enable.replay_end) {
          this.replay_end();
        }
        break;
      case GameStateEvent.MatchEnded:
        if (this._config.enable.match_ended) {
          this.match_ended(data);
        }
        break;
      case GameStateEvent.PodiumStart:
        if (this._config.enable.podium_start)  {
          this._obsConn.setScene(this._config.scenes.podium_start, this._config.delays.podium_start);
        }
        break;
      case GameStateEvent.MatchDestroyed:
        if (this._config.enable.match_destroyed) {
          this._obsConn.setScene(this._config.scenes.match_destroyed, this._config.delays.match_destroyed);
        }
        break;
      default:
        break;
    }
  }



  /**
   * @method update_state
   * @description Updates the internal gamestate with the state tick from the server and
   * determines when the next config update should occur
   */
   update_state = (data: GameState) => {
    this._gameState = data;

    // Updating from the config every 2500ms
    if (new Date().getTime() - this._lastUpdate >= 2500) {
      this.read_config();
      this._lastUpdate = new Date().getTime();
    }
  }



  /**
   * @method read_config
   * @description Updates the internal gamestate with the state tick from the server and
   * determines when the next config update should occur
   */
  read_config = async() => {
    const rawData: string = await fsNode.readFileSync(this._configPath, "utf-8");
    this._config = JSON.parse(rawData);
  }



  /**
   * @method goal_scored
   * @description Processing a goal that is scored and changing scene 
   * to a team specific scene of the team that scored
   */
  goal_scored = (data: GoalScored) => {
    const { teamnum } = data.scorer; //0 = left, 1 = right
    const teamObject = this._gameState.game?.teams[teamnum];
		const teamName = _.startCase(_.toLower(teamObject?.name));

    const scene: string = parseVariableName(this._config.scenes.goal_scored, teamName);
    this._obsConn.setScene(scene, this._config.delays.goal_scored);
  }


  
  /**
   * @method replay_will_end
   * @description When the goal is scored in the replay, the replay_will_end event is fired.
   * This allows us to have a nice transition back to the proper scene after the replay ends
   */
  replay_will_end = () => {
    this._replayWillEnd = true;

    // Zero second goal is scored or game is in Overtime, we don't want this scene
    if (this._gameState.game?.time !== 0 && !this._gameState.game?.isOT) {
      this._obsConn.setScene(this._config.scenes.replay_will_end, this._config.delays.replay_will_end);
    }
  }



  /**
   * @method replay_end
   * @description Handles the event if the replay is skipped by everyone before 
   * the replay_will_end event is fired
   */
  replay_end = () => {
    if (!this._replayWillEnd) {
      this._obsConn.setScene(this._config.scenes.replay_end, this._config.delays.replay_end);
    }
    this._replayWillEnd = false;
  }



  /**
   * @method match_ended
   * @description Gets the winning team and changes the scene to the proper winning scene
   */
  match_ended = (data: MatchEnded) => {
    const teamObject = this._gameState.game?.teams[data.winner_team_num];
    const teamName = _.startCase(_.toLower(teamObject?.name));
    
    const scene: string = parseVariableName(this._config.scenes.match_ended, teamName)
    this._obsConn.setScene(scene, this._config.delays.match_ended);
  }
}