'use client'

import { Level, Role } from '@/generated/prisma/enums'
import { useServerFunction } from '@/lib/components/hooks/useServerFunction'
import { ApiResponse } from '@/lib/utils/serverResponse'
import { RoleBcOrMip } from '@/lib/utils/types'
import { canBeUntrainedRole } from '@/lib/utils/user'
import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import styles from './SelectRoleCommon.module.css'

interface Props {
  currentUserEmail: string
  currentRole: RoleBcOrMip
  email: string
  level: Level | null
  teamRoles: RoleBcOrMip[]
  changeRole?: (email: string, newRole: RoleBcOrMip) => Promise<ApiResponse>
  setLocalRole?: (newRole: RoleBcOrMip) => void
  canEditSelfRole?: boolean
}

const SelectRoleCommon = ({
  currentUserEmail,
  email,
  currentRole,
  level,
  changeRole,
  setLocalRole,
  teamRoles,
  canEditSelfRole,
}: Props) => {
  const t = useTranslations('role')
  const [role, setRole] = useState(currentRole)
  const { callServerFunction } = useServerFunction()

  const router = useRouter()
  const { update: updateSession } = useSession()

  useEffect(() => {
    setRole(currentRole)
  }, [currentRole])

  const selectNewRole = async (event: SelectChangeEvent<RoleBcOrMip>) => {
    const newRole = event.target.value as RoleBcOrMip
    if (newRole !== role && changeRole) {
      await callServerFunction(() => changeRole(email, newRole), {
        getSuccessMessage: () => t('saved'),
        onSuccess: () => {
          setRole(newRole)
          if (email === currentUserEmail) {
            updateSession()
            router.refresh()
          }
        },
      })
    } else if (newRole !== role && setLocalRole) {
      setLocalRole(newRole)
      setRole(newRole)
    }
  }

  const disabled = useMemo(
    () => (!canEditSelfRole && currentUserEmail === email) || currentRole === Role.SUPER_ADMIN,
    [currentUserEmail, email, currentRole],
  )

  return (
    <Select className={styles.select} value={role} onChange={selectNewRole} disabled={disabled}>
      <MenuItem value={Role.SUPER_ADMIN} className={styles.hidden} aria-hidden="true">
        {t(Role.SUPER_ADMIN)}
      </MenuItem>
      {teamRoles
        .filter((role) => role !== Role.SUPER_ADMIN)
        .filter((role) => level || canBeUntrainedRole(role))
        .map((role) => (
          <MenuItem key={role} value={role}>
            {t(role)}
          </MenuItem>
        ))}
    </Select>
  )
}

export default SelectRoleCommon
