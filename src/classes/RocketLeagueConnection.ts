/**
 * File:          RocketLeagueConnection.ts
 * Author:        Travis Roy
 * Date Created:  Dec 27, 2022
 * Date Modified: May 31, 2023
 * Description:   Contains the class for communication to Rocket League
 */

import WebSocket, { MessageEvent } from "ws";
import * as fsNode from "fs";

import { sleep, getKeyByValueGameState } from "../utils";
import { GameStateEvent } from "../constants";

import type { Config, GameState, GoalScored, MatchEnded } from "../types";


/**
 * @class RocketLeagueConnection
 * @description The class that handles the connection to Rocket League
 */
export default class RocketLeagueConnection {
  private _config: Config;
  private _hostname: string;
  private _port: number;
  private _client: WebSocket | null;
  private _callback: (event: GameStateEvent, data: GameState) => void;
  
  constructor(configPath: string, eventCallback: (event: GameStateEvent, data: GameState) => void) {
    try {
      // Read from JSON configuration file
      this._config = JSON.parse(fsNode.readFileSync(configPath, "utf-8"));
    }
    catch (e) {
      console.log(e);
      process.exit(1);
    }

    this._hostname = this._config.connections.RLHostname;
    this._port = this._config.connections.RLPort;
    this._client = null;
    this._callback = eventCallback;
  }

  get config() { return this._config }
  get hostname() { return this._hostname }
  get port() { return this._port }
  get client() { return this._client }
  get callback() { return this._callback }



  /**
   * @method init
   * @description Start and manage the connection to Rocket League's websocket server
   */
  init = () => {
    this._client = new WebSocket(`ws://${this._hostname}:${this._port}`);

    this._client.onopen = () => {
      console.log(`Connected to Rocket League on ${this._hostname}`);
    }

    this._client.onmessage = (d: MessageEvent) => {
      try {
        const { event, data }: { event: string, data: any } = JSON.parse(d.data.toString());
        const eventEnum = GameStateEvent[getKeyByValueGameState(event) as keyof typeof GameStateEvent];
        
        this._callback(eventEnum, data);
      }
      catch (err) {
        console.log("Error processing message");
      }
    }

    this._client.onclose = async() => {
      if(this._client?.readyState === WebSocket.CLOSED) {
        console.log("Rocket League WebSocket Server Closed. Attempting to reconnect...");
        
        await sleep(5000);
        this.init();
      }
    }

    this._client.onerror = async() => {
      console.log("Error connecting to Rocket League. Please ensure your config is correct!");

      await sleep(5000);
    }
  }
}