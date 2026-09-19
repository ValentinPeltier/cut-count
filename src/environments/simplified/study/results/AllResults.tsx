'use client'

import Block from '@/lib/components/base/Block'
import LoadingButton from '@/lib/components/base/LoadingButton'

import ConsolidatedResultsTable from '@/components/study/results/consolidated/ConsolidatedResultsTable'
import SelectStudySite from '@/components/study/site/SelectStudySite'
import TabPanel from '@/components/tabPanel/tabPanel'
import { SiteCAUnit } from '@/generated/prisma/enums'
import { EmissionFactorWithParts } from '@/db/emissionFactors'
import type { FullStudy } from '@/db/study'
import CarbonIntensitiesCut from '@/environments/cut/study/results/CarbonIntensitiesCut'
import { useServerFunction } from '@/lib/components/hooks/useServerFunction'
import { BarChart, PieChart } from '@/lib/ui'
import { customRich } from '@/lib/utils/customRich'
import type { BaseResultsByPost } from '@/services/posts'
import { generateStudySummaryPDF } from '@/services/serverFunctions/pdf'
import { downloadStudyResults } from '@/services/study'
import type { BaseResultsBySite } from '@/types/study.types'
import DownloadIcon from '@mui/icons-material/Download'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { Box, Button, Tab, Tabs, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { SyntheticEvent, useMemo, useState } from 'react'
import { a11yProps, ChartType, defaultChartOrder, tabsLabels } from './utils'

interface Props {
  setSite: (site: string) => void
  study: FullStudy
  studySite: string
  // equivalent to previous `withDepValue`
  totalValue: number
  computedResults: BaseResultsByPost[]
  computedResultsBySite?: BaseResultsBySite
  totalValueWithoutDep?: number
  caUnit?: SiteCAUnit
  chartOrder?: Record<ChartType, number>
  emissionFactorsWithPart?: EmissionFactorWithParts[]
  showSubLevel?: boolean
}

const AllResults = ({
  setSite,
  study,
  studySite,
  totalValue,
  computedResults,
  totalValueWithoutDep = totalValue,
  caUnit = SiteCAUnit.K,
  chartOrder = defaultChartOrder,
  showSubLevel = false,
}: Props) => {
  const [tabValue, setTabValue] = useState(0)
  const [pdfLoading, setPdfLoading] = useState(false)

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const tOrga = useTranslations('study.organization')
  const tResults = useTranslations('study.results')
  const tExport = useTranslations('exports')
  const tUnits = useTranslations('study.results.units')
  const tExportButton = useTranslations('study.export')
  const tStudyNav = useTranslations('study.navigation')

  const { callServerFunction } = useServerFunction()

  const handlePDFDownload = async () => {
    setPdfLoading(true)
    await callServerFunction(() => generateStudySummaryPDF(study.id, study.name, study.startDate.getFullYear()), {
      onSuccess: (data) => {
        const pdfBuffer = new Uint8Array(data.pdfBuffer)
        const pdfBlob = new Blob([pdfBuffer], { type: data.contentType })

        const url = URL.createObjectURL(pdfBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = data.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      },
    })
    setPdfLoading(false)
  }

  const orderedTabs = useMemo(
    () => [...tabsLabels].sort((a, b) => chartOrder[a as ChartType] - chartOrder[b as ChartType]),
    [chartOrder],
  )

  return (
    <Block
      title={study.name}
      as="h2"
      description={tStudyNav('results')}
      bold
      descriptionColor="primary"
      rightComponent={
        <div className="flex gapped align-center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            endIcon={<DownloadIcon />}
            onClick={() => {
              downloadStudyResults(
                study,
                tResults,
                tExport,
                tOrga,
                tUnits,
                computedResults,
                studySite,
              )
            }}
          >
            {tExportButton('export')}
          </Button>
          <LoadingButton
            variant="outlined"
            color="primary"
            size="large"
            endIcon={<PictureAsPdfIcon />}
            onClick={handlePDFDownload}
            loading={pdfLoading}
          >
            {pdfLoading ? tResults('downloadingPDF') : tResults('downloadPDF')}
          </LoadingButton>
          <SelectStudySite sites={study.sites} defaultValue={studySite} setSite={setSite} />
        </div>
      }
    >
      <Box component="section" className="mb2">
        <Typography>
          {customRich(tResults, 'simplifiedFeedback', {
            formation: (children) => (
              <Link href={process.env.NEXT_PUBLIC_FORMATION_URL ?? ''} target="_blank">
                <strong>{children}</strong>
              </Link>
            ),
            email: (children) => (
              <Link href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? ''}`} target="_blank">
                <strong>{children}</strong>
              </Link>
            ),
            prestataire: (children) => (
              <Link href={process.env.NEXT_PUBLIC_ACTORS_URL ?? ''} target="_blank">
                <strong>{children}</strong>
              </Link>
            ),
          })}
        </Typography>
      </Box>

      <Box component="section" sx={{ marginTop: '1rem' }}>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
        >
          {orderedTabs.map((tab, index) => (
            <Tab key={tab} label={tResults(`chartTypes.${tab}`)} {...a11yProps(index)} />
          ))}
        </Tabs>
        <Box component="section" sx={{ marginTop: '1rem' }}>
          <TabPanel value={tabValue} index={chartOrder.table}>
            <ConsolidatedResultsTable resultsUnit={study.resultsUnit} data={computedResults} hiddenUncertainty />
          </TabPanel>
          <TabPanel value={tabValue} index={chartOrder.bar}>
            <BarChart
              results={computedResults}
              resultsUnit={study.resultsUnit}
              height={400}
              showTitle={false}
              showLegend={false}
              showSubLevel={showSubLevel}
              showLabelsOnBars={!showSubLevel}
              type="post"
            />
          </TabPanel>
          <TabPanel value={tabValue} index={chartOrder.pie}>
            <PieChart
              resultsUnit={study.resultsUnit}
              height={400}
              showTitle={false}
              showLabelsOnPie={true}
              results={computedResults}
              showSubLevel={false}
              type="post"
            />
          </TabPanel>
          <TabPanel value={tabValue} index={chartOrder.ratio}>
            <CarbonIntensitiesCut study={study} studySite={studySite} withDepValue={totalValue} />
          </TabPanel>
        </Box>
      </Box>
    </Block>
  )
}

export default AllResults
