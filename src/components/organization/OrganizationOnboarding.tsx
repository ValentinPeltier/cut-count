import Block from '@/lib/components/base/Block'
import LinkButton from '@/lib/components/base/LinkButton'
import { Alert, Typography } from '@mui/material'
import { UserSession } from 'next-auth'
import { getTranslations } from 'next-intl/server'
import StudiesContainer from '../study/StudiesContainer'

interface Props {
  user: UserSession
}

const OrganizationOnboarding = async ({ user }: Props) => {
  const t = await getTranslations('organization.onboarding')

  return (
    <>
      <Block title={t('title')} as="h1" data-testid="organization-onboarding">
        <Alert severity="info" className="mb-2">
          <Typography>{t('description')}</Typography>
        </Alert>
        <Typography className="mb-2">{t('instructions')}</Typography>
        <LinkButton href="/register" data-testid="organization-onboarding-register">
          {t('registerCta')}
        </LinkButton>
      </Block>
      <StudiesContainer user={user} />
    </>
  )
}

export default OrganizationOnboarding
