import { useState } from '#app'

// Global state for saved properties (persists across page navigations in the current session)
export const useSavedProperties = () => {
  return useState<string[]>('saved-properties', () => [])
}

export const useProperties = () => {
  const savedPropertyIds = useSavedProperties()

  const toggleSaveProperty = (id: string) => {
    if (savedPropertyIds.value.includes(id)) {
      savedPropertyIds.value = savedPropertyIds.value.filter(pid => pid !== id)
      return false // Not saved
    } else {
      savedPropertyIds.value.push(id)
      return true // Saved
    }
  }

  const isPropertySaved = (id: string) => {
    return savedPropertyIds.value.includes(id)
  }

  return {
    savedPropertyIds,
    toggleSaveProperty,
    isPropertySaved
  }
}
