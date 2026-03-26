import { useState } from '#app'

export const useSavedProperties = () => {
  return useState<string[]>('saved-properties', () => [])
}

export const useProperties = () => {
  const savedPropertyIds = useSavedProperties()
  // Grab headers synchronously to prevent context loss during SSR when this composable is used after an await
  const headers = useRequestHeaders(['cookie'])

  // Fetch from the database on login/mount
  const fetchSavedProperties = async () => {
    console.log('fetchsavedproperties')
    try {
      const ids = await $fetch<string[]>('/api/user/saved-properties', { headers })
      savedPropertyIds.value = ids || []
    } catch (error) {
      savedPropertyIds.value = []
    }
  }

  const toggleSaveProperty = async (id: string) => {
    const isCurrentlySaved = savedPropertyIds.value.includes(id)
    const action = isCurrentlySaved ? 'unsave' : 'save'

    // Optimistic UI update
    if (isCurrentlySaved) {
      savedPropertyIds.value = savedPropertyIds.value.filter(pid => pid !== id)
    } else {
      savedPropertyIds.value.push(id)
    }

    try {
      await $fetch('/api/user/saved-properties', {
        method: 'POST',
        body: { propertyId: id, action }
      })
      return !isCurrentlySaved // Return new state
    } catch (error) {
      // Rollback on failure
      console.error('Failed to toggle save state', error)
      if (isCurrentlySaved) {
        savedPropertyIds.value.push(id) // Put it back
      } else {
        savedPropertyIds.value = savedPropertyIds.value.filter(pid => pid !== id) // Remove it again
      }
      return isCurrentlySaved
    }
  }

  const isPropertySaved = (id: string) => {
    return savedPropertyIds.value.includes(id)
  }

  // Helper to completely clear state on logout
  const clearSavedProperties = () => {
    savedPropertyIds.value = []
  }

  return {
    savedPropertyIds,
    toggleSaveProperty,
    isPropertySaved,
    fetchSavedProperties,
    clearSavedProperties
  }
}
