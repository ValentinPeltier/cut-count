import PublicCutPage from '@/components/pages/PublicCut'

import CutThemeProvider from '@/environments/cut/theme/CutThemeProvider'
import { MuiAppProviders } from '@/lib/MuiAppProviders'
import { customRich } from '@/lib/utils/customRich'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export const metadata: Metadata = {
  title: "Count le premier calculateur d'impact écologique dédié aux salles de cinéma",
  description: "Count le premier calculateur d'impact écologique dédié aux salles de cinéma",
}

const PublicLayout = async ({ children }: Props) => {
  const t = await getTranslations('login')
  const question = customRich(t, 'question', {})
  return (
    <MuiAppProviders>
      <CutThemeProvider>
        <main className="h100">
          <PublicCutPage question={question}>{children}</PublicCutPage>
        </main>
      </CutThemeProvider>
    </MuiAppProviders>
  )
}

export default PublicLayout
