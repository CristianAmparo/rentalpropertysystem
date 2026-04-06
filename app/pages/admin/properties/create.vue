<template>
  <div class="space-y-8 max-w-5xl mx-auto pb-12">
    <!-- Header with Back Button -->
    <div class="flex items-center gap-4">
      <UButton
        icon="i-heroicons-arrow-left"
        color="neutral"
        variant="ghost"
        round
        to="/admin/properties"
      />
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Add New Property</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Fill in the details to create a new listing.</p>
      </div>
    </div>

    <UCard class="ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
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

            <UFormField label="Initial Status" name="isVacant">
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

          <UFormField label="Gallery Image URLs" help="Enter full public image URLs, one per line.">
            <UTextarea v-model="imageUrlsRaw" :rows="3" placeholder="https://images.unsplash.com/photo-1..." class="w-full font-mono text-sm" />
          </UFormField>

          <UFormField label="Gallery Video URLs" help="Enter YouTube or direct video URLs, one per line.">
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
            label="Create Property"
            color="primary"
            icon="i-heroicons-plus"
            :loading="isSubmitting"
            size="lg"
            class="px-8 shadow-sm"
          />
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { createProperty } = useAdmin()
const toast = useToast()

const isSubmitting = ref(false)

const propertyTypes = [
  { label: 'Apartment', value: 'APARTMENT' },
  { label: 'House', value: 'HOUSE' },
  { label: 'Condo', value: 'CONDO' },
  { label: 'Townhouse', value: 'TOWNHOUSE' }
]

const form = reactive({
  title: '',
  type: 'APARTMENT',
  description: '',
  price: '',
  beds: '',
  baths: '',
  sqft: '',
  isVacant: 'true',
  address: '',
  city: '',
  state: '',
  zipCode: ''
})

const imageUrlsRaw = ref('')
const videoUrlsRaw = ref('')

const handleSubmit = async () => {
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
    
    await createProperty({
      ...form,
      images,
      videos
    })

    toast.add({ title: 'Property created successfully', color: 'green' })
    navigateTo('/admin/properties')
  } catch (error) {
    toast.add({
      title: 'Failed to create property',
      description: error.data?.message || 'An error occurred',
      color: 'red'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
