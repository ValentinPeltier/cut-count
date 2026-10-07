'use client'

import { getLocale, switchLocale } from '@/i18n/locale'
import { availableLocales, defaultLocale, LocaleType } from '@/lib/i18n/config'
import { InputLabel, MenuItem, Select } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const LocaleSelector = () => {
  const t = useTranslations('locale')
  const router = useRouter()
  const [locale, setLocale] = useState<LocaleType>(defaultLocale)

  useEffect(() => {
    getLocale().then(setLocale)
  }, [])

  return (
    <>
      <InputLabel id="local-selector-label">{t('selector')}</InputLabel>
      <Select
        value={locale}
        data-testid="locale-selector"
        aria-labelledby="local-selector-label"
        onChange={async (event) => {
          const nextLocale = event.target.value as LocaleType
          await switchLocale(nextLocale)
          setLocale(nextLocale)
          router.refresh()
        }}
      >
        {availableLocales.map((availableLocale) => (
          <MenuItem key={availableLocale} value={availableLocale} data-value={availableLocale}>
            {t(availableLocale)}
          </MenuItem>
        ))}
      </Select>
    </>
  )
}

export default LocaleSelector
