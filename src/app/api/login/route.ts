import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import cookie from 'cookie'

const prisma = new PrismaClient()

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    // Find the user in the database
    const company = await prisma.company.findUnique({
      where: { email },
    })

    if (!company) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, company.password)
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Generate a JWT
    const token = jwt.sign(
      { id: company.id, email: company.email, name: company.companyName }, // Payload (user info to be encoded)
      SECRET_KEY, // Secret key for signing
      { expiresIn: '1h' } // Token expiration (e.g., 1 hour)
    )

    // Set the token as a cookie (httpOnly, secure, etc.)
    const response = NextResponse.json({ message: 'Login successful' })
    response.headers.append(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
        sameSite: 'strict',
        maxAge: 3600, // 1 hour
        path: '/',
      })
    )

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
