<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Subtle Background Gradient Additions -->
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>

    <UCard class="w-full max-w-md relative z-10 shadow-xl border-gray-100 dark:border-gray-800" :ui="{ base: 'backdrop-blur-sm bg-white/90 dark:bg-gray-900/90' }">
      <div class="mb-8 text-center">
        <UIcon name="i-heroicons-home-modern" class="mx-auto h-12 w-12 text-primary-500" />
        <h2 class="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Create an account
        </h2>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Already have an account?
          <NuxtLink :to="{ path: '/login', query: route.query }" class="font-medium text-primary-600 hover:text-primary-500 transition-colors">
            Sign in here
          </NuxtLink>
        </p>
      </div>

      <UForm :state="state" @submit="onSubmit">
        <div class="flex flex-col gap-3">
          <UFormGroup name="name">
            <UInput v-model="state.name" size="lg" placeholder="John Doe" icon="i-heroicons-user" required class="w-full" />
          </UFormGroup>

          <UFormGroup name="email">
            <UInput v-model="state.email" size="lg" type="email" placeholder="you@example.com" icon="i-heroicons-envelope" required class="w-full" />
          </UFormGroup>

          <UFormGroup name="password">
            <UInput v-model="state.password" size="lg" type="password" placeholder="••••••••" icon="i-heroicons-lock-closed" required class="w-full" />
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
            Sign up
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  layout: false,
  middleware: 'guest'
})

const route = useRoute()
const { register } = useAuth()
const isLoading = ref(false)
const errorMsg = ref('')
const state = reactive({ name: '', email: '', password: '', role: 'USER' })

const onSubmit = async () => {
  isLoading.value = true
  errorMsg.value = ''
  
  const result = await register(state)
  
  if (result.success) {
    if (route.query.callback) {
      navigateTo(route.query.callback)
    } else {
      navigateTo('/')
    }
  } else {
    errorMsg.value = result.error
  }
  isLoading.value = false
}
</script>
