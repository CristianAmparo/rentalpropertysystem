<template>
  <UContainer class="px-4 py-4 md:px-8 md:py-8">
    <!-- Header -->
    <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Browse Properties</h1>
        <p class="text-gray-500 mt-2">Find the perfect place to call home from our extensive catalog.</p>
      </div>
      <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
        Showing {{ filteredProperties.length }} properties
      </div>
    </div>

    <!-- Filters Section -->
    <div class="mb-8 p-4 md:p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Search Input -->
        <UFormField label="Search">
          <UInput v-model="filters.search" placeholder="City, neighborhood, or address..." icon="i-heroicons-magnifying-glass" class="w-full" />
        </UFormField>

        <!-- Price Range -->
        <UFormField label="Max Price">
          <USelectMenu v-model="filters.maxPrice" :options="priceOptions" placeholder="Any Price" class="w-full" />
        </UFormField>

        <!-- Bedrooms -->
        <UFormField label="Bedrooms">
          <USelectMenu v-model="filters.bedrooms" :options="roomOptions" placeholder="Any" class="w-full" />
        </UFormField>

        <!-- Bathrooms -->
        <UFormField label="Bathrooms">
          <USelectMenu v-model="filters.bathrooms" :options="roomOptions" placeholder="Any" class="w-full" />
        </UFormField>
      </div>

      <!-- Clear Filters -->
      <div class="mt-4 flex justify-end" v-if="hasActiveFilters">
        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="clearFilters">
          Clear Filters
        </UButton>
      </div>
    </div>

    <!-- Property Grid -->
    <div v-if="filteredProperties.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <PropertyCard 
        v-for="property in filteredProperties" 
        :key="property.id" 
        :property="property" 
      />
    </div>
    
    <!-- Empty State -->
    <div v-else class="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
      <UIcon name="i-heroicons-home-modern" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No properties found</h3>
      <p class="text-gray-500 max-w-sm mx-auto mb-6">We couldn't find any properties matching your current filters. Try adjusting your search criteria.</p>
      <UButton color="primary" @click="clearFilters">Clear all filters</UButton>
    </div>
  </UContainer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProperties } from '../../composables/useProperties'

useHead({
  title: 'Browse Properties - RentalProperty',
})

const { getProperties } = useProperties()
const properties = getProperties()

// Filter options
const priceOptions = [
  { label: 'Any Price', value: null },
  { label: 'Up to $1,500', value: 1500 },
  { label: 'Up to $2,000', value: 2000 },
  { label: 'Up to $3,000', value: 3000 },
  { label: 'Up to $4,000', value: 4000 },
  { label: 'Up to $5,000', value: 5000 },
]

const roomOptions = [
  { label: 'Any', value: null },
  { label: '1+', value: 1 },
  { label: '2+', value: 2 },
  { label: '3+', value: 3 },
  { label: '4+', value: 4 },
]

// Filter state
const filters = ref({
  search: '',
  maxPrice: null,
  bedrooms: null,
  bathrooms: null
})

// Check if any filter is active
const hasActiveFilters = computed(() => {
  return filters.value.search !== '' || 
         filters.value.maxPrice !== null || 
         filters.value.bedrooms !== null || 
         filters.value.bathrooms !== null
})

// Clear all filters
const clearFilters = () => {
  filters.value = {
    search: '',
    maxPrice: null,
    bedrooms: null,
    bathrooms: null
  }
}

// Filtered properties logic
const filteredProperties = computed(() => {
  return properties.filter(p => {
    // Search filter (address or title)
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      if (!p.title.toLowerCase().includes(searchTerm) && !p.address.toLowerCase().includes(searchTerm)) {
        return false
      }
    }
    
    // Max price filter (comparing to value object)
    if (filters.value.maxPrice && filters.value.maxPrice.value !== null) {
      if (p.price > filters.value.maxPrice.value) {
        return false
      }
    }
    
    // Bedrooms filter
    if (filters.value.bedrooms && filters.value.bedrooms.value !== null) {
      if (p.bedrooms < filters.value.bedrooms.value) {
        return false
      }
    }
    
    // Bathrooms filter
    if (filters.value.bathrooms && filters.value.bathrooms.value !== null) {
      if (p.bathrooms < filters.value.bathrooms.value) {
        return false
      }
    }
    
    return true
  })
})
</script>
