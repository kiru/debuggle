import {string} from "prop-types";

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

export type GameStats = {
  tries: number[]
  currentStreak: number
  bestStreak: number
}

