import { defineEventHandler, createError, readBody } from 'h3'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  try {
    const body = await readBody(event)
    
    const property = await prisma.property.create({
      data: {
        title: body.title,
        description: body.description,
        price: Number(body.price),
        address: body.address,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
        beds: Number(body.beds),
        baths: Number(body.baths),
        sqft: body.sqft ? Number(body.sqft) : null,
        type: body.type,
        amenities: body.amenities || [],
        images: body.images || [],
        videos: body.videos || [],
        isVacant: body.isVacant === true || body.isVacant === 'true' || body.isVacant === undefined
      }
    })

    return property
  } catch (error) {
    console.error('Create property error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to create property' })
  }
})
