const WebSocket = require("ws");
const OBSWebSocket = require("obs-websocket-js");
const { success, error, warn, info, log, indent } = require("cli-msg");
const _ = require("lodash");

class App {
  constructor() {
    // OBS Websocket
    this.OBSHostname = "localhost:4444";
    this.sceneList = [];
    this.obsClient = null;

    // Rocket League SOS Websocket
    this.gameState = {};
    this.replayWillEnd = false;
    this.rocketLeagueHostname = "localhost:49122";
    this.wsClient = null;
  }

  init = () => {
    this.initOBSWebSocket();
    this.initRocketLeagueWebsocket();
  }

  initOBSWebSocket = () => {
    this.obsClient = new OBSWebSocket();

    this.obsClient.connect({
      address: this.OBSHostname,
    })
    .then(() => {
      success.wb("Connected to OBS on " + this.OBSHostname);

      return this.obsClient.send("GetSceneList");
    })
    .then((data) => {
      data.scenes.map((scene) => {
        this.sceneList.push(scene.name)
      });
    })
    .catch(err => { // Promise convention dicates you have a catch on every chain.
      //console.log(err);

      if(err.code === "CONNECTION_ERROR"){
        this.initOBSWebSocket();
        warn.wb("OBS WebSocket Server Closed. Attempting to reconnect");
      }
    });

    // You must add this handler to avoid uncaught exceptions.
    this.obsClient.on("error", (err) => {
      if(err && err.code === "CONNECTION_ERROR"){
        this.initOBSWebSocket();
        warn.wb("OBS WebSocket Server Closed. Attempting to reconnect");
      }
      else {
        error.wb("OBS websocket error:", err);
      }
    });

    this.obsClient.on("ConnectionClosed", (err) => {
      if(err && err.code === "CONNECTION_ERROR"){
        this.initOBSWebSocket();
        warn.wb("OBS WebSocket Server Closed. Attempting to reconnect");
      }
    });
  }

  initRocketLeagueWebsocket = () => {
    this.wsClient = new WebSocket("ws://" + this.rocketLeagueHostname);

    this.wsClient.onopen = () => {
        success.wb("Connected to Rocket League on " + this.rocketLeagueHostname);
    }

    // Callback to process every message sent on the websocket
    this.wsClient.on("message", (d) => {
      try {
        const { event, data } = JSON.parse(d);

        /* List of SOS Events:
        *  match_created, initialized, pre_countdown_begin, post_countdown_begin
        *  update_state, statfeed_event, goal_scored, replay_start, replay_will_end
        *  replay_end, match_ended, podium_start, match_destroyed
        */
          switch(event) {
          case "game:initialized":
            this.updateScene("Match", 0);
            break;
          case "game:update_state":
            this.gamestate = data;
            break;
          case "game:goal_scored":
            this.goal_scored(data);
            break;
          case "game:replay_will_end":
            this.replay_will_end();
            break;
          case "game:replay_end":
            this.replay_end();
            break;
          case "game:match_ended":
            this.match_ended(data);
            break;
          case "game:podium_start":
            this.updateScene("End Match", 4250);
            break;
          case "game:match_destroyed":
            this.updateScene("Intermission", 0);
            break;
          default:
            // Events not needed
        }
      }
      catch(e) {
        error.wb(e);
      }
    });

    this.wsClient.on("error", (err) => {
      if(err && err.code === "ECONNREFUSED"){
        this.initRocketLeagueWebsocket();
        warn.wb("Rocket League WebSocket Server Closed. Attempting to reconnect");
      }
      else {
        error.wb(`Error connecting to Rocket League on host "` +
        `${this.rocketLeagueHostname}"\nIs the plugin loaded into ` +
        `Rocket League? Run the command "plugin load sos" from the ` +
        `BakkesMod console to make sure`);
      }
    });
  }

  // Processing a goal that is scored and changing scene to the team that scored
  goal_scored = (data) => {
    const teamNum = this.gamestate.players[data.scorer.id].team; //0 = left, 1 = right
    const teamObject = this.gamestate.game.teams[teamNum];
    const teamName = _.capitalize(teamObject.name);

    this.updateScene(teamName, 1600);
  }

  // When the goal is scored in the replay, the replay_will_end event is fired
  // This allows us to have a nice transition beack to the match after the replay ends
  replay_will_end = () => {
    this.replayWillEnd = true;

    // Zero second goal is scored or game is in Overtime, we don"t want this scene
    if (this.gamestate.game.time !== 0 && !this.gamestate.game.isOT) {
      this.updateScene("Match", 1250);
    }
  }

  /**
   * @function replay_end
   * @description 
   * 
   * @param {Object} data - 
   */
  replay_end = () => {
    // If the replay is skipped by everyone, this returns the scene back to the match
    if (!this.replayWillEnd) {
      this.updateScene("Match", 0);
    }
    this.replayWillEnd = false;
  }

  // Gets the winning team and changes the scene to the proper winning scene
  match_ended = (data) => {
    const teamObject = this.gamestate.game.teams[data.winner_team_num];
    const winTeamScene = _.capitalize(teamObject.name) + " Win";
    
    this.updateScene(winTeamScene, 0);
  }

  updateScene = (sceneName, sceneDelay) => {
    if(this.sceneList.includes(sceneName)){
      setTimeout(() => { 
        this.obsClient.send("SetCurrentScene", {
          "scene-name": sceneName
        });
      }, sceneDelay);
    }
    else {
      warn.wb("Scene does not exist in OBS: " + sceneName);
    }
  }
}

// Main entry of the application
const app = new App();
app.init();