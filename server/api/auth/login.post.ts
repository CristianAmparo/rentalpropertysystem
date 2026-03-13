import bcrypt from 'bcrypt'
import { prisma } from '../../utils/prisma'
import { generateToken } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    if (!email || !password) {
      throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.password) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    }

    if (user.banned) {
      throw createError({ statusCode: 403, statusMessage: 'Your account is banned' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role })

    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })

    const { password: _, ...userWithoutPassword } = user

    return {
      message: 'Login successful',
      user: userWithoutPassword
    }
  } catch (error: any) {
    if (error.statusCode) {
        throw error
    }
    throw createError({ statusCode: 500, statusMessage: error.message || 'Internal Server Error' })
  }
})
