import React from 'react'
import BoardView from '@components/Board'
import Controls from '@components/Controls'
import MoveLog from '@components/MoveLog'
import AdvantageBar from '@components/AdvantageBar'
import TimelineControls from '@components/Timeline'
import { ENGINES, getEngine } from '@ai/index'
import type { Board, GameStatus, Move, Player, LogEntry } from '@game/types'
import { createInitialBoard, getValidMoves, applyMove, opposite, countDiscs, isGameOver, hasAnyValidMoves } from '@game/logic'
import { evaluateBoard } from '@game/eval'
import { evalToProbability } from '@game/eval'

type EngineSelection = {
  B: string
  W: string
}

function useOthello() {
  const initial = React.useMemo(() => ({ board: createInitialBoard(), turn: 'B' as Player, status: { type: 'playing', turn: 'B' as Player } as GameStatus }), [])
  const [positions, setPositions] = React.useState<Array<{ board: Board; turn: Player; status: GameStatus }>>([initial])
  const [cursor, setCursor] = React.useState(0)
  const [engines, setEngines] = React.useState<EngineSelection>({ B: 'human', W: 'human' })
  const [log, setLog] = React.useState<LogEntry[]>([])
  const [autoplay, setAutoplay] = React.useState(false)
  

  const view = positions[cursor]
  const atEnd = cursor === positions.length - 1
  const validMoves = React.useMemo(() => getValidMoves(view.board, view.turn), [view])
  const score = React.useMemo(() => countDiscs(view.board), [view.board])
  const boardRef = React.useRef<HTMLDivElement | null>(null)
  const [boardHeight, setBoardHeight] = React.useState<number>(0)
  const lowerRef = React.useRef<HTMLDivElement | null>(null)
  const [lowerHeight, setLowerHeight] = React.useState<number>(0)
  const upperRef = React.useRef<HTMLDivElement | null>(null)
  const [upperHeight, setUpperHeight] = React.useState<number>(0)
  React.useEffect(() => {
    if (!boardRef.current) return
    const el = boardRef.current
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect
      if (cr) setBoardHeight(cr.height)
    })
    ro.observe(el)
    // initial read
    setBoardHeight(el.getBoundingClientRect().height)
    return () => ro.disconnect()
  }, [boardRef])

  React.useEffect(() => {
    if (!lowerRef.current) return
    const el = lowerRef.current
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect
      if (cr) setLowerHeight(cr.height)
    })
    ro.observe(el)
    setLowerHeight(el.getBoundingClientRect().height)
    return () => ro.disconnect()
  }, [lowerRef])

  React.useEffect(() => {
    if (!upperRef.current) return
    const el = upperRef.current
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect
      if (cr) setUpperHeight(cr.height)
    })
    ro.observe(el)
    setUpperHeight(el.getBoundingClientRect().height)
    return () => ro.disconnect()
  }, [upperRef])

  const reset = React.useCallback(() => {
    const init = { board: createInitialBoard(), turn: 'B' as Player, status: { type: 'playing', turn: 'B' as Player } as GameStatus }
    setPositions([init])
    setCursor(0)
    setLog([])
  }, [])

  const step = React.useCallback(
    (move: Move | null) => {
      const current = positions[cursor]
      if (current.status.type === 'gameover') return
      // Truncate future if replaying
      const basePositions = positions.slice(0, cursor + 1)
      const baseLog = log.slice(0, cursor)
      if (move) {
        const evalBefore = evaluateBoard(current.board)
        const nextBoard = applyMove(current.board, move, current.turn)
        const evalAfter = evaluateBoard(nextBoard)
        const delta = evalAfter - evalBefore
        const notation = `${String.fromCharCode(65 + move.col)}${move.row + 1}`
        const newLogEntry: LogEntry = {
          n: baseLog.length + 1,
          player: current.turn,
          move,
          notation,
          flips: move.flips.length,
          evalBefore,
          evalAfter,
          delta,
        }
        const nextTurnCandidate = opposite(current.turn)
        if (isGameOver(nextBoard)) {
          const { black, white } = countDiscs(nextBoard)
          const winner = black === white ? 'draw' : black > white ? 'B' : 'W'
          const nextSnap = { board: nextBoard, turn: current.turn, status: { type: 'gameover', black, white, winner } as GameStatus }
          setPositions([...basePositions, nextSnap])
          setLog([...baseLog, newLogEntry])
          setCursor(basePositions.length)
          return
        }
        // If opponent has no moves, current player continues
        const opponentHasMoves = hasAnyValidMoves(nextBoard, nextTurnCandidate)
        if (opponentHasMoves) {
          const nextSnap = { board: nextBoard, turn: nextTurnCandidate, status: { type: 'playing', turn: nextTurnCandidate as Player } as GameStatus }
          setPositions([...basePositions, nextSnap])
          setLog([...baseLog, newLogEntry])
          setCursor(basePositions.length)
        } else {
          const stillPlaying = hasAnyValidMoves(nextBoard, current.turn)
          if (!stillPlaying) {
            const { black, white } = countDiscs(nextBoard)
            const winner = black === white ? 'draw' : black > white ? 'B' : 'W'
            const nextSnap = { board: nextBoard, turn: current.turn, status: { type: 'gameover', black, white, winner } as GameStatus }
            setPositions([...basePositions, nextSnap])
            setLog([...baseLog, newLogEntry])
            setCursor(basePositions.length)
          } else {
            const nextSnap = { board: nextBoard, turn: current.turn, status: { type: 'passed', from: nextTurnCandidate, to: current.turn } as GameStatus }
            setPositions([...basePositions, nextSnap])
            setLog([...baseLog, newLogEntry])
            setCursor(basePositions.length)
          }
        }
      } else {
        // No move provided: treat as pass if truly no moves
        if (!validMoves.length) {
          const evalBefore = evaluateBoard(current.board)
          const next = opposite(current.turn)
          const nextSnap = { board: current.board, turn: next, status: { type: 'passed', from: current.turn, to: next } as GameStatus }
          const passLog: LogEntry = { n: baseLog.length + 1, player: current.turn, move: null, notation: 'pass', flips: 0, evalBefore, evalAfter: evalBefore, delta: 0 }
          setPositions([...basePositions, nextSnap])
          setLog([...baseLog, passLog])
          setCursor(basePositions.length)
        }
      }
    },
    [positions, cursor, log, validMoves]
  )

  const setEngineFor = React.useCallback((p: Player, id: string) => {
    setEngines((prev) => ({ ...prev, [p]: id }))
  }, [])

  // timeline controls
  const first = React.useCallback(() => setCursor(0), [])
  const last = React.useCallback(() => setCursor(positions.length - 1), [positions.length])
  const prev = React.useCallback(() => setCursor((c) => Math.max(0, c - 1)), [])
  const next = React.useCallback(() => setCursor((c) => Math.min(positions.length - 1, c + 1)), [positions.length])

  // autoplay
  React.useEffect(() => {
    if (!autoplay) return
    if (cursor >= positions.length - 1) return
    const id = setTimeout(() => setCursor((c) => Math.min(positions.length - 1, c + 1)), 800)
    return () => clearTimeout(id)
  }, [autoplay, cursor, positions.length])

  return {
    // view
    board: view.board,
    turn: view.turn,
    status: view.status,
    score,
    engines,
    validMoves,
    reset,
    step,
    setEngineFor,
    log,
    // timeline
    cursor,
    lastIndex: positions.length - 1,
    first,
    prev,
    next,
    last,
    autoplay,
    setAutoplay,
    // board size sync
    boardRef,
    boardHeight,
    lowerRef,
    lowerHeight,
    upperRef,
    upperHeight,
    atEnd,
  }
}

