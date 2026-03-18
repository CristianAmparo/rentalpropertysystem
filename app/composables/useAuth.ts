import { ref, readonly } from 'vue'

export const useAuth = () => {
  const user = useState('auth_user', () => null)
  const isAuthenticated = useState('auth_isAuthenticated', () => false)
  const isLoading = useState('auth_isLoading', () => false)

  const fetchUser = async () => {
    isLoading.value = true
    try {
      const data = await $fetch<any>('/api/auth/me')
      user.value = data.user
      isAuthenticated.value = true
    } catch (error) {
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
      const authToken = useCookie('auth_token')
      authToken.value = 'active'
      
      await fetchUser()
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
      const authToken = useCookie('auth_token')
      authToken.value = 'active'

      await fetchUser()
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.data?.statusMessage || 'Registration failed' }
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      // Clear the session indicator cookie
      const authToken = useCookie('auth_token')
      authToken.value = null
      
      user.value = null
      isAuthenticated.value = false
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
