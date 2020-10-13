const WebSocket = require('ws');
const OBSWebSocket = require('obs-websocket-js');
const { success, error, warn, info, log, indent } = require('cli-msg');
const _ = require("lodash");

function app() {
  /**
   * Rocket League WebSocket client
   * @type {WebSocket}
   */

  const rocketLeagueHostname = 'localhost:49122'
  const OBSHostname = 'localhost:4444'

  let wsClient;
  let obsClient;
  let sceneList = [];

  let gamestate = {};
  let replayWillEnd = false;

  initOBSWebSocket(OBSHostname);
  initRocketLeagueWebsocket(rocketLeagueHostname);

  setInterval(function () {
    if (!obsClient._connected) {
        warn.wb("OBS WebSocket Server Closed. Attempting to reconnect");
        initOBSWebSocket(OBSHostname);
    }
  }, 10000);

  setInterval(function () {
      if (wsClient.readyState === WebSocket.CLOSED) {
          warn.wb("Rocket League WebSocket Server Closed. Attempting to reconnect");
          initRocketLeagueWebsocket(rocketLeagueHostname);
      }
  }, 10000);

  function initOBSWebSocket(OBSHostname) {
    obsClient = new OBSWebSocket();

    obsClient.connect({
      address: OBSHostname,
    })
    .then(() => {
      success.wb("Connected to OBS on " + OBSHostname);

      return obsClient.send('GetSceneList');
    })
    .then((data) => {
      data.scenes.map((scene) => {
        sceneList.push(scene.name)
      });
    })
    .catch(err => { // Promise convention dicates you have a catch on every chain.
      //console.log(err);
    });
  }

  function initRocketLeagueWebsocket(rocketLeagueHostname) {
      wsClient = new WebSocket("ws://" + rocketLeagueHostname);

      wsClient.onopen = function open() {
          success.wb("Connected to Rocket League on " + rocketLeagueHostname);
      }

      wsClient.on("message", (d) => {
        try {
          const { event, data } = JSON.parse(d);

          /* List of SOS Events:
          *  match_created, initialized, pre_countdown_begin, post_countdown_begin
          *  update_state, statfeed_event, goal_scored, replay_start, replay_will_end
          *  replay_end, match_ended, podium_start, match_destroyed
          */
            switch(event) {
            case "game:initialized":
              updateScene("Match", 0);
              break;
            case "game:update_state":
              update_state(data);
              break;
            case "game:goal_scored":
              goal_scored(data);
              break;
            case "game:replay_will_end":
              replay_will_end();
              break;
            case "game:replay_end":
              replay_end();
              break;
            case "game:match_ended":
              match_ended(data);
              break;
            case "game:podium_start":
              updateScene("End Match", 4250);
              break;
            case "game:match_destroyed":
              updateScene("Intermission", 0);
              break;
            default:
              // Events not needed
          }
        }
        catch(e) {
          error.wb(e);
        }
      });

      wsClient.onerror = function (err) {
        error.wb(`Error connecting to Rocket League on host "${rocketLeagueHostname}"\nIs the plugin loaded into Rocket League? Run the command "plugin load sos" from the BakkesMod console to make sure`);
    };
  }

  // Updating gamestate data to latest from server
  function update_state(data) {
    gamestate = data;
  }

  function goal_scored(data) {
    const teamNum = gamestate.players[data.scorer.id].team; //0 = left, 1 = right
    const teamObject = gamestate.game.teams[teamNum];
    const teamName = _.capitalize(teamObject.name);

    updateScene(teamName, 1600);
  }

  function replay_will_end() {
    replayWillEnd = true;

    // Zero second goal is scored or game is in Overtime, we don't want this scene
    if (gamestate.game.time !== 0 && !gamestate.game.isOT) {
      updateScene("Match", 1250);
    }
  }

  function replay_end() {
    if (!replayWillEnd) {
      updateScene("Match", 0);
    }
    replayWillEnd = false;
  }

  function match_ended(data) {
    const teamObject = gamestate.game.teams[data.winner_team_num];
    const winTeamScene = _.capitalize(teamObject.name) + " Win";
    
    updateScene(winTeamScene, 0);
  }

  function updateScene(sceneName, sceneDelay) {
    if(sceneList.includes(sceneName)){
      setTimeout(() => { 
        obsClient.send('SetCurrentScene', {
          'scene-name': sceneName
        });
      }, sceneDelay);
    }
    else {
      warn.wb("Scene does not exist in OBS: " + sceneName);
    }
  }
}

// Main entry of the application
app();