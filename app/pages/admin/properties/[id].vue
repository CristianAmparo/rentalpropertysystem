<template>
  <div class="space-y-8 max-w-5xl mx-auto pb-12">
    <!-- Header with Back Button -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <UButton
          icon="i-heroicons-arrow-left"
          color="neutral"
          variant="ghost"
          round
          to="/admin/properties"
        />
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Edit Property</h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">Review and update property details.</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex flex-col items-center justify-center py-24 space-y-4">
      <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 animate-spin text-primary-500" />
      <p class="text-gray-500 animate-pulse text-sm font-medium">Loading property data...</p>
    </div>

    <!-- Form Content -->
    <UCard v-else-if="property" class="ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <form @submit.prevent="handleSubmit" class="space-y-10">
        <!-- Section 1: Basic Information -->
        <div class="space-y-6">
          <div class="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
            <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-primary-500" />
            <h3 class="font-semibold text-lg">General Information</h3>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
            <UFormField label="Property Title" name="title" required class="md:col-span-8">
              <UInput v-model="form.title" placeholder="e.g. Modern Downtown Studio Loft" class="w-full" spellcheck="false" />
            </UFormField>

            <UFormField label="Type" name="type" required class="md:col-span-4">
              <USelect v-model="form.type" :items="propertyTypes" class="w-full" />
            </UFormField>

            <UFormField label="Description" name="description" required class="md:col-span-12">
              <UTextarea v-model="form.description" :rows="4" placeholder="Tell potential tenants what makes this property unique..." class="w-full" />
            </UFormField>
          </div>
        </div>

        <!-- Section 2: Pricing & Features -->
        <div class="space-y-6">
          <div class="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
            <UIcon name="i-heroicons-banknotes" class="w-5 h-5 text-primary-500" />
            <h3 class="font-semibold text-lg">Pricing & Features</h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <UFormField label="Monthly Rent ($)" name="price" required>
              <UInput v-model="form.price" type="number" min="0" placeholder="0.00" class="w-full" icon="i-heroicons-currency-dollar" />
            </UFormField>

            <UFormField label="Bedrooms" name="beds" required>
              <UInput v-model="form.beds" type="number" min="0" placeholder="0" class="w-full" />
            </UFormField>

            <UFormField label="Bathrooms" name="baths" required>
              <UInput v-model="form.baths" type="number" min="0" step="0.5" placeholder="0" class="w-full" />
            </UFormField>

            <UFormField label="Sq Ft" name="sqft">
              <UInput v-model="form.sqft" type="number" min="0" placeholder="0" class="w-full" />
            </UFormField>

            <UFormField label="Current Status" name="isVacant">
              <USelect v-model="form.isVacant" :items="[{ label: 'Available (Vacant)', value: 'true' }, { label: 'Rented (Occupied)', value: 'false' }]" class="w-full" />
            </UFormField>
          </div>
        </div>

        <!-- Section 3: Location -->
        <div class="space-y-6">
          <div class="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
            <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-primary-500" />
            <h3 class="font-semibold text-lg">Location Details</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
            <UFormField label="Street Address" name="address" required class="md:col-span-12">
              <UInput v-model="form.address" placeholder="123 Luxury Ave, Apt 4B" class="w-full" />
            </UFormField>

            <UFormField label="City" name="city" required class="md:col-span-4">
              <UInput v-model="form.city" placeholder="San Francisco" class="w-full" />
            </UFormField>

            <UFormField label="State" name="state" required class="md:col-span-4">
              <UInput v-model="form.state" placeholder="CA" class="w-full" />
            </UFormField>

            <UFormField label="ZIP Code" name="zipCode" required class="md:col-span-4">
              <UInput v-model="form.zipCode" placeholder="94105" class="w-full" />
            </UFormField>
          </div>
        </div>

        <!-- Section 4: Media -->
        <div class="space-y-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
          <div class="flex items-center gap-2 pb-2">
            <UIcon name="i-heroicons-photo" class="w-5 h-5 text-primary-500" />
            <h3 class="font-semibold text-lg text-gray-900 dark:text-white">Property Media</h3>
          </div>

          <UFormField label="Gallery Image URLs" help="One full public URL per line.">
            <UTextarea v-model="imageUrlsRaw" :rows="3" placeholder="https://images.unsplash.com/photo-1..." class="w-full font-mono text-sm" />
          </UFormField>

          <UFormField label="Gallery Video URLs" help="Enter direct video URLs, one per line.">
            <UTextarea v-model="videoUrlsRaw" :rows="2" placeholder="https://www.youtube.com/watch?v=..." class="w-full font-mono text-sm" />
          </UFormField>
        </div>

        <!-- Submit Actions -->
        <div class="flex items-center justify-end gap-3 pt-6">
          <UButton
            label="Cancel"
            color="neutral"
            variant="ghost"
            to="/admin/properties"
            size="lg"
          />
          <UButton
            type="submit"
            label="Save Changes"
            color="primary"
            icon="i-heroicons-check"
            :loading="isSubmitting"
            size="lg"
            class="px-8 shadow-sm"
          />
        </div>
      </form>
    </UCard>
    
    <UCard v-else class="text-center py-16">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-error-500 mx-auto mb-4" />
      <h3 class="text-xl font-bold text-gray-900 dark:text-white">Property Not Found</h3>
      <p class="mt-2 text-gray-500 max-w-sm mx-auto">The property listing you are trying to edit doesn't exist or may have been removed.</p>
      <UButton to="/admin/properties" class="mt-8" label="Return to Directory" icon="i-heroicons-arrow-left" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const route = useRoute()
