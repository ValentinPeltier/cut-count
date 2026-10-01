import { ASSIGNABLE_ORGANIZATION_ROLES } from '@/services/roles'
import z from 'zod'

export const AddMemberCommandValidation = z.object({
  email: z
    .email()
    .trim()
    .transform((email) => email.toLowerCase()),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  role: z.enum(ASSIGNABLE_ORGANIZATION_ROLES),
})

export type AddMemberCommand = z.infer<typeof AddMemberCommandValidation>
