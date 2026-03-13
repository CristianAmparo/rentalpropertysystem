<template>
  <UContainer class="py-12">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Browse Properties</h1>
      <p class="text-gray-500 mt-2">Find the perfect place to call home from our extensive catalog.</p>
    </div>

    <!-- Filters placeholder -->
    <div class="mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      <div class="text-center text-gray-500 py-4">
        Search and filter controls will be implemented in Step 5
      </div>
    </div>

    <!-- Property Grid placeholder -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <UCard v-for="i in 6" :key="i" class="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800" :ui="{ body: { padding: '!p-0' } }">
        <div class="aspect-[4/3] bg-gray-200 dark:bg-gray-800 relative w-full overflow-hidden">
          <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
            <UIcon name="i-heroicons-photo" class="w-12 h-12" />
          </div>
        </div>
        <div class="p-5 flex flex-col flex-1">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white truncate">Sample Property {{ i }}</h3>
            <span class="font-semibold text-primary-500 whitespace-nowrap">$1,200/mo</span>
          </div>
          <p class="text-sm text-gray-500 mb-4 flex-1 line-clamp-2">A beautiful sample property located in a great neighborhood.</p>
          <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <span class="flex items-center gap-1"><UIcon name="i-heroicons-home" class="w-4 h-4"/> 3 Bed</span>
            <span class="flex items-center gap-1"><UIcon name="i-heroicons-sparkles" class="w-4 h-4"/> 2 Bath</span>
          </div>
          <UButton :to="'/properties/sample-' + i" block color="gray" variant="solid">View Details</UButton>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup>
useHead({
  title: 'Browse Properties - RentalProperty',
})
</script>
