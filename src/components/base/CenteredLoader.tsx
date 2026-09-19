'use client'

import CircularProgress from '@/components/base/CircularProgress'
import styles from './CenteredLoader.module.css'

const CenteredLoader = () => (
  <div className={styles.loading}>
    <CircularProgress className={styles.circular} variant="indeterminate" color="primary" />
  </div>
)

export default CenteredLoader
