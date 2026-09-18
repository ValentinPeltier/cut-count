import { Role, SiteCAUnit } from '@abc-transitionbascarbone/db-common/enums'
import z from 'zod'

export const EditProfileCommandValidation = z.object({
  firstName: z.string().min(1).trim(),
  lastName: z.string().min(1).trim(),
})

export type EditProfileCommand = z.infer<typeof EditProfileCommandValidation>

export const OnboardingCommandValidation = z.object({
  organizationVersionId: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  companyName: z.string().min(1),
  collaborators: z
    .array(
      z.union([
        z.object({ email: z.literal(''), role: z.undefined() }),
        z.object({
          email: z
            .email()
            .trim()
            .transform((email) => email.toLowerCase()),
          role: z.enum(Role),
        }),
      ]),
    )
    .optional(),
})
export type OnboardingCommand = z.infer<typeof OnboardingCommandValidation>

export const EditSettingsCommandValidation = z.object({
  validatedEmissionSourcesOnly: z.boolean(),
  caUnit: z.enum(SiteCAUnit),
})

export type EditSettingsCommand = z.infer<typeof EditSettingsCommandValidation>

export const SignUpCutCommandValidation = z.object({
  email: z
    .email()
    .trim()
    .transform((email) => email.toLowerCase()),
  siretOrCNC: z.string().min(1).max(14).optional(),
})

export type SignUpCutCommand = z.infer<typeof SignUpCutCommandValidation>
