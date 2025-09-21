import { SIZE } from './constants'
import type { Board, Coord, Disc, Move, Player } from './types'

const directions: Coord[] = [
  { row: -1, col: 0 },
  { row: -1, col: 1 },
  { row: 0, col: 1 },
  { row: 1, col: 1 },
  { row: 1, col: 0 },
  { row: 1, col: -1 },
  { row: 0, col: -1 },
  { row: -1, col: -1 },
]

export function createInitialBoard(): Board {
  const board: Board = Array.from({ length: SIZE }, () => Array<Disc>(SIZE).fill(null))
  const mid = SIZE / 2
  board[mid - 1][mid - 1] = 'W'
  board[mid][mid] = 'W'
  board[mid - 1][mid] = 'B'
  board[mid][mid - 1] = 'B'
  return board
}

export function inBounds({ row, col }: Coord): boolean {
  return row >= 0 && col >= 0 && row < SIZE && col < SIZE
}

export function opposite(p: Player): Player {
  return p === 'B' ? 'W' : 'B'
}

export function cloneBoard(board: Board): Board {
  return board.map((r) => r.slice())
}

function traceDirection(board: Board, from: Coord, dir: Coord, player: Player): Coord[] {
  const flips: Coord[] = []
  let r = from.row + dir.row
  let c = from.col + dir.col
  while (inBounds({ row: r, col: c })) {
    const v = board[r][c]
    if (v === null) return []
    if (v === player) return flips.length > 0 ? flips : []
    flips.push({ row: r, col: c })
    r += dir.row
    c += dir.col
  }
  return []
}

export function getValidMoves(board: Board, player: Player): Move[] {
  const moves: Move[] = []
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board[row][col] !== null) continue
      let allFlips: Coord[] = []
      for (const d of directions) {
        const flips = traceDirection(board, { row, col }, d, player)
        if (flips.length) allFlips = allFlips.concat(flips)
      }
      if (allFlips.length) moves.push({ row, col, flips: allFlips })
    }
  }
  return moves
}

export function applyMove(board: Board, move: Move, player: Player): Board {
  const next = cloneBoard(board)
  next[move.row][move.col] = player
  for (const f of move.flips) next[f.row][f.col] = player
  return next
}

export function hasAnyValidMoves(board: Board, player: Player): boolean {
  return getValidMoves(board, player).length > 0
}

export function countDiscs(board: Board): { black: number; white: number } {
  let black = 0,
    white = 0
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 'B') black++
      else if (board[r][c] === 'W') white++
    }
  }
  return { black, white }
}

export function isGameOver(board: Board): boolean {
  return !hasAnyValidMoves(board, 'B') && !hasAnyValidMoves(board, 'W')
}

