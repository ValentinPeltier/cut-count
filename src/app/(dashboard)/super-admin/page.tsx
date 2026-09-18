'use server'

import withAuth from '@/components/hoc/withAuth'
import SuperAdminPage from '@/components/pages/SuperAdmin'
import { Role } from '@/db-common/enums'
import NotFound from '@/lib/components/pages/NotFound'
import { auth } from '@/services/auth'

const SuperAdmin = async () => {
  const session = await auth()
  if (session?.user?.role !== Role.SUPER_ADMIN) {
    return <NotFound />
  }
  return <SuperAdminPage />
}

export default withAuth(SuperAdmin)
