export interface Settings {
  firstExplanation: boolean,
  hardCore: boolean,
  hideZero: boolean,
}

export interface GameState {
  gameId: number;
  guessedWords: string[];
  gameEnded: boolean;
}

export type StatsTiming = {
  gameId: number;
  tries: number;
}

export type GameStats = {
  timings: StatsTiming[]
  currentStreak: number
  bestStreak: number
}

