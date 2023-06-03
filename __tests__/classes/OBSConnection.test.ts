import fs from "fs";
import { when } from "jest-when";
import WS from "jest-websocket-mock";

import OBSConnection from "../../src/classes/OBSConnection";
import { sleep } from "../../src/utils";
import OBSWebSocket, { OBSResponseTypes } from "obs-websocket-js";
import { BaseOBSWebSocket } from "obs-websocket-js/dist/base";

const configPath = "./config";
const config = {
  "connections": {
    "OBSHostname": "localhost",
    "OBSPort": 4455,
    "OBSAuth": "0123456789",
    "RLHostname": "localhost",
    "RLPort": 49122
  },
  "scenes": {
    "initialized": "Game Start",
    "goal_scored": "{teamName} Replay",
    "replay_will_end": "Main Game",
    "replay_end": "Main Game",
    "match_ended": "{teamName} Win",
    "podium_start": "Stats",
    "match_destroyed": "Intermission"
  },
  "delays": {
    "initialized": 100,
    "goal_scored": 1500,
    "replay_will_end": 1000,
    "replay_end": 50,
    "match_ended": 150,
    "podium_start": 4000,
    "match_destroyed": 250
  }
}
const obsSceneList: OBSResponseTypes['GetSceneList'] = {
  currentPreviewSceneName: "",
  currentProgramSceneName: 'Main Screen',
  scenes: [
    { sceneIndex: 1, sceneName: 'Main Screen' },
    { sceneIndex: 2, sceneName: 'Orangey Win' },
    { sceneIndex: 3, sceneName: 'Bluey Win' },
    { sceneIndex: 4, sceneName: 'Orangey Replay' },
    { sceneIndex: 5, sceneName: 'Bluey Replay' },
    { sceneIndex: 6, sceneName: 'Stats' },
    { sceneIndex: 7, sceneName: 'Casters' }
  ]
}
const parsedSceneList = [
  'Main Screen',
  'Stats',
  'Casters',
  '{teamName} Win',
  '{teamName} Replay'
]

const readFileSyncMock = jest.spyOn(fs, 'readFileSync');
when(readFileSyncMock)
  .calledWith(configPath, 'utf-8')
  .mockReturnValue(JSON.stringify(config));

jest.mock("../../src/utils", () => {
  return {
    sleep: jest.fn()
  }
});

jest.mock("obs-websocket-js", () => {
  return jest.fn().mockImplementation(() => { 
    return {
      default: jest.fn(),
      connect: jest.fn(),
      call: jest.fn(() => {}),
      on: jest.fn()
    }
  });
});


describe("OBSConnection", () => {
  let obsConn: OBSConnection;

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 4, 1));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    obsConn = new OBSConnection(configPath);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should initialize the OBSConnection object correctly", () => {
    const obsConn = new OBSConnection(configPath);

    // Using Jest fake timers adds 1 call to our expected 1
    expect(fs.readFileSync).toHaveBeenCalledTimes(2);
    
    expect(obsConn.config).toEqual(config);
    expect(obsConn.hostname).toEqual(config.connections.OBSHostname);
    expect(obsConn.port).toEqual(config.connections.OBSPort);
    expect(obsConn.auth).toEqual(config.connections.OBSAuth);
    expect(JSON.stringify(obsConn.client)).toEqual(JSON.stringify(new OBSWebSocket()));
    expect(obsConn.scenes).toEqual([]);
  });

  it("should connect to OBS, send a log and retrieve the scene list", async() => {
    when(obsConn.client.call)
      .calledWith("GetSceneList")
      .mockResolvedValue(obsSceneList)

    console.log = jest.fn();
    await obsConn.init();

    expect(console.log).toHaveBeenCalledWith("Connected to OBS");
    expect(obsConn.scenes).toEqual(parsedSceneList);
  });

  it("should take the obs scene list and parse it to insert the placeholders", async() => {
    const actualScenes = obsConn.parseScenes(obsSceneList);

    expect(actualScenes).toEqual(parsedSceneList);
  });

  it("should not parse the scene list", async() => {
    const emptySceneList: OBSResponseTypes['GetSceneList'] = {
      currentPreviewSceneName: "",
      currentProgramSceneName: 'Main Screen',
      scenes: []
    }
    const actualScenes = obsConn.parseScenes(emptySceneList);
    
    expect(actualScenes).toBeUndefined();
  });

  it("should get the obs scene list, parse it and return the updated list", async() => {
    when(obsConn.client.call)
      .calledWith("GetSceneList")
      .mockResolvedValue(obsSceneList)

    const actualScenes = await obsConn.getScenes();

    expect(actualScenes).toEqual(parsedSceneList);
  });

  it.each([
    { 
      scene: config.scenes.initialized,
      delay: config.delays.initialized
    },
    { 
      scene: config.scenes.goal_scored,
      delay: config.delays.goal_scored
    },
    { 
      scene: config.scenes.replay_will_end,
      delay: config.delays.replay_will_end
    },
    { 
      scene: config.scenes.replay_end,
      delay: config.delays.replay_end
    },
    { 
      scene: config.scenes.match_ended,
      delay: config.delays.match_ended
    },
    { 
      scene: config.scenes.podium_start,
      delay: config.delays.podium_start
    },
    { 
      scene: config.scenes.match_destroyed,
      delay: config.delays.match_destroyed
    }
  ])("should change the active scene on OBS to '$scene' with a delay of $delay ms", async({ scene, delay }) => {
    obsConn.setScene(scene, delay);

    jest.advanceTimersByTime(20);
    await Promise.resolve();
    expect(obsConn.client.call).not.toHaveBeenCalled();

    jest.advanceTimersByTime(delay - 20);
    await Promise.resolve();
    expect(obsConn.client.call).toHaveBeenCalledWith("SetCurrentProgramScene", {
      "sceneName": scene
    });
  });
});