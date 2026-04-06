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

  try {
    const applications = await prisma.application.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        property: {
          select: {
            id: true,
            title: true,
            address: true,
            price: true,
            images: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format for easier UI consumption if necessary
    return applications.map((app: any) => {
      let propertyImage = null
      if (app.property.images) {
        try {
          const imgArray = typeof app.property.images === 'string' 
            ? JSON.parse(app.property.images) 
            : app.property.images
          if (Array.isArray(imgArray) && imgArray.length > 0) {
            propertyImage = imgArray[0]
          }
        } catch (e) {}
      }

      return {
        ...app,
        propertyImage
      }
    })

  } catch (error: any) {
    console.error('Fetch all applications error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch applications'
    })
  }
})
