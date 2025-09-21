import type { Engine } from './types'
import type { Board, Move, Player } from '@game/types'
import { getValidMoves, applyMove, opposite, isGameOver, countDiscs } from '@game/logic'
import { evaluateBoard } from '@game/eval'

type TTEntry = { depth: number; score: number; best?: Move }

const CORNERS = new Set(['0:0', '0:7', '7:0', '7:7'])

function keyOf(board: Board, player: Player): string {
  let s = player
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const v = board[r][c]
      s += v ? v : '-'
    }
  }
  return s
}

function terminalScore(board: Board, player: Player): number {
  const { black, white } = countDiscs(board)
  if (black === white) return 0
  const winner: Player = black > white ? 'B' : 'W'
  // Large margin at terminal to prefer actual wins over eval
  const margin = Math.abs(black - white)
  const base = 100000 + margin
  return winner === 'B' ? (player === 'B' ? base : -base) : (player === 'W' ? base : -base)
}

function evalFor(board: Board, player: Player): number {
  const e = evaluateBoard(board) // positive if Black is better
  return player === 'B' ? e : -e
}

function orderMoves(moves: Move[]): Move[] {
  return moves
    .slice()
    .sort((a, b) => {
      const aCorner = CORNERS.has(`${a.row}:${a.col}`) ? 1 : 0
      const bCorner = CORNERS.has(`${b.row}:${b.col}`) ? 1 : 0
      if (aCorner !== bCorner) return bCorner - aCorner
      return b.flips.length - a.flips.length
    })
}

async function search(
  board: Board,
  player: Player,
  depth: number,
  alpha: number,
  beta: number,
  deadline: number,
  tt: Map<string, TTEntry>
): Promise<{ score: number; best?: Move }> {
  // Time check
  if (Date.now() > deadline) {
    return { score: evalFor(board, player) }
  }

  const k = keyOf(board, player)
  const cached = tt.get(k)
  if (cached && cached.depth >= depth) {
    return { score: cached.score, best: cached.best }
  }

  if (depth === 0) {
    const score = evalFor(board, player)
    return { score }
  }

  if (isGameOver(board)) {
    const score = terminalScore(board, player)
    return { score }
  }

  const moves = getValidMoves(board, player)
  if (moves.length === 0) {
    // Pass turn
    const res = await search(board, opposite(player), depth - 1, -beta, -alpha, deadline, tt)
    return { score: -res.score }
  }

  let best: Move | undefined
  let bestScore = -Infinity
  for (const m of orderMoves(moves)) {
    const next = applyMove(board, m, player)
    const res = await search(next, opposite(player), depth - 1, -beta, -alpha, deadline, tt)
    const score = -res.score
    if (score > bestScore) {
      bestScore = score
      best = m
    }
    if (score > alpha) alpha = score
    if (alpha >= beta) break // alpha-beta cut
    // Time check mid-loop
    if (Date.now() > deadline) break
  }

  const out = { score: bestScore, best }
  tt.set(k, { depth, score: bestScore, best })
  return out
}

export const MinimaxEngine: Engine = {
  id: 'minimax',
  name: 'minimax（強）',
  isHuman: false,
  async selectMove(board: Board, player: Player, valid: Move[]): Promise<Move | null> {
    if (valid.length === 0) return null

    // Iterative deepening within a soft time budget
    const timeMs = 800 // budget per move
    const deadline = Date.now() + timeMs
    const tt = new Map<string, TTEntry>()
    let best: Move | null = valid[0]
    let depth = 2
    while (depth <= 6) {
      const { best: b } = await search(board, player, depth, -Infinity, Infinity, deadline, tt)
      if (b) best = b
      if (Date.now() > deadline) break
      depth++
    }
    return best
  },
}

