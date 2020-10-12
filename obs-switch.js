const WebSocket = require('ws');
const OBSWebSocket = require('obs-websocket-js');
const prompt = require('prompt');
const { success, error, warn, info, log, indent } = require('cli-msg');
const atob = require('atob');
const _ = require("lodash");

prompt.get([
    {
        message: "Port number for this websocket server",
        name: 'port',
        required: true,
        default: "49322",
    },
    {
        message: "Hostname:Port that Rocket League is running on",
        name: 'rocketLeagueHostname',
        required: true,
        default: "localhost:49122"
    }
], function (e, r) {
    /**
     * Rocket League WebSocket client
     * @type {WebSocket}
     */
    let wsClient;
    let obsClient;
    let gamestate = {};

    initOBSWebSocket();
    initRocketLeagueWebsocket(r.rocketLeagueHostname);

    setInterval(function () {
       if (wsClient.readyState === WebSocket.CLOSED) {
           warn.wb("Rocket League WebSocket Server Closed. Attempting to reconnect");
           initRocketLeagueWebsocket(r.rocketLeagueHostname);
       }
    }, 10000);

    function initOBSWebSocket() {
      obsClient = new OBSWebSocket();
      obsClient.connect({
        address: 'localhost:4444',
      })
      .then(() => {
          console.log(`Success! We're connected & authenticated.`);
      })
      .catch(err => { // Promise convention dicates you have a catch on every chain.
        console.log(err);
    });
    }

    function initRocketLeagueWebsocket(rocketLeagueHostname) {
        wsClient = new WebSocket("ws://"+rocketLeagueHostname);

        wsClient.onopen = function open() {
            success.wb("Connected to Rocket League on "+rocketLeagueHostname);
        }

        wsClient.on("message", (d) => {
          const { event, data } = JSON.parse(d);
          if (event === "game:update_state") {
            gamestate = data;
          }
          else if (event === "game:goal_scored") {
            const teamNum = gamestate.players[data.scorer.id].team; //0 = left, 1 = right
            const teamObject = gamestate.game.teams[teamNum];

            const teamName = _.capitalize(teamObject.name);
            console.log(teamName);

            obsClient.send('SetCurrentTransition', {
              'transition-name': teamName
            });

            setTimeout(() => { 
              obsClient.send('SetCurrentScene', {
                'scene-name': teamName
              });
            }, 1250);
          }
          else if (event === "game:replay_will_end") {
            obsClient.send('SetCurrentTransition', {
              'transition-name': "Frontline_Fade"
            });

            setTimeout(() => { 
              obsClient.send('SetCurrentScene', {
                'scene-name': "Rocket League"
              });
             }, 1000);
          }
          else {
            //console.log(event);
          }
        });

        wsClient.onerror = function (err) {
          error.wb(`Error connecting to Rocket League on host "${rocketLeagueHostname}"\nIs the plugin loaded into Rocket League? Run the command "plugin load sos" from the BakkesMod console to make sure`);
      };
    }
});