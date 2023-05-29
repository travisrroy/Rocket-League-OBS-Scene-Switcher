/**
 * File:          RocketLeagueConnection.ts
 * Author:        Travis Roy
 * Date Created:  Dec 27, 2022
 * Date Modified: May 5, 2023
 * Description:   Contains the class for communication to Rocket League
 */

import WebSocket from "ws";
import * as fsNode from "fs";
import path from "path";

import { sleep, getKeyByValueGameState } from "../utils";
import { GameStateEvent } from "../constants";

import type { Config, GameState, GoalScored, MatchEnded } from "../types";


const fs = fsNode.promises;
const configPath = path.resolve(".", "./src/config.json");


/**
 * @class RocketLeagueConnection
 * @description The class that handles the connection to Rocket League
 */
export default class RocketLeagueConnection {
  private config: Config;
  private hostname: string;
  private port: number;
  private client: WebSocket | null;
  private callback: (event: GameStateEvent, data: GameState) => void;
  
  constructor(eventCallback: (event: GameStateEvent, data: GameState) => void) {
    try {
      // Read from JSON configuration file
      this.config = JSON.parse(fsNode.readFileSync(configPath, "utf-8"));
    }
    catch (e) {
      console.log(e);
      process.exit(1);
    }

    this.hostname = this.config.connections.RLHostname;
    this.port = this.config.connections.RLPort;
    this.client = null;
    this.callback = eventCallback;
  }



  /**
   * @method init
   * @description Start and manage the connection to Rocket League's websocket server
   */
  init = () => {
    this.client = new WebSocket(`ws://${this.hostname}:${this.port}`);

    this.client.onopen = () => {
      console.log(`Connected to Rocket League on ${this.hostname}`);
    }

    this.client.on("message", (d: string) => {
      try {
        const { event, data }: { event: string, data: any } = JSON.parse(d);
        const eventEnum = GameStateEvent[getKeyByValueGameState(event) as keyof typeof GameStateEvent];
        
        this.callback(eventEnum, data);
      }
      catch (err) {
        console.log("Error processing message");
      }
    });

    this.client.on("close", async() => {
      if(this.client?.readyState === WebSocket.CLOSED) {
        console.log("Rocket League WebSocket Server Closed. Attempting to reconnect...");
        await sleep(5000);
        this.init();
      }
    })

    this.client.on("error", async() => {
      console.log("Error connecting to Rocket League");
      await sleep(5000);
    });
  }
}