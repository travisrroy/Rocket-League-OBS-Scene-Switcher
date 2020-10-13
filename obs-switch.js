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

          switch(event) {
            case "game:match_created":
              break;
            case "game:initialized":
              updateTransitionScene("Frontline_Slam", "Rocket League", 0);
              break;
            case "game:pre_countdown_begin":
              break;
            case "game:post_countdown_begin":
              break;
            case "game:update_state":
              update_state(data);
              break;
            case "game:statfeed_event":
              break;
            case "game:goal_scored":
              goal_scored(data);
              break;
            case "game:replay_start":
              break;
            case "game:replay_will_end":
              replay_will_end();
              break;
            case "game:replay_end":
              replay_end();
              break;
            case "game:match_ended":
              //console.log(data);
              break;
            case "game:podium_start":
              updateTransitionScene("Frontline_Slam", "Stinger", 4250);
              break;
            case "game:match_destroyed":
              updateTransitionScene("Frontline_Slam", "Intermission", 0);
              break;
            default:
              // Event handler not needed
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

  // 
  function goal_scored(data) {
    const teamNum = gamestate.players[data.scorer.id].team; //0 = left, 1 = right
    const teamObject = gamestate.game.teams[teamNum];
    const teamName = _.capitalize(teamObject.name);

    updateTransitionScene(teamName, teamName, 1600);
  }

  function replay_will_end() {
    replayWillEnd = true;
    updateTransitionScene("Frontline_Fade", "Rocket League", 1250);
  }

  function replay_end() {
    if (!replayWillEnd) {
      updateTransitionScene("Cut", "Rocket League", 0);
    }
    replayWillEnd = false;
  }

  function updateTransitionScene(transitionName, sceneName, sceneDelay) {
    obsClient.send('SetCurrentTransition', {
      'transition-name': transitionName
    });

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

app();