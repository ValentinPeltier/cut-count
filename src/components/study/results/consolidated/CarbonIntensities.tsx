import type { FullStudy } from '@/db/study'
import CarbonIntensitiesCut from '@/environments/cut/study/results/CarbonIntensitiesCut'
import { SiteCAUnit } from '@/generated/prisma/enums'

interface Props {
  study: FullStudy
  studySite: string
  withDep: number
  withoutDep?: number
  caUnit?: SiteCAUnit
}

const CarbonIntensities = ({ study, studySite, withDep }: Props) => {
  return <CarbonIntensitiesCut study={study} studySite={studySite} withDepValue={withDep} />
}

export default CarbonIntensities
