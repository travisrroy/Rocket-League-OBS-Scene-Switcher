import { GameStateEvent } from "./constants";

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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