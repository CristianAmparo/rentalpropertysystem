<template>
  <div class="py-12 bg-gray-50 dark:bg-gray-950 min-h-screen">
    <UContainer class="px-4 py-4 md:px-8 md:py-8">
      <div class="mb-8">
        <UBreadcrumb :links="links" class="mb-4" />
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">My Applications</h1>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="space-y-4">
        <USkeleton class="h-32 w-full mb-4" />
        <USkeleton class="h-32 w-full" />
      </div>

      <!-- Empty State -->
      <UCard v-else-if="!userApplications || userApplications.length === 0" class="shadow-md hover:shadow-lg transition-shadow">
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

      <!-- Applications List -->
      <div v-else class="space-y-4">
        <UCard v-for="app in userApplications" :key="app.id" class="shadow-sm hover:shadow-md transition-shadow">
          <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
            
            <div class="flex items-start gap-4 flex-1">
              <div class="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden shrink-0">
                <img v-if="app.propertyImage" :src="app.propertyImage" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800">
                  <UIcon name="i-heroicons-photo" class="w-8 h-8" />
                </div>
              </div>

              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-medium text-gray-500">App #{{ app.id.split('-')[0].toUpperCase() }}</span>
                  <UBadge :color="getStatusColor(app.status)" variant="subtle" size="sm">{{ app.status }}</UBadge>
                </div>
                <NuxtLink :to="`/properties/${app.propertyId}`" class="text-lg font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-1">
                  {{ app.propertyTitle }}
                </NuxtLink>
                <p class="text-sm text-gray-500 mt-1 line-clamp-1 border-b border-gray-100 dark:border-gray-800 pb-2">{{ app.propertyAddress }}</p>
                <p class="text-xs text-gray-400 mt-2">Submitted on {{ new Date(app.dateApplied).toLocaleDateString() }}</p>
              </div>
            </div>
            
            <div class="flex flex-col sm:flex-row items-end sm:items-center gap-2 mt-4 md:mt-0">
              <UButton color="gray" variant="soft" icon="i-heroicons-arrow-down-tray" v-if="app.documents && app.documents.length">
                {{ app.documents.length }} Docs
              </UButton>
            </div>
          </div>
        </UCard>
      </div>

    </UContainer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useApplications } from '../../composables/useApplications'

definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'My Applications - RentalProperty',
})

const { fetchUserApplications } = useApplications()
const { data: userApplications, pending } = await useAsyncData('user-apps', () => fetchUserApplications())

const links = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Applications', to: '/dashboard/applications' }
]

const getStatusColor = (status) => {
  switch (status) {
    case 'APPROVED': return 'green'
    case 'REJECTED': return 'red'
    case 'PENDING':
    default: return 'yellow'
  }
}
</script>
