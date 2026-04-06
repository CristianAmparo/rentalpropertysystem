import { defineEventHandler, createError } from 'h3'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  // Enforce authentication & admin role
  const user = event.context.user
  if (!user || user.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Admin access required',
    })
  }

  const id = event.context.params?.id

  try {
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true
          }
        },
        property: {
          select: {
            id: true,
            title: true,
            address: true,
            price: true,
            images: true,
            isVacant: true
          }
        }
      }
    })

    if (!application) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Application not found'
      })
    }

    return application

  } catch (error: any) {
    console.error('Fetch application detail error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch application details'
    })
  }
})
