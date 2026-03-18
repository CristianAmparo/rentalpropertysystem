import { useState } from '#app'

// Global state for saved properties (persists across page navigations in the current session)
export const useSavedProperties = () => {
  return useState<string[]>('saved-properties', () => [])
}

export const useProperties = () => {
  const savedPropertyIds = useSavedProperties()

  // Mock database of properties
  const properties = [
    {
      id: 'sample-1',
      title: 'Modern City Apartment',
      address: '123 Downtown Ave, Metro City, ST 12345',
      price: 2400,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1100,
      description: 'Experience luxury living in the heart of downtown. This modern apartment features floor-to-ceiling windows, hardwood floors, and a chef-inspired kitchen with stainless steel appliances. Building amenities include a rooftop pool, 24/7 fitness center, and concierge service.',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800&h=600',
      amenities: ['In-unit Laundry', 'Central A/C', 'Gym Access', 'Pool', 'Pet Friendly']
    },
    {
      id: 'sample-2',
      title: 'Spacious Suburban Home',
      address: '456 Oak Lane, Suburbia, ST 54321',
      price: 3200,
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2500,
      description: 'Perfect family home in a quiet, tree-lined neighborhood. This spacious property boasts a large fenced backyard, attached two-car garage, and a newly renovated master suite. Conveniently located near top-rated schools and shopping centers.',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800&h=600',
      amenities: ['Fenced Yard', 'Garage Parking', 'Dishwasher', 'Fireplace', 'Hardwood Floors']
    },
    {
      id: 'sample-3',
      title: 'Cozy Studio Loft',
      address: '789 Arts District Blvd, Metro City, ST 12345',
      price: 1500,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 750,
      description: 'Creative inspiration awaits in this true industrial loft. Featuring exposed brick walls, 15-foot ceilings, and massive industrial windows that flood the space with natural light. The open floor plan provides the perfect blank canvas for your unique style.',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1de2d9d000?auto=format&fit=crop&q=80&w=800&h=600',
      amenities: ['Exposed Brick', 'High Ceilings', 'Walk-in Closet', 'On-site Laundry']
    },
    {
      id: 'sample-4',
      title: 'Luxury Waterfront Condo',
      address: '101 Marina Way, Bayview, ST 98765',
      price: 4500,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      description: 'Wake up to breathtaking ocean views every morning. This premium corner unit offers panoramic vistas of the marina, a wraparound private balcony, and high-end finishes throughout. The exclusive community provides resort-style living year-round.',
      image: 'https://images.unsplash.com/photo-1515263487990-61b07216b5ff?auto=format&fit=crop&q=80&w=800&h=600',
      amenities: ['Water View', 'Balcony', 'Secure Access', 'Pool', 'Fitness Center']
    },
    {
      id: 'sample-5',
      title: 'Charming Historic Townhouse',
      address: '222 Heritage Row, Old Town, ST 34567',
      price: 2800,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1600,
      description: 'Step back in time without sacrificing modern convenience. This beautifully restored 19th-century townhouse retains its original crown moldings and hardwood floors while offering a fully updated chef\'s kitchen and modern climate control.',
      image: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=800&h=600',
      amenities: ['Historic Details', 'Updated Kitchen', 'Private Patio', 'Street Parking']
    },
    {
      id: 'sample-6',
      title: 'Minimalist Eco-Apartment',
      address: '333 Green Tech Park, Innovation City, ST 11223',
      price: 2100,
      bedrooms: 2,
      bathrooms: 1,
      sqft: 950,
      description: 'Live sustainably in this LEED-certified smart apartment. Equipped with solar integration, energy-efficient appliances, and a fully automated smart home system. Building features community gardens and electric vehicle charging stations.',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800&h=600',
      amenities: ['Smart Home Integration', 'Energy Efficient', 'EV Charging', 'Community Garden']
    }
  ]

  const getProperties = () => {
    return properties
  }

  const getPropertyById = (id: string) => {
    return properties.find(p => p.id === id) || null
  }

  const toggleSaveProperty = (id: string) => {
    if (savedPropertyIds.value.includes(id)) {
      savedPropertyIds.value = savedPropertyIds.value.filter(pid => pid !== id)
      return false // Not saved
    } else {
      savedPropertyIds.value.push(id)
      return true // Saved
    }
  }

  const isPropertySaved = (id: string) => {
    return savedPropertyIds.value.includes(id)
  }
  
  const getSavedProperties = () => {
    return properties.filter(p => savedPropertyIds.value.includes(p.id))
  }

  return {
    properties,
    savedPropertyIds,
    getProperties,
    getPropertyById,
    toggleSaveProperty,
    isPropertySaved,
    getSavedProperties
  }
}
