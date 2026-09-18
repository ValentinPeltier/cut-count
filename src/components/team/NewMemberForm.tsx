'use client'

import { Role } from '@/db-common/enums'
import NewMemberFormCommon from '@/lib/components/team/NewMemberFormCommon'
import { addMember } from '@/services/serverFunctions/user'
import { getTeamRoles } from '@/utils/user'

const NewMemberForm = () => {
  return (
    <NewMemberFormCommon teamRoles={getTeamRoles() as typeof Role} addMember={addMember} />
  )
}

export default NewMemberForm
