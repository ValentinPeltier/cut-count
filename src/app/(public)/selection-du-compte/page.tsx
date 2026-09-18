'use server'

import SelectAccountPage from '@/components/pages/SelectAccount'
import { getUserWithAccountsAndOrganizationsById } from '@/db/user'
import NotFound from '@/lib/components/pages/NotFound'
import { auth } from '@/services/auth'

const SelectAccount = async () => {
  const session = await auth()
  if (!session || !session.user) {
    return <NotFound />
  }
  const userWithAccountsAndOrganizations = await getUserWithAccountsAndOrganizationsById(session.user.userId)

  return <SelectAccountPage user={session.user} userWithAccountsAndOrganizations={userWithAccountsAndOrganizations} />
}

export default SelectAccount
