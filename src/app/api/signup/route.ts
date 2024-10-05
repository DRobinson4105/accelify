import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import cookie from 'cookie'

const prisma = new PrismaClient()

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key'

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password } = await req.json()

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword, // Store hashed password
      },
    })

    // Generate JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      SECRET_KEY,
      { expiresIn: '1h' }
    )

    // Set the token in an HTTP-only cookie
    const response = NextResponse.json({ message: 'Signup successful' })
    response.headers.append(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
        sameSite: 'strict',
        maxAge: 3600, // 1 hour
        path: '/',
      })
    )

    return response
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
