import {StatBar} from '../stats/StatBar'
import {BaseModal} from './BaseModal'
import {GameStats} from "../../lib/types";

type Props = {
  isOpen: boolean
  handleClose: () => void
  gameStats: GameStats
}

export const StatsModal = ({isOpen, handleClose, gameStats,}: Props) => {
  return (
    <BaseModal
      title={"Statistics"}
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <StatBar gameStats={gameStats}/>
    </BaseModal>
  )
}
