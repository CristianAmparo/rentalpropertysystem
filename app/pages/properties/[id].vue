<template>
  <UContainer class="py-12">
    <UButton to="/properties" variant="ghost" color="gray" leading-icon="i-heroicons-arrow-left" class="mb-6">
      Back to Properties
    </UButton>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Main Image Placeholder -->
        <div class="aspect-video bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center relative overflow-hidden">
          <UIcon name="i-heroicons-photo" class="w-16 h-16 text-gray-400" />
        </div>

        <div>
          <div class="flex justify-between items-start mb-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Sample Property {{ propertyId }}</h1>
              <p class="text-gray-500 flex items-center gap-1 mt-1">
                <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
                123 Fake Street, Cityville, ST 12345
              </p>
            </div>
          </div>
          
          <div class="prose dark:prose-invert max-w-none mt-6">
            <h3>Description</h3>
            <p>This is a placeholder for the property description. In Step 5, this page will be connected to the database to show real property data, image galleries, and full feature lists.</p>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <UCard class="sticky top-24 shadow-md hover:shadow-lg transition-shadow">
          <div class="mb-6">
            <span class="text-3xl font-bold text-gray-900 dark:text-white">$1,200</span>
            <span class="text-gray-500 dark:text-gray-400"> / month</span>
          </div>

          <div class="space-y-4 mb-6">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">Bedrooms</span>
              <span class="font-medium">3</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">Bathrooms</span>
              <span class="font-medium">2</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">Square Feet</span>
              <span class="font-medium">1,500</span>
            </div>
          </div>

          <UDivider class="my-6" />

          <!-- Apply Now Gateway -->
          <div class="space-y-4">
            <p class="text-sm text-gray-500 text-center mb-2">Like this property? Submit an application today.</p>
            <UButton block size="lg" color="primary" @click="handleApply" class="font-semibold">
              Apply Now
            </UButton>
            <UButton block size="lg" color="gray" variant="solid" icon="i-heroicons-bookmark">
              Save Property
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { isAuthenticated } = useAuth()

const propertyId = route.params.id

useHead({
  title: `Property ${propertyId} - RentalProperty`,
})

// Authentication Gateway Logic
const handleApply = () => {
  if (!isAuthenticated.value) {
    // Redirect to login, appending a callback URL so users are brought back here post-login
    router.push({ path: '/login', query: { callback: `/properties/${propertyId}` } })
  } else {
    // Proceed to application form (implemented in Step 7)
    alert('Application workflow to be implemented in Step 7!')
  }
}
</script>
