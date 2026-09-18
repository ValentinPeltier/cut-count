export const getSiteEmissionSourcesWithoutMarketBase = <T>(emissionSources: T[], _siteId: string): T[] =>
  emissionSources

export const getAllSiteEmissionSources = <T>(emissionSources: T[], _siteId: string): T[] => emissionSources

export const filterEmissionSourcesWithDeps = <T>(emissionSources: T[]) => emissionSources

export const filterWithDependencies = <T>(items: T[], _withDependencies: boolean) => items
