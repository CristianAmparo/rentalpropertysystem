import { ref, readonly } from 'vue'

export const useAuth = () => {
  const user = useState('auth_user', () => null)
  const isAuthenticated = useState('auth_isAuthenticated', () => false)
  const isLoading = useState('auth_isLoading', () => false)
  const headers = useRequestHeaders(['cookie'])

  const fetchUser = async () => {
    isLoading.value = true
    try {
      const data = await $fetch<any>('/api/auth/me', {
        headers
      })
      user.value = data.user
      isAuthenticated.value = true

    } catch (error) {
      console.error("fetchUser auth error:", error)
      user.value = null
      isAuthenticated.value = false
    } finally {
      isLoading.value = false
    }
  }

  const login = async (credentials: any) => {
    try {
      const data = await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      // Set an indicator cookie so the frontend knows the user has an active session
      const authSession = useCookie('auth_session')
      authSession.value = 'active'

      await fetchUser()
      const { fetchSavedProperties } = useProperties()
      await fetchSavedProperties()
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.data?.statusMessage || 'Login failed' }
    }
  }

  const register = async (userData: any) => {
    try {
      const data = await $fetch('/api/auth/register', {
        method: 'POST',
        body: userData
      })
      const authSession = useCookie('auth_session')
      authSession.value = 'active'

      await fetchUser()
      const { fetchSavedProperties } = useProperties()
      await fetchSavedProperties()
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.data?.statusMessage || 'Registration failed' }
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      // Clear the session indicator cookie
      const authSession = useCookie('auth_session')
      authSession.value = null

      user.value = null
      isAuthenticated.value = false
      
      const { clearSavedProperties } = useProperties()
      clearSavedProperties()
      
      navigateTo('/login')
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    fetchUser,
    login,
    register,
    logout
  }
}
