import withAuth, { UserSessionProps } from '@/components/hoc/withAuth'
import Navbar from '@/components/navbar/Navbar'
import { getAccountOrganizationVersions } from '@/db/account'
import CutThemeProvider from '@/environments/cut/theme/CutThemeProvider'
import { Box } from '@mui/material'
import styles from './layout.module.css'

interface Props {
  children: React.ReactNode
}

const NavLayout = async ({ children, user: account }: Props & UserSessionProps) => {
  if (account.needsAccountSelection) {
    return <main className={styles.content}>{children}</main>
  }

  await getAccountOrganizationVersions(account.accountId)

  return (
    <CutThemeProvider>
      <Box className="flex-col h100">
        <Navbar user={account} />
        <Box component="main" className={styles.content}>
          {children}
        </Box>
      </Box>
    </CutThemeProvider>
  )
}

export default withAuth(NavLayout)
