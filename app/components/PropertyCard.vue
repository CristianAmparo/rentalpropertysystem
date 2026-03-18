<template>
  <UCard class="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800 p-0">
    <div class="aspect-4/3 bg-gray-200 dark:bg-gray-800 relative w-full overflow-hidden group block">
      <NuxtLink :to="`/properties/${property.id}`" class="block w-full h-full">
        <img v-if="property.image && !imageError" :src="property.image" :alt="property.title" @error="imageError = true" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800">
          <UIcon name="i-heroicons-photo" class="w-12 h-12 mb-2" />
          <span class="text-xs font-medium text-gray-400">No Image Available</span>
        </div>
      </NuxtLink>

      <!-- Save Button overlay -->
      <button @click.prevent.stop="handleSave" class="cursor-pointer absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-900/90 shadow-sm hover:scale-110 transition-transform backdrop-blur-sm z-10" :class="[isSaved ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300']" :aria-label="isSaved ? 'Unsave property' : 'Save property'">
        <UIcon :name="isSaved ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'" class="w-5 h-5 flex" />
      </button>
      
      <!-- Price overlay -->
      <div class="absolute bottom-3 left-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3 py-1.5 rounded-md font-bold text-primary-600 dark:text-primary-400 shadow-sm">
        ₱{{ property.price.toLocaleString() }}<span class="text-xs font-normal text-gray-500 dark:text-gray-400"> / mo</span>
      </div>
    </div>

    <div class="p-5 flex flex-col flex-1">
      <NuxtLink :to="`/properties/${property.id}`" class="block mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{{ property.title }}</h3>
      </NuxtLink>
      
      <p class="text-sm text-gray-500 flex items-center gap-1 mb-4 truncate">
        <UIcon name="i-heroicons-map-pin" class="w-4 h-4 shrink-0 text-gray-400" />
        <span class="truncate">{{ property.address }}</span>
      </p>

      <div class="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
        <div class="flex items-center justify-center gap-1.5" title="Bedrooms">
          <UIcon name="i-heroicons-home" class="w-4 h-4"/> 
          <span class="font-medium text-gray-900 dark:text-gray-200">{{ property.bedrooms }}</span>
          <span class="hidden sm:inline">Beds</span>
        </div>
        <div class="flex items-center justify-center gap-1.5 border-x border-gray-100 dark:border-gray-800" title="Bathrooms">
          <UIcon name="i-heroicons-sparkles" class="w-4 h-4"/>
          <span class="font-medium text-gray-900 dark:text-gray-200">{{ property.bathrooms }}</span>
          <span class="hidden sm:inline">Baths</span>
        </div>
        <div class="flex items-center justify-center gap-1.5" title="Square Feet">
          <UIcon name="i-heroicons-arrows-pointing-out" class="w-4 h-4"/>
          <span class="font-medium text-gray-900 dark:text-gray-200">{{ property.sqft }}</span>
          <span class="hidden sm:inline">Sqft</span>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useProperties } from '../composables/useProperties'

const props = defineProps({
  property: {
    type: Object,
    required: true
  }
})

const imageError = ref(false)

const { isPropertySaved, toggleSaveProperty } = useProperties()

const isSaved = computed(() => {
  return isPropertySaved(props.property.id)
})

const handleSave = () => {
  toggleSaveProperty(props.property.id)
}
</script>
