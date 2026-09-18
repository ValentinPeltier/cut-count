import { StudyResultUnit } from '@abc-transitionbascarbone/db-common/enums'
import { formatNumber } from '@abc-transitionbascarbone/utils/number'
import { useTranslations } from 'next-intl'
import styles from './CarbonIntensity.module.css'

interface Props {
  withDep: number
  withoutDep: number
  divider: number
  resultsUnit: StudyResultUnit
  label: string
  testId: string
  simplified?: boolean | null
}

const CarbonIntensity = ({ withDep, divider, resultsUnit, label, testId }: Props) => {
  const tUnits = useTranslations('study.results.units')

  return (
    <div className={styles.container}>
      <strong data-testid={`dependency-${testId}`}>
        {formatNumber(withDep / divider)} {tUnits(resultsUnit)}/{label}
      </strong>
    </div>
  )
}

export default CarbonIntensity
