export default defineNuxtRouteMiddleware((to, from) => {
  const authSession = useCookie('auth_session')
  
  // If user has an active session cookie, synchronously block guest routes (like login)
  if (authSession.value) {
    return navigateTo('/')
  }
})
