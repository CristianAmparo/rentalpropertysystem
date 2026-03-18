<template>
  <div class="py-12 bg-gray-50 dark:bg-gray-950 min-h-screen">
    <UContainer class="px-4 py-4 md:px-8 md:py-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">User Profile</h1>
        
        <UCard class="shadow-md hover:shadow-lg transition-shadow">
          <template #header>
            <div class="flex items-center gap-4">
              <UAvatar :src="user?.avatar" :alt="user?.name" :text="user?.email?.charAt(0).toUpperCase()" size="lg" class="bg-primary-500 font-bold text-white text-xl" />
              <div>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ user?.name || 'User Profile' }}</h2>
                <p class="text-gray-500 dark:text-gray-400">{{ user?.email }}</p>
              </div>
            </div>
          </template>

          <UForm :state="state" @submit="onSubmit" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField label="First Name" name="firstName">
                <UInput v-model="state.firstName" class="w-full" />
              </UFormField>
              <UFormField label="Last Name" name="lastName">
                <UInput v-model="state.lastName" class="w-full" />
              </UFormField>
            </div>

            <UFormField label="Phone Number" name="phone">
              <UInput v-model="state.phone" type="tel" class="w-full" />
            </UFormField>

            <UFormField label="Bio / About Me" name="bio" help="Write a short introduction for property managers.">
              <UTextarea v-model="state.bio" :rows="4" class="w-full" />
            </UFormField>

            <div class="flex justify-end pt-4">
              <UButton type="submit" color="primary" :loading="isLoading">
                Save Changes
              </UButton>
            </div>
          </UForm>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'My Profile - RentalProperty',
})

const { user } = useAuth()
const isLoading = ref(false)

const state = reactive({
  firstName: user.value?.name?.split(' ')[0] || '',
  lastName: user.value?.name?.split(' ')[1] || '',
  phone: '',
  bio: ''
})

const onSubmit = async () => {
  isLoading.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  // TODO: Add actual profile update hook here
  isLoading.value = false
}
</script>
