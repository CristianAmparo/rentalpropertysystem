<template>
  <UContainer class="py-10 text-center">
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold text-primary">House Rental System</h1>
      </template>

      <div v-if="isLoading">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin text-2xl" />
      </div>
      
      <div v-else-if="isAuthenticated && user">
        <p class="mb-2 text-lg">Welcome back, <span class="font-bold">{{ user.name }}</span>!</p>
        <p class="mb-6 text-sm text-gray-500">{{ user.email }} • Role: {{ user.role }}</p>
        <UButton color="red" variant="soft" @click="logout" label="Sign Out" icon="i-heroicons-arrow-right-on-rectangle" />
      </div>
      
      <div v-else>
        <p class="mb-6 text-gray-600 dark:text-gray-300">
          You are not logged in.
        </p>
        <div class="flex gap-4 justify-center">
          <UButton to="/login" label="Sign In" color="primary" />
          <UButton to="/register" color="gray" variant="solid" label="Sign Up" />
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup>
const { user, isAuthenticated, isLoading, logout } = useAuth()
</script>
