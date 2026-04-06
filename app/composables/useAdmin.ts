export const useAdmin = () => {
    const headers = useRequestHeaders(['cookie'])
    const opts = { headers, credentials: 'include' as const }

    const fetchAnalytics = async () => {
      return await $fetch('/api/admin/analytics', { ...opts })
    }
  
    const fetchAllApplications = async () => {
      return await $fetch('/api/admin/applications', { ...opts })
    }

    const fetchApplication = async (id: string) => {
      return await $fetch(`/api/admin/applications/${id}`, { ...opts })
    }
  
    const updateApplicationStatus = async (id: string, status: string, notes?: string) => {
      return await $fetch(`/api/admin/applications/${id}/status`, {
        ...opts,
        method: 'PATCH',
        body: { status, notes }
      })
    }

    // --- Properties ---
    const fetchProperties = async (query?: any) => {
      return await $fetch('/api/admin/properties', { ...opts, query })
    }

    const fetchProperty = async (id: string) => {
      return await $fetch(`/api/admin/properties/${id}`, { ...opts })
    }

    const createProperty = async (body: any) => {
      return await $fetch('/api/admin/properties', {
        ...opts,
        method: 'POST',
        body
      })
    }

    const updateProperty = async (id: string, body: any) => {
      return await $fetch(`/api/admin/properties/${id}`, {
        ...opts,
        method: 'PUT',
        body
      })
    }

    const deleteProperty = async (id: string) => {
      return await $fetch(`/api/admin/properties/${id}`, {
        ...opts,
        method: 'DELETE'
      })
    }

    // --- Users ---
    const fetchUsers = async (query?: any) => {
      return await $fetch('/api/admin/users', { ...opts, query })
    }

    const updateUserStatus = async (id: string, banned: boolean) => {
      return await $fetch(`/api/admin/users/${id}/status`, {
        ...opts,
        method: 'PATCH',
        body: { banned }
      })
    }
  
    return {
      fetchAnalytics,
      fetchAllApplications,
      fetchApplication,
      updateApplicationStatus,
      fetchProperties,
      fetchProperty,
      createProperty,
      updateProperty,
      deleteProperty,
      fetchUsers,
      updateUserStatus
    }
  }
