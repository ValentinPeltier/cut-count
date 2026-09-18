'use client'

import { getUserWithAccountsAndOrganizationsById } from '@/db/user'
import Block from '@/lib/components/base/Block'
import { accountHandler } from '@/lib/services/auth/auth.utils'
import { useAppLoadingStore } from '@/store/AppLoading'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { UserSession } from 'next-auth'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

interface Props {
  user: UserSession
  userWithAccountsAndOrganizations: Awaited<ReturnType<typeof getUserWithAccountsAndOrganizationsById>>
}

const SelectAccount = ({ user, userWithAccountsAndOrganizations }: Props) => {
  const router = useRouter()
  const t = useTranslations('navigation')
  const { setIsLoading } = useAppLoadingStore()

  const onSelectAccount = async (accountId: string) => {
    const result = await accountHandler(accountId)
    if (result && !result?.error) {
      setIsLoading(true)
      router.push('/')
    }
  }

  return (
    <div className="justify-center">
      <Block title={t('selectAccount')} data-testid="select-account" fullSize={false}>
        <List>
          {userWithAccountsAndOrganizations?.accounts.map((account) => (
            <ListItem disablePadding key={account.id}>
              <ListItemButton
                selected={user?.accountId === account.id}
                disabled={user?.accountId === account.id}
                onClick={() => onSelectAccount(account.id)}
                data-testid={`account-${account.id}`}
              >
                <ListItemIcon>
                  <PermIdentityIcon />
                </ListItemIcon>
                <ListItemText>
                  <p className="bold mr1">{account.organizationVersion?.organization.name}</p>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Block>
    </div>
  )
}

export default SelectAccount
