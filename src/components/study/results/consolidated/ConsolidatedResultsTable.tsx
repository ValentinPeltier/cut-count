import { StudyResultUnit } from '@/db-common/enums'
import { STUDY_UNIT_VALUES } from '@/lib/utils/charts'
import { formatNumber } from '@/lib/utils/number'
import type { BaseResultsByPost } from '@/services/posts'
import { useTranslations } from 'next-intl'
import styles from './ConsolidatedResultsTable.module.css'

interface Props {
  resultsUnit: StudyResultUnit
  data: BaseResultsByPost[]
  hiddenUncertainty?: boolean
  hideExpandIcons?: boolean
}

const ConsolidatedResultsTable = ({ resultsUnit, data }: Props) => {
  const tUnits = useTranslations('study.results.units')

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Post</th>
          <th>{tUnits(resultsUnit)}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <>
            <tr key={String(row.post)}>
              <td>{row.label}</td>
              <td>{formatNumber((row.value ?? 0) / STUDY_UNIT_VALUES[resultsUnit])}</td>
            </tr>
            {row.children.map((child) => (
              <tr key={`${row.post}-${String(child.post)}`}>
                <td className={styles.child}>{child.label}</td>
                <td>{formatNumber((child.value ?? 0) / STUDY_UNIT_VALUES[resultsUnit])}</td>
              </tr>
            ))}
          </>
        ))}
      </tbody>
    </table>
  )
}

export default ConsolidatedResultsTable
