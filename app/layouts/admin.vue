<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
    <!-- Sidebar -->
    <aside class="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hidden md:flex flex-col sticky top-0 h-screen">
      <div class="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
        <div class="p-1.5 bg-primary-600 rounded-lg text-white">
          <UIcon name="i-heroicons-home-modern" class="w-6 h-6" />
        </div>
        <span class="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">Admin Panel</span>
      </div>

      <div class="flex-1 overflow-y-auto p-4 py-6">
        <UNavigationMenu orientation="vertical" :items="links" class="w-full" />
      </div>

      <div class="p-4 border-t border-gray-200 dark:border-gray-800">
        <div class="flex items-center gap-3 px-2 py-3">
          <UAvatar :src="user?.avatar || ''" :alt="user?.name" size="sm" />
          <div class="flex-1 overflow-hidden">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ user?.name }}</p>
            <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
          </div>
        </div>
        <UButton
          icon="i-heroicons-arrow-right-on-rectangle"
          color="gray"
          variant="ghost"
          block
          @click="handleLogout"
          class="mt-2"
        >
          Sign out
        </UButton>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <header class="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
        <div class="flex items-center gap-4">
          <UButton
            icon="i-heroicons-bars-3"
            color="gray"
            variant="ghost"
            class="md:hidden"
            @click="isMobileMenuOpen = true"
          />
          <UBreadcrumb :links="breadcrumbs" />
        </div>

        <div class="flex items-center gap-3">
          <UButton
            to="/"
            icon="i-heroicons-globe-alt"
            color="gray"
            variant="ghost"
            label="View Site"
          />
          <UColorModeButton />
        </div>
      </header>

      <main class="flex-1 p-4 md:p-8">
        <slot />
      </main>
    </div>

    <!-- Mobile Menu -->
    <USlideover v-model="isMobileMenuOpen" side="left" class="md:hidden">
      <div class="p-4 flex-1">
        <div class="flex items-center justify-between mb-8">
          <span class="text-lg font-bold uppercase tracking-wider">Admin</span>
          <UButton
            icon="i-heroicons-x-mark"
            color="gray"
            variant="ghost"
            @click="isMobileMenuOpen = false"
          />
        </div>
        <UNavigationMenu orientation="vertical" :items="links" class="w-full" />
      </div>
    </USlideover>
    
    <UToaster />
  </div>
</template>

<script setup>
const { user, logout } = useAuth()
const route = useRoute()
const isMobileMenuOpen = ref(false)

const links = [
  {
    label: 'Dashboard',
    icon: 'i-heroicons-squares-2x2',
    to: '/admin',
    exact: true
  },
  {
    label: 'Properties',
    icon: 'i-heroicons-home',
    to: '/admin/properties'
  },
  {
    label: 'Applications',
    icon: 'i-heroicons-document-text',
    to: '/admin/applications',
    badge: 'New'
  },
  {
    label: 'Users',
    icon: 'i-heroicons-users',
    to: '/admin/users'
  },
  {
    label: 'Settings',
    icon: 'i-heroicons-cog-6-tooth',
    to: '/admin/settings'
  }
]

const breadcrumbs = computed(() => {
  const parts = route.path.split('/').filter(p => p)
  return parts.map((part, index) => ({
    label: part.charAt(0).toUpperCase() + part.slice(1),
    to: '/' + parts.slice(0, index + 1).join('/')
  }))
})

// Close mobile menu on route change
watch(() => route.path, () => {
  isMobileMenuOpen.value = false
})

const handleLogout = async () => {
  await logout()
  navigateTo('/login')
}
</script>
