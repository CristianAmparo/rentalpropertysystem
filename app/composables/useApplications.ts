export interface Application {
  id: string
  propertyId: string
  propertyTitle: string
  propertyAddress: string
  propertyImage: string | null
  dateApplied: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  formData: any
  documents: string[] | null
}

export const useApplications = () => {
  // Upload documents to the server
  const uploadDocuments = async (files: File[]) => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    
    return await $fetch<{ success: boolean, urls: string[] }>('/api/applications/upload', {
      method: 'POST',
      body: formData
    })
  }

  // Submit the final payload to MySQL
  const submitApplication = async (propertyId: string, formData: any, documents: string[]) => {
    return await $fetch<{ success: boolean, application: any }>('/api/applications', {
      method: 'POST',
      body: { propertyId, formData, documents }
    })
  }

  // Fetch from MySQL
  const fetchUserApplications = async () => {
    return await $fetch<Application[]>('/api/applications')
  }

  const getActiveApplicationsCount = (apps: Application[] | null) => {
    if (!apps) return 0
    return apps.filter(app => ['PENDING'].includes(app.status)).length
  }

  return {
    uploadDocuments,
    submitApplication,
    fetchUserApplications,
    getActiveApplicationsCount
  }
}