export default function App() {
  const {
    board, turn, status, score, engines, validMoves, reset, step, setEngineFor, log,
    cursor, lastIndex, first, prev, next, last, autoplay, setAutoplay, boardRef, boardHeight, lowerRef, lowerHeight, upperRef, upperHeight, atEnd
  } = useOthello()

  // Trigger AI move if current player is AI
  React.useEffect(() => {
    if (status.type === 'gameover') return
    if (!atEnd) return // disable AI while replaying
    const engineId = engines[turn]
    const engine = getEngine(engineId)
    if (!engine || engine.isHuman) return
    if (validMoves.length === 0) {
      // auto-pass
      step(null)
      return
    }
    let cancelled = false
    ;(async () => {
      const move = await engine.selectMove(board, turn, validMoves)
      if (!cancelled) step(move)
    })()
    return () => {
      cancelled = true
    }
  }, [board, turn, engines, status, validMoves, step])

  const isHumanTurn = React.useMemo(() => {
    const engine = getEngine(engines[turn])
    return !engine || engine.isHuman
  }, [engines, turn])

  const statusText = React.useMemo(() => {
    switch (status.type) {
      case 'playing':
        return `手番: ${status.turn === 'B' ? '黒' : '白'}`
      case 'passed':
        return `${status.from === 'B' ? '黒' : '白'}は打てる手がありません。パス。`
      case 'gameover':
        if (status.winner === 'draw') return `対局終了: 引き分け（${status.black}-${status.white}）`
        return `対局終了: ${status.winner === 'B' ? '黒' : '白'}の勝ち（${status.black}-${status.white}）`
    }
  }, [status])

  const currentEval = React.useMemo(() => evaluateBoard(board), [board])

  const probs = React.useMemo(() => {
    if (status.type === 'gameover') {
      if (status.winner === 'draw') return { black: 0.5, white: 0.5 }
      return status.winner === 'B' ? { black: 1, white: 0 } : { black: 0, white: 1 }
    }
    return evalToProbability(currentEval)
  }, [currentEval, status])

  return (
    <div className="app">
      <div className="header">
        <h1>オセロ シミュレーション</h1>
        <div className="controls">
          <Controls
            blackEngineId={engines.B}
            whiteEngineId={engines.W}
            onChangeBlack={(id) => setEngineFor('B', id)}
            onChangeWhite={(id) => setEngineFor('W', id)}
            onReset={reset}
          />
        </div>
      </div>

      <div className="layout">
        <div className="panel adv-panel layout-span">
          <div className="panel-title">勝率</div>
          <AdvantageBar black={probs.black} white={probs.white} large />
        </div>
        
        <div>
          <div ref={upperRef}>
            <div className="score">
              <span className="pill">黒: {score.black}</span>
              <span className="pill">白: {score.white}</span>
            </div>
            <div className="status">{statusText}</div>

            {status.type === 'gameover' && (
              <div className="winner">
                {status.winner !== 'draw' ? (
                  <>
                    <span className={`tag ${status.winner === 'B' ? 'black' : 'white'}`} />
                    <span className="winner-text">{status.winner === 'B' ? '黒' : '白'}の勝ち</span>
                  </>
                ) : (
                  <span className="winner-text">引き分け</span>
                )}
                <span className="winner-score">（{status.black}-{status.white}）</span>
              </div>
            )}
          </div>

          <div ref={lowerRef}>
          <BoardView
            board={board}
            validMoves={validMoves}
            interactive={isHumanTurn && status.type !== 'gameover' && atEnd}
            onPlay={(m) => step(m)}
            boardRef={boardRef}
          />
          <TimelineControls
            cursor={cursor}
            last={lastIndex}
            onFirst={first}
            onPrev={prev}
            onNext={next}
            onLast={last}
            autoplay={autoplay}
            onToggleAutoplay={() => setAutoplay((v) => !v)}
          />
          </div>
        </div>
        <div>
          <MoveLog
            entries={log}
            currentEval={currentEval}
            perspective={turn}
            height={(upperHeight || 0) + (boardHeight || 0)}
          />
        </div>
      </div>

      
    </div>
  )
}
