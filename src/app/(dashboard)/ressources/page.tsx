'use server'

import withAuth from '@/components/hoc/withAuth'
import RessourcesPage from '@/components/pages/Ressources'
import NotFound from '@/lib/components/pages/NotFound'
import { auth } from '@/services/auth'

const Ressources = async () => {
  const session = await auth()
  if (!session) {
    return <NotFound />
  }
  return <RessourcesPage environment={session.user.environment} />
}

export default withAuth(Ressources)
