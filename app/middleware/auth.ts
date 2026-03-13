export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()
  
  // If user is not authenticated, redirect to login page
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
