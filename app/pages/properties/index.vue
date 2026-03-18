<template>
  <UContainer class="px-4 py-4 md:px-8 md:py-8">
    <!-- Header -->
    <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Browse Properties</h1>
        <p class="text-gray-500 mt-2">Find the perfect place to call home from our extensive catalog.</p>
      </div>
      <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
        Showing {{ filteredProperties.length }} of {{ totalProperties }} properties
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
          <UInput v-model.number="filters.maxPrice" type="number" placeholder="Max Price" class="w-full" />
        </UFormField>

        <!-- Bedrooms -->
        <UFormField label="Bedrooms">
          <UInput v-model.number="filters.bedrooms" type="number" min="1" placeholder="Min Bedrooms" class="w-full" />
        </UFormField>

        <!-- Bathrooms -->
        <UFormField label="Bathrooms">
          <UInput v-model.number="filters.bathrooms" type="number" min="1" placeholder="Min Bathrooms" class="w-full" />
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
    <ClientOnly>
      <template #fallback>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <UCard v-for="i in 6" :key="i" class="flex flex-col h-full shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-0">
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
        <UCard v-for="i in 6" :key="i" class="flex flex-col h-full shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-0">
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
      <div v-else-if="filteredProperties.length > 0" class="flex flex-col gap-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PropertyCard 
            v-for="property in filteredProperties" 
            :key="property.id" 
            :property="property" 
          />
        </div>
        
        <!-- Pagination Component -->
        <div v-if="totalPages > 1" class="flex justify-center mt-4 pt-8 border-t border-gray-100 dark:border-gray-800">
          <UPagination 
            v-model:page="page"
            :items-per-page="limit" 
            :total="totalProperties" 
          />
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
        <UIcon name="i-heroicons-home-modern" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No properties found</h3>
        <p class="text-gray-500 max-w-sm mx-auto mb-6">We couldn't find any properties matching your current filters. Try adjusting your search criteria.</p>
        <UButton color="primary" @click="clearFilters">Clear all filters</UButton>
      </div>
    </ClientOnly>
  </UContainer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { watchDebounced } from '@vueuse/core'

useHead({
  title: 'Browse Properties - RentalProperty',
})

// Filter state for UI inputs
const filters = ref({
  search: '',
  maxPrice: null,
  bedrooms: null,
  bathrooms: null
})

// Pagination state
const page = ref(1)
const limit = ref(9)

// Separate state for the actual API query to decouple reactivity
const apiQuery = ref({
  page: page.value,
  limit: limit.value
})

// Watch page separately to update apiQuery when user clicks pagination, preserving existing active filters
watch(page, (newPage) => {
  apiQuery.value = { ...apiQuery.value, page: newPage }
  
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

// Watch the filters deeply and debounce the update to apiQuery
watchDebounced(filters, () => {
  const params = {
    page: 1, // Reset to page 1 on filter change
    limit: limit.value
  }
  if (filters.value.search) params.search = filters.value.search
  if (filters.value.maxPrice) params.maxPrice = filters.value.maxPrice
  if (filters.value.bedrooms) params.bedrooms = filters.value.bedrooms
  if (filters.value.bathrooms) params.bathrooms = filters.value.bathrooms
  
  page.value = 1 // Reset UI page state
  apiQuery.value = params
}, { debounce: 500, deep: true })

// Check if any filter is active (still use immediate filters for snappy UI updates for the Clear button)
const hasActiveFilters = computed(() => {
  return !!filters.value.search || 
         !!filters.value.maxPrice || 
         !!filters.value.bedrooms || 
         !!filters.value.bathrooms
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

// Fetch dynamic properties from backend using the debounced query state
const { data: response, status } = await useLazyFetch('/api/properties', {
  query: apiQuery,
  watch: [apiQuery, page] // Explicitly watch BOTH the apiQuery object and the page ref
})

const pending = computed(() => status.value === 'pending')

const filteredProperties = computed(() => {
  return response.value?.data || []
})

const totalProperties = computed(() => response.value?.total || 0)
const totalPages = computed(() => response.value?.totalPages || 0)
</script>
