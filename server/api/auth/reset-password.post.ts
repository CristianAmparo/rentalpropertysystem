import { prisma } from '../../utils/prisma'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { token, password } = body

    if (!token) {
      throw createError({ statusCode: 400, statusMessage: 'Reset token is required' })
    }

    if (!password || password.length < 6) {
      throw createError({ statusCode: 400, statusMessage: 'Password must be at least 6 characters long' })
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid or expired reset token. Please request a new password reset link.' })
    }

    // Hash the new password and clear the reset token fields
    const hashedPassword = await bcrypt.hash(password, 10)
    
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('\n======================================================')
    console.log('✅ MOCK PASSWORD RESET SUCCESSFUL')
    console.log(`Token used: ${token}`)
    console.log('======================================================\n')

    return {
      success: true,
      message: 'Password successfully reset'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({ statusCode: 500, statusMessage: error.message || 'Internal Server Error' })
  }
})
