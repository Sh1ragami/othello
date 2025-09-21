import React from 'react'

type Props = {
  cursor: number
  last: number
  onFirst: () => void
  onPrev: () => void
  onNext: () => void
  onLast: () => void
  autoplay: boolean
  onToggleAutoplay: () => void
}

export default function TimelineControls({ cursor, last, onFirst, onPrev, onNext, onLast, autoplay, onToggleAutoplay }: Props) {
  return (
    <div className="timeline">
      <button onClick={onFirst} disabled={cursor === 0} title="First">⏮</button>
      <button onClick={onPrev} disabled={cursor === 0} title="Prev">◀</button>
      <button onClick={onToggleAutoplay} disabled={cursor === last && !autoplay} title="Play/Pause">
        {autoplay ? '⏸' : '▶'}
      </button>
      <button onClick={onNext} disabled={cursor === last} title="Next">►</button>
      <button onClick={onLast} disabled={cursor === last} title="Last">⏭</button>
      <span className="timeline-pos">{cursor} / {last}</span>
    </div>
  )
}

