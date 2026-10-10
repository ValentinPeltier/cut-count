import PublicCutPage from '@/components/pages/PublicCut'

import { Metadata } from 'next'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export const metadata: Metadata = {
  title: "Count le premier calculateur d'impact écologique dédié aux salles de cinéma",
  description: "Count le premier calculateur d'impact écologique dédié aux salles de cinéma",
}

const PublicLayout = ({ children }: Props) => {
  return (
    <main className="h100">
      <PublicCutPage>{children}</PublicCutPage>
    </main>
  )
}

export default PublicLayout
