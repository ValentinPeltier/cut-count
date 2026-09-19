'use client'

import { getFeaturesRestictions, RestrictionsTypes } from '@/db/deactivableFeatures'
import { useServerFunction } from '@/lib/components/hooks/useServerFunction'
import {
  changeDeactivableFeatureRestriction,
  changeDeactivableFeatureStatus,
} from '@/services/serverFunctions/deactivableFeatures'
import { FormControl, FormControlLabel, FormLabel, Switch } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

interface Props {
  restrictions: AsyncReturnType<typeof getFeaturesRestictions>[number]
}

type DeactivationCriteria = {
  title: string
  criterias: RestrictionsTypes[]
  t: (value: string) => string
  values: RestrictionsTypes[]
}

const DeactivableFeature = ({ restrictions }: Props) => {
  const t = useTranslations('deactivableFeatures')
  const { callServerFunction } = useServerFunction()
  const router = useRouter()

  const changeFeatureStatus = async (status: boolean) => {
    await callServerFunction(() => changeDeactivableFeatureStatus(restrictions.feature, status), {
      onSuccess: () => {
        router.refresh()
      },
    })
  }

  const updateDeactivatedFeatureRestrictions = async (value: RestrictionsTypes, checked: boolean) => {
    await callServerFunction(() => changeDeactivableFeatureRestriction(restrictions.feature, value, !checked), {
      onSuccess: () => {
        router.refresh()
      },
    })
  }

  const featureDeactivationCriterias: DeactivationCriteria[] = []

  const isCriteriaActive = (criterias: RestrictionsTypes[], value: RestrictionsTypes) =>
    (criterias && !criterias.length) || !criterias.includes(value)

  return (
    <>
      <div className="mt2 align-center" data-testid={`deactivable-feature-${restrictions.feature}`}>
        <h4 className="flex-col mr1">{t(restrictions.feature)}</h4>
        <FormControl>
          <FormControlLabel
            control={
              <Switch
                aria-label={t(restrictions.active.toString())}
                checked={restrictions.active}
                onChange={(event) => changeFeatureStatus(event.target.checked)}
                data-testid={`deactivable-feature-${restrictions.feature}-toggle`}
              />
            }
            label={t(restrictions.active.toString())}
          />
        </FormControl>
      </div>
      {featureDeactivationCriterias.map(({ title, t: tFactor, values, criterias }) => (
        <div className="wrap align-center" key={title}>
          {t(title)} :
          {(values as typeof criterias).map((value) => (
            <div key={value} className="ml2">
              <FormControl className="flex-row align-center" sx={{ gap: 1 }}>
                <FormLabel>{tFactor(value)}</FormLabel>
                <FormControlLabel
                  control={
                    <Switch
                      aria-label={t(isCriteriaActive(criterias, value).toString())}
                      checked={isCriteriaActive(criterias, value)}
                      onChange={(event) => updateDeactivatedFeatureRestrictions(value, event.target.checked)}
                    />
                  }
                  disabled={!restrictions.active}
                  label={t(isCriteriaActive(criterias, value).toString())}
                />
              </FormControl>
            </div>
          ))}
        </div>
      ))}
    </>
  )
}

export default DeactivableFeature
