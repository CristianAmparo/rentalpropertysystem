<template>
  <div class="py-12 md:py-24 bg-gray-50 dark:bg-gray-950 min-h-screen">
    <UContainer class="px-4 py-4 md:px-8 md:py-8">
      <div class="max-w-2xl mx-auto">
        <UCard class="shadow-md hover:shadow-lg transition-shadow">
          <template #header>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Contact Us</h1>
            <p class="text-sm text-gray-500 mt-1">We'd love to hear from you. Send us a message below.</p>
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

            <UFormField label="Email" name="email" required>
              <UInput v-model="state.email" type="email" class="w-full" />
            </UFormField>

            <UFormField label="Message" name="message" required>
              <UTextarea v-model="state.message" :rows="4" class="w-full" />
            </UFormField>

            <UButton type="submit" color="primary" block :loading="isLoading">
              Send Message
            </UButton>
          </UForm>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

useHead({
  title: 'Contact Us - RentalProperty',
})

const { user } = useAuth()
const isLoading = ref(false)

const state = reactive({
  firstName: user.value?.name?.split(' ')[0] || '',
  lastName: user.value?.name?.split(' ').slice(1).join(' ') || '',
  email: user.value?.email || '',
  message: ''
})

const onSubmit = async () => {
  isLoading.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  alert('Message sent placeholder!')
  isLoading.value = false
  state.message = ''
}
</script>
