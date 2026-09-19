'use server'

import Block from '@/lib/components/base/Block'
import { customRich } from '@/lib/utils/customRich'
import { getRessources } from '@/utils/ressources'
import { Alert } from '@mui/material'
import classNames from 'classnames'
import { getTranslations } from 'next-intl/server'
import RessourceLinks from '../ressources/RessourceLinks'
import styles from './Ressources.module.css'

const RessourcesPage = async () => {
  const t = await getTranslations('ressources')

  const ressources = await getRessources(t)

  return (
    <Block title={t('title')} as="h1">
      <Alert severity="info" className="mb2" data-testid="ressources-cut-description">
        {customRich(t, 'description')}
      </Alert>
      <div className={classNames(styles.ressources, 'gapped1')} data-testid="ressources-sections">
        {ressources.map(({ title, links }) => (
          <RessourceLinks key={title} title={title} links={links} />
        ))}
      </div>
      <Alert severity="info" className="mt2" data-testid="ressources-cut-france2030">
        {t('france2030')}
      </Alert>
    </Block>
  )
}

export default RessourcesPage
