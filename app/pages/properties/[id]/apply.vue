<template>
  <div class="py-12 bg-gray-50 dark:bg-gray-950 min-h-screen">
    <UContainer>
      <div class="max-w-2xl mx-auto">
        <div class="mb-8">
          <UBreadcrumb :links="links" class="mb-4" />
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Apply for Property</h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">Please fill out all required information to submit your application.</p>
        </div>

        <UCard class="shadow-md hover:shadow-lg transition-shadow">
          <!-- Using placeholder property details since dynamic fetching isn't wired yet -->
          <div class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
            <div class="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center shrink-0">
               <UIcon name="i-heroicons-home-modern" class="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white text-lg">Modern City Apartment</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">123 Example St, Metro City, ST 12345</p>
              <div class="mt-2 text-primary-600 dark:text-primary-400 font-bold">$2,400 / month</div>
            </div>
          </div>

          <UForm :state="state" @submit="onSubmit" class="space-y-6">
            
            <div class="space-y-4">
              <h4 class="font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Employment Information</h4>
              
              <UFormField label="Current Employer" name="employer" required>
                <UInput v-model="state.employer" />
              </UFormField>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormField label="Job Title" name="jobTitle" required>
                  <UInput v-model="state.jobTitle" />
                </UFormField>
                
                <UFormField label="Monthly Income (Net)" name="income" required>
                  <UInput v-model="state.income" type="number" leading-icon="i-heroicons-currency-dollar" />
                </UFormField>
              </div>
            </div>

            <div class="space-y-4 pt-4">
              <h4 class="font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Additional Information</h4>
              
              <UFormField label="Desired Move-in Date" name="moveInDate" required>
                <UInput v-model="state.moveInDate" type="date" />
              </UFormField>
              
              <UFormField label="Number of Occupants" name="occupants" required>
                <UInput v-model="state.occupants" type="number" min="1" />
              </UFormField>

              <UFormField label="Pets" name="pets">
                <USelect v-model="state.pets" :options="['No pets', '1 dog', '1 cat', 'Multiple pets', 'Other']" />
              </UFormField>

              <UFormField label="Additional Comments" name="comments">
                <UTextarea v-model="state.comments" :rows="4" placeholder="Any special requests or details we should know?" />
              </UFormField>
            </div>

            <div class="pt-6 border-t border-gray-200 dark:border-gray-800">
              <div class="flex items-center gap-2 mb-6">
                 <UCheckbox v-model="state.agreed" name="agreed" label="I confirm that all information provided is accurate and I agree to a background check." />
              </div>
              
              <UButton type="submit" color="primary" block size="lg" :loading="isLoading" :disabled="!state.agreed">
                Submit Application
              </UButton>
            </div>

          </UForm>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

// Only logged in users can apply
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const propertyId = route.params.id

useHead({
  title: 'Apply for Property - RentalProperty',
})

const links = computed(() => [
  { label: 'Browse', to: '/properties' },
  { label: 'Property Details', to: `/properties/${propertyId}` },
  { label: 'Apply' }
])

const isLoading = ref(false)
const state = reactive({
  employer: '',
  jobTitle: '',
  income: '',
  moveInDate: '',
  occupants: 1,
  pets: 'No pets',
  comments: '',
  agreed: false
})

const onSubmit = async () => {
  isLoading.value = true
  // Simulate submission delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  isLoading.value = false
  
  // Reroute them to the dashboard applications tab to see it pending
  navigateTo('/dashboard/applications')
}
</script>
