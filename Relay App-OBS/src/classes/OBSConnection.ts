import * as fsNode from "fs";
import path from "path";
import OBSWebSocket, { OBSResponseTypes } from "obs-websocket-js";

import { sleep } from "../utils";
import type { Config, Scene, ConnError, Scenes } from "../types";

const fs = fsNode.promises;
const configPath = path.resolve(".", "./src/config.json");

export default class OBSConnection {
  private config: Config;

  private hostname: string;
  private port: number;
  private auth: string;
  private client: OBSWebSocket;
  private scenes: string[];



  constructor() {
    try {
      // Read from JSON configuration file
      this.config = JSON.parse(fsNode.readFileSync(configPath, "utf-8"));
    }
    catch (e) {
      console.log(e);
      process.exit(1);
    }

    this.hostname = this.config.connections.OBSHostname;
    this.port = this.config.connections.OBSPort;
    this.auth = this.config.connections.OBSAuth;
    this.client = new OBSWebSocket();
    this.scenes = [];
  }



  init = async() => {
    try {
      await this.client.connect(`ws://${this.hostname}:${this.port}`, this.auth);
      console.log("Connected to OBS");

      const rawSceneList = await this.client.call("GetSceneList");
      this.parseScenes(rawSceneList);
      console.log(this.scenes);
    }
    catch (error: any) {
      console.error('Failed to connect', error.code, error.message);
    }

    this.client.on("ConnectionClosed", async() => {
      console.log("OBS WebSocket Server Closed. Attempting to reconnect...");
      await sleep(5000);
      this.init();
    });
  }


  
  private parseScenes = (rawSceneList: OBSResponseTypes['GetSceneList']) => {
    let maybeMatchArr: string[] = []; // Stores the string endings after the space
    let indexArr: number[] = []; // Holds the index of where there are matched endings
    let cleanArr: string[] = [];

    // The Scene type is explicitly defined rather than using JsonObject
    // @ts-ignore
    const sceneList: Scene[] = rawSceneList.scenes;

    if (sceneList === undefined || sceneList.length < 1) return;
  
    // Splitting off the string endings to check for matches
    for (let i = 0; i < sceneList.length; i++) {
      if (sceneList[i].sceneName.includes(" ")) {
        maybeMatchArr.push(sceneList[i].sceneName.split(" ").pop()!.trim());
      }
    }
  
    // Finding the matches in the string array
    //   NOTE: This does not store the first instance of a match
    const dupeArr = [...new Set(maybeMatchArr.filter((e, i, a) => a.indexOf(e) !== i))];
  
    // Looping back through the original array to find all the indexes of matched endings
    for (let i = 0; i < sceneList.length; i++) {
      const end = sceneList[i].sceneName.split(" ").pop()!.trim();
      if (dupeArr.includes(end)) {
        indexArr.push(i);
      }
    }
  
    // Removing the whole strings where there was a match
    for (let i = indexArr.length - 1; i >= 0; i--) {
      if (i > -1) {
        sceneList.splice(indexArr[i], 1);
      }
    }

    // Copying the remaining array to a string typed array
    cleanArr = sceneList.map(scene => scene.sceneName);
  
    // Adding the teamName placeholder
    for (let i = 0; i < dupeArr.length; i++) {
      cleanArr.push(`{teamName} ${dupeArr[i]}`);
    }
  
    // Copying to the stored array
    this.scenes = [...cleanArr];
  }



  // Rewrite to only provide "Scene, Audio, Main, and {teamName} Replay"
  getScenes = async() => {
    try {
      const rawSceneList = await this.client.call("GetSceneList");
      this.parseScenes(rawSceneList);
    }
    catch (error: any) {
      console.error('Failed to connect', error.code, error.message);
    }

    return this.scenes;
  }



  /**
   * @method updateScene
   * @description Checks if the scene exists in OBS and sets a timeout of sceneDelay length
   * and changes the scene once the timeout is over
   */
  setScene = (sceneName: string, sceneDelay: number) => {
    setTimeout(async() => { 
      try {
        await this.client.call("SetCurrentProgramScene", {
          "sceneName": sceneName
        });
      }
      catch (error: any) {
        console.error('Error!', `[${error.code}]`, error.message);
      }
    }, sceneDelay);
  }
}