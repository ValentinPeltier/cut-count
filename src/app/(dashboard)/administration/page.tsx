import AdminStudiesExportButton from '@/components/admin/AdminStudiesExportButton'
import withAuth, { UserSessionProps } from '@/components/hoc/withAuth'
import Block from '@/lib/components/base/Block'
import { isSuperAdmin } from '@/utils/user'
import { useTranslations } from 'next-intl'
import { redirect } from 'next/navigation'

const Administration = ({ user }: UserSessionProps) => {
  if (!isSuperAdmin(user.role)) {
    redirect('/')
  }

  const t = useTranslations('adminPanel')

  return (
    <Block title={t('title')} as="h1" data-testid="admin-panel-page">
      <AdminStudiesExportButton />
    </Block>
  )
}

export default withAuth(Administration)
