import { prisma } from "@/lib/prisma"; // Ensure Prisma client is properly set up

export async function POST(req) {
  try {
    // Parse the incoming request body
    const { productName, companyId } = await req.json();

    // Find the product by name to get its ID
    const product = await prisma.product.findFirst({
      where: { name: productName },
    });

    if (!product) {
      return new Response(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    // Delete the ProductOnCompany record based on productId and companyId
    const deletedProductOnCompany = await prisma.productOnCompany.deleteMany({
      where: {
        productId: product.id,
        companyId: companyId,
      },
    });

    // Check if any record was deleted
    if (deletedProductOnCompany.count === 0) {
      return new Response(
        JSON.stringify({ message: "No matching product for the company found to delete" }),
        { status: 404 }
      );
    }

    // Respond with success if deletion was successful
    return new Response(
      JSON.stringify({ message: "Product successfully deleted from company" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}