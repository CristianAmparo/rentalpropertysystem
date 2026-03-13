import bcrypt from 'bcrypt'
import { prisma } from '../../utils/prisma'
import { generateToken } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password, name, phone, role } = body

    if (!email || !password || !name) {
      throw createError({ statusCode: 400, statusMessage: 'Email, password, and name are required' })
    }

    const unverifiedRole = role === 'ADMIN' ? 'ADMIN' : 'USER'

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw createError({ statusCode: 400, statusMessage: 'Email already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: unverifiedRole
      }
    })

    // Generate JWT
    const token = generateToken({ id: user.id, email: user.email, role: user.role })

    // Set HTTP-only cookie
    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    // We don't want to return the hashed password Let's destructure
    const { password: _, ...userWithoutPassword } = user

    return {
      message: 'Registration successful',
      user: userWithoutPassword
    }
  } catch (error: any) {
    if (error.statusCode) {
        throw error
    }
    throw createError({ statusCode: 500, statusMessage: error.message || 'Internal Server Error' })
  }
})
