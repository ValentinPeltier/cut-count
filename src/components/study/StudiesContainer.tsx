import { getOrganizationVersionForRightsCheck } from '@/db/organization'
import {
  StudyCardItem,
  getAllowedStudiesByAccount,
  getAllowedStudiesByUserAndOrganization,
  getExternalAllowedStudiesByUser,
  getStudiesForCards,
} from '@/db/study'
import Block from '@/lib/components/base/Block'
import Box from '@/lib/components/base/Box'
import LinkButton from '@/lib/components/base/LinkButton'
import Image from '@/lib/components/document/Image'
import { customRich } from '@/lib/utils/customRich'
import { canCreateAStudy } from '@/services/permissions/study'
import { hasActiveLicence } from '@/utils/organization'
import AddIcon from '@mui/icons-material/Add'
import { Alert, Box as MUIBox } from '@mui/material'
import classNames from 'classnames'
import { UserSession } from 'next-auth'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Studies from './Studies'
import styles from './StudiesContainer.module.css'

interface Props {
  user: UserSession
  organizationVersionId?: string
  isCR?: boolean
  simplified?: boolean
}

const StudiesContainer = async ({ user, organizationVersionId, isCR, simplified = false }: Props) => {
  const t = await getTranslations('study')
  const tCommon = await getTranslations('common')

  const allowedStudies = organizationVersionId
    ? await getAllowedStudiesByUserAndOrganization(user, organizationVersionId)
    : isCR
      ? await getExternalAllowedStudiesByUser(user)
      : await getAllowedStudiesByAccount(user)

  const allowedStudyIds = allowedStudies.map((study) => study.id)

  const mainStudyOrganizationVersionId = organizationVersionId ?? user.organizationVersionId

  const [organizationVersion, studiesForCards] = await Promise.all([
    getOrganizationVersionForRightsCheck(mainStudyOrganizationVersionId),
    getStudiesForCards(allowedStudyIds),
  ])

  const studies = allowedStudyIds
    .map((studyId) => {
      const card = studiesForCards[studyId]
      if (!card) {
        return null
      }
      return card
    })
    .filter((c): c is StudyCardItem => c !== null)

  const isOrgaHomePage = !organizationVersionId && !isCR
  const [orgaStudies, otherStudies] = isOrgaHomePage
    ? studies.reduce(
        (res, study) => {
          const isOwnOrganizationStudy = user.organizationVersionId
            ? study.organizationVersion?.id === user.organizationVersionId
            : study.ownerAccountId === user.accountId
          res[isOwnOrganizationStudy ? 0 : 1].push(study)
          return res
        },
        [[] as StudyCardItem[], [] as StudyCardItem[]],
      )
    : [studies, [] as StudyCardItem[]]

  const mainStudies = isOrgaHomePage ? orgaStudies : studies
  const collaborationStudies = isOrgaHomePage ? otherStudies : []
  const advancedStudies = mainStudies.filter((study) => !study.simplified)
  const simplifiedStudies = mainStudies.filter((study) => study.simplified)
  const footprintStudies = advancedStudies.length > 0 ? advancedStudies : simplifiedStudies
  const showSeparateSimplifiedList = advancedStudies.length > 0 && simplifiedStudies.length > 0

  const creationUrl = organizationVersionId ? `/organisations/${organizationVersionId}/etudes/creer` : '/etudes/creer'

  const canCreateStudy = await canCreateAStudy(user, simplified)
  const activeLicence =
    organizationVersion != null ? hasActiveLicence(organizationVersion) : canCreateStudy && !user.organizationVersionId

  const displaySimplifiedStudies = showSeparateSimplifiedList
  const hasStudies = studies.length > 0

  return hasStudies ? (
    <>
      {!!footprintStudies.length && (
        <Studies
          studies={footprintStudies}
          canAddStudy={canCreateStudy && !isCR && activeLicence}
          creationUrl={creationUrl}
          user={user}
          collaborations={!organizationVersionId && isCR}
        />
      )}

      {displaySimplifiedStudies && (
        <Studies
          studies={simplifiedStudies}
          canAddStudy={(await canCreateAStudy(user, true)) && !isCR && activeLicence}
          creationUrl={`${creationUrl}?simplified=true`}
          user={user}
          collaborations={!organizationVersionId && isCR}
          simplified
        />
      )}
      {!!collaborationStudies.length && (
        <Studies studies={collaborationStudies} canAddStudy={false} user={user} collaborations />
      )}
    </>
  ) : canCreateStudy ? (
    !isCR && (
      <MUIBox component="section" className="mt1">
        <Block>
          <div className="justify-center">
            <Box className={classNames(styles.firstStudyCard, 'flex-col align-center')}>
              <Image src="/img/orga.png" alt="orga.png" width={177} height={119} />
              <h5>{t(simplified ? 'createFirstSimplifiedStudy' : 'createFirstStudy')}</h5>
              <p>{t(simplified ? 'firstSimplifiedStudyMessage' : 'firstStudyMessage')}</p>
              <LinkButton
                data-testid="new-study"
                className={classNames('w100 justify-center mb1')}
                href={simplified ? `${creationUrl}?simplified=true` : creationUrl}
              >
                <AddIcon />
                {t(simplified ? 'createFirstSimplifiedStudy' : 'createFirstStudy')}
              </LinkButton>
            </Box>
          </div>
        </Block>
      </MUIBox>
    )
  ) : !simplified ? (
    <Block>
      <Alert className="p0" severity="info">
        <p>
          {customRich(t, 'cannotCreateStudy', {
            link: (children) => (
              <Link href="https://abc-transitionbascarbone.fr/agir/se-former-au-bilan-carbone/">{children}</Link>
            ),
          })}
        </p>
        <p>
          {customRich(t, 'canCreateFootPrint', {
            link: (children) => <Link href="/">{children}</Link>,
          })}
        </p>
      </Alert>
    </Block>
  ) : (
    <Block>{customRich(tCommon, 'noStudies')}</Block>
  )
}

export default StudiesContainer
