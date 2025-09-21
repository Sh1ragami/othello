import type { Board, Move, Player } from '@game/types'

export interface Engine {
  id: string
  name: string
  isHuman: boolean
  selectMove(
    board: Board,
    player: Player,
    validMoves: Move[]
  ): Promise<Move | null>
}

