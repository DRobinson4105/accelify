import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(req : any) {
  const { firstName, lastName, email, password } = await req.json()

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
      },
    })

    // Respond with success
    return NextResponse.json(newUser, { status: 200 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Error creating user" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
