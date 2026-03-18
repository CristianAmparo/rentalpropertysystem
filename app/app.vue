<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const { fetchUser } = useAuth()
const authToken = useCookie('auth_token')

// Fetch user session on app load only if they have an active token session cookie
onMounted(() => {
  if (authToken.value) {
    fetchUser()
  }
})
</script>
