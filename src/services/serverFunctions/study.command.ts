import { DayOfWeek, Level, StudyResultUnit, StudyRole } from '@/db-common/enums'
import { setCustomIssue, setCustomMessage } from '@/lib'
import dayjs from 'dayjs'
import z from 'zod'
import { HolidayOpeningHoursValidation, OpeningHoursValidation } from '../hours'

export const SitesCommandValidation = z.object({
  sites: z.array(
    z.object({
      id: z.string(),
      cncId: z.string().optional(),
      cncCode: z.string().optional(),
      name: z.string().trim().min(1),
      etp: z.int().min(0).optional(),
      ca: z.number().min(0).optional(),
      selected: z.boolean().optional(),
      postalCode: z.string().optional(),
      city: z.string().optional(),
    }),
  ),
})
export type SitesCommand = z.infer<typeof SitesCommandValidation>

const dateValidation = () => z.string().refine((val) => dayjs(val).isValid(), setCustomMessage('invalidDate'))

const optionalDateValidation = () =>
  z
    .string()
    .optional()
    .nullable()
    .refine((val) => val === null || dayjs(val).isValid(), setCustomMessage('invalidDate'))

const BaseStudyValidation = z.object({
  organizationVersionId: z.string(),
  name: z.string().trim().min(1),
  validator: z.email().trim(),
  startDate: dateValidation(),
  endDate: dateValidation(),
  realizationStartDate: optionalDateValidation(),
  realizationEndDate: optionalDateValidation(),
  level: z.enum(Level),
  isPublic: z.string(),
  simplified: z.boolean().optional(),
  exports: z.array(z.string()).optional(),
})

export const CreateStudyCommandValidation = z
  .intersection(BaseStudyValidation, SitesCommandValidation)
  .superRefine((data, ctx) => {
    if (!dayjs(data.endDate).isAfter(dayjs(data.startDate))) {
      ctx.addIssue(setCustomIssue(['endDate'], 'endDateBeforeStartDate'))
    }
    if (
      data.realizationStartDate &&
      data.realizationEndDate &&
      !dayjs(data.realizationEndDate).isAfter(dayjs(data.realizationStartDate))
    ) {
      ctx.addIssue(setCustomIssue(['realizationEndDate'], 'endDateBeforStartDate'))
    }
    if (!data.sites.some((site) => site.selected)) {
      ctx.addIssue(setCustomIssue(['sites'], 'noSiteSelected'))
    }
  })

export type CreateStudyCommand = z.infer<typeof CreateStudyCommandValidation>

export const ChangeStudySitesCommandValidation = z
  .intersection(
    z.object({
      organizationId: z.string(),
    }),
    SitesCommandValidation,
  )
  .refine(({ sites }) => sites.some((site) => site.selected), { params: { message: 'noSiteSelected' } })
export type ChangeStudySitesCommand = z.infer<typeof ChangeStudySitesCommandValidation>

export const ChangeStudyPublicStatusCommandValidation = z.object({
  studyId: z.string(),
  isPublic: z.string(),
})

export type ChangeStudyPublicStatusCommand = z.infer<typeof ChangeStudyPublicStatusCommandValidation>

export const ChangeStudyLevelCommandValidation = z.object({
  studyId: z.string(),
  level: z.enum(Level),
})

export type ChangeStudyLevelCommand = z.infer<typeof ChangeStudyLevelCommandValidation>

export const ChangeStudyResultsUnitCommandValidation = z.object({
  studyId: z.string(),
  resultsUnit: z.enum(StudyResultUnit),
})

export type ChangeStudyResultsUnitCommand = z.infer<typeof ChangeStudyResultsUnitCommandValidation>

export const ChangeStudyDatesCommandValidation = z
  .object({
    studyId: z.string(),
    startDate: dateValidation(),
    endDate: dateValidation(),
    realizationStartDate: optionalDateValidation(),
    realizationEndDate: optionalDateValidation(),
  })
  .superRefine((data, ctx) => {
    if (!dayjs(data.endDate).isAfter(dayjs(data.startDate))) {
      ctx.addIssue(setCustomIssue(['endDate'], 'endDateBeforeStartDate'))
    }
    if (
      data.realizationStartDate &&
      data.realizationEndDate &&
      !dayjs(data.realizationEndDate).isAfter(dayjs(data.realizationStartDate))
    ) {
      ctx.addIssue(setCustomIssue(['realizationEndDate'], 'endDateBeforeStartDate'))
    }
  })

export type ChangeStudyDatesCommand = z.infer<typeof ChangeStudyDatesCommandValidation>

export const ChangeStudyNameValidation = z.object({
  studyId: z.string(),
  name: z.string().trim().min(1),
})

export type ChangeStudyNameCommand = z.infer<typeof ChangeStudyNameValidation>

export const ChangeStudyCinemaValidation = z.object({
  openingHours: z.partialRecord(z.enum(DayOfWeek), OpeningHoursValidation).optional(),
  openingHoursHoliday: z.partialRecord(z.enum(DayOfWeek), HolidayOpeningHoursValidation).optional(),
  numberOfSessions: z.number().optional().nullable(),
  numberOfTickets: z.number().optional().nullable(),
  numberOfOpenDays: z.number().optional().nullable(),
  numberOfProgrammedFilms: z.number().optional().nullable(),
})

export type ChangeStudyCinemaCommand = z.infer<typeof ChangeStudyCinemaValidation>

export const NewStudyRightCommandValidation = z.object({
  studyId: z.string(),
  email: z.email().trim(),
  role: z.enum(StudyRole),
})

export type NewStudyRightCommand = z.infer<typeof NewStudyRightCommandValidation>

export const DeleteCommandValidation = z.object({
  id: z.string(),
  name: z.string(),
})
export type DeleteCommand = z.infer<typeof DeleteCommandValidation>
