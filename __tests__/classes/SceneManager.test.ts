import fs from "fs";
import { when } from "jest-when";

import SceneManager from "../../src/classes/SceneManager";
import OBSConnection from "../../src/classes/OBSConnection";
import RocketLeagueConnection from "../../src/classes/RocketLeagueConnection";
import { GameStateEvent } from "../../src/constants";
import { GameState, GoalScored, MatchEnded } from "../../src/types";

const configPathEnabled = "./configEnabled";
const configPathDisabled = "./configDisabled";
const readConfigPath = "./readConfig"

const testConfigEnabled = {
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
  },
  "enable": {
    "initialized": true,
    "goal_scored": true,
    "replay_will_end": true,
    "replay_end": true,
    "match_ended": true,
    "podium_start": true,
    "match_destroyed": true
  }
}

const testConfigDisabled = {
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
  },
  "enable": {
    "initialized": false,
    "goal_scored": false,
    "replay_will_end": false,
    "replay_end": false,
    "match_ended": false,
    "podium_start": false,
    "match_destroyed": false
  }
}

const readFileSyncMock = jest.spyOn(fs, 'readFileSync');
when(readFileSyncMock)
  .calledWith(configPathEnabled, 'utf-8')
  .mockReturnValue(JSON.stringify(testConfigEnabled));
when(readFileSyncMock)
  .calledWith(configPathDisabled, 'utf-8')
  .mockReturnValue(JSON.stringify(testConfigDisabled));
when(readFileSyncMock)
  .calledWith(readConfigPath, "utf-8")
  .mockReturnValue(JSON.stringify(testConfigEnabled));

jest.mock("../../src/classes/OBSConnection", () => {
  return jest.fn().mockImplementation(() => { 
    return { 
      default: jest.fn(),
      init: jest.fn(() => { return Promise<void> }),
      setScene: jest.fn((sceneName: string, sceneDelay: number) => { return })
    }
  });
});
jest.mock("../../src/classes/RocketLeagueConnection", () => {
  return jest.fn().mockImplementation(() => { 
    return { 
      default: jest.fn(),
      init: jest.fn(() => { return })
    }
  });
});

