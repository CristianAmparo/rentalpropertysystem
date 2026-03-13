<template>
  <div class="py-12 bg-gray-50 dark:bg-gray-950 min-h-screen">
    <UContainer>
      
      <div class="mb-8">
        <UBreadcrumb :links="links" class="mb-4" />
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Saved Properties</h1>
        </div>
      </div>

      <UCard class="shadow-md hover:shadow-lg transition-shadow">
        <div class="text-center py-16">
          <UIcon name="i-heroicons-heart" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No saved properties yet</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Properties you favorite while browsing will appear here so you can easily find them later.
          </p>
          <UButton to="/properties" color="primary" size="lg">
            Browse Properties
          </UButton>
        </div>
      </UCard>
      
    </UContainer>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'Saved Properties - RentalProperty',
})

const links = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Saved Properties', to: '/dashboard/saved-properties' }
]
</script>
