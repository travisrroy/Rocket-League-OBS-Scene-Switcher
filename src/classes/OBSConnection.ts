/**
 * File:          OBSConnection.ts
 * Author:        Travis Roy
 * Date Created:  Dec 27, 2022
 * Date Modified: May 31, 2023
 * Description:   Contains the class for communication to OBS
 */

import * as fsNode from "fs";
import OBSWebSocket, { OBSResponseTypes } from "obs-websocket-js";
import { sleep } from "../utils";
import type { Config, Scene } from "../types";


/**
 * @class OBSConnection
 * @description The class that handles the connection to OBS
 */
export default class OBSConnection {
  private _config: Config;
  private _hostname: string;
  private _port: number;
  private _auth: string;
  private _client: OBSWebSocket;
  private _scenes: string[];

  constructor(configPath: string) {
    try {
      // Read from JSON configuration file
      this._config = JSON.parse(fsNode.readFileSync(configPath, "utf-8"));
    }
    catch (e) {
      console.log(e);
      process.exit(1);
    }

    this._hostname = this._config.connections.OBSHostname;
    this._port = this._config.connections.OBSPort;
    this._auth = this._config.connections.OBSAuth;
    this._client = new OBSWebSocket();
    this._scenes = [];
  }

  get config() { return this._config }
  get hostname() { return this._hostname }
  get port() { return this._port }
  get auth() { return this._auth }
  get client() { return this._client }
  get scenes() { return this._scenes }



  /**
   * @method init
   * @description Start and manage the connection to OBS' websocket server
   */
  init = async() => {
    try {
      await this._client.connect(`ws://${this._hostname}:${this._port}`, this._auth);
      console.log("Connected to OBS");

      // Populating the scene list
      const rawSceneList = await this._client.call("GetSceneList");
      const cleanScenes = this.parseScenes(rawSceneList);

      if (cleanScenes) {
        this._scenes = cleanScenes;
      }
    }
    catch (error: any) {
      console.error('Failed to connect', error.code, error.message);
    }

    this._client.on("ConnectionClosed", async() => {
      console.log("OBS WebSocket Server Closed. Attempting to reconnect...");
      await sleep(5000);
      this.init();
    });
  }



  /**
   * @method parseScenes
   * @description Parses the provided scenes and finds scenes with names that have duplicate parts. The non-duplicate 
   * part of the name is replaced by {teamName} so that it can be used for dynamic scene switching
   * @param rawSceneList The raw scenes from 
   * @returns 
   */
  parseScenes = (rawSceneList: OBSResponseTypes['GetSceneList']) => {
    let maybeMatchArr: string[] = []; // Stores the string endings after the space
    let indexArr: number[] = []; // Holds the index of where there are matched endings
    let cleanArr: string[] = [];

    // The Scene type is explicitly defined rather than using JsonObject
    const sceneList: Scene[] = JSON.parse(JSON.stringify(rawSceneList.scenes));

    if (sceneList === undefined || sceneList.length < 1) return;
  
    // Splitting off the string endings to check for matches
    for (let i = 0; i < sceneList.length; i++) {
      if (sceneList[i].sceneName.includes(" ")) {
        maybeMatchArr.push(sceneList[i].sceneName.split(" ").pop()!.trim());
      }
    }
  
    // Finding the matches in the string array
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
  
    return [...cleanArr];
  }



  /**
   * @method getScenes
   * @description Retrieves the raw list of scenes from OBS and passes them to be parsed
   * @returns The list of parsed scenes
   */
  getScenes = async() => {
    let cleanScenes: string[];

    try {
      const rawSceneList = await this.client.call("GetSceneList");
      cleanScenes = this.parseScenes(rawSceneList)!;
    }
    catch (error: any) {
      console.error('Failed to connect', error.code, error.message);
    }

    return cleanScenes!;
  }



  /**
   * @method updateScene
   * @description Checks if the scene exists in OBS and sets a timeout of sceneDelay length
   * and changes the scene once the timeout is over
   */
  setScene = (sceneName: string, sceneDelay: number) => {
    setTimeout(async() => { 
      try {
        await this._client.call("SetCurrentProgramScene", {
          "sceneName": sceneName
        });
      }
      catch (error: any) {
        console.error('Error!', `[${error.code}]`, error.message);
      }
    }, sceneDelay);
  }
}