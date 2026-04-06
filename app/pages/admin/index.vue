<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">Overview of your rental operations.</p>
    </div>

    <!-- Analytics Cards -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      <UCard v-for="i in 4" :key="i" class="h-32 bg-gray-100 dark:bg-gray-800" />
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard class="shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
            <UIcon name="i-heroicons-home" class="w-7 h-7" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Properties</p>
            <p class="text-2xl font-bold">{{ data?.properties.total }}</p>
          </div>
        </div>
      </UCard>

      <UCard class="shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
            <UIcon name="i-heroicons-check-circle" class="w-7 h-7" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Occupied</p>
            <p class="text-2xl font-bold">{{ data?.properties.occupied }}</p>
          </div>
        </div>
      </UCard>

      <UCard class="shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
            <UIcon name="i-heroicons-document-text" class="w-7 h-7" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Apps</p>
            <p class="text-2xl font-bold">{{ data?.applications.pending }}</p>
          </div>
        </div>
      </UCard>

      <UCard class="shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
            <UIcon name="i-heroicons-users" class="w-7 h-7" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
            <p class="text-2xl font-bold">{{ data?.users.total }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Charts / Recent Activity Placeholders -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <UCard class="flex flex-col">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">Occupancy Rate</h2>
            <UBadge variant="subtle" color="primary">Real-time</UBadge>
          </div>
        </template>
        <div class="flex-1 flex items-center justify-center min-h-[16rem]">
           <Doughnut v-if="data" :data="chartData" :options="chartOptions" />
        </div>
      </UCard>

      <UCard class="flex flex-col">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">Recent Applications</h2>
            <UButton to="/admin/applications" variant="link" color="primary" label="View all" />
          </div>
        </template>
        <div class="flex-1 overflow-y-auto">
           <div v-if="data?.applications?.recent?.length === 0" class="flex flex-col items-center justify-center h-full text-gray-500">
             <UIcon name="i-heroicons-inbox" class="w-12 h-12 mb-2 text-gray-300 dark:text-gray-600" />
             <p>No recent applications</p>
           </div>
           <div v-else class="space-y-4">
             <div v-for="app in data?.applications?.recent" :key="app.id" class="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
               <UAvatar :src="app.user.avatar || ''" :alt="app.user.name" size="md" />
               <div class="flex-1 min-w-0">
                 <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ app.user.name }}</p>
                 <p class="text-xs text-gray-500 truncate">Applied for {{ app.property.title }}</p>
               </div>
               <UBadge :color="app.status === 'APPROVED' ? 'green' : app.status === 'REJECTED' ? 'red' : 'yellow'" variant="subtle">
                 {{ app.status }}
               </UBadge>
             </div>
           </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { fetchAnalytics } = useAdmin()
const { data, pending } = useAsyncData('admin-analytics', () => fetchAnalytics())

const chartData = computed(() => ({
  labels: ['Vacant', 'Occupied'],
  datasets: [
    {
      backgroundColor: ['#f87171', '#4ade80'],
      borderColor: ['#ef4444', '#22c55e'],
      data: [data.value?.properties?.vacant || 0, data.value?.properties?.occupied || 0]
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}
</script>
