'use client'

import { Environment, Role } from '@/db-common/enums'
import NewMemberFormCommon from '@/lib/components/team/NewMemberFormCommon'
import { addMember } from '@/services/serverFunctions/user'
import { getEnvironmentRoles } from '@/utils/user'

interface Props {
  environment: Environment
}
const NewMemberForm = ({ environment }: Props) => {
  return (
    <NewMemberFormCommon environmentRoles={getEnvironmentRoles(environment) as typeof Role} addMember={addMember} />
  )
}

export default NewMemberForm
