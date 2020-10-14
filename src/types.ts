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
  [key: string]: Player
}

export interface GameState {
  event?: string;
  game?: Game
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