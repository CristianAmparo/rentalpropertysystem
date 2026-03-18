<template>
  <div class="py-12 bg-gray-50 dark:bg-gray-950 min-h-screen">
    <UContainer class="px-4 py-4 md:px-8 md:py-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Tenant Dashboard</h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {{ user?.name || user?.email }}</p>
        </div>
        
        <UButton to="/properties" color="primary" icon="i-heroicons-magnifying-glass">
          Find Properties
        </UButton>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Quick Stats Cards -->
        <UCard class="bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
              <UIcon name="i-heroicons-heart" class="w-6 h-6" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Saved Properties</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ savedPropertyIds.length }}</p>
            </div>
          </div>
          <NuxtLink to="/dashboard/saved-properties" class="text-sm text-primary-600 hover:text-primary-500 mt-4 inline-block font-medium">View saved &rarr;</NuxtLink>
        </UCard>

        <UCard class="bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-500">
              <UIcon name="i-heroicons-document-text" class="w-6 h-6" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Applications</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ activeAppCount }}</p>
            </div>
          </div>
          <NuxtLink to="/dashboard/applications" class="text-sm text-yellow-600 hover:text-yellow-500 mt-4 inline-block font-medium">Track status &rarr;</NuxtLink>
        </UCard>

        <UCard class="bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
              <UIcon name="i-heroicons-home" class="w-6 h-6" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Current Lease</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">None</p>
            </div>
          </div>
          <span class="text-sm text-gray-400 mt-4 inline-block">No active rentals</span>
        </UCard>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <UCard class="shadow-md hover:shadow-lg transition-shadow">
            <template #header>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            </template>
            <div class="text-center py-12">
              <UIcon name="i-heroicons-clock" class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p class="text-gray-500 dark:text-gray-400">No recent activity yet.</p>
              <UButton to="/properties" variant="soft" color="primary" class="mt-4">
                Start Exploring
              </UButton>
            </div>
          </UCard>
        </div>

        <div>
          <UCard class="shadow-md hover:shadow-lg transition-shadow">
            <template #header>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Account Settings</h2>
            </template>
            <div class="space-y-4">
              <NuxtLink to="/profile" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-600 dark:text-gray-300">
                    <UIcon name="i-heroicons-user" class="w-5 h-5" />
                  </div>
                  <span class="font-medium text-gray-900 dark:text-white">Profile details</span>
                </div>
                <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-400" />
              </NuxtLink>

              <NuxtLink to="/profile/security" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-600 dark:text-gray-300">
                    <UIcon name="i-heroicons-lock-closed" class="w-5 h-5" />
                  </div>
                  <span class="font-medium text-gray-900 dark:text-white">Security & Password</span>
                </div>
                <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-400" />
              </NuxtLink>

              <button @click="handleLogout" class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-red-600 dark:text-red-400">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-red-100 dark:bg-red-900/20 rounded-md">
                    <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5" />
                  </div>
                  <span class="font-medium">Sign out</span>
                </div>
              </button>
            </div>
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProperties } from '../../composables/useProperties'
import { useApplications } from '../../composables/useApplications'

definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'Dashboard - RentalProperty',
})

const { user, logout } = useAuth()
const { savedPropertyIds } = useProperties()
const { getActiveApplicationsCount } = useApplications()

const activeAppCount = computed(() => getActiveApplicationsCount())

const handleLogout = async () => {
  await logout()
  navigateTo('/')
}
</script>
