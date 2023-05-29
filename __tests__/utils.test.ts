import { getKeyByValueGameState, parseVariableName, sleep } from "../src/utils";

// Using test from: https://stackoverflow.com/a/52686304
describe("sleep", () => {
  beforeEach(() => { jest.useFakeTimers(); });
  afterEach(() => { jest.useRealTimers(); });

  it("should not resolve until sleep has finished", async () => {
    const spy = jest.fn();
    sleep(100).then(spy);  // <= resolve after 100ms

    jest.advanceTimersByTime(20);  // <= advance less than 100ms
    await Promise.resolve();  // let any pending callbacks in PromiseJobs run
    expect(spy).not.toHaveBeenCalled();  // SUCCESS

    jest.advanceTimersByTime(80);  // <= advance the rest of the time
    await Promise.resolve();  // let any pending callbacks in PromiseJobs run
    expect(spy).toHaveBeenCalled();  // SUCCESS
  });
});

describe("getKeyByValueGameState", () => {
  it.each([
    { event: "game:initialized", key: "Initialized" },
    { event: "game:update_state", key: "UpdateState" },
    { event: "game:goal_scored", key: "GoalScored" },
    { event: "game:replay_will_end", key: "ReplayWillEnd" },
    { event: "game:replay_end", key: "ReplayEnd" },
    { event: "game:match_ended", key: "MatchEnded" },
    { event: "game:podium_start", key: "PodiumStart" },
    { event: "game:match_destroyed", key: "MatchDestroyed" }
  ])("should provide the GameStateEvent key '$key' for the event '$event'", ({ event, key }) => {
    const result = getKeyByValueGameState(event);
    expect(result).toEqual(key);
  });

  it("should return undefined if a GameStateEvent key does not match", () => {
    const eventInput = "game:clock_stopped";
    
    const result = getKeyByValueGameState(eventInput);
    expect(result).toBeUndefined();
  });
});

describe("parseVariableName", () => {
  it("should replace {teamName} with the name of the team with default key", () => {
    const configInput = "{teamName} Replay";
    const teamInput = "Test";

    const output = "Test Replay";
    const result = parseVariableName(configInput, teamInput);
    expect(result).toEqual(output);
  });

  it("should replace {teamName} with the name of the team with provided key", () => {
    const configInput = "{testKey} Replay";
    const teamInput = "Test";
    const keyInput = "testKey";

    const output = "Test Replay";
    const result = parseVariableName(configInput, teamInput, keyInput);
    expect(result).toEqual(output);
  });

  it("should not replace any text with no key present in config", () => {
    const configInput = "The Best Replay";
    const teamInput = "Test";

    const output = "The Best Replay";
    const result = parseVariableName(configInput, teamInput);
    expect(result).toEqual(output);
  });

  it("should not replace any text with no key present in config with a provided key", () => {
    const configInput = "The Best Replay";
    const teamInput = "Test";
    const keyInput = "testKey";

    const output = "The Best Replay";
    const result = parseVariableName(configInput, teamInput, keyInput);
    expect(result).toEqual(output);
  });
});