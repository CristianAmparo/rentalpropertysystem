<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <UToaster />
  </NuxtLayout>
</template>

<script setup>
const { fetchUser } = useAuth()
const { fetchSavedProperties } = useProperties()
const authSession = useCookie('auth_session')

// Fetch user session on app load during SSR if they have an active session
await useAsyncData('auth-init', async () => {
  if (authSession.value) {
    await fetchUser()
    await fetchSavedProperties()
  }
  return true
})
</script>
