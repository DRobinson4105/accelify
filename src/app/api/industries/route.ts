import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const industries = await prisma.industry.findMany() // Fetch industries from your database
    return NextResponse.json(industries)
  } catch (error) {
    console.error('Error fetching industries:', error)
    return NextResponse.error()
  }
}
