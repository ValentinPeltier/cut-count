'use client'

import { Logo } from '@/components/base/Logo'
import CutTopLeftNavBar from '@/environments/cut/navbar/TopLeftNavBar'
import { Role } from '@abc-transitionbascarbone/db-common/enums'
import { signOutEnv } from '@abc-transitionbascarbone/services/auth/auth.utils'
import AppBar from '@abc-transitionbascarbone/ui/navbar/AppBar'
import NavbarButton from '@abc-transitionbascarbone/ui/navbar/NavbarButton'
import NavbarLink from '@abc-transitionbascarbone/ui/navbar/NavbarLink'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import { Box, Container, Toolbar } from '@mui/material'
import classNames from 'classnames'
import { UserSession } from 'next-auth'
import { useTranslations } from 'next-intl'

interface Props {
  user: UserSession
}

const Navbar = ({ user }: Props) => {
  const t = useTranslations('navigation')

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar variant="dense">
        <Container maxWidth="lg" className="justify-between">
          <Box className={classNames('flex-cc', 'gapped1')}>
            <NavbarLink href="/" aria-label={t('home')} title={t('home')}>
              <Logo />
            </NavbarLink>
            <CutTopLeftNavBar user={user} />
          </Box>
          <div className="flex gapped1">
            <Box>
              <div className="h100 align-center">
                {user.role === Role.SUPER_ADMIN && <NavbarLink href="/super-admin">{t('admin')}</NavbarLink>}
                <NavbarButton rel="noreferrer noopener" href="/ressources" aria-label={t('help')}>
                  <HelpOutlineIcon />
                </NavbarButton>
                <NavbarButton aria-label={t('profile')} href="/profil">
                  <AccountCircleIcon />
                </NavbarButton>
                <NavbarButton title={t('logout')} aria-label={t('logout')} onClick={() => signOutEnv(user.environment)}>
                  <PowerSettingsNewIcon />
                </NavbarButton>
              </div>
            </Box>
          </div>
        </Container>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
