import { Role } from '@/generated/prisma/enums'
import { isAdmin } from '@/utils/user'
import { UserSession } from 'next-auth'

export const isAdminOnOrga = (
  account: UserSession,
  organizationVersion: {
    id: string
    parentId: string | null
  },
) => isAdmin(account.role) && isInOrgaOrParent(account.organizationVersionId, organizationVersion)

export const isInOrgaOrParent = (
  userOrganizationVersionId: string | null,
  organizationVersion: {
    id: string
    parentId: string | null
  },
) =>
  userOrganizationVersionId &&
  (userOrganizationVersionId === organizationVersion.id || userOrganizationVersionId === organizationVersion.parentId)

export const hasEditionRole = (_isCR: boolean, userRole: Role): boolean => isAdmin(userRole)

export const canEditOrganizationVersion = (
  account: UserSession,
  organizationVersion?: {
    id: string
    parentId: string | null
  },
) => {
  if (organizationVersion && !isInOrgaOrParent(account.organizationVersionId, organizationVersion)) {
    return false
  }

  const isCR = !!organizationVersion?.parentId && organizationVersion.parentId === account.organizationVersionId
  return hasEditionRole(isCR, account.role)
}

export const shouldRenewLicenceText = (_accountOrganizationVersion?: unknown) => ''

export const hasActiveLicence = (_organizationVersion?: unknown) => true

export const hasActiveLicenceForFormation = (_organizationVersion?: unknown) => false
