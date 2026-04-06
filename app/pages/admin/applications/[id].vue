<template>
  <div class="space-y-8 max-w-5xl mx-auto pb-12">
    <!-- Breadcrumbs -->
    <UBreadcrumb :links="breadcrumbLinks" />

    <div v-if="pending" class="space-y-6 animate-pulse">
      <div class="h-10 bg-gray-200 dark:bg-gray-800 w-1/3 rounded"></div>
      <div class="h-64 bg-gray-100 dark:bg-gray-900 rounded-xl"></div>
    </div>

    <div v-else-if="application" class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Application Details</h1>
            <UBadge :color="getStatusColor(application.status)" variant="subtle" size="lg">
              {{ application.status }}
            </UBadge>
          </div>
          <p class="text-gray-500 dark:text-gray-400">
            Submitted on {{ _dateTime(application.createdAt) }} by {{ application.user.name }}
          </p>
        </div>

        <div class="flex items-center gap-3" v-if="application.status === 'PENDING'">
          <UButton
            icon="i-heroicons-x-circle"
            color="error"
            variant="soft"
            label="Reject Application"
            :loading="isUpdating"
            @click="handleUpdateStatus('REJECTED')"
          />
          <UButton
            icon="i-heroicons-check-circle"
            color="primary"
            label="Approve Application"
            :loading="isUpdating"
            @click="handleUpdateStatus('APPROVED')"
          />
        </div>
        <div v-else class="text-sm font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
          This application is <strong>{{ application.status }}</strong>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Details (Left Column) -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Rental Preferences -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2 font-semibold">
                <UIcon name="i-heroicons-home" class="w-5 h-5 text-primary-500" />
                Rental Preferences
              </div>
            </template>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 p-2">
              <div class="sm:col-span-2 grid grid-cols-2 gap-4 border-b border-gray-100 dark:border-gray-800 pb-4 mb-2">
                <div>
                  <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Contact Email</span>
                  <p class="text-gray-900 dark:text-gray-200 font-medium">{{ formData?.personal?.contactEmail || application.user.email }}</p>
                </div>
                <div>
                  <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Contact Phone</span>
                  <p class="text-gray-900 dark:text-gray-200 font-medium">{{ formData?.personal?.contactPhone || 'Not provided' }}</p>
                </div>
              </div>

              <div>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Desired Move-in</span>
                <p class="text-gray-900 dark:text-gray-200 font-medium">{{ _prettyDate(formData?.personal?.moveInDate) }}</p>
              </div>
              <div>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Occupants</span>
                <p class="text-gray-900 dark:text-gray-200 font-medium">{{ formData?.personal?.occupants }} person(s)</p>
              </div>
              <div class="sm:col-span-2">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Pets Information</span>
                <p class="text-gray-900 dark:text-gray-200 font-medium">{{ formData?.personal?.pets || 'No pets' }}</p>
              </div>
              <div class="sm:col-span-2">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Additional Comments</span>
                <p class="text-gray-900 dark:text-gray-200 whitespace-pre-wrap">{{ formData?.personal?.comments || 'None' }}</p>
              </div>
            </div>
          </UCard>

          <!-- Employment History -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2 font-semibold">
                <UIcon name="i-heroicons-briefcase" class="w-5 h-5 text-primary-500" />
                Employment & Income
              </div>
            </template>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 p-2">
              <div class="sm:col-span-2">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Current Employer</span>
                <p class="text-gray-900 dark:text-gray-200 font-medium text-lg">{{ formData?.employment?.employer }}</p>
              </div>
              <div>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Job Title</span>
                <p class="text-gray-900 dark:text-gray-200 font-medium">{{ formData?.employment?.jobTitle }}</p>
              </div>
              <div>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Monthly Net Income</span>
                <p class="font-medium text-lg text-primary-600 dark:text-primary-400">
                  ${{ parseFloat(formData?.employment?.income).toLocaleString() }}
                </p>
              </div>
            </div>
          </UCard>

          <!-- Uploaded Documents -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2 font-semibold">
                <UIcon name="i-heroicons-document-duplicate" class="w-5 h-5 text-primary-500" />
                Verification Documents
              </div>
            </template>
            <div v-if="application.documents && application.documents.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="(doc, idx) in application.documents" :key="idx" class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                 <div class="flex items-center gap-3 overflow-hidden">
                    <UIcon name="i-heroicons-document" class="w-8 h-8 text-gray-400 shrink-0" />
                    <div class="overflow-hidden">
                      <p class="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">Document {{ Number(idx) + 1 }}</p>
                      <p class="text-xs text-gray-500">Uploaded verification</p>
                    </div>
                 </div>
                 <UButton
                    :to="doc"
                    target="_blank"
                    icon="i-heroicons-arrow-down-tray"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                 />
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              No documents uploaded.
            </div>
          </UCard>
        </div>

        <!-- Sidebar Details (Right Column) -->
        <div class="space-y-8">
          <!-- Property Summary -->
          <UCard class="overflow-hidden">
            <img v-if="propertyImage" :src="propertyImage" class="w-full h-40 object-cover -mt-4" />
            <div class="pt-4">
              <h3 class="font-bold text-lg mb-1">{{ application.property.title }}</h3>
              <p class="text-sm text-gray-500 mb-4">{{ application.property.address }}</p>
              <div class="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4 mt-4">
                <span class="text-sm font-bold text-primary-600 dark:text-primary-400">${{ application.property.price }}/mo</span>
                <UButton :to="`/properties/${application.property.id}`" variant="link" label="View Listing" size="xs" />
              </div>
            </div>
          </UCard>

          <!-- Applicant Information -->
          <UCard>
            <template #header>
              <h3 class="font-semibold">Applicant Profile</h3>
            </template>
            <div class="flex items-center gap-4 mb-6">
              <UAvatar :src="application.user.avatar || ''" :alt="application.user.name" size="lg" />
              <div>
                <p class="font-bold text-gray-900 dark:text-white">{{ application.user.name }}</p>
                <p class="text-sm text-gray-500">{{ application.user.email }}</p>
              </div>
            </div>
            <div class="space-y-4 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Status</span>
                <span :class="application.user.banned ? 'text-red-500 font-bold' : 'text-green-500 font-bold'">
                  {{ application.user.banned ? 'Banned' : 'Active Account' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Phone</span>
                <span class="font-medium">{{ application.user.phone || 'N/A' }}</span>
              </div>
            </div>
            <UButton block color="neutral" variant="soft" class="mt-6" disabled>View Full Profile</UButton>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const route = useRoute()
const id = route.params.id as string
const { updateApplicationStatus, fetchApplication } = useAdmin()
const isUpdating = ref(false)

// Use the utilities in script to ensure they are available in template context
const _prettyDate = formatPrettyDate
const _dateTime = formatDateTime

const { data: application, pending, refresh } = useAsyncData(`admin-application-${id}`, () => {
  return fetchApplication(id)
})

const breadcrumbLinks = computed(() => [
  { label: 'Admin', to: '/admin' },
  { label: 'Applications', to: '/admin/applications' },
  { label: 'Detail' }
])

const formData = computed(() => {
  if (!application.value?.notes) return {}
  try {
    return JSON.parse(application.value.notes)
  } catch (e) {
    return {}
  }
})

const propertyImage = computed(() => {
  if (!application.value?.property.images) return null
  try {
    const images = typeof application.value.property.images === 'string'
      ? JSON.parse(application.value.property.images)
      : application.value.property.images
    return Array.isArray(images) && images.length > 0 ? images[0] : null
  } catch (e) {
    return null
  }
})

const getStatusColor = (status: string) => {
  if (status === 'APPROVED') return 'success'
  if (status === 'REJECTED') return 'error'
  return 'warning'
}

const handleUpdateStatus = async (status: string) => {
  try {
    isUpdating.value = true
    await updateApplicationStatus(id, status)
    useToast().add({
       title: 'Success',
       description: `Application has been ${status.toLowerCase()}.`,
       color: status === 'APPROVED' ? 'success' : 'error'
    })
    refresh()
  } catch (error: any) {
    console.error('Update status error:', error)
    useToast().add({
      title: 'Update Failed',
      description: error.data?.statusMessage || 'An unexpected error occurred while updating the application.',
      color: 'error'
    })
  } finally {
    isUpdating.value = false
  }
}
</script>
