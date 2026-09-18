import type { Questions, RuleName } from '@/publicodes/rules/publicodes-build'
import Engine, { Situation } from 'publicodes'

export type CutRuleName = RuleName
export type CutQuestion = Questions
export type CutPublicodesEngine = Engine<RuleName>
export type CutSituation = Situation<RuleName>
