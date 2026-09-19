'use client'

import type { FullStudy } from '@/db/study'
import { StudyRole } from '@/generated/prisma/enums'
import { useServerFunction } from '@/lib/components/hooks/useServerFunction'
import { Toast, ToastColors } from '@/lib/ui'
import { isAdminOnStudyOrga } from '@/services/permissions/study.utils'
import { changeStudyRole } from '@/services/serverFunctions/study'
import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { UserSession } from 'next-auth'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

const emptyToast = { text: '', color: 'info' } as const
const toastPosition = { vertical: 'bottom', horizontal: 'left' } as const

interface Props {
  user: UserSession
  userRole?: StudyRole
  rowUser: FullStudy['allowedUsers'][0]['account']
  currentRole: StudyRole
  study: FullStudy
}

const SelectStudyRole = ({ user, rowUser, study, currentRole, userRole }: Props) => {
  const t = useTranslations('study.role')
  const { callServerFunction } = useServerFunction()
  const [role, setRole] = useState(currentRole)
  const [toast, setToast] = useState<{ text: string; color: ToastColors }>(emptyToast)

  const selectNewRole = async (event: SelectChangeEvent<StudyRole>) => {
    const newRole = event.target.value as StudyRole
    if (newRole !== role) {
      await callServerFunction(() => changeStudyRole(study.id, rowUser.user.email, newRole), {
        onSuccess: () => {
          setRole(newRole)
        },
        getSuccessMessage: () => t('saved'),
      })
    }
  }

  /**
   * Disabled if:
   * - user is the same as the one in the row
   * - current role is Validator and user is not Validator and (user is not admin OR user is not part of the study's organization)
   * - user has readerOnly attribute (calculated by back-end if : user has no account or user does not match the study's level)
   */
  const isStudyOrgaAdmin = study.organizationVersion
    ? isAdminOnStudyOrga(user, study.organizationVersion)
    : false
  const isStudyOwner = study.ownerAccountId === user.accountId

  const isDisabled = useMemo(
    () =>
      user.email === rowUser.user.email ||
      (currentRole === StudyRole.Validator &&
        userRole !== StudyRole.Validator &&
        !isStudyOrgaAdmin &&
        !isStudyOwner) ||
      rowUser.readerOnly,
    [currentRole, isStudyOrgaAdmin, isStudyOwner, rowUser, user, userRole],
  )

  /**
   * Allowed roles:
   * - if currentUser.role is admin or if the user is a validator or selector is disabled : all roles
   * - otherwise : all roles except validator
   */
  const allowedRoles = useMemo(
    () =>
      Object.keys(StudyRole).filter(
        (role) =>
          isStudyOrgaAdmin ||
          isStudyOwner ||
          userRole === StudyRole.Validator ||
          isDisabled ||
          role !== StudyRole.Validator,
      ),
    [isStudyOrgaAdmin, isStudyOwner, userRole, isDisabled],
  )

  return (
    <>
      <Select
        className="fit-content"
        data-testid="select-study-role"
        value={role}
        onChange={selectNewRole}
        disabled={isDisabled}
      >
        {allowedRoles.map((role) => (
          <MenuItem key={role} value={role}>
            {t(role)}
          </MenuItem>
        ))}
      </Select>
      {toast.text && (
        <Toast
          position={toastPosition}
          onClose={() => setToast(emptyToast)}
          message={t(toast.text)}
          color={toast.color}
          toastKey="select-role-toast"
          open
        />
      )}
    </>
  )
}

export default SelectStudyRole
