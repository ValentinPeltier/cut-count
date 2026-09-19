'use client'
import { UserSessionProps } from '@/components/hoc/withAuth'

import Image from '@/lib/components/document/Image'
import { Box } from '@mui/material'
import styles from './LogosHome.module.css'

const logos = [
  { src: '/logos/cut/Republique_francaise.png', alt: 'Logo de la république française', priority: true },
  {
    src: '/logos/cut/Banques_des_territoires.svg',
    alt: 'Logo du groupe la caisse des dépots',
    priority: true,
  },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LogosHome = (_props: UserSessionProps) => {
  const isCut = true
  return (
    isCut && (
      <Box data-testid={'home-cut-logo'} className={styles.container}>
        {logos.map((logo, i) => (
          <Image
            src={logo.src}
            key={i}
            alt={logo.alt}
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 33vw"
            quality={90}
            width={400}
            height={100}
            priority={logo.priority}
          />
        ))}
      </Box>
    )
  )
}

export default LogosHome
