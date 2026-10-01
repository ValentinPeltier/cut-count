'use client'

import LoadingButton from '@/lib/components/base/LoadingButton'
import { useServerFunction } from '@/lib/components/hooks/useServerFunction'
import { downloadFile } from '@/lib/utils/download'
import { exportAdminStudiesExcel } from '@/services/serverFunctions/adminStudiesExport'
import DownloadIcon from '@mui/icons-material/Download'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const AdminStudiesExportButton = () => {
  const t = useTranslations('adminPanel')
  const { callServerFunction } = useServerFunction()
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    await callServerFunction(() => exportAdminStudiesExcel(), {
      onSuccess: (data) => {
        downloadFile([new Uint8Array(data.xlsxBuffer)], data.filename, 'xlsx')
      },
    })
    setLoading(false)
  }

  return (
    <LoadingButton
      data-testid="admin-studies-export-xlsx"
      variant="contained"
      color="primary"
      loading={loading}
      endIcon={<DownloadIcon />}
      onClick={handleExport}
    >
      {loading ? t('exportStudiesLoading') : t('exportStudies')}
    </LoadingButton>
  )
}

export default AdminStudiesExportButton
