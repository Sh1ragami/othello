import React from 'react'
import type { LogEntry, Player } from '@game/types'

function fmtDelta(x: number) {
  const s = x.toFixed(2)
  return x > 0 ? `+${s}` : s
}

type Props = {
  entries: LogEntry[]
  currentEval: number // positive = Black better
  perspective: Player // whose perspective to display (+ good for this color)
  height?: number
}

export default function MoveLog({ entries, currentEval, perspective, height }: Props) {
  const evalForPerspective = perspective === 'B' ? currentEval : -currentEval
  const listRef = React.useRef<HTMLOListElement | null>(null)
  React.useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [entries.length, height])
  return (
    <div className="sidebar">
      <div className="panel movelog" style={height ? { height } : undefined}>
        <div className="panel-title">着手ログ</div>
        <ol className="movelist" ref={listRef}>
          {entries.map((e) => (
            <li key={e.n} className="move-item">
              <span className={`tag ${e.player === 'B' ? 'black' : 'white'}`}>
                {e.player === 'B' ? '黒' : '白'}
              </span>
              <span className="move">{e.notation}</span>
              <span className="delta">{fmtDelta(e.player === 'B' ? e.delta : -e.delta)}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
