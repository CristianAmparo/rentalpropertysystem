<template>
  <div>
    <header class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
      <UContainer>
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <NuxtLink to="/" class="flex items-center gap-2 font-bold text-xl text-primary-500">
            <UIcon name="i-heroicons-home-modern" class="w-8 h-8" />
            <span>RentalProperty</span>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-gray-200">
          <NuxtLink to="/" class="hover:text-primary-500 transition-colors" active-class="text-primary-500">Home</NuxtLink>
          <NuxtLink to="/properties" class="hover:text-primary-500 transition-colors" active-class="text-primary-500">Browse Properties</NuxtLink>
          <NuxtLink to="/about" class="hover:text-primary-500 transition-colors" active-class="text-primary-500">About Us</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-primary-500 transition-colors" active-class="text-primary-500">Contact</NuxtLink>
        </nav>

        <!-- Right Side / Auth -->
        <div class="flex items-center justify-end gap-3">
          <div v-if="isLoading">
            <USkeleton class="h-8 w-8 rounded-full" />
          </div>
          <template v-else-if="isAuthenticated && user">
            <!-- Custom User Menu Dropdown -->
            <div class="relative">
              <button @click="isDesktopMenuOpen = !isDesktopMenuOpen" class="flex outline-none rounded-full cursor-pointer transition-transform hover:scale-105 shadow-sm border-2 border-transparent hover:border-primary-500 focus:border-primary-500">
                <UAvatar v-if="user.avatar" :src="user.avatar" :alt="user.name" size="sm" />
                <div v-else class="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500 text-white font-bold text-sm">
                  {{ user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U' }}
                </div>
              </button>

              <!-- Dropdown Panel -->
              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <div v-if="isDesktopMenuOpen" class="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-800 border border-gray-200 dark:border-gray-800 z-50">
                  <div class="px-4 py-3">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                    <p class="truncate font-medium text-gray-900 dark:text-white">{{ user.email }}</p>
                  </div>
                  
                  <div class="py-1">
                    <NuxtLink to="/dashboard" class="group flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" @click="isDesktopMenuOpen = false">
                      <UIcon name="i-heroicons-home" class="h-4 w-4 text-gray-400 group-hover:text-primary-500" />
                      Dashboard
                    </NuxtLink>
                    <NuxtLink to="/profile" class="group flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" @click="isDesktopMenuOpen = false">
                      <UIcon name="i-heroicons-user" class="h-4 w-4 text-gray-400 group-hover:text-primary-500" />
                      Profile
                    </NuxtLink>
                  </div>

                  <div class="py-1">
                    <button @click="toggleColorMode" class="group flex w-full items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <div class="flex items-center gap-2">
                        <UIcon :name="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'" class="h-4 w-4 text-gray-400 group-hover:text-primary-500" />
                        Theme
                      </div>
                      <span class="text-xs text-gray-500">{{ isDark ? 'Dark' : 'Light' }}</span>
                    </button>
                    <button @click="() => { isDesktopMenuOpen = false; handleLogout() }" class="group flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                      <UIcon name="i-heroicons-arrow-right-on-rectangle" class="h-4 w-4 text-red-500 dark:text-red-400" />
                      Sign out
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </template>
          <template v-else>
            <div class="hidden md:flex items-center gap-3">
              <UButton @click="toggleColorMode" variant="ghost" color="gray" :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'" aria-label="Theme" />
              <UButton to="/login" variant="ghost" color="gray" label="Log in" />
              <UButton to="/register" color="primary" label="Sign up" />
            </div>
          </template>
        </div>
      </div>
    </UContainer>

  </header>

    <!-- Mobile Floating Bottom Navigation -->
    <div class="md:hidden fixed bottom-4 left-4 right-4 z-60">
      <div class="bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-800 p-2 flex items-center justify-around text-white">
        <div class="flex flex-col items-center">
          <UButton to="/" variant="ghost" color="white" icon="i-heroicons-home" size="lg" aria-label="Home" />
          <span class="text-[10px] mt-1 font-medium text-gray-400">Home</span>
        </div>
        
        <div class="flex flex-col items-center">
          <UButton to="/properties" variant="ghost" color="white" icon="i-heroicons-magnifying-glass" size="lg" aria-label="Browse" />
          <span class="text-[10px] mt-1 font-medium text-gray-400">Browse</span>
        </div>
        
        <div class="flex flex-col items-center">
          <UButton to="/about" variant="ghost" color="white" icon="i-heroicons-information-circle" size="lg" aria-label="About" />
          <span class="text-[10px] mt-1 font-medium text-gray-400">About</span>
        </div>

        <div class="flex flex-col items-center relative">
          <UButton 
            variant="ghost" 
            color="white" 
            :icon="isMobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-user'" 
            size="lg" 
            aria-label="Account"
            @click="isMobileMenuOpen = !isMobileMenuOpen" 
          />
          <span class="text-[10px] mt-1 font-medium text-gray-400">Account</span>
          
          <!-- Auth / Account Popup Menu (Triggered by Hamburger/User icon) -->
          <div v-if="isMobileMenuOpen" class="absolute bottom-16 right-0 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden pointer-events-auto origin-bottom-right transition-all">
            <div class="py-2" v-if="!isAuthenticated">
              <UButton to="/login" variant="ghost" color="white" label="Log In" block class="justify-start px-4 rounded-none" @click="isMobileMenuOpen = false" />
              <UButton to="/register" variant="ghost" color="primary" label="Sign Up" block class="justify-start px-4 rounded-none" @click="isMobileMenuOpen = false" />
            </div>
            <div class="py-2" v-else>
              <div class="px-4 py-2 border-b border-gray-800 mb-1">
                <span class="block text-xs text-gray-400">Signed in as</span>
                <span class="block text-sm font-medium truncate">{{ user?.email }}</span>
              </div>
              <UButton to="/dashboard" variant="ghost" color="white" icon="i-heroicons-squares-2x2" label="Dashboard" block class="justify-start px-4 rounded-none" @click="isMobileMenuOpen = false" />
              <UButton variant="ghost" color="red" icon="i-heroicons-arrow-right-on-rectangle" label="Log Out" block class="justify-start px-4 rounded-none" @click="() => { isMobileMenuOpen = false; handleLogout() }" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const colorMode = useColorMode()
const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const toggleColorMode = () => {
  isDark.value = !isDark.value
}

const { user, isAuthenticated, isLoading, logout } = useAuth()
const isMobileMenuOpen = ref(false)
const isDesktopMenuOpen = ref(false)

const handleLogout = async () => {
  await logout()
  navigateTo('/')
}

const dropdownItems = computed(() => {
  return [
    [{
      label: user.value?.email,
      slot: 'account',
      disabled: true
    }],
    [{
      label: 'Dashboard',
      icon: 'i-heroicons-home',
      to: '/dashboard'
    }, {
      label: 'Profile',
      icon: 'i-heroicons-user',
      to: '/profile'
    }],
    [{
      label: 'Sign out',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: handleLogout
    }]
  ]
})
</script>
