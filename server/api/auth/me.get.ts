import { verifyToken } from '../../utils/jwt'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'auth_token')

    if (!token) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const decoded = verifyToken(token)

    if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid or expired token' })
    }

    const user = await prisma.user.findUnique({
      where: { id: (decoded as any).userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true,
        banned: true,
        createdAt: true
      }
    })

    if (!user) {
      throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    if (user.banned) {
      throw createError({ statusCode: 403, statusMessage: 'Account banned' })
    }

    return { user }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({ statusCode: 401, statusMessage: 'Authentication failed' })
  }
})
