<template>
  <UContainer class="px-4 py-4 md:px-8 md:py-8">
    <UButton to="/properties" variant="ghost" color="neutral" leading-icon="i-heroicons-arrow-left" class="mb-6">
      Back to Properties
    </UButton>

    <!-- Handle invalid property IDs -->
    <div v-if="!property" class="text-center py-24">
      <UIcon name="i-heroicons-exclamation-circle" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Property Not Found</h2>
      <p class="text-gray-500 mb-6">The property you are looking for does not exist or has been removed.</p>
      <UButton to="/properties" color="primary">Browse All Properties</UButton>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Main Image/Video -->
        <div class="space-y-4">
          <div class="aspect-video bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center relative overflow-hidden group">
            <template v-if="activeMedia">
              <!-- Background Placeholder -->
              <div class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 z-0">
                <UIcon name="i-heroicons-photo" class="w-16 h-16 mb-2" />
                <span class="text-sm font-medium">No Media Available</span>
              </div>

              <!-- Foreground Media -->
              <img v-if="activeMedia.type === 'image'" :key="`img-${activeMedia.url}`" :src="activeMedia.url" :alt="property.title" class="absolute inset-0 w-full h-full object-cover z-10 bg-gray-200 dark:bg-gray-800 transition-opacity" onerror="this.style.opacity='0'" onload="this.style.opacity='1'" />
              <video v-else-if="activeMedia.type === 'video'" :key="`vid-${activeMedia.url}`" :src="activeMedia.url" controls class="absolute inset-0 w-full h-full bg-black object-contain z-10" />
            </template>
            <div v-else class="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
              <UIcon name="i-heroicons-photo" class="w-16 h-16 mb-2" />
              <span class="text-sm font-medium">No Media Available</span>
            </div>
            
            <!-- Navigation Arrows (only show if multiple media) -->
            <button v-if="mediaList.length > 1" @click="selectedMediaIndex = (selectedMediaIndex - 1 + mediaList.length) % mediaList.length" class="absolute left-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <UIcon name="i-heroicons-chevron-left" class="w-6 h-6" />
            </button>
            <button v-if="mediaList.length > 1" @click="selectedMediaIndex = (selectedMediaIndex + 1) % mediaList.length" class="absolute right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <UIcon name="i-heroicons-chevron-right" class="w-6 h-6" />
            </button>
          </div>
          
          <!-- Thumbnails -->
          <div v-if="mediaList.length > 1" class="flex gap-2 overflow-x-auto pb-2 snap-x">
            <button v-for="(media, index) in mediaList" :key="index" @click="selectedMediaIndex = index" class="relative shrink-0 w-24 h-24 rounded-lg overflow-hidden snap-start transition-all border-2" :class="selectedMediaIndex === index ? 'border-primary-500' : 'border-transparent hover:opacity-80'">
              <template v-if="media.type === 'image'">
                <div class="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 z-0">
                  <UIcon name="i-heroicons-photo" class="w-8 h-8 opacity-50" />
                </div>
                <!-- Image on top -->
                <img :src="media.url" class="absolute inset-0 w-full h-full object-cover z-10 bg-gray-100 dark:bg-gray-800 transition-opacity" onerror="this.style.opacity='0'" onload="this.style.opacity='1'" />
              </template>
              <div v-else-if="media.type === 'video'" class="w-full h-full bg-gray-900 flex items-center justify-center relative">
                <UIcon name="i-heroicons-play-circle" class="w-8 h-8 text-white absolute z-10 drop-shadow-md" />
                <video :src="`${media.url}#t=3.0`" preload="metadata" muted playsinline class="w-full h-full object-cover opacity-60 absolute inset-0 pointer-events-none" />
              </div>
            </button>
          </div>
        </div>

        <div>
          <div class="flex justify-between items-start mb-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ property.title }}</h1>
              <p class="text-gray-500 flex items-center gap-1 mt-1">
                <UIcon name="i-heroicons-map-pin" class="w-4 h-4 shrink-0" />
                {{ property.address }}
              </p>
            </div>
          </div>
          
          <div class="prose dark:prose-invert max-w-none mt-6">
            <h3>Description</h3>
            <p>{{ property.description }}</p>
          </div>

          <div class="mt-8">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Amenities</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
               <div v-for="amenity in property.amenities" :key="amenity" class="flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500 shrink-0" />
                  <span class="text-sm font-medium">{{ amenity }}</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <UCard class="sticky top-24 shadow-md hover:shadow-lg transition-shadow">
          <div class="mb-6">
            <span class="text-3xl font-bold text-gray-900 dark:text-white">₱{{ property.price.toLocaleString('en-US') }}</span>
            <span class="text-gray-500 dark:text-gray-400"> / month</span>
          </div>

          <div class="space-y-4 mb-6">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">Bedrooms</span>
              <span class="font-medium">{{ property.bedrooms }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">Bathrooms</span>
              <span class="font-medium">{{ property.bathrooms }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">Square Feet</span>
              <span class="font-medium">{{ property.sqft.toLocaleString('en-US') }}</span>
            </div>
          </div>

          <UDivider class="my-6" />

          <!-- Apply Now Gateway -->
          <div class="space-y-4">
            <p class="text-sm text-gray-500 text-center mb-2">Like this property? Submit an application today.</p>
            <UButton block size="lg" color="primary" @click="handleApply" class="cursor-pointer font-semibold">
              Apply Now
            </UButton>
            <UButton block size="lg" :color="isSaved ? 'error' : 'neutral'" :variant="isSaved ? 'soft' : 'solid'" :icon="isSaved ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'" @click="handleSave" class="cursor-pointer transition-colors">
              {{ isSaved ? 'Saved to Dashboard' : 'Save Property' }}
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup>

const imageError = ref(false)
const selectedMediaIndex = ref(0)
const brokenThumbnails = ref([])

const route = useRoute()
const router = useRouter()
const { isAuthenticated } = useAuth()
const { toggleSaveProperty, isPropertySaved } = useProperties()

const propertyId = route.params.id
const { data: property, status: propertyStatus } = await useFetch(`/api/properties/${propertyId}`)

const mediaList = computed(() => {
  if (!property.value) return []
  const list = []
  
  // Add images
  if (Array.isArray(property.value.images)) {
    property.value.images.forEach(url => {
      list.push({ type: 'image', url })
    })
  } else if (property.value.image) {
    list.push({ type: 'image', url: property.value.image })
  }
  
  // Add videos
  if (Array.isArray(property.value.videos)) {
    property.value.videos.forEach(url => {
      list.push({ type: 'video', url })
    })
  }
  
  return list
})

const activeMedia = computed(() => {
  if (mediaList.value.length === 0) return null
  return mediaList.value[selectedMediaIndex.value] || mediaList.value[0]
})

// Reset error when changing media
watch(selectedMediaIndex, () => {
  imageError.value = false
})

useHead({
  title: computed(() => property.value ? `${property.value.title} - RentalProperty` : 'Property Not Found'),
})

const isSaved = computed(() => {
  if (!property.value) return false
  return isPropertySaved(property.value.id)
})

const handleSave = () => {
  if (!property.value) return
  if (!isAuthenticated.value) {
    router.push({ path: '/login', query: { callback: route.fullPath } })
    return
  }
  toggleSaveProperty(property.value.id)
}

// Authentication Gateway Logic
const handleApply = () => {
  if (!isAuthenticated.value) {
    // Redirect to login, appending a callback URL so users are brought back here post-login
    router.push({ path: '/login', query: { callback: `/properties/${propertyId}/apply` } })
  } else {
    // Proceed directly to the real application form we built
    router.push(`/properties/${propertyId}/apply`)
  }
}
</script>
