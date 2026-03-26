import { defineEventHandler, createError } from 'h3'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  // Enforce authentication
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  try {
    // Return all applications for the authenticated user natively from the db
    const applications = await prisma.application.findMany({
      where: {
        userId: user.id
      },
      include: {
        property: {
          select: {
             id: true,
             title: true,
             price: true,
             address: true,
             images: true, // Need to fetch images array
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format the data explicitly to map to our Application composable shapes
    const formattedApplications = applications.map((app: any) => {
      // Safely process images. Prisma Json types can be unpredictable.
      let propertyImage = null
      if (app.property.images) {
        try {
          // If it's a stringified JSON array, parse it.
          const imgArray = typeof app.property.images === 'string' 
            ? JSON.parse(app.property.images) 
            : app.property.images
            
          if (Array.isArray(imgArray) && imgArray.length > 0) {
            propertyImage = imgArray[0]
          }
        } catch (e) {
          // Ignore parse errors, image defaults to null
        }
      }

      return {
        id: app.id,
        propertyId: app.propertyId,
        propertyTitle: app.property.title,
        propertyAddress: app.property.address,
        propertyImage: propertyImage,
        dateApplied: app.createdAt.toISOString(),
        status: app.status,
        // Ensure form data parsing is safe
        formData: app.notes ? JSON.parse(app.notes) : {},
        documents: app.documents
      }
    })

    return formattedApplications

  } catch (error: any) {
    console.error('Fetch applications error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch user applications'
    })
  }
})
