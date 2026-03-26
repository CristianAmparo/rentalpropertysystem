import pkg from '@prisma/client'
const { PrismaClient } = pkg
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const adapter = new PrismaMariaDb("mysql://root@127.0.0.1:3306/rentalproperty")
const prisma = new PrismaClient({ adapter })

async function main() {
  const properties = [
    {
      title: "Luxury Oceanview Condo",
      description: "A stunning 2-bedroom condo with panoramic ocean views. Fully furnished and ready to move in. Includes state-of-the-art appliances and building amenities.",
      price: 150000,
      address: "123 Coastal Drive",
      city: "Cebu City",
      state: "Cebu",
      zipCode: "6000",
      beds: 2,
      baths: 2,
      sqft: 1200,
      type: "CONDO",
      amenities: ["Ocean View", "Pool", "Gym", "Concierge", "Parking"],
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1de2d93688?w=800&q=80",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80"
      ],
      videos: [
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
      ]
    },
    {
      title: "Modern Minimalist Townhouse",
      description: "Sleek and modern townhouse located in the heart of the tech district. Perfect for professionals looking for convenience and style.",
      price: 85000,
      address: "456 Silicon Avenue",
      city: "Makati",
      state: "Metro Manila",
      zipCode: "1226",
      beds: 3,
      baths: 2.5,
      sqft: 1800,
      type: "TOWNHOUSE",
      amenities: ["Smart Home", "Rooftop Terrace", "Garage", "High-speed Internet"],
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80"
      ],
      videos: [
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
      ]
    },
    {
      title: "Cozy Suburban Family Home",
      description: "Spacious family home in a quiet neighborhood. Features a large backyard, open-concept kitchen, and proximity to top-rated schools.",
      price: 45000,
      address: "789 Maple Lane",
      city: "Quezon City",
      state: "Metro Manila",
      zipCode: "1100",
      beds: 4,
      baths: 3,
      sqft: 2400,
      type: "HOUSE",
      amenities: ["Backyard", "Basement", "Fireplace", "Playroom"],
      images: [
        "https://images.unsplash.com/photo-1542861623-e6ef6eace254?w=800&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80"
      ],
      videos: [
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
      ]
    },
    {
      title: "Downtown Studio Loft",
      description: "Industrial-chic studio loft with exposed brick walls, huge windows, and incredibly high ceilings. Steps away from the best cafes.",
      price: 30000,
      address: "321 Art District Blvd",
      city: "Taguig",
      state: "Metro Manila",
      zipCode: "1630",
      beds: 1,
      baths: 1,
      sqft: 800,
      type: "APARTMENT",
      amenities: ["Exposed Brick", "High Ceilings", "Pet Friendly", "In-unit Laundry"],
      images: [
        "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&q=80",
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80"
      ],
      videos: [
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      ]
    },
    {
      title: "Serene Garden Villa",
      description: "A gorgeous villa surrounded by lush gardens. A true oasis in the city with a private courtyard and exquisite architectural details.",
      price: 250000,
      address: "999 Oasis Road",
      city: "Antipolo",
      state: "Rizal",
      zipCode: "1870",
      beds: 5,
      baths: 4.5,
      sqft: 3500,
      type: "HOUSE",
      amenities: ["Private Garden", "Courtyard", "Wine Cellar", "Home Theater", "Gated Security"],
      images: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
        "https://images.unsplash.com/photo-1600607688969-93e1b7829871?w=800&q=80",
        "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80"
      ],
      videos: [
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"
      ]
    }
  ]
  
  for (const property of properties) {
    const created = await prisma.property.create({
      data: property as any
    })
    console.log(`Created property: ${created.title}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
