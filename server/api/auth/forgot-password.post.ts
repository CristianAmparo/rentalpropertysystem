import { prisma } from '../../utils/prisma'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email } = body

    if (!email) {
      throw createError({ statusCode: 400, statusMessage: 'Email is required' })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Return success even if user not found to prevent email enumeration attacks
      throw createError({ statusCode: 400, statusMessage: 'Invalid email' })
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex')

    // Save the token and expiration to the DB (1 hour validity)
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })
    console.log('\n======================================================')
    console.log('🔒 PASSWORD RESET REQUEST')
    console.log(`To: ${email}`)
    console.log(`Reset Token: ${resetToken}`)
    console.log(`Reset Link: http://localhost:3000/reset-password?token=${resetToken}`)
    console.log('======================================================\n')

    return {
      message: `If an account with that email exists, a reset link has been sent.Reset Link: http://localhost:3000/reset-password?token=${resetToken}`
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({ statusCode: 500, statusMessage: error.message || 'Internal Server Error' })
  }
})
