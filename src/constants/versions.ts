import countPackage from '@/publicodes/rules/package.json'
import mainPackage from '../../package.json'

export const PUBLICODES_COUNT_VERSION = `${countPackage.name}@${countPackage.version}`
export const PUBLICODES_ENGINE_VERSION = mainPackage.dependencies.publicodes.replace('^', '') // "1.9.1"
