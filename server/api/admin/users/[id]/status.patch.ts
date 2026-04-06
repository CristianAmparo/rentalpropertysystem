import { defineEventHandler, createError, readBody } from 'h3'
import { prisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const adminUser = event.context.user
  if (!adminUser || adminUser.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing ID' })

  // Prevent admin from banning themselves just in case
  if (adminUser.id === id) {
    throw createError({ statusCode: 400, statusMessage: 'Cannot modify your own status' })
  }

  try {
    const body = await readBody(event)

    if (body.banned === undefined) {
      throw createError({ statusCode: 400, statusMessage: 'banned status is required' })
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { banned: body.banned },
      select: { id: true, email: true, name: true, banned: true }
    })

    return updatedUser
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }
    console.error('Update user status error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to update user status' })
  }
})
