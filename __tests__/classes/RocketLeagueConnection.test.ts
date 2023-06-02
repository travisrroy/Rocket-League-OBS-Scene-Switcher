import fs from "fs";
import { when } from "jest-when";
import WS from "jest-websocket-mock";

import RocketLeagueConnection from "../../src/classes/RocketLeagueConnection";
import { GameStateEvent } from "../../src/constants";
import { sleep } from "../../src/utils";

const configPath = "./config";
const config = {
  "connections": {
    "OBSHostname": "localhost",
    "OBSPort": 4455,
    "OBSAuth": "0123456789",
    "RLHostname": "localhost",
    "RLPort": 49122
  }
}

const mockCallback = jest.fn((event: GameStateEvent, data: any) => { return });

const readFileSyncMock = jest.spyOn(fs, 'readFileSync');
when(readFileSyncMock)
  .calledWith(configPath, 'utf-8')
  .mockReturnValue(JSON.stringify(config));

jest.mock("../../src/utils", () => {
  const getKeyByValueGameState = jest.requireActual("../../src/utils");
  return {
    ...getKeyByValueGameState,
    sleep: jest.fn()
  }
});

let rlConn: RocketLeagueConnection;

describe("RocketLeagueConnection", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    rlConn = new RocketLeagueConnection(configPath, mockCallback);
  });

  afterEach(() => {
    // Prevents init from being called when closing the websocket
    jest.spyOn(rlConn, "init").mockReturnValue();
    WS.clean();
  })

  it("should initialize the RocketLeagueConnection object correctly", () => {
    expect(fs.readFileSync).toHaveBeenCalledTimes(1);
    
    expect(rlConn.config).toEqual(config);
    expect(rlConn.hostname).toEqual(config.connections.RLHostname);
    expect(rlConn.port).toEqual(config.connections.RLPort);
    expect(rlConn.client).toBeNull();
    expect(rlConn.callback).toEqual(mockCallback);
  });

  it("should connect to the websocket server and send a log message", async() => {
    const webSocketServer = new WS(`ws://${config.connections.RLHostname}:${config.connections.RLPort}`);

    console.log = jest.fn();

    rlConn.init();
    await webSocketServer.connected;

    expect(rlConn.client?.OPEN).toBeTruthy();
    expect(console.log).toHaveBeenCalledWith(`Connected to Rocket League on ${rlConn.hostname}`);
  });

  it("should call the callback with the proper events", async() => {
    const webSocketServer = new WS(`ws://${config.connections.RLHostname}:${config.connections.RLPort}`);
    const eventArr = Object.values(GameStateEvent);

    rlConn.init();
    await webSocketServer.connected;

    eventArr.forEach(event => {
      const message = {
        event, 
        data: {
          hasGame: true
        }
      }
      webSocketServer.send(JSON.stringify(message));
      
      expect(mockCallback).toHaveBeenCalledWith(event, message.data);
    });
  });

  it("should handle an improper message received from the websocket", async() => {
    const webSocketServer = new WS(`ws://${config.connections.RLHostname}:${config.connections.RLPort}`);
    const eventArr = Object.values(GameStateEvent);

    rlConn.init();
    await webSocketServer.connected;

    console.log = jest.fn();
    webSocketServer.send("Hello");
      
    expect(console.log).toHaveBeenCalledWith("Error processing message");
  });

  it("should close gracefully, wait 5 seconds, and call init to attempt to connect", async() => {
    const webSocketServer = new WS(`ws://${config.connections.RLHostname}:${config.connections.RLPort}`);

    rlConn.init();
    await webSocketServer.connected;

    console.log = jest.fn();
    // Preventing an open handle
    jest.spyOn(rlConn, "init").mockReturnValue();

    webSocketServer.close();
    await webSocketServer.closed;

    const expectedTime = 5000;

    expect(console.log).toHaveBeenCalledWith("Rocket League WebSocket Server Closed. Attempting to reconnect...");
    expect(sleep).toBeCalledWith(expectedTime);
    expect(rlConn.init).toBeCalledTimes(1);
  });

  it("should catch error, wait 5 seconds, and init to attempt to connect", async() => {
    const webSocketServer = new WS(`ws://${config.connections.RLHostname}:${config.connections.RLPort}`);

    rlConn.init();
    await webSocketServer.connected;

    console.log = jest.fn();
    // Preventing an open handle
    jest.spyOn(rlConn, "init").mockReturnValue();

    webSocketServer.error({ reason: "Incorrect credentials", wasClean: false, code: 1 });

    const expectedTime = 5000;

    expect(console.log).toHaveBeenCalledWith("Error connecting to Rocket League. Please ensure your config is correct!");
    expect(sleep).toBeCalledWith(expectedTime);
  });
});