import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server"; // Use NextResponse for the Next.js 13+ API format

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get('companyId');

  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }

  try {
    // Step 1: Fetch the company using the companyId
    const company = await prisma.company.findFirst({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Step 2: Use the company's industryId to fetch the industry name
    const industry = await prisma.industry.findFirst({
      where: { id: company.industryId },
    });

    if (!industry) {
      return NextResponse.json({ error: "Industry not found" }, { status: 404 });
    }

    // Return the industry name
    return NextResponse.json({ industry: industry.name });
  } catch (error) {
    console.error("Error fetching industry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
