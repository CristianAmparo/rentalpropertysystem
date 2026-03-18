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
    <section class="py-16 lg:py-24 bg-white dark:bg-gray-950">
      <UContainer class="px-4 py-4 md:px-8 md:py-8">
        <div class="flex items-center justify-between mb-10">
          <div>
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Featured Properties</h2>
            <p class="mt-2 text-gray-500 dark:text-gray-400">Explore our most popular and newly listed homes.</p>
          </div>
          <UButton to="/properties" variant="ghost" color="primary" trailing-icon="i-heroicons-arrow-right">
            View all
          </UButton>
        </div>
        
        <!-- Placeholder Grid (will be replaced with actual data later) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <UCard v-for="i in 3" :key="i" class="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800" :ui="{ body: { padding: '!p-0' } }">
            <div class="aspect-4/3 bg-gray-200 dark:bg-gray-800 relative w-full overflow-hidden">
              <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                <UIcon name="i-heroicons-photo" class="w-12 h-12" />
              </div>
            </div>
            <div class="p-5 flex flex-col flex-1">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white truncate">Sample Property {{ i }}</h3>
                <span class="font-semibold text-primary-500 whitespace-nowrap">$1,200/mo</span>
              </div>
              <p class="text-sm text-gray-500 mb-4 flex-1 line-clamp-2">A beautiful sample property located in a great neighborhood. Coming soon in Step 5.</p>
              <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span class="flex items-center gap-1"><UIcon name="i-heroicons-home" class="w-4 h-4"/> 3 Bed</span>
                <span class="flex items-center gap-1"><UIcon name="i-heroicons-sparkles" class="w-4 h-4"/> 2 Bath</span>
              </div>
              <UButton :to="'/properties/sample-' + i" block color="gray" variant="solid">View Details</UButton>
            </div>
          </UCard>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<script setup>
// Page configuration
useHead({
  title: 'RentalProperty - Find Your Perfect Home',
})
</script>
