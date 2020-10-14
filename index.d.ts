declare interface Team {
  name: string;
  score: number;
}

declare interface Game {
  ballSpeed: number;
  ballTeam: number;
  ballX: number;
  ballY: number;
  ballZ: number;
  hasTarget: boolean;
  hasWinner: boolean;
  itOT: boolean;
  isReplay: boolean;
  target: string;
  teams: Team[];
  time: number;
  winner: string;
}

declare interface Player {
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

declare interface Players {
  [key: string]: Player
}

declare interface GameState {
  event: string;
  game: Game
  hasGame: boolean;
  players: Players;
}