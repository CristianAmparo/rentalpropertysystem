<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Manage user accounts and access.</p>
      </div>
    </div>

    <UCard>
      <div class="mb-4">
        <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Search users..." class="max-w-xs" />
      </div>

      <UTable :data="filteredUsers" :columns="columns" :loading="loading">
        <template #user-cell="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar :src="row.original.avatar || ''" :alt="row.original.name" size="sm" />
            <div class="flex flex-col">
              <span class="font-medium text-gray-900 dark:text-white">{{ row.original.name }}</span>
              <span class="text-xs text-gray-500">{{ row.original.email }}</span>
            </div>
          </div>
        </template>

        <template #role-cell="{ row }">
          <UBadge :color="row.original.role === 'ADMIN' ? 'primary' : 'neutral'" variant="subtle">
            {{ row.original.role }}
          </UBadge>
        </template>

        <template #stats-cell="{ row }">
          <div class="text-xs text-gray-500 space-y-1">
            <p>Apps: <span class="font-medium text-gray-700 dark:text-gray-300">{{ row.original._count?.applications ?? 0 }}</span></p>
            <p>Saved: <span class="font-medium text-gray-700 dark:text-gray-300">{{ row.original._count?.savedProps ?? 0 }}</span></p>
          </div>
        </template>

        <template #status-cell="{ row }">
          <UBadge :color="row.original.banned ? 'error' : 'success'" variant="subtle">
            {{ row.original.banned ? 'Banned' : 'Active' }}
          </UBadge>
        </template>

        <template #actions-cell="{ row }">
          <UButton
            v-if="row.original.role !== 'ADMIN'"
            :color="row.original.banned ? 'success' : 'error'"
            variant="ghost"
            size="sm"
            :label="row.original.banned ? 'Unban' : 'Ban'"
            :icon="row.original.banned ? 'i-heroicons-check-circle' : 'i-heroicons-no-symbol'"
            @click="toggleBan(row.original)"
          />
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const toast = useToast()
const search = ref('')

const users = ref<any[]>([])
const loading = ref(false)

async function loadUsers() {
  loading.value = true
  try {
    const data = await $fetch<any[]>('/api/admin/users')
    users.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('Failed to load users', e)
    users.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => loadUsers())

const filteredUsers = computed(() => {
  if (!search.value) return users.value
  const q = search.value.toLowerCase()
  return users.value.filter(u =>
    u.name?.toLowerCase().includes(q) ||
    u.email?.toLowerCase().includes(q)
  )
})

const columns = [
  { id: 'user', header: 'User' },
  { id: 'role', header: 'Role' },
  { id: 'stats', header: 'Stats' },
  { id: 'status', header: 'Status' },
  { id: 'actions', header: 'Actions' }
]

async function toggleBan(user: any) {
  try {
    const newStatus = !user.banned
    await $fetch(`/api/admin/users/${user.id}/status`, {
      method: 'PATCH',
      body: { banned: newStatus }
    })
    toast.add({
      title: `User ${newStatus ? 'banned' : 'unbanned'} successfully`,
      color: newStatus ? 'warning' : 'success'
    })
    await loadUsers()
  } catch (error: any) {
    toast.add({
      title: 'Failed to update user status',
      description: error.data?.message || 'An error occurred',
      color: 'error'
    })
  }
}
</script>
