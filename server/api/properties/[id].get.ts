import { defineEventHandler, createError } from 'h3'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Property ID is required'
    })
  }

  try {
    const property = await prisma.property.findUnique({
      where: { id }
    })

    if (!property) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Property not found'
      })
    }

    return {
      ...property,
      bedrooms: property.beds,
      bathrooms: property.baths,
      image: property.images && Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : null
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    
    console.error('Error fetching property by ID:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
