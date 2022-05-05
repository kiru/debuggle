import {GameStats, StatsTiming} from "./types";

export const addStatsForCompletedGame = (
  gameStats: GameStats,
  gameId:number,
  tries: number
): GameStats => {
  // Count is number of incorrect guesses before end.
  const stats = { ...gameStats }

  let highestGameId = Math.max(...stats.timings.map(each => each.gameId))

  let time: StatsTiming = {
    tries: tries,
    gameId: gameId
  }
  stats.timings = [...stats.timings, time]

  // this is the next game?
  if(stats.currentStreak == 0){
    stats.currentStreak += 1
  }

  if(gameId == (highestGameId+1)){
    stats.currentStreak += 1
  }else{
    stats.currentStreak = 1
  }

  if(stats.currentStreak >= stats.bestStreak){
    stats.bestStreak = stats.currentStreak;
  }
  return stats
}

export const defaultStats: GameStats = {
  timings: [],
  currentStreak: 0,
  bestStreak: 0,
}

