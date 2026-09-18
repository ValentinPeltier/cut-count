'use client'

import { Role } from '@/db-common/enums'
import { TeamMember } from '@/db/account'
import LoadingButton from '@/lib/components/base/LoadingButton'
import { useServerFunction } from '@/lib/components/hooks/useServerFunction'
import SelectRoleCommon from '@/lib/components/team/SelectRoleCommon'
import { deleteMember, validateMember } from '@/services/serverFunctions/user'
import { getTeamRoles } from '@/utils/user'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import classNames from 'classnames'
import { UserSession } from 'next-auth'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './InvitationsActions.module.css'

interface Props {
  user: UserSession
  member: TeamMember
}

const InvitationsToValidateActions = ({ user, member }: Props) => {
  const t = useTranslations('team')
  const { callServerFunction } = useServerFunction()
  const [validating, setValidating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const [role, setRole] = useState(member.user.level ? member.role : Role.DEFAULT)

  return (
    <div className={classNames(styles.buttons, 'flex')}>
      <SelectRoleCommon
        currentUserEmail={user.email}
        currentRole={role}
        email={member.user.email}
        level={member.user.level}
        teamRoles={Object.values(getTeamRoles())}
        setLocalRole={setRole}
      />
      <LoadingButton
        data-testid="validate-invitation"
        aria-label={t('resend')}
        title={t('resend')}
        loading={validating}
        onClick={async () => {
          setValidating(true)
          await callServerFunction(() => validateMember(member.user.email, role), {
            onSuccess: () => {
              router.refresh()
            },
          })
          setValidating(false)
        }}
        iconButton
      >
        <CheckIcon />
      </LoadingButton>
      <LoadingButton
        data-testid="delete-invitation"
        aria-label={t('delete')}
        title={t('delete')}
        loading={deleting}
        onClick={async () => {
          setDeleting(true)
          await callServerFunction(() => deleteMember(member.user.email), {
            onSuccess: () => {
              router.refresh()
            },
          })
          setDeleting(false)
        }}
        iconButton
      >
        <DeleteIcon />
      </LoadingButton>
    </div>
  )
}

export default InvitationsToValidateActions
