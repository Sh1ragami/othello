import type { Engine } from './types'
import { HumanEngine } from './human'

export const ENGINES: Engine[] = [HumanEngine]

export function getEngine(id: string): Engine | undefined {
  return ENGINES.find((e) => e.id === id)
}

