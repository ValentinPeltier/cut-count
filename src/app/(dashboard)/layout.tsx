import withAuth, { UserSessionProps } from '@/components/hoc/withAuth'
import Navbar from '@/components/navbar/Navbar'
import { getAccountOrganizationVersions } from '@/db/account'
import cutTheme from '@/environments/cut/theme/theme'
import { Box } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
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
    <ThemeProvider theme={cutTheme}>
      <Box className="flex-col h100">
        <Navbar user={account} />
        <Box component="main" className={styles.content}>
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default withAuth(NavLayout)
