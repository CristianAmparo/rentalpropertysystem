<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Subtle Background Gradient Additions -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary-500/5 rounded-full blur-3xl"></div>

    <UCard class="w-full max-w-md relative z-10 shadow-xl border-gray-100 dark:border-gray-800" :ui="{ base: 'backdrop-blur-sm bg-white/90 dark:bg-gray-900/90' }">
      <div class="mb-8 text-center">
        <UIcon name="i-heroicons-key" class="mx-auto h-12 w-12 text-primary-500" />
        <h2 class="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Reset your password
        </h2>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Or
          <NuxtLink to="/login" class="font-medium text-primary-600 hover:text-primary-500 transition-colors">
            return to sign in
          </NuxtLink>
        </p>
      </div>

      <UForm v-if="!success" :state="state" @submit="onSubmit">
        <div class="flex flex-col gap-5">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <UFormGroup name="email">
            <UInput v-model="state.email" size="lg" type="email" placeholder="you@example.com" icon="i-heroicons-envelope" required class="w-full" />
          </UFormGroup>

          <UAlert v-if="errorMsg" color="red" variant="soft" class="!p-2">
            <template #title>
              <div class="flex items-center justify-center gap-2">
                <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
                <span>{{ errorMsg }}</span>
              </div>
            </template>
          </UAlert>

          <UButton type="submit" color="primary" size="lg" block class="w-full font-semibold mt-2" :loading="isLoading">
            Send reset link
          </UButton>
        </div>
      </UForm>
      
      <div v-else class="text-center py-4">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
          <UIcon name="i-heroicons-check" class="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Check your email</h3>
        <p class="mt-2 text-sm text-gray-500">We've sent a password reset link to <span class="font-medium text-gray-900 dark:text-white">{{ state.email }}</span>.</p>
        <div class="mt-8">
          <UButton to="/login" color="gray" variant="solid" size="lg" block class="w-full font-medium">Return to login</UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

definePageMeta({
  layout: false
})

const isLoading = ref(false)
const errorMsg = ref('')
const success = ref(false)
const state = reactive({ email: '' })

const onSubmit = async () => {
  isLoading.value = true
  errorMsg.value = ''
  
  try {
    const response = await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: state
    })
    success.value = true
    console.log(response.message)
  } catch (error) {
    errorMsg.value = error.data?.statusMessage || 'An error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>
