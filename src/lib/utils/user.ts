import { Role } from '@/generated/prisma/enums'

export const canBeUntrainedRole = (_role: Role, _environment?: string) => true
