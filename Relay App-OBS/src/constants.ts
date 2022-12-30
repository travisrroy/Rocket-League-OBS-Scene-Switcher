export enum GameStateEvent {
  Initialized = "game:initialized",
  UpdateState = "game:update_state",
  GoalScored = "game:goal_scored",
  ReplayWillEnd = "game:replay_will_end",
  ReplayEnd = "game:replay_end",
  MatchEnded = "game:match_ended",
  PodiumStart = "game:podium_start",
  MatchDestroyed = "game:match_destroyed"
}