export default defineNuxtRouteMiddleware((to) => {
  const authSession = useCookie('auth_session')
  
  // If user lacks an active session cookie, synchronously jump to login
  if (!authSession.value) {
    return navigateTo('/login')
  }
})
