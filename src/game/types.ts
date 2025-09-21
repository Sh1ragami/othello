export type Player = 'B' | 'W'
export type Disc = Player | null

export type Coord = { row: number; col: number }
export type Move = Coord & { flips: Coord[] }

export type Board = Disc[][] // 8x8

export type GameStatus =
  | { type: 'playing'; turn: Player }
  | { type: 'passed'; from: Player; to: Player }
  | { type: 'gameover'; black: number; white: number; winner: Player | 'draw' }

export type LogEntry = {
  n: number
  player: Player
  move: Move | null
  notation: string
  flips: number
  evalBefore: number
  evalAfter: number
  delta: number
}
