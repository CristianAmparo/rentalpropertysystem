<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const { fetchUser, isAuthenticated } = useAuth()

// Fetch user session on app load
onMounted(() => {
  fetchUser()
})
</script>
