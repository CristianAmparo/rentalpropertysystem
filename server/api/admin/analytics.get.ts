import { defineEventHandler, createError } from 'h3'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  // Enforce authentication & admin role
  const user = event.context.user
  if (!user || user.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Admin access required',
    })
  }

  try {
    const totalProperties = await prisma.property.count({ where: { isArchived: false } })
    const vacantProperties = await prisma.property.count({ where: { isVacant: true, isArchived: false } })
    const occupiedProperties = totalProperties - vacantProperties
    const totalApplications = await prisma.application.count()
    const pendingApplications = await prisma.application.count({ where: { status: 'PENDING' } })
    const totalUsers = await prisma.user.count({ where: { role: 'USER' } })

    const recentApplications = await prisma.application.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true, avatar: true } },
        property: { select: { title: true } }
      }
    })

    return {
      properties: {
        total: totalProperties,
        vacant: vacantProperties,
        occupied: occupiedProperties
      },
      applications: {
        total: totalApplications,
        pending: pendingApplications,
        recent: recentApplications
      },
      users: {
        total: totalUsers
      }
    }

  } catch (error: any) {
    console.error('Fetch analytics error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch analytics'
    })
  }
})
