"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket = require("ws");
var OBSWebSocket = require("obs-websocket-js");
var _a = require("cli-msg"), success = _a.success, error = _a.error, warn = _a.warn;
var _ = require("lodash");
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        this.init = function () {
            _this.initOBSWebSocket();
            _this.initRocketLeagueWebsocket();
        };
        this.initOBSWebSocket = function () {
            _this.obsClient = new OBSWebSocket();
            _this.obsClient.connect({
                address: _this.OBSHostname,
            })
                .then(function () {
                var _a;
                success.wb("Connected to OBS on " + _this.OBSHostname);
                return (_a = _this.obsClient) === null || _a === void 0 ? void 0 : _a.send("GetSceneList");
            })
                .then(function (data) {
                data.scenes.map(function (scene) {
                    _this.sceneList.push(scene.name);
                });
            })
                .catch(function (err) {
                //console.log(err);
                if (err.code === "CONNECTION_ERROR") {
                    error.wb("Fatal error occurred: " + err.description);
                }
            });
            // You must add this handler to avoid uncaught exceptions.
            // this.obsClient.on("error", (err) => {
            //   if(err && err.code === "CONNECTION_ERROR"){
            //     this.initOBSWebSocket();
            //     warn.wb("OBS WebSocket Server Closed. Attempting to reconnect");
            //   }
            //   else {
            //     error.wb("OBS websocket error:", err);
            //   }
            // });
            _this.obsClient.on("ConnectionClosed", function () {
                _this.initOBSWebSocket();
                warn.wb("OBS WebSocket Server Closed. Attempting to reconnect");
            });
        };
        this.initRocketLeagueWebsocket = function () {
            _this.wsClient = new WebSocket("ws://" + _this.rocketLeagueHostname);
            _this.wsClient.onopen = function () {
                success.wb("Connected to Rocket League on " + _this.rocketLeagueHostname);
            };
            // Callback to process every message sent on the websocket
            _this.wsClient.on("message", function (d) {
                try {
                    var _a = JSON.parse(d), event_1 = _a.event, data = _a.data;
                    /* List of SOS Events:
                    *  match_created, initialized, pre_countdown_begin, post_countdown_begin
                    *  update_state, statfeed_event, goal_scored, replay_start, replay_will_end
                    *  replay_end, match_ended, podium_start, match_destroyed
                    */
                    switch (event_1) {
                        case "game:initialized":
                            _this.updateScene("Match", 0);
                            break;
                        case "game:update_state":
                            _this.gameState = data;
                            break;
                        case "game:goal_scored":
                            _this.goal_scored(data);
                            break;
                        case "game:replay_will_end":
                            _this.replay_will_end();
                            break;
                        case "game:replay_end":
                            _this.replay_end();
                            break;
                        case "game:match_ended":
                            _this.match_ended(data);
                            break;
                        case "game:podium_start":
                            _this.updateScene("End Match", 4250);
                            break;
                        case "game:match_destroyed":
                            _this.updateScene("Intermission", 0);
                            break;
                        default:
                        // Events not needed
                    }
                }
                catch (e) {
                    error.wb(e);
                }
            });
            _this.wsClient.on("error", function (err) {
                console.log(err);
                if ((err === null || err === void 0 ? void 0 : err.name) === "ECONNREFUSED") {
                    _this.initRocketLeagueWebsocket();
                    warn.wb("Rocket League WebSocket Server Closed. Attempting to reconnect");
                }
                else {
                    error.wb("Error connecting to Rocket League on host \"" +
                        (_this.rocketLeagueHostname + "\"\nIs the plugin loaded into ") +
                        "Rocket League? Run the command \"plugin load sos\" from the " +
                        "BakkesMod console to make sure");
                }
            });
        };
        // Processing a goal that is scored and changing scene to the team that scored
        this.goal_scored = function (data) {
            var _a;
            var teamnum = data.scorer.teamnum; //0 = left, 1 = right
            var teamObject = (_a = _this.gameState.game) === null || _a === void 0 ? void 0 : _a.teams[teamnum];
            var teamName = _.capitalize(teamObject === null || teamObject === void 0 ? void 0 : teamObject.name);
            _this.updateScene(teamName, 1600);
        };
        // When the goal is scored in the replay, the replay_will_end event is fired
        // This allows us to have a nice transition beack to the match after the replay ends
        this.replay_will_end = function () {
            var _a, _b;
            _this.replayWillEnd = true;
            // Zero second goal is scored or game is in Overtime, we don"t want this scene
            if (((_a = _this.gameState.game) === null || _a === void 0 ? void 0 : _a.time) !== 0 && !((_b = _this.gameState.game) === null || _b === void 0 ? void 0 : _b.isOT)) {
                _this.updateScene("Match", 1250);
            }
        };
        this.replay_end = function () {
            // If the replay is skipped by everyone, this returns the scene back to the match
            if (!_this.replayWillEnd) {
                _this.updateScene("Match", 0);
            }
            _this.replayWillEnd = false;
        };
        // Gets the winning team and changes the scene to the proper winning scene
        this.match_ended = function (data) {
            var _a;
            var teamObject = (_a = _this.gameState.game) === null || _a === void 0 ? void 0 : _a.teams[data.winner_team_num];
            var winTeamScene = _.capitalize(teamObject === null || teamObject === void 0 ? void 0 : teamObject.name) + " Win";
            _this.updateScene(winTeamScene, 0);
        };
        this.updateScene = function (sceneName, sceneDelay) {
            if (_this.sceneList.includes(sceneName)) {
                setTimeout(function () {
                    var _a;
                    (_a = _this.obsClient) === null || _a === void 0 ? void 0 : _a.send("SetCurrentScene", {
                        "scene-name": sceneName
                    });
                }, sceneDelay);
            }
            else {
                warn.wb("Scene does not exist in OBS: " + sceneName);
            }
        };
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
    return App;
}());
// Main entry of the application
var app = new App();
app.init();
exports.default = App;
