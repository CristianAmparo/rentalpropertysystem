import { useState } from '#app'

export interface Application {
  id: string
  propertyId: string
  propertyTitle: string
  dateApplied: string
  status: 'Pending' | 'Under Review' | 'Approved' | 'Declined'
  formData: any
}

export const useApplications = () => {
  const applications = useState<Application[]>('user-applications', () => [])

  const submitApplication = (propertyId: string, propertyTitle: string, formData: any) => {
    const newApp: Application = {
      id: Math.random().toString(36).substring(2, 9),
      propertyId,
      propertyTitle,
      dateApplied: new Date().toISOString(),
      status: 'Pending',
      formData: { ...formData }
    }
    applications.value.unshift(newApp) // Add to beginning of array
    return newApp
  }

  const getUserApplications = () => {
    return applications.value
  }

  const getActiveApplicationsCount = () => {
    return applications.value.filter(app => ['Pending', 'Under Review'].includes(app.status)).length
  }

  return {
    applications,
    submitApplication,
    getUserApplications,
    getActiveApplicationsCount
  }
}
