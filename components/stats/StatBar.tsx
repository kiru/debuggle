import {GameStats} from "../../lib/types";
import {sumTogether} from "../../lib/commons";

export const TOTAL_TRIES_TEXT = 'Total tries'
export const SUCCESS_RATE_TEXT = 'Success rate'
export const CURRENT_STREAK_TEXT = 'Current streak'
export const BEST_STREAK_TEXT = 'Best streak'

type Props = {
  gameStats: GameStats
}

const StatItem = ({
  label,
  value,
}: {
  label: string
  value: string | number
}) => {
  return (
    <div className="items-center justify-center m-1 w-1/4 dark:text-white">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-xs">{label}</div>
    </div>
  )
}

export const StatBar = ({ gameStats }: Props) => {
  function getAverage() {
    if(gameStats.timings.length == 0){
      return (0).toFixed(2);
    }

    let avg = sumTogether(gameStats.timings.map(each => each.tries)) / gameStats.timings.length;

    return (avg / 1000).toFixed(2);
  }

  return (
    <div className="flex justify-center my-2">
      <StatItem label={TOTAL_TRIES_TEXT} value={gameStats.timings.length} />
      <StatItem label="Average" value={`${(getAverage())}`}/>
      <StatItem label={CURRENT_STREAK_TEXT} value={gameStats.currentStreak} />
      <StatItem label={BEST_STREAK_TEXT} value={gameStats.bestStreak} />
    </div>
  )
}
