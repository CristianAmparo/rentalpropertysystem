import { defineEventHandler, getQuery } from 'h3'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  // Build Prisma where clause based on query parameters
  const where: any = {
    isArchived: false
  }

  // Search by title or address
  if (query.search) {
    const searchTerm = String(query.search)
    where.OR = [
      { title: { contains: searchTerm } },
      { address: { contains: searchTerm } },
      { city: { contains: searchTerm } },
      { zipCode: { contains: searchTerm } },
    ]
  }

  // Filter by multiple IDs (used for saved properties)
  if (query.ids) {
    const idsString = String(query.ids)
    if (idsString) {
      where.id = { in: idsString.split(',') }
    }
  }

  // Max price
  if (query.maxPrice) {
    where.price = { lte: parseFloat(String(query.maxPrice)) }
  }

  // Minimum bedrooms
  if (query.bedrooms) {
    where.beds = { gte: parseInt(String(query.bedrooms), 10) }
  }

  // Minimum bathrooms
  if (query.bathrooms) {
    where.baths = { gte: parseFloat(String(query.bathrooms)) }
  }

  // Pagination
  const page = parseInt(String(query.page || '1'), 10)
  const limit = parseInt(String(query.limit || '9'), 10)
  const skip = (page - 1) * limit

  try {
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.property.count({ where })
    ])
    
    // Map standard fields to match frontend expectations if necessary
    const mappedProperties = properties.map((p: any) => ({
      ...p,
      bedrooms: p.beds, // Frontend uses bedrooms
      bathrooms: p.baths, // Frontend uses bathrooms
      image: p.images && Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null // provide a primary image
    }))

    return {
      data: mappedProperties,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  } catch (error) {
    console.error('Error fetching properties:', error)
    return { data: [], total: 0, page: 1, limit: 9, totalPages: 0 }
  }
})
