import type { Engine } from './types'
import type { Board, Move, Player } from '@game/types'

// Human engine: returns null; UI handles click.
export const HumanEngine: Engine = {
  id: 'human',
  name: 'Human',
  isHuman: true,
  async selectMove(_board: Board, _player: Player, _valid: Move[]) {
    return null
  },
}

