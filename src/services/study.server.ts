import { getOrgVersionWithOrgId } from '@/db/organization'
import { getStudyById } from '@/db/study'

export const getStudyParentOrganizationVersionId = async (
  studyId: string,
  userOrganizationVersionId: string | null,
) => {
  const study = await getStudyById(studyId, userOrganizationVersionId)
  if (!study) {
    throw Error("Study doesn't exist")
  }

  if (!study.organizationVersion) {
    throw new Error('Study is not attached to an organization')
  }

  return study.organizationVersion.parentId || study.organizationVersion.id
}

export const getStudyParentOrganizationId = async (studyId: string, userOrganizationVersionId: string | null) => {
  const organizationVersionId = await getStudyParentOrganizationVersionId(studyId, userOrganizationVersionId)
  const organizationVersion = await getOrgVersionWithOrgId(organizationVersionId)

  if (!organizationVersion) {
    throw new Error('Organization version not found')
  }

  return organizationVersion.organizationId
}
