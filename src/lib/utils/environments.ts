import { Environment } from '@/db-common/enums'

export const isCut = (_environment?: Environment) => true

export enum EnvironmentMode {
  SIMPLIFIED = 'SIMPLIFIED',
}

export const EnvironmentNames = {
  [Environment.CUT]: 'Count',
}

export const environmentWithOnboarding: Environment[] = []
export const environmentsWithChecklist: Environment[] = []
