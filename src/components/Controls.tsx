import React from 'react'
import { ENGINES } from '@ai/index'

type Props = {
  blackEngineId: string
  whiteEngineId: string
  onChangeBlack: (id: string) => void
  onChangeWhite: (id: string) => void
  onReset: () => void
}

export default function Controls({ blackEngineId, whiteEngineId, onChangeBlack, onChangeWhite, onReset }: Props) {
  return (
    <div className="toolbar">
      <label>
        黒:
        <select value={blackEngineId} onChange={(e) => onChangeBlack(e.target.value)}>
          {ENGINES.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        白:
        <select value={whiteEngineId} onChange={(e) => onChangeWhite(e.target.value)}>
          {ENGINES.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </label>
      <button className="primary" onClick={onReset}>新規対局</button>
    </div>
  )
}
