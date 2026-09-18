import Engine from 'publicodes'

const engineInstances = new Map<string, Engine<string>>()

function getOrCreateInstance<T>(cache: Map<string, T>, key: string, factory: () => T): T {
  if (!cache.has(key)) {
    cache.set(key, factory())
  }

  return cache.get(key) as T
}

export function getOrCreateEngine<RuleName extends string>(
  key: string,
  createEngine: () => Engine<RuleName>,
): Engine<RuleName> {
  return getOrCreateInstance(engineInstances, key, createEngine) as Engine<RuleName>
}
