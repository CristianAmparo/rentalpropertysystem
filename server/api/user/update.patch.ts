import { defineEventHandler, createError, readBody, setResponseStatus } from 'h3'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  // 1. Authenticate user from event context (set by auth middleware)
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Session required',
    })
  }

  // 2. Read body for profile updates
  const { name, phone } = await readBody(event)

  // Basic validation (optional)
  if (name && name.length < 2) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name must be at least 2 characters long',
    })
  }

  try {
    // 3. Update User in DB via Prisma
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        phone
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true
      }
    })

    setResponseStatus(event, 200)
    return {
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    }
  } catch (error: any) {
    console.error('Profile update error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update user profile'
    })
  }
})
