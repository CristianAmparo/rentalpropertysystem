<template>
  <div>
    <!-- Hero Section -->
    <section class="relative py-20 lg:py-32 overflow-hidden">
      <!-- Background pattern -->
      <div class="absolute inset-0 bg-primary-50 dark:bg-gray-900 -z-10"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -z-10"></div>
      
      <UContainer class="px-4 py-4 md:px-8 md:py-8">
        <div class="max-w-3xl">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Find Your Next Perfect Home with Ease
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
            Discover a wide range of premium rental properties tailored to your lifestyle. Apply online seamlessly and manage your tenancy all in one place.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <UButton to="/properties" size="xl" color="primary" label="Browse Properties" class="font-semibold justify-center" />
            <UButton to="/about" size="xl" color="gray" variant="solid" label="Learn More" class="font-semibold justify-center text-center" />
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Featured Properties Placeholder -->
    <section class="py-5 lg:py-8 bg-white dark:bg-gray-950">
      <UContainer class="px-4 py-4 md:px-8 md:py-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-10">
          <div>
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Featured Properties</h2>
            <p class="mt-2 text-gray-500 dark:text-gray-400">Explore our most popular and newly listed homes.</p>
          </div>
          <div class="flex justify-start sm:justify-end">
            <UButton to="/properties" variant="ghost" color="primary" trailing-icon="i-heroicons-arrow-right" class="pl-0 sm:pl-3">
              View all
            </UButton>
          </div>
        </div>
        
        <!-- Featured Properties Grid -->
        <ClientOnly>
          <template #fallback>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <UCard v-for="i in 3" :key="i" class="flex flex-col h-full shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-0">
                 <USkeleton class="aspect-4/3 w-full" />
                 <div class="p-5 flex flex-col gap-4">
                   <USkeleton class="h-6 w-3/4" />
                   <USkeleton class="h-4 w-1/2" />
                   <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-3 gap-2">
                     <USkeleton class="h-4 w-full" />
                     <USkeleton class="h-4 w-full" />
                     <USkeleton class="h-4 w-full" />
                   </div>
                 </div>
              </UCard>
            </div>
          </template>

          <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <UCard v-for="i in 3" :key="i" class="flex flex-col h-full shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-0">
                 <USkeleton class="aspect-4/3 w-full" />
                 <div class="p-5 flex flex-col gap-4">
                   <USkeleton class="h-6 w-3/4" />
                   <USkeleton class="h-4 w-1/2" />
                   <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-3 gap-2">
                     <USkeleton class="h-4 w-full" />
                     <USkeleton class="h-4 w-full" />
                     <USkeleton class="h-4 w-full" />
                   </div>
                 </div>
              </UCard>
          </div>
          <div v-else-if="featuredProperties && featuredProperties.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <PropertyCard 
              v-for="property in featuredProperties" 
              :key="property.id" 
              :property="property" 
            />
          </div>
          <div v-else class="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
             No featured properties available at this time.
          </div>
        </ClientOnly>
      </UContainer>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Page configuration
useHead({
  title: 'RentalProperty - Find Your Perfect Home',
})

const { data: featuredProperties, status } = await useLazyFetch('/api/properties/featured')
const pending = computed(() => status.value === 'pending')
</script>
