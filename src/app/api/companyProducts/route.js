// src/app/api/companyProducts/route.js
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get('companyId');

  if (!companyId) {
    return new Response(JSON.stringify({ message: "Company ID is required" }), { status: 400 });
  }

  try {
    // Fetch products linked to the company
    const companyProducts = await prisma.productOnCompany.findMany({
      where: { companyId },
      include: { product: true },  // Include product details
    });


    console.log("Fetched company products:", companyProducts); // Log the fetched products

    return new Response(JSON.stringify(companyProducts), { status: 200 });
  } catch (error) {
    console.error("Error fetching company products:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