const propertyId = route.params.id
const { fetchProperty, updateProperty } = useAdmin()
const toast = useToast()

const propertyTypes = [
  { label: 'Apartment', value: 'APARTMENT' },
  { label: 'House', value: 'HOUSE' },
  { label: 'Condo', value: 'CONDO' },
  { label: 'Townhouse', value: 'TOWNHOUSE' }
]

const { data: property, pending } = useAsyncData(`admin-property-${propertyId}`, () => fetchProperty(String(propertyId)))

const form = reactive({
  title: '',
  type: 'APARTMENT',
  description: '',
  price: '' as any,
  beds: '' as any,
  baths: '' as any,
  sqft: '' as any,
  isVacant: 'true' as any,
  address: '',
  city: '',
  state: '',
  zipCode: ''
})

const imageUrlsRaw = ref('')
const videoUrlsRaw = ref('')
const isSubmitting = ref(false)

watchEffect(() => {
  if (property.value) {
    form.title = property.value.title
    form.type = property.value.type
    form.description = property.value.description
    form.price = property.value.price
    form.beds = property.value.beds
    form.baths = property.value.baths
    form.sqft = property.value.sqft || ''
    form.isVacant = String(property.value.isVacant)
    form.address = property.value.address
    form.city = property.value.city
    form.state = property.value.state
    form.zipCode = property.value.zipCode
    
    if (property.value.images && Array.isArray(property.value.images)) {
      imageUrlsRaw.value = property.value.images.join('\n')
    }

    if (property.value.videos && Array.isArray(property.value.videos)) {
      videoUrlsRaw.value = property.value.videos.join('\n')
    }
  }
})

const handleSubmit = async () => {
  console.log('Submitting property update...', form)
  isSubmitting.value = true
  try {
    const images = imageUrlsRaw.value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
    
    const videos = videoUrlsRaw.value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
    
    console.log('Processed media:', { images, videos })

    await updateProperty(String(propertyId), {
      ...form,
      images,
      videos
    })

    console.log('Update successful!')
    toast.add({ title: 'Property updated successfully', color: 'success' })
    navigateTo('/admin/properties')
  } catch (error: any) {
    console.error('Save changes failed:', error)
    toast.add({
      title: 'Failed to update property',
      description: error.data?.message || 'An error occurred',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
