import { getValidMoves } from './logic'
import type { Board } from './types'

export type EvalWeights = {
  piece: number
  mobility: number
  corner: number
  cornerAdjPenalty: number
}

export const defaultWeights: EvalWeights = {
  piece: 10,
  mobility: 30,
  corner: 100,
  cornerAdjPenalty: 25,
}

// Return positive when Black is better, negative when White is better.
export function evaluateBoard(board: Board, weights: EvalWeights = defaultWeights): number {
  const { pieceDiff, mobilityDiff, cornerDiff, cornerAdjPenaltyDiff } = features(board)
  const score =
    weights.piece * pieceDiff +
    weights.mobility * mobilityDiff +
    weights.corner * cornerDiff -
    weights.cornerAdjPenalty * cornerAdjPenaltyDiff
  // Clamp for readability
  return Math.max(-999, Math.min(999, score))
}

function features(board: Board) {
  let black = 0,
    white = 0
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const v = board[r][c]
      if (v === 'B') black++
      else if (v === 'W') white++
    }
  }
  const total = black + white || 1
  const pieceDiff = (black - white) / total

  const bMoves = getValidMoves(board, 'B').length
  const wMoves = getValidMoves(board, 'W').length
  const denom = bMoves + wMoves || 1
  const mobilityDiff = (bMoves - wMoves) / denom

  const corners: [number, number][] = [
    [0, 0],
    [0, 7],
    [7, 0],
    [7, 7],
  ]
  let bCorners = 0,
    wCorners = 0
  for (const [r, c] of corners) {
    const v = board[r][c]
    if (v === 'B') bCorners++
    else if (v === 'W') wCorners++
  }
  const cornerDiff = (bCorners - wCorners) / 4

  // Squares adjacent to corners (risky before securing the corner)
  const adjSets: [number, number][][] = [
    [
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    [
      [0, 6],
      [1, 7],
      [1, 6],
    ],
    [
      [7, 1],
      [6, 0],
      [6, 1],
    ],
    [
      [7, 6],
      [6, 7],
      [6, 6],
    ],
  ]
  let bAdj = 0,
    wAdj = 0
  for (const group of adjSets) {
    for (const [r, c] of group) {
      const v = board[r][c]
      if (v === 'B') bAdj++
      else if (v === 'W') wAdj++
    }
  }
  const cornerAdjPenaltyDiff = (bAdj - wAdj) / 12

  return { pieceDiff, mobilityDiff, cornerDiff, cornerAdjPenaltyDiff }
}

export function formatEval(e: number): { who: 'Black' | 'White' | 'Even'; value: number } {
  if (Math.abs(e) < 1e-6) return { who: 'Even', value: 0 }
  return e > 0 ? { who: 'Black', value: e } : { who: 'White', value: -e }
}

// Map evaluation score to win probability for Black/White.
// Uses tanh for a smooth S-curve; `scale` controls steepness.
export function evalToProbability(e: number, scale = 100) {
  const pBlack = (Math.tanh(e / scale) + 1) / 2
  const pWhite = 1 - pBlack
  return { black: pBlack, white: pWhite }
}
