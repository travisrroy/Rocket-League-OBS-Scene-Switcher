export interface Team {
    name: string;
    score: number;
}
export interface Game {
    ballSpeed: number;
    ballTeam: number;
    ballX: number;
    ballY: number;
    ballZ: number;
    hasTarget: boolean;
    hasWinner: boolean;
    isOT: boolean;
    isReplay: boolean;
    target: string;
    teams: Team[];
    time: number;
    winner: string;
}
export interface Player {
    assists: number;
    attacker: string;
    boost: number;
    cartouches: number;
    demos: number;
    goals: number;
    hasCar: boolean;
    id: string;
    isDead: boolean;
    isPowersliding: boolean;
    /**
     * Is the player supersonic?
     */
    isSonic: boolean;
    name: string;
    onGround: boolean;
    onWall: boolean;
    pitch: number;
    primaryID: string;
    roll: number;
    saves: number;
    score: number;
    shortcut: number;
    shots: number;
    speed: number;
    team: number;
    touches: number;
    x: number;
    y: number;
    yaw: number;
    z: number;
}
export interface Players {
    [key: string]: Player;
}
export interface GameState {
    event?: string;
    game?: Game;
    hasGame?: boolean;
    players?: Players;
}
export interface Scorer {
    id: string;
    name: string;
    teamnum: number;
}
export interface BallLastTouch {
    player: string;
    speed: number;
}
export interface ImpactLocation {
    X: number;
    Y: number;
}
export interface GoalScored {
    ball_last_touch: BallLastTouch;
    goalspeed: number;
    impact_location: ImpactLocation;
    scorer: Scorer;
}
export interface MatchEnded {
    winner_team_num: number;
}
export interface Connections {
    OBSHostname: string;
    OBSAuth: string;
    RocketLeagueHostname: string;
}
export interface Scenes {
    initialized: string;
    goal_scored: string;
    replay_will_end: string;
    replay_end: string;
    match_ended: string;
    podium_start: string;
    match_destroyed: string;
}
export interface Delays {
    initialized: number;
    goal_scored: number;
    replay_will_end: number;
    replay_end: number;
    match_ended: number;
    podium_start: number;
    match_destroyed: number;
}
export interface Enable {
    initialized: boolean;
    goal_scored: boolean;
    replay_will_end: boolean;
    replay_end: boolean;
    match_ended: boolean;
    podium_start: boolean;
    match_destroyed: boolean;
}
export interface Config {
    connections: Connections;
    scenes: Scenes;
    delays: Delays;
    enable: Enable;
}
