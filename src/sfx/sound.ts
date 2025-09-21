let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  try {
    if (!ctx) {
      // @ts-ignore vendor
      const AC = window.AudioContext || (window as any).webkitAudioContext
      if (!AC) return null
      ctx = new AC()
    }
    return ctx
  } catch {
    return null
  }
}

function blipAt(time: number, freq = 900) {
  const c = getCtx()
  if (!c) return
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'square'
  osc.frequency.setValueAtTime(freq, time)
  gain.gain.setValueAtTime(0.0001, time)
  gain.gain.exponentialRampToValueAtTime(0.18, time + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.08)
  osc.connect(gain).connect(c.destination)
  osc.start(time)
  osc.stop(time + 0.12)
}

export function playFlips(count: number) {
  const c = getCtx()
  if (!c) return
  const start = c.currentTime + 0.01
  const step = 0.06
  for (let i = 0; i < Math.max(1, count); i++) {
    const t = start + i * step
    const f = 900 - i * 35 + (Math.random() * 40 - 20)
    blipAt(t, f)
  }
}

// Attempt to resume audio on first user interaction (needed on iOS/Safari)
if (typeof window !== 'undefined') {
  const tryResume = () => {
    const c = getCtx()
    if (c && c.state === 'suspended') c.resume()
    window.removeEventListener('pointerdown', tryResume)
  }
  window.addEventListener('pointerdown', tryResume, { once: true })
}

