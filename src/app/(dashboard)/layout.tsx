import withAuth, { UserSessionProps } from '@/components/hoc/withAuth'
import Navbar from '@/components/navbar/Navbar'
import { getAccountOrganizationVersions } from '@/db/account'
import CutThemeProvider from '@/environments/cut/theme/CutThemeProvider'
import DashboardProviders from '@/lib/DashboardProviders'
import { Box } from '@mui/material'
import styles from './layout.module.css'

interface Props {
  children: React.ReactNode
}

const NavLayout = async ({ children, user: account }: Props & UserSessionProps) => {
  if (account.needsAccountSelection) {
    return (
      <DashboardProviders>
        <main className={styles.content}>{children}</main>
      </DashboardProviders>
    )
  }

  await getAccountOrganizationVersions(account.accountId)

  return (
    <CutThemeProvider>
      <DashboardProviders>
        <Box className="flex-col h100">
          <Navbar user={account} />
          <Box component="main" className={styles.content}>
            {children}
          </Box>
        </Box>
      </DashboardProviders>
    </CutThemeProvider>
  )
}

export default withAuth(NavLayout)
