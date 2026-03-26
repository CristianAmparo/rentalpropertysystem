import { defineEventHandler, getCookie } from 'h3'
import { verifyToken } from '../utils/jwt'
import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  // Extract token from cookies
  const token = getCookie(event, 'auth_token')
  if (!token) return // Proceed as unauthenticated guest

  try {
    // Verify and decode JWT
    const decoded = verifyToken(token)
    if (decoded && typeof decoded === 'object' && decoded.userId) {
      // Find active user
      const user = await prisma.user.findUnique({
        where: { id: (decoded as any).userId },
        select: { id: true, email: true, role: true, name: true, banned: true }
      })

      // Attach user object to the event context if valid and not banned
      if (user && !user.banned) {
        event.context.user = user
      }
    }
  } catch (error) {
    // Silently ignore invalid/expired tokens, leaving event.context.user undefined
  }
})
