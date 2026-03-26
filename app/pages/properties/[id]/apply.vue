<template>
  <div class="py-12 bg-gray-50 dark:bg-gray-950 min-h-screen">
    <UContainer class="px-4 py-4 md:px-8 md:py-8">
      <div class="max-w-2xl mx-auto">
        <div class="mb-8">
          <UBreadcrumb :links="links" class="mb-4" />
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Apply for Property</h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">Please fill out all required information to submit your application.</p>
        </div>

        <!-- Stepper Visual -->
        <div class="mb-8 flex items-center justify-between relative">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-800 -z-10 rounded-full"></div>
          <div class="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-500 -z-10 rounded-full transition-all duration-300" :style="{ width: `${((currentStep - 1) / 3) * 100}%` }"></div>
          
          <div v-for="step in 4" :key="step" class="flex flex-col items-center">
            <div :class="['w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300', currentStep >= step ? 'bg-primary-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-2 border-gray-200 dark:border-gray-700']">
              {{ currentStep > step ? '✓' : step }}
            </div>
            <span :class="['text-xs font-medium mt-2 absolute top-12', currentStep >= step ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400']">
              {{ ['Personal', 'Employment', 'Documents', 'Review'][step - 1] }}
            </span>
          </div>
        </div>

        <UCard class="shadow-md transition-shadow mt-12">
          <div v-if="property" class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
            <div class="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center shrink-0 overflow-hidden">
               <img v-if="property.image" :src="property.image" class="w-full h-full object-cover" />
               <UIcon v-else name="i-heroicons-home-modern" class="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white text-lg line-clamp-1">{{ property.title }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{{ property.address }}</p>
              <div class="mt-1 text-primary-600 dark:text-primary-400 font-bold">${{ property.price.toLocaleString('en-US') }} / month</div>
            </div>
          </div>

          <form @submit.prevent="nextStep" class="space-y-6">
            
            <!-- Step 1: Personal -->
            <div v-if="currentStep === 1" class="space-y-6">
              <div class="mb-4">
                <h4 class="font-bold text-gray-900 dark:text-white text-xl">Personal Information</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Tell us a bit about your moving plans.</p>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <!-- Move In Date -->
                <UFormField label="Desired Move-in Date" name="moveInDate" class="w-full" required>
                  <UPopover :popper="{ placement: 'bottom-start' }" class="w-full">
                    <UButton icon="i-heroicons-calendar-days" :label="state.moveInDate ? df.format(state.moveInDate.toDate(getLocalTimeZone())) : 'Select a date'" variant="outline" size="lg" color="neutral" block class="justify-start text-left font-normal" />
                    <template #content>
                      <UCalendar v-model="state.moveInDate" class="p-2" :min-value="minDate" />
                    </template>
                  </UPopover>
                </UFormField>
                
                <!-- Occupants -->
                <UFormField label="Number of Occupants" name="occupants" class="w-full" required>
                  <UInput v-model="state.occupants" type="number" min="1" size="lg" class="w-full" required />
                </UFormField>

                <!-- Pets -->
                <UFormField label="Pets" name="pets" class="w-full sm:col-span-2">
                  <UInput v-model="state.pets" placeholder="e.g. None, 1 dog, 2 cats..." size="lg" class="w-full" />
                </UFormField>

                <!-- Comments -->
                <UFormField label="Additional Comments" name="comments" class="w-full sm:col-span-2">
                  <UTextarea v-model="state.comments" :rows="3" placeholder="Any special requests or details we should know?" size="lg" class="w-full" />
                </UFormField>
              </div>
            </div>

            <!-- Step 2: Employment -->
            <div v-if="currentStep === 2" class="space-y-6">
              <div class="mb-4">
                <h4 class="font-bold text-gray-900 dark:text-white text-xl">Employment History</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Please provide your current employment details for income verification.</p>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <UFormField label="Current Employer" name="employer" class="w-full sm:col-span-2" required>
                  <UInput v-model="state.employer" size="lg" class="w-full" required />
                </UFormField>
                
                <UFormField label="Job Title" name="jobTitle" class="w-full" required>
                  <UInput v-model="state.jobTitle" size="lg" class="w-full" required />
                </UFormField>
                
                <UFormField label="Monthly Income (Net)" name="income" class="w-full" required>
                  <UInput v-model="state.income" type="number" leading-icon="i-heroicons-currency-dollar" size="lg" class="w-full" required />
                </UFormField>
              </div>
            </div>

            <!-- Step 3: Documents -->
            <div v-if="currentStep === 3" class="space-y-4">
              <h4 class="font-medium text-gray-900 dark:text-white text-lg">Required Documents</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Please attach copies of your ID and recent payslips for verification.</p>
              
              <div class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <UIcon name="i-heroicons-document-arrow-up" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div class="font-medium text-gray-900 dark:text-white mb-1">Upload Documents</div>
                <p class="text-sm text-gray-500 mb-4">PDF, JPG, or PNG</p>
                <input type="file" multiple @change="handleFileSelect" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900 dark:file:text-primary-400 cursor-pointer mx-auto max-w-xs" />
              </div>
              
              <div v-if="selectedFiles.length > 0" class="mt-4 space-y-2">
                <div class="text-sm font-medium text-gray-700 dark:text-gray-300">Selected files:</div>
                <div v-for="(file, index) in selectedFiles" :key="index" class="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded-md border border-gray-200 dark:border-gray-700">
                  <div class="flex items-center gap-2 truncate">
                    <UIcon name="i-heroicons-document" class="w-4 h-4 text-primary-500 shrink-0" />
                    <span class="truncate">{{ file.name }}</span>
                  </div>
                  <button @click.prevent="removeFile(index)" class="text-red-500 hover:text-red-700 p-1">
                    <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Step 4: Review -->
            <div v-if="currentStep === 4" class="space-y-6">
              <h4 class="font-medium text-gray-900 dark:text-white text-lg">Review Application</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Please verify all the details below before submitting.</p>
              
              <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-sm border border-gray-200 dark:border-gray-700 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <span class="text-gray-500 block text-xs uppercase tracking-wider font-semibold">Move In</span>
                    <span class="font-medium dark:text-gray-200">{{ state.moveInDate || 'Not specified' }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500 block text-xs uppercase tracking-wider font-semibold">Occupants & Pets</span>
                    <span class="font-medium dark:text-gray-200">{{ state.occupants }} Person(s), {{ state.pets }}</span>
                  </div>
                  <div class="col-span-2">
                    <span class="text-gray-500 block text-xs uppercase tracking-wider font-semibold">Employment</span>
                    <span class="font-medium dark:text-gray-200">{{ state.jobTitle }} at {{ state.employer }} (${{ state.income }}/mo)</span>
                  </div>
                  <div class="col-span-2">
                    <span class="text-gray-500 block text-xs uppercase tracking-wider font-semibold">Attached Docs</span>
                    <span class="font-medium dark:text-gray-200">{{ selectedFiles.length }} file(s) ready to upload</span>
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-200 dark:border-gray-800">
                <UCheckbox v-model="state.agreed" name="agreed" label="I confirm that all information provided is accurate and I agree to a background check." />
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800 mt-8">
              <UButton v-if="currentStep > 1" type="button" variant="soft" color="gray" @click="currentStep--" :disabled="isLoading">
                Back
              </UButton>
              <div v-else></div> <!-- Spacer -->
              
              <UButton v-if="currentStep < 4" type="submit" color="primary" trailing-icon="i-heroicons-arrow-right">
                Next Step
              </UButton>
              
              <UButton v-if="currentStep === 4" type="button" color="primary" @click="submitFinal" :loading="isLoading" :disabled="!state.agreed" size="lg" class="px-8 font-bold">
                Submit Application
              </UButton>
            </div>

          </form>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<script setup>


definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const propertyId = route.params.id

const { data: property } = await useFetch(`/api/properties/${propertyId}`)

useHead({
  title: computed(() => property.value ? `Apply for ${property.value.title}` : 'Apply for Property'),
})

const links = computed(() => [
  { label: 'Browse', to: '/properties' },
  { label: 'Property Details', to: `/properties/${propertyId}` },
  { label: 'Apply' }
])

const { submitApplication, uploadDocuments } = useApplications()
const toast = useToast()

import { CalendarDate, DateFormatter, getLocalTimeZone, today } from '@internationalized/date'
const df = new DateFormatter('en-US', { dateStyle: 'medium' })

// Minimum selectable date is tomorrow
const minDate = today(getLocalTimeZone()).add({ days: 1 })

const isLoading = ref(false)
const currentStep = ref(1)

// Form State
const state = reactive({
  moveInDate: null,
  occupants: 1,
  pets: '',
  comments: '',
  employer: '',
  jobTitle: '',
  income: '',
  agreed: false
})

// File Handling
const selectedFiles = ref([])

const handleFileSelect = (event) => {
  const files = event.target.files
  if (!files.length) return
  
  // Convert FileList to Array and append
  const newFiles = Array.from(files)
  selectedFiles.value = [...selectedFiles.value, ...newFiles]
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

const submitFinal = async () => {
  try {
    isLoading.value = true
    
    // 1. Upload files first (if any)
    let uploadedUrls = []
    if (selectedFiles.value.length > 0) {
      const uploadRes = await uploadDocuments(selectedFiles.value)
      if (uploadRes && uploadRes.success) {
        uploadedUrls = uploadRes.urls
      }
    }
    
    // 2. Submit the complete application payload
    const formPayload = {
      personal: {
        moveInDate: state.moveInDate,
        occupants: state.occupants,
        pets: state.pets,
        comments: state.comments,
      },
      employment: {
        employer: state.employer,
        jobTitle: state.jobTitle,
        income: state.income,
      }
    }
    
    await submitApplication(propertyId, formPayload, uploadedUrls)
    
    toast.add({
      title: 'Application Submitted!',
      description: 'Your application has been received successfully.',
      color: 'green'
    })
    
    // Reroute to dashboard
    navigateTo('/dashboard/applications')
    
  } catch (error) {
    console.error('Submission failed:', error)
    toast.add({
      title: 'Submission Failed',
      description: error.statusMessage || 'There was an error submitting your application.',
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
}
</script>