describe("SceneManager", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 4, 1));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should initialize the sceneManager object correctly", () => {
    const sceneManager = new SceneManager(configPathEnabled);

    expect(fs.readFileSync).toHaveBeenCalledTimes(1);
    expect(OBSConnection).toHaveBeenCalledTimes(1);
    expect(RocketLeagueConnection).toHaveBeenCalledTimes(1);

    const expectedLastUpdate = new Date().getTime();
    
    expect(sceneManager.config).toEqual(testConfigEnabled);
    expect(sceneManager.configPath).toEqual(configPathEnabled);
    expect(sceneManager.gameState).toEqual({});
    expect(sceneManager.replayWillEnd).toEqual(false);
    expect(sceneManager.lastUpdate).toEqual(expectedLastUpdate);
  });

  it("should run init for obsConnection and rocketLeagueConnection", () => {
    const sceneManager = new SceneManager(configPathEnabled);
    sceneManager.init();

    const setObsConnSpy = jest.spyOn(sceneManager.obsConn, "init");
    const setrlConnSpy = jest.spyOn(sceneManager.rlConn, "init");

    expect(setObsConnSpy).toBeCalledTimes(1);
    expect(setrlConnSpy).toBeCalledTimes(1);
  });

  it("should read the config and update the config field", async() => {
    const sceneManager = new SceneManager(readConfigPath);

    let expectedConfig = JSON.parse(JSON.stringify(testConfigEnabled));
    expectedConfig.scenes.initialized = "Game Start";
    expectedConfig.delays.goal_scored = 1500;
    expectedConfig.enable.match_destroyed = false;

    // Changing config back to normal
    when(readFileSyncMock)
    .calledWith(readConfigPath, "utf-8")
    .mockReturnValue(JSON.stringify(expectedConfig))

    await sceneManager.read_config();
    
    // Using jest-when and Jest fake timers add 3 calls (2 and 1 respectfully)
    // Our expected from read_config is 2
    expect(readFileSyncMock).toHaveBeenCalledTimes(5);
    expect(sceneManager.config).toEqual(expectedConfig);
  });

  it("should set the scene based on who scored the goal", () => {
    const dataInput: GoalScored = {
      ball_last_touch: {
        player: "Test Player",
        speed: 85.0
      },
      goalspeed: 88.5,
      impact_location: {
        X: 5,
        Y: 10
      },
      scorer: {
        id: "0123456",
        name: "Test Player",
        teamnum: 1 // Test Team 2
      }
    }
    const gameStateInput: GameState = {
      game: {
        ballSpeed: 88.0,
        ballTeam: 1,
        ballX: 5,
        ballY: 10,
        ballZ: 8,
        hasTarget: true,
        hasWinner: false,
        isOT: false,
        isReplay: false,
        target: "",
        teams: [
          {
            name: "Test Team 1",
            score: 1
          },
          {
            name: "Test Team 2",
            score: 5
          }
        ],
        time: 120,
        winner: ""
      }
    }
    const sceneManager = new SceneManager(configPathEnabled);
    sceneManager.update_state(gameStateInput);

    const expectedScene = "Test Team 2 Replay";

    sceneManager.goal_scored(dataInput);
    expect(sceneManager.obsConn.setScene).toHaveBeenCalledTimes(1);
    expect(sceneManager.obsConn.setScene).toBeCalledWith(expectedScene, testConfigEnabled.delays.goal_scored);
  });

  it("should set the scene to Main Game after a goal before the replay is over", () => {
    let gameStateInput: GameState = {
      game: {
        ballSpeed: 88.0,
        ballTeam: 1,
        ballX: 5,
        ballY: 10,
        ballZ: 8,
        hasTarget: true,
        hasWinner: false,
        isOT: false,
        isReplay: false,
        target: "",
        teams: [
          {
            name: "Test Team 1",
            score: 1
          },
          {
            name: "Test Team 2",
            score: 5
          }
        ],
        time: 0,
        winner: ""
      }
    }
    const sceneManager = new SceneManager(configPathEnabled);
    sceneManager.update_state(gameStateInput);

    // Should not be called because time is 0
    sceneManager.update_callback(GameStateEvent.ReplayWillEnd, "")
    expect(sceneManager.obsConn.setScene).not.toHaveBeenCalled();

    gameStateInput.game!.time = 120;
    gameStateInput.game!.isOT = true;

    // Should not be called because game was in overtime
    sceneManager.update_callback(GameStateEvent.ReplayWillEnd, "")
    expect(sceneManager.obsConn.setScene).not.toHaveBeenCalled();

    gameStateInput.game!.isOT = false;

    sceneManager.update_callback(GameStateEvent.ReplayWillEnd, "")
    expect(sceneManager.obsConn.setScene).toBeCalledTimes(1);
    expect(sceneManager.obsConn.setScene).toBeCalledWith(testConfigEnabled.scenes.replay_will_end, testConfigEnabled.delays.replay_will_end);
  });

  it("should set the scene to game scene after a goal when the replay is over", () => {
    const sceneManager = new SceneManager(configPathEnabled);
    sceneManager.replayWillEnd = true;

    // Should not be called because replay_will_end was called
    sceneManager.update_callback(GameStateEvent.ReplayEnd, "")
    expect(sceneManager.obsConn.setScene).not.toHaveBeenCalled();

    sceneManager.replayWillEnd = false;

    sceneManager.update_callback(GameStateEvent.ReplayEnd, "")
    expect(sceneManager.obsConn.setScene).toBeCalledTimes(1);
    expect(sceneManager.obsConn.setScene).toBeCalledWith(testConfigEnabled.scenes.replay_end, testConfigEnabled.delays.replay_end);
  });

  it("should set the scene to the team specific winning scene", () => {
    const dataInput: MatchEnded = {
      winner_team_num: 0
    };
    const gameStateInput: GameState = {
      game: {
        ballSpeed: 88.0,
        ballTeam: 1,
        ballX: 5,
        ballY: 10,
        ballZ: 8,
        hasTarget: true,
        hasWinner: false,
        isOT: false,
        isReplay: false,
        target: "",
        teams: [
          {
            name: "Test Team 1",
            score: 1
          },
          {
            name: "Test Team 2",
            score: 5
          }
        ],
        time: 120,
        winner: ""
      }
    }
    const sceneManager = new SceneManager(configPathEnabled);
    sceneManager.update_state(gameStateInput);

    const expectedScene = "Test Team 1 Win";

    sceneManager.match_ended(dataInput);
    expect(sceneManager.obsConn.setScene).toHaveBeenCalledTimes(1);
    expect(sceneManager.obsConn.setScene).toBeCalledWith(expectedScene, testConfigEnabled.delays.match_ended);
  });

  describe("update_callback where scene is enabled", () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2023, 4, 1));
    });
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    afterAll(() => {
      jest.useRealTimers();
    });

    it.each([
      { 
        event: GameStateEvent.Initialized,
        scene: testConfigEnabled.scenes.initialized, 
        delay: testConfigEnabled.delays.initialized 
      },
      { 
        event: GameStateEvent.PodiumStart,
        scene: testConfigEnabled.scenes.podium_start, 
        delay: testConfigEnabled.delays.podium_start 
      },
      { 
        event: GameStateEvent.MatchDestroyed,
        scene: testConfigEnabled.scenes.match_destroyed, 
        delay: testConfigEnabled.delays.match_destroyed 
      }
    ])("should set the scene to '$scene' as defined in the config for '$event'", ({ event, scene, delay }) => {
      const sceneManager = new SceneManager(configPathEnabled);   
  
      sceneManager.update_callback(event, "");
      expect(sceneManager.obsConn.setScene).toBeCalledTimes(1);
      expect(sceneManager.obsConn.setScene).toBeCalledWith(scene, delay);
    });

    it("should call update_state with data provided", () => {
      const dataInput: GameState = { hasGame: true };
      const sceneManager = new SceneManager(configPathEnabled);

      const expectedLastUpdate = new Date().getTime() + 2550;
      const updateStateSpy = jest.spyOn(sceneManager, "update_state");
      jest.advanceTimersByTime(2550); // Advance time to force config update

      sceneManager.update_callback(GameStateEvent.UpdateState, dataInput);
      expect(updateStateSpy).toBeCalledTimes(1);
      expect(updateStateSpy).toBeCalledWith(dataInput);
      expect(sceneManager.lastUpdate).toEqual(expectedLastUpdate);
    });

    it("should call goal_scored with data provided", () => {
      const dataInput: GoalScored = {
        ball_last_touch: {
          player: "Test Player",
          speed: 85.0
        },
        goalspeed: 88.5,
        impact_location: {
          X: 5,
          Y: 10
        },
        scorer: {
          id: "0123456",
          name: "Test Player",
          teamnum: 1 // Test Team 2
        }
      }
      const gameStateInput: GameState = {
        game: {
          ballSpeed: 88.0,
          ballTeam: 1,
          ballX: 5,
          ballY: 10,
          ballZ: 8,
          hasTarget: true,
          hasWinner: false,
          isOT: false,
          isReplay: false,
          target: "",
          teams: [
            {
              name: "Test Team 1",
              score: 1
            },
            {
              name: "Test Team 2",
              score: 5
            }
          ],
          time: 120,
          winner: ""
        }
      }
      const sceneManager = new SceneManager(configPathEnabled);
      sceneManager.update_state(gameStateInput);

      const goalScoredSpy = jest.spyOn(sceneManager, "goal_scored");

      sceneManager.update_callback(GameStateEvent.GoalScored, dataInput);
      expect(goalScoredSpy).toBeCalledTimes(1);
      expect(goalScoredSpy).toBeCalledWith(dataInput);
    });

    it("should call replay_will_end with data provided", () => {
      const sceneManager = new SceneManager(configPathEnabled);

      const replayWillEndSpy = jest.spyOn(sceneManager, "replay_will_end");

      // Method does not take any data arguments
      sceneManager.update_callback(GameStateEvent.ReplayWillEnd, "")
      expect(replayWillEndSpy).toBeCalledTimes(1);
    });

    it("should call replay_end with data provided", () => {
      const sceneManager = new SceneManager(configPathEnabled);

      const replayEndSpy = jest.spyOn(sceneManager, "replay_end");

      // Method does not take any data arguments
      sceneManager.update_callback(GameStateEvent.ReplayEnd, "")
      expect(replayEndSpy).toBeCalledTimes(1);
    });

    it("should call match_ended with data provided", () => {
      const dataInput: MatchEnded = {
        winner_team_num: 0
      };
      const sceneManager = new SceneManager(configPathEnabled);

      const matchEndedSpy = jest.spyOn(sceneManager, "match_ended");

      sceneManager.update_callback(GameStateEvent.MatchEnded, dataInput)
      expect(matchEndedSpy).toBeCalledTimes(1);
      expect(matchEndedSpy).toBeCalledWith(dataInput);
    });
  });

  describe("update_callback where scene is disabled", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it.each([
      { event: GameStateEvent.Initialized },
      { event: GameStateEvent.PodiumStart },
      { event: GameStateEvent.MatchDestroyed }
    ])("should not set the scene for '$event' as it is disabled", ({ event }) => {
      const sceneManager = new SceneManager(configPathDisabled);

      sceneManager.update_callback(event, "");
      expect(sceneManager.obsConn.setScene).not.toHaveBeenCalled();
    });

    it("should not call goal_scored as it is disabled", () => {
      const sceneManager = new SceneManager(configPathDisabled);

      const goalScoredSpy = jest.spyOn(sceneManager, "goal_scored");

      // No arguments as method should not be called
      sceneManager.update_callback(GameStateEvent.GoalScored, "");
      expect(goalScoredSpy).not.toHaveBeenCalled();
    });

    it("should not call replay_will_end as it is disabled", () => {
      const sceneManager = new SceneManager(configPathDisabled);

      const replayWillEndSpy = jest.spyOn(sceneManager, "replay_will_end");

      // No arguments as method should not be called
      sceneManager.update_callback(GameStateEvent.ReplayWillEnd, "")
      expect(replayWillEndSpy).not.toHaveBeenCalled();
    });

    it("should not call replay_end as it is disabled", () => {
      const sceneManager = new SceneManager(configPathDisabled);

      const replayEndSpy = jest.spyOn(sceneManager, "replay_end");

      // No arguments as method should not be called
      sceneManager.update_callback(GameStateEvent.ReplayEnd, "")
      expect(replayEndSpy).not.toHaveBeenCalled();
    });

    it("should not call match_ended as it is disabled", () => {
      const sceneManager = new SceneManager(configPathDisabled);

      const matchEndedSpy = jest.spyOn(sceneManager, "match_ended");

      // No arguments as method should not be called
      sceneManager.update_callback(GameStateEvent.MatchEnded, "")
      expect(matchEndedSpy).not.toHaveBeenCalled();
    });
  });
});
