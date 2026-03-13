import jwt from 'jsonwebtoken'

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'fallback-secret-key-12345'

export const generateToken = (user: { id: string, email: string, role: string }) => {
  return jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_ACCESS_SECRET, {
    expiresIn: '7d'
  })
}

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET)
  } catch (error) {
    return null
  }
}
