"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket = require("ws");
var OBSWebSocket = require("obs-websocket-js");
var fsNode = __importStar(require("fs"));
var path_1 = __importDefault(require("path"));
var _a = require("cli-msg"), success = _a.success, error = _a.error, warn = _a.warn;
var _ = require("lodash");
var fs = fsNode.promises;
var configPath = path_1.default.resolve(".", "./configuration.json");
// https://regex101.com/r/X9YMp2/1
var parseVariableName = function (configVal, replaceVal, replaceKey) {
    if (replaceKey === void 0) { replaceKey = "teamName"; }
    var re = new RegExp("{" + replaceKey + "}");
    return configVal.replace(re, replaceVal);
};
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        this.init = function () {
            warn.wb("Please ensure that you have set the configuration with the configuration tool!");
            _this.initOBSWebSocket();
            _this.initRocketLeagueWebsocket();
        };
        this.initOBSWebSocket = function () {
            _this.obsClient = new OBSWebSocket();
            _this.obsClient.connect({
                address: _this.OBSHostname,
                password: _this.OBSAuth
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
                if (err.code !== "CONNECTION_ERROR") {
                    error.wb("Fatal error occurred: " + err.description);
                }
            });
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
                            if (_this.config.enable.initialized)
                                _this.updateScene(_this.config.scenes.initialized, _this.config.delays.initialized);
                            break;
                        case "game:update_state":
                            _this.update_state(data);
                            break;
                        case "game:goal_scored":
                            if (_this.config.enable.goal_scored)
                                _this.goal_scored(data);
                            break;
                        case "game:replay_will_end":
                            if (_this.config.enable.replay_will_end)
                                _this.replay_will_end();
                            break;
                        case "game:replay_end":
                            if (_this.config.enable.replay_end)
                                _this.replay_end();
                            break;
                        case "game:match_ended":
                            if (_this.config.enable.match_ended)
                                _this.match_ended(data);
                            break;
                        case "game:podium_start":
                            if (_this.config.enable.podium_start)
                                _this.updateScene(_this.config.scenes.podium_start, _this.config.delays.podium_start);
                            break;
                        case "game:match_destroyed":
                            if (_this.config.enable.match_destroyed)
                                _this.updateScene(_this.config.scenes.match_destroyed, _this.config.delays.match_destroyed);
                            break;
                        default:
                        // Events not needed
                    }
                }
                catch (e) {
                    error.wb(e);
                }
            });
            _this.wsClient.on("close", function () {
                var _a;
                if (((_a = _this.wsClient) === null || _a === void 0 ? void 0 : _a.readyState) === WebSocket.CLOSED) {
                    _this.initRocketLeagueWebsocket();
                    warn.wb("Rocket League WebSocket Server Closed. Attempting to reconnect");
                }
            });
            _this.wsClient.on("error", function () {
                _this.initRocketLeagueWebsocket();
                error.wb("Error connecting to Rocket League on host \"" +
                    (_this.rocketLeagueHostname + "\"\nIs the plugin loaded into ") +
                    "Rocket League? Run the command \"plugin load sos\" from the " +
                    "BakkesMod console to make sure");
            });
        };
        this.update_state = function (data) {
            _this.gameState = data;
            if (new Date().getTime() - _this.lastUpdate >= 2500) {
                _this.read_config();
            }
        };
        this.read_config = function () { return __awaiter(_this, void 0, void 0, function () {
            var rawData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs.readFile(configPath, "utf-8")];
                    case 1:
                        rawData = _a.sent();
                        this.config = JSON.parse(rawData);
                        return [2 /*return*/];
                }
            });
        }); };
        // Processing a goal that is scored and changing scene to the team that scored
        this.goal_scored = function (data) {
            var _a;
            var teamnum = data.scorer.teamnum; //0 = left, 1 = right
            var teamObject = (_a = _this.gameState.game) === null || _a === void 0 ? void 0 : _a.teams[teamnum];
            var teamName = _.capitalize(teamObject === null || teamObject === void 0 ? void 0 : teamObject.name);
            var scene = parseVariableName(_this.config.scenes.goal_scored, teamName);
            _this.updateScene(scene, _this.config.delays.goal_scored);
        };
        // When the goal is scored in the replay, the replay_will_end event is fired
        // This allows us to have a nice transition beack to the match after the replay ends
        this.replay_will_end = function () {
            var _a, _b;
            _this.replayWillEnd = true;
            // Zero second goal is scored or game is in Overtime, we don"t want this scene
            if (((_a = _this.gameState.game) === null || _a === void 0 ? void 0 : _a.time) !== 0 && !((_b = _this.gameState.game) === null || _b === void 0 ? void 0 : _b.isOT)) {
                _this.updateScene(_this.config.scenes.replay_will_end, _this.config.delays.replay_will_end);
            }
        };
        this.replay_end = function () {
            // If the replay is skipped by everyone, this returns the scene back to the match
            if (!_this.replayWillEnd) {
                _this.updateScene(_this.config.scenes.replay_end, _this.config.delays.replay_end);
            }
            _this.replayWillEnd = false;
        };
        // Gets the winning team and changes the scene to the proper winning scene
        this.match_ended = function (data) {
            var _a;
            var teamObject = (_a = _this.gameState.game) === null || _a === void 0 ? void 0 : _a.teams[data.winner_team_num];
            var teamName = _.capitalize(teamObject === null || teamObject === void 0 ? void 0 : teamObject.name);
            var scene = parseVariableName(_this.config.scenes.match_ended, teamName);
            _this.updateScene(scene, _this.config.delays.match_ended);
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
        try {
            // Read from JSON
            this.config = JSON.parse(fsNode.readFileSync(configPath, "utf-8"));
        }
        catch (e) {
            error.wb(e);
            process.exit(1);
        }
        // OBS Websocket
        this.OBSHostname = this.config.connections.OBSHostname;
        this.OBSAuth = this.config.connections.OBSAuth;
        this.sceneList = [];
        this.obsClient = null;
        // Rocket League SOS Websocket
        this.rocketLeagueHostname = this.config.connections.RocketLeagueHostname;
        this.wsClient = null;
        this.gameState = {};
        this.replayWillEnd = false;
        this.lastUpdate = new Date().getTime();
    }
    return App;
}());
// Main entry of the application
var app = new App();
app.init();
exports.default = App;
