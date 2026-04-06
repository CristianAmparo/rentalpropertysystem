<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Applications</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Review and manage tenant applications.</p>
      </div>
      <div class="flex items-center gap-2">
        <USelect v-model="statusFilter" :items="statusOptions" placeholder="Filter by Status" class="w-48" />
        <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass" placeholder="Search applicants..." class="w-64" />
      </div>
    </div>

    <UCard>
      <UTable :data="filteredRows" :columns="columns" :loading="loading">
        <template #property-cell="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar :src="row.original.propertyImage || ''" size="sm" icon="i-heroicons-home" />
            <div>
              <p class="font-medium text-sm">{{ row.original.property?.title }}</p>
              <p class="text-xs text-gray-500">{{ row.original.property?.address }}</p>
            </div>
          </div>
        </template>

        <template #applicant-cell="{ row }">
          <div class="flex items-center gap-2">
            <UAvatar :src="row.original.user?.avatar || ''" size="sm" :alt="row.original.user?.name" />
            <p class="font-medium text-sm">{{ row.original.user?.name }}</p>
          </div>
        </template>

        <template #date-cell="{ row }">
          <span class="text-sm text-gray-500">{{ formatPrettyDate(row.original.createdAt) }}</span>
        </template>

        <template #status-cell="{ row }">
          <UBadge :color="getStatusColor(row.original.status)" variant="subtle" size="sm">
            {{ row.original.status }}
          </UBadge>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex items-center justify-end gap-2">
            <UButton icon="i-heroicons-eye" color="neutral" variant="ghost" :to="`/admin/applications/${row.original.id}`" />
            <UDropdownMenu :items="getActionItems(row.original)">
              <UButton icon="i-heroicons-ellipsis-horizontal" color="neutral" variant="ghost" />
            </UDropdownMenu>
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const searchQuery = ref('')
const statusFilter = ref('')

const statusOptions = [
  { label: 'All Statuses', value: undefined },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' }
]

const columns = [
  { id: 'property', header: 'Property' },
  { id: 'applicant', header: 'Applicant' },
  { id: 'date', header: 'Applied Date' },
  { id: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const applications = ref<any[]>([])
const loading = ref(false)

async function loadApplications() {
  loading.value = true
  try {
    const data = await $fetch<any[]>('/api/admin/applications')
    applications.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('Failed to load applications', e)
    applications.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => loadApplications())

const filteredRows = computed(() => {
  return applications.value.filter(app => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch = !q ||
      app.user?.name?.toLowerCase().includes(q) ||
      app.property?.title?.toLowerCase().includes(q)
    const matchesStatus = !statusFilter.value || app.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

function getStatusColor(status: string) {
  if (status === 'APPROVED') return 'success'
  if (status === 'REJECTED') return 'error'
  return 'warning'
}

function getActionItems(row: any) {
  return [
    {
      label: 'Pending',
      icon: 'i-heroicons-x-circle',
      onSelect: () => handleUpdateStatus(row.id, 'PENDING'),
      disabled: row.status === 'PENDING'
    },
    {
      label: 'Approve',
      icon: 'i-heroicons-check-circle',
      onSelect: () => handleUpdateStatus(row.id, 'APPROVED'),
      disabled: row.status === 'APPROVED'
    },
    {
      label: 'Reject',
      icon: 'i-heroicons-x-circle',
      onSelect: () => handleUpdateStatus(row.id, 'REJECTED'),
      disabled: row.status === 'REJECTED'
    }   
  ]
}

async function handleUpdateStatus(id: string, status: string) {
  try {
    await $fetch(`/api/admin/applications/${id}/status`, {
      method: 'PATCH',
      body: { status }
    })
    useToast().add({
      title: 'Success',
      description: `Application ${status.toLowerCase()} successfully.`,
      color: status === 'APPROVED' ? 'success' : 'error'
    })
    await loadApplications()
  } catch (e: any) {
    console.error('Update status error:', e)
    useToast().add({
      title: 'Update Failed',
      description: e.data?.statusMessage || 'An unexpected error occurred while updating the application.',
      color: 'error'
    })
  }
}
</script>
