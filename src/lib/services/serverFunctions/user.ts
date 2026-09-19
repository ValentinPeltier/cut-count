import { updateUserResetTokenForEmail } from '@/db/user'
import { TIME_IN_MS } from '@/lib/utils/time'
import jwt from 'jsonwebtoken'

export const updateUserResetToken = async (email: string, duration: number) => {
  const resetToken = Math.random().toString(36)
  const payload = {
    email,
    resetToken,
    exp: Math.round(Date.now() / TIME_IN_MS) + duration,
  }
  await updateUserResetTokenForEmail(email, resetToken)
  return jwt.sign(payload, process.env.NEXTAUTH_SECRET as string)
}
