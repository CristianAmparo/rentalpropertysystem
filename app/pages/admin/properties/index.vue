<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Properties</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Manage your rental properties.</p>
      </div>
      <UButton to="/admin/properties/create" icon="i-heroicons-plus" color="primary" label="Add Property" />
    </div>

    <UCard>
      <div class="mb-4">
        <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Search properties..." class="max-w-xs" />
      </div>

      <UTable :data="filteredRows" :columns="columns" :loading="loading">
        <template #price-cell="{ row }">
          ₱{{ row.original.price?.toLocaleString() }}/mo
        </template>
        <template #isVacant-cell="{ row }">
          <UBadge :color="row.original.isVacant ? 'success' : 'error'" variant="subtle">
            {{ row.original.isVacant ? 'Vacant' : 'Occupied' }}
          </UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex items-center gap-2">
            <UButton :to="`/admin/properties/${row.original.id}`" icon="i-heroicons-pencil-square" size="sm" color="neutral" variant="ghost" />
            <UButton icon="i-heroicons-trash" size="sm" color="error" variant="ghost" @click="confirmDelete(row.original)" />
          </div>
        </template>
      </UTable>
    </UCard>

    <UModal v-model:open="showDeleteModal">
      <template #header>
        <h3 class="text-base font-semibold">Delete Property</h3>
      </template>
      <template #body>
        <p>Are you sure you want to delete <strong>{{ pendingDelete?.title }}</strong>?</p>
        <p class="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton color="neutral" variant="ghost" label="Cancel" @click="showDeleteModal = false" />
          <UButton color="error" label="Delete" :loading="isDeleting" @click="handleDelete" />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const toast = useToast()
const search = ref('')

const properties = ref<any[]>([])
const loading = ref(false)

async function loadProperties() {
  loading.value = true
  try {
    const data = await $fetch<any[]>('/api/admin/properties', {
      query: { isArchived: 'false' }
    })
    properties.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('Failed to load properties', e)
    properties.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => loadProperties())

const filteredRows = computed(() => {
  if (!search.value) return properties.value
  const q = search.value.toLowerCase()
  return properties.value.filter(p =>
    p.title?.toLowerCase().includes(q) ||
    p.city?.toLowerCase().includes(q)
  )
})

const columns = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'city', header: 'City' },
  { accessorKey: 'price', header: 'Price/mo' },
  { accessorKey: 'isVacant', header: 'Status' },
  { id: 'actions', header: 'Actions' }
]

const showDeleteModal = ref(false)
const pendingDelete = ref<any>(null)
const isDeleting = ref(false)

function confirmDelete(property: any) {
  pendingDelete.value = property
  showDeleteModal.value = true
}

async function handleDelete() {
  if (!pendingDelete.value) return
  isDeleting.value = true
  try {
    await $fetch(`/api/admin/properties/${pendingDelete.value.id}`, { method: 'DELETE' })
    toast.add({ title: 'Property deleted', color: 'success' })
    showDeleteModal.value = false
    await loadProperties()
  } catch {
    toast.add({ title: 'Error', description: 'Failed to delete', color: 'error' })
  } finally {
    isDeleting.value = false
    pendingDelete.value = null
  }
}
</script>