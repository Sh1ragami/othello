import React from 'react'

type Props = {
  row: number
  col: number
  value: 'B' | 'W' | null
  showHint: boolean
  disabled?: boolean
  onClick?: () => void
  isLastBlack?: boolean
  isLastWhite?: boolean
}

export default function Cell({ row, col, value, showHint, disabled, onClick, isLastBlack, isLastWhite }: Props) {
  const className = ['cell', disabled ? 'disabled' : '', showHint ? 'hint' : '', isLastBlack ? 'last-black' : '', isLastWhite ? 'last-white' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={className}
      aria-label={`マス ${row + 1}-${col + 1}`}
      onClick={disabled ? undefined : onClick}
    >
      {value && <div className={`disc ${value === 'B' ? 'black' : 'white'}`} />}
    </button>
  )
}
