import { prisma } from "@/lib/prisma"; // Make sure to have prisma client properly set up

export async function POST(req) {
  try {
    // Parse the incoming request body
    const { productName, companyId, implemented } = await req.json();

    // Find the product by name
    const product = await prisma.product.findFirst({
      where: { name: productName },
    });

    if (!product) {
      return new Response(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    // Update the ProductOnCompany record to set 'implemented' status
    const updatedProductOnCompany = await prisma.productOnCompany.updateMany({
      where: {
        productId: product.id,
        companyId: companyId,
      },
      data: {
        implemented: implemented,
      },
    });

    if (updatedProductOnCompany.count === 0) {
      return new Response(
        JSON.stringify({ message: "Failed to update product" }),
        { status: 404 }
      );
    }

    // Respond with success
    return new Response(
      JSON.stringify({ message: "Product updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}
