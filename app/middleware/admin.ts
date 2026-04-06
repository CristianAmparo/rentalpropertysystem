export default defineNuxtRouteMiddleware(async (to) => {
  const { user, fetchUser } = useAuth()
  const authSession = useCookie('auth_session')

  // If no session cookie, redirect to login
  if (!authSession.value) {
    return navigateTo('/login')
  }

  // If user state is missing, try fetching it (in case of page refresh)
  if (!user.value) {
    await fetchUser()
  }

  // Final check: Is user an ADMIN?
  if (!user.value || user.value.role !== 'ADMIN') {
    // If not admin, redirect to tenant dashboard or home
    return navigateTo('/dashboard')
  }
})
