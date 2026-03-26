import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import { join } from 'path'
import { writeFile } from 'fs/promises'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No files uploaded',
      })
    }
    
    const uploadedFiles = []
    
    // Process each file in the multipart payload
    for (const field of formData) {
      if (field.name === 'files' && field.filename) {
        // Generate a unique physical filename
        const ext = field.filename.split('.').pop()
        const uniqueFilename = `${randomUUID()}.${ext}`
        
        // Define exact path: /public/uploads/file.ext
        const filePath = join(process.cwd(), 'public', 'uploads', uniqueFilename)
        
        // Write the buffer to the physical disk route
        await writeFile(filePath, field.data)
        
        // Push the relative public accessible URL to our return array
        uploadedFiles.push(`/uploads/${uniqueFilename}`)
      }
    }
    
    return {
      success: true,
      urls: uploadedFiles
    }
    
  } catch (error: any) {
    console.error('File upload error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'File upload failed'
    })
  }
})
