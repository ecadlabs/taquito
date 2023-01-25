export enum GameStatusStanding {
  ONGOING = 'ongoing',
  ENDED = 'ended',
}

export enum GamePlayerResult {
  LOSER = 'loser',
  DRAW = 'draw',
}

export enum GameResultReason {
  CONFLICT_RESOLVED = 'conflict_resolved',
  TIMEOUT = 'timeout',
}

export interface GameResultDraw {
  kind: GamePlayerResult.DRAW;
}

export interface GameResultLose {
  kind: GamePlayerResult.LOSER;
  reason: GameResultReason.CONFLICT_RESOLVED | GameResultReason.TIMEOUT;
  player: string;
}
