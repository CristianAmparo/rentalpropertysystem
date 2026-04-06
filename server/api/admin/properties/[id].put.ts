import { defineEventHandler, createError, readBody } from 'h3'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing ID' })

  try {
    const body = await readBody(event)
    
    const property = await prisma.property.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        price: body.price !== undefined ? Number(body.price) : undefined,
        address: body.address,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
        beds: body.beds !== undefined ? Number(body.beds) : undefined,
        baths: body.baths !== undefined ? Number(body.baths) : undefined,
        sqft: body.sqft !== undefined ? Number(body.sqft) : null,
        type: body.type,
        amenities: body.amenities,
        images: body.images,
        videos: body.videos,
        isVacant: body.isVacant === true || body.isVacant === 'true',
        isArchived: body.isArchived === true || body.isArchived === 'true'
      }
    })

    return property
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: 'Property not found' })
    }
    console.error('Update property error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to update property' })
  }
})
