import type { Engine } from './types'
import { HumanEngine } from './human'
import { MinimaxEngine } from './minimax'

export const ENGINES: Engine[] = [HumanEngine, MinimaxEngine]

export function getEngine(id: string): Engine | undefined {
  return ENGINES.find((e) => e.id === id)
}
