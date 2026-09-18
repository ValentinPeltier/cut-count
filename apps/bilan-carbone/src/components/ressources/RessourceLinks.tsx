'use client'

import { getDocumentUrl } from '@/services/serverFunctions/documents'
import { useServerFunction } from '@abc-transitionbascarbone/components/src/hooks/useServerFunction'
import { Card, CardContent, Typography } from '@mui/material'
import classNames from 'classnames'
import Link from 'next/link'
import styles from './RessourceLinks.module.css'

interface Props {
  title: string
  links: { title: string; link?: string; downloadKey?: string }[]
}

const RessourceLinks = ({ title, links }: Props) => {
  const { callServerFunction } = useServerFunction()

  const handleDownload = async (downloadKey: string) => {
    const response = await callServerFunction(() => getDocumentUrl(downloadKey))
    if (response.success) {
      window.open(response.data, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Card className={classNames('h100', styles.card)} data-testid="ressource-links-card">
      <CardContent className={'p0'}>
        <div className={classNames(styles.cardHeader, 'p1')}>
          <Typography className="mb-2 bold text-center" data-testid="ressource-links-title">
            {title}
          </Typography>
        </div>
        <div className={classNames(styles.cardLinks, 'text-center', 'h100')} data-testid="ressource-links-list">
          {links.map(({ title: linkTitle, link, downloadKey }) => (
            <div className="mt-2 mb-2" key={link || downloadKey || linkTitle}>
              {link ? (
                <Link
                  href={link}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-testid="ressource-external-link"
                  data-resource-title={linkTitle}
                >
                  {linkTitle}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => downloadKey && handleDownload(downloadKey)}
                  className={styles.linkButton}
                  data-testid="ressource-download-button"
                  data-download-key={downloadKey ?? ''}
                >
                  {linkTitle}
                </button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default RessourceLinks
