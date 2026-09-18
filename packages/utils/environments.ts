import { Environment } from '@abc-transitionbascarbone/db-common/enums'

const { BC, CUT } = Environment
const advancedEnvironments: Environment[] = [BC]
const simplifiedEnvironments: Environment[] = [CUT]

export const isAdvanced = (environment: Environment) => advancedEnvironments.includes(environment)
export const isSimplified = (environment: Environment) => simplifiedEnvironments.includes(environment)

export const environmentWithOnboarding: Environment[] = [BC]
export const environmentsWithChecklist: Environment[] = [BC]
export const EnvironmentNames = {
  [BC]: 'BC+ 2.0',
  [CUT]: 'Count',
}

export enum EnvironmentMode {
  SIMPLIFIED = 'SIMPLIFIED',
  ADVANCED = 'ADVANCED',
}
