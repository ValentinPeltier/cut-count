import PublicCutPage from '@/components/pages/PublicCut'
import cutTheme from '@/environments/cut/theme/theme'
import { Environment } from '@abc-transitionbascarbone/db-common/enums'
import { customRich } from '@abc-transitionbascarbone/utils/customRich'
import { ThemeProvider } from '@mui/material/styles'
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
  const question = customRich(t, 'question', {}, Environment.CUT)
  return (
    <ThemeProvider theme={cutTheme}>
      <main className="h100">
        <PublicCutPage question={question}>{children}</PublicCutPage>
      </main>
    </ThemeProvider>
  )
}

export default PublicLayout
