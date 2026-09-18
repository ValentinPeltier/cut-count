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
    <Card className={styles.card} data-testid="ressource-links-card">
      <CardContent>
        <Typography variant="h6" data-testid="ressource-links-title">
          {title}
        </Typography>
        <ul className={classNames(styles.links, 'flex-col')} data-testid="ressource-links-list">
          {links.map((item) => (
            <li key={item.link || item.downloadKey || item.title}>
              {item.link ? (
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="ressource-external-link"
                  data-resource-title={item.title}
                >
                  {item.title}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => item.downloadKey && handleDownload(item.downloadKey)}
                  className={styles.linkButton}
                  data-testid="ressource-download-button"
                  data-download-key={item.downloadKey ?? ''}
                >
                  {item.title}
                </button>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default RessourceLinks
