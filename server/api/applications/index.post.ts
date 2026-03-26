import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  // Enforce authentication
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized. Please log in to submit applications.',
    })
  }

  const body = await readBody(event)
  const { propertyId, formData, documents } = body

  if (!propertyId || !formData) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing property ID or application form data.',
    })
  }

  try {
    // 1. Verify the property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    })
    
    if (!property) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Property not found.'
      })
    }

    // 2. Check if the user already applied for this property
    const existingApplication = await prisma.application.findFirst({
      where: {
        userId: user.id,
        propertyId: propertyId
      }
    })

    if (existingApplication) {
      throw createError({
        statusCode: 400,
        statusMessage: 'You have already submitted an application for this property.'
      })
    }

    // 3. Create the real application record
    const application = await prisma.application.create({
      data: {
        userId: user.id,
        propertyId,
        status: 'PENDING',
        // Bundle ALL the multi-step form data
        notes: JSON.stringify(formData), 
        // Bundle the uploaded document URLs
        documents: documents || [], 
      },
      // Include property data to easily return the success payload to the front-end
      include: {
        property: {
          select: { title: true, price: true, images: true } // Return basic property details for context
        }
      }
    })

    return {
      success: true,
      application
    }

  } catch (error: any) {
    console.error('Submit application error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to submit application'
    })
  }
})
