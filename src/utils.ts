/**
 * File:          utils.ts
 * Author:        Travis Roy
 * Date Created:  Dec 27, 2022
 * Date Modified: May 5, 2023
 * Description:   Contains utility functions
 */

import { GameStateEvent } from "./constants";

/**
 * @function sleep
 * @description A simple delay function
 * @param ms - The number of milliseconds to delay for
 * @returns A promise for the setTimeout
 */
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



/**
 * @function getKeyByValueGameState
 * @description Returns the enum GameStateEvent's key that matches the game state from the websocket
 * @param value - The game state from the websocket
 * @returns The enum's key
 */
export function getKeyByValueGameState(value: string) {
  const indexOfS = Object.values(GameStateEvent).indexOf(value as unknown as GameStateEvent);
  const key = Object.keys(GameStateEvent)[indexOfS];

  return key;
}



/**
 * @function parseVariableName
 * @description Parses the variable name from the user's input and replaces it with what is contained in that variable
 * https://regex101.com/r/X9YMp2/2
 */
 export const parseVariableName = (configVal: string, replaceVal: string, replaceKey: string = "teamName"): string => {
  const re = new RegExp(`\{${replaceKey}\}`)
  return configVal.replace(re, replaceVal);
}