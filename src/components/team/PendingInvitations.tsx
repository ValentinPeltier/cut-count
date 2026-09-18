import { TeamMember } from '@/db/account'
import PendingInvitationsCommon from '@/lib/components/team/PendingInvitationsCommon'
import { deleteMember, resendInvitation } from '@/services/serverFunctions/user'
import { canEditMemberRole } from '@/utils/user'
import { UserSession } from 'next-auth'

interface Props {
  user: UserSession
  team: TeamMember[]
}

const PendingInvitations = ({ user, team }: Props) => {
  return !canEditMemberRole(user) || team.length === 0 ? null : (
    <PendingInvitationsCommon team={team} resendInvitation={resendInvitation} deleteMember={deleteMember} />
  )
}

export default PendingInvitations
