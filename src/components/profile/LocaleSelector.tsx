'use client'

import { getLocale, switchLocale } from '@/i18n/locale'
import { Locale, LocaleType, defaultLocale } from '@/lib/i18n/config'
import { InputLabel, MenuItem, Select } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'

const LocaleSelector = () => {
  const t = useTranslations('locale')
  const [locale, setLocale] = useState<LocaleType>(defaultLocale)

  const availableLocales = useMemo(() => [Locale.FR], [])

  useEffect(() => {
    getLocale().then((value) => {
      setLocale(value)
    })
  }, [])

  return (
    <>
      <InputLabel id="local-selector-label">{t('selector')}</InputLabel>
      <Select
        value={locale}
        aria-labelledby="local-selector-label"
        onChange={(event) => {
          switchLocale(event.target.value as LocaleType)
          setLocale(event.target.value as LocaleType)
        }}
      >
        {availableLocales
          .map((local) => local.toLowerCase())
          .map((local) => (
            <MenuItem key={local} value={local}>
              {t(local)}
            </MenuItem>
          ))}
      </Select>
    </>
  )
}

export default LocaleSelector
