import React from 'react'
import Cell from './Cell'
import type { Board, Move, Coord } from '@game/types'
import { SIZE } from '@game/constants'

type Props = {
  board: Board
  validMoves: Move[]
  interactive: boolean
  onPlay: (move: Move) => void
  boardRef?: React.Ref<HTMLDivElement>
  lastBlack?: Coord | null
  lastWhite?: Coord | null
}

export default function BoardView({ board, validMoves, interactive, onPlay, boardRef, lastBlack, lastWhite }: Props) {
  const hintMap = React.useMemo(() => {
    const map = new Set(validMoves.map((m) => `${m.row}:${m.col}`))
    return map
  }, [validMoves])

  return (
    <div className="board" ref={boardRef}>
      {Array.from({ length: SIZE }).map((_, r) =>
        Array.from({ length: SIZE }).map((__, c) => {
          const value = board[r][c]
          const key = `${r}-${c}`
          const showHint = hintMap.has(`${r}:${c}`)
          const move = validMoves.find((m) => m.row === r && m.col === c)
          const isLastBlack = !!lastBlack && lastBlack.row === r && lastBlack.col === c
          const isLastWhite = !!lastWhite && lastWhite.row === r && lastWhite.col === c
          return (
            <Cell
              key={key}
              row={r}
              col={c}
              value={value}
              showHint={interactive && showHint}
              disabled={!interactive || (!showHint && value === null)}
              onClick={move ? () => onPlay(move) : undefined}
              isLastBlack={isLastBlack}
              isLastWhite={isLastWhite}
            />
          )
        })
      )}
    </div>
  )
}
