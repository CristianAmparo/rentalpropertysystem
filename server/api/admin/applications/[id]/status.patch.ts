import { defineEventHandler, createError, readBody } from 'h3'
import { prisma } from '../../../../utils/prisma'

export default defineEventHandler(async (event) => {
  // Enforce authentication & admin role
  const user = event.context.user
  if (!user || user.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Admin access required',
    })
  }

  const id = event.context.params?.id
  const { status, notes } = await readBody(event)

  if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid application status',
    })
  }

  try {
    // 1. Fetch current application to get propertyId and tenant details
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        user: { select: { email: true, name: true } }
      }
    })

    if (!application) {
       throw createError({
         statusCode: 404,
         statusMessage: 'Application not found',
       })
    }

    // 2. Perform updates in a transaction for data consistency
    const result = await prisma.$transaction(async (tx: any) => {
      // Check for existing approved application for this property
      if (status === 'APPROVED') {
        const existingApproved = await tx.application.findFirst({
          where: {
            propertyId: application.propertyId,
            status: 'APPROVED',
            id: { not: id } // Exclude current application
          }
        })

        if (existingApproved) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Property already has an approved application. Reject the current tenant first.',
          })
        }
      }

      // Update status
      const updatedApp = await tx.application.update({
        where: { id },
        data: { status, notes }
      })

      // If approving this tenant, reject all other PENDING ones for the same property
      if (status === 'APPROVED') {
        await tx.application.updateMany({
          where: {
            propertyId: application.propertyId,
            status: 'PENDING',
            id: { not: id }
          },
          data: { 
            status: 'REJECTED'
          }
        })
      }

      // Re-evaluate property vacancy (is it occupied by ANY approved application?)
      const approvedAppsCount = await tx.application.count({
        where: {
          propertyId: application.propertyId,
          status: 'APPROVED'
        }
      })

      // If at least one application is approved, it's not vacant. Otherwise, it is vacant.
      await tx.property.update({
        where: { id: application.propertyId },
        data: { isVacant: approvedAppsCount === 0 }
      })

      return updatedApp
    })

    // 3. Automated Email Notification
    // ==========================================
    // PLACEHOLDER: Sending Email to Tenant
    // ==========================================
    /*
    async function sendEmailNotification(tenantEmail, tenantName, status) {
       console.log(`Sending email to ${tenantEmail}: Dear ${tenantName}, your application has been ${status}.`)
       // Integration logic for Nodemailer / Resend / AWS SES would go here.
       // Example:
       // await mailTransporter.sendMail({
       //   from: '"Antigravity Rentals" <noreply@antigravity.com>',
       //   to: tenantEmail,
       //   subject: `Application Update: ${status}`,
       //   text: `Hello ${tenantName}, your application for property ${application.propertyId} has been updated to: ${status}.`,
       // })
    }
    
    // In production, you'd trigger this asynchronously (uncomment when SMTP is ready):
    // await sendEmailNotification(application.user.email, application.user.name, status)
    */

    return { success: true, application: result }

  } catch (error: any) {
    console.error('Update application status error:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update application status'
    })
  }
})
