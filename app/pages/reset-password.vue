<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Subtle Background Gradient Additions -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary-500/5 rounded-full blur-3xl"></div>

    <UCard class="w-full max-w-md relative z-10 shadow-xl border-gray-100 dark:border-gray-800" :ui="{ base: 'backdrop-blur-sm bg-white/90 dark:bg-gray-900/90' }">
      <div class="mb-8 text-center">
        <UIcon name="i-heroicons-lock-closed" class="mx-auto h-12 w-12 text-primary-500" />
        <h2 class="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Create new password
        </h2>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Your new password must be different from previously used passwords.
        </p>
      </div>

      <UForm v-if="!success" :state="state" @submit="onSubmit">
        <div class="flex flex-col gap-5">
          <UFormGroup name="password">
            <UInput v-model="state.password" size="lg" type="password" placeholder="New Password" icon="i-heroicons-lock-closed" required class="w-full" />
          </UFormGroup>
          
          <UFormGroup name="confirmPassword">
            <UInput v-model="state.confirmPassword" size="lg" type="password" placeholder="Confirm New Password" icon="i-heroicons-lock-closed" required class="w-full" />
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
            Reset password
          </UButton>
        </div>
      </UForm>
      
      <div v-else class="text-center py-4">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
          <UIcon name="i-heroicons-check" class="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Password reset complete</h3>
        <p class="mt-2 text-sm text-gray-500">Your password has been successfully reset. You can now use your new password to sign in.</p>
        <div class="mt-8">
          <UButton to="/login" color="primary" variant="solid" size="lg" block class="w-full font-medium">Continue to login</UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  layout: false
})

const route = useRoute()
const token = ref('')
const isLoading = ref(false)
const errorMsg = ref('')
const success = ref(false)

const state = reactive({ 
  password: '',
  confirmPassword: ''
})

onMounted(() => {
  if (route.query.token) {
    token.value = route.query.token
  } else {
    errorMsg.value = 'Invalid or missing password reset token.'
  }
})

const onSubmit = async () => {
  if (state.password !== state.confirmPassword) {
    errorMsg.value = 'Passwords do not match.'
    return
  }
  
  if (!token.value) {
    errorMsg.value = 'Invalid reset token. Please request a new password reset link.'
    return
  }

  isLoading.value = true
  errorMsg.value = ''
  
  try {
    const response = await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { 
        token: token.value,
        password: state.password 
      }
    })
    success.value = true
  } catch (error) {
    errorMsg.value = error.data?.statusMessage || 'An error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>
