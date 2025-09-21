import React from 'react'

type Props = {
  black: number // 0..1
  white: number // 0..1 (ideally 1 - black)
  large?: boolean
}

export default function AdvantageBar({ black, white, large }: Props) {
  const b = Math.max(0, Math.min(1, black))
  const w = Math.max(0, Math.min(1, white))
  const bPct = Math.round(b * 100)
  const wPct = Math.round(w * 100)
  const bWidth = `${bPct}%`
  const wWidth = `${100 - bPct}%`
  return (
    <div className={`adv ${large ? 'large' : ''}`}>
      <div className="adv-bar-track" aria-label={`Black ${bPct}%, White ${wPct}%`}>
        <div className="adv-fill black" style={{ width: bWidth }} />
        <div className="adv-fill white" style={{ width: wWidth }} />
      </div>
      <div className="adv-legend">
        <span>黒 {bPct}%</span>
        <span>白 {wPct}%</span>
      </div>
    </div>
  )
}
