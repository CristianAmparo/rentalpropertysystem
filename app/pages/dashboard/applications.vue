<template>
  <div class="py-12 bg-gray-50 dark:bg-gray-950 min-h-screen">
    <UContainer>
      <div class="mb-8">
        <UBreadcrumb :links="links" class="mb-4" />
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">My Applications</h1>
        </div>
      </div>

      <UCard class="shadow-md hover:shadow-lg transition-shadow">
        <div class="text-center py-16">
          <UIcon name="i-heroicons-document-text" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No active applications</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            You haven't applied to any properties yet. Once you submit an application, you can track its status here.
          </p>
          <UButton to="/properties" color="primary" size="lg">
            Find a Property
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
  title: 'My Applications - RentalProperty',
})

const links = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Applications', to: '/dashboard/applications' }
]
</script>
