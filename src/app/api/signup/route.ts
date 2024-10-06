import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import cookie from 'cookie'


const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key'

export async function POST(request: Request) {
  try {
    const { companyName, email, password, industryId } = await request.json();

    // Check if the company already exists
    const existingCompany = await prisma.company.findUnique({
      where: { email },
    });

    if (existingCompany) {
      return NextResponse.json(
        { error: "Company with this email already exists." },
        { status: 400 }
      );
    }

    // Hash the password before saving it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new company, with no products initially and linking the industry
    const newCompany = await prisma.company.create({
      data: {
        companyName,
        email,
        password: hashedPassword,
        industryId, // Set the industry relation using the industryId
        programStartDate: new Date(), // Optional: Use current date or omit it if default is set in Prisma schema
      },
    });

    //Generate JWT
    const token = jwt.sign(
      {id: newCompany.id, companyName: newCompany.companyName, industryId: newCompany.industryId},
      SECRET_KEY,
      {expiresIn: '1h'}
    )

    // Set the token in an HTTP-only cookie
    const response = NextResponse.json(newCompany, { status: 201 });
response.headers.set(
  'Set-Cookie',
  cookie.serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
    sameSite: 'strict',
    maxAge: 3600, // 1 hour
    path: '/',
  })
);

return response;

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
