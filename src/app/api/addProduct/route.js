import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { productName, companyId } = await req.json(); // Get the request body

    // Find the product by its name using `findFirst`
    const product = await prisma.product.findFirst({
      where: { name: productName },
    });

    if (!product) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
      });
    }

    // Log the product details and company ID to ensure they're correct
    console.log("Product found:", product);
    console.log("Company ID:", companyId);

    // Add product to the company with the 'implemented' field set to false
    const result = await prisma.productOnCompany.create({
      data: {
        productId: product.id,
        companyId: companyId,
        implemented: false,
      },
    });

    // Log the result of the create operation
    console.log("Product added to company:", result);

    return new Response(JSON.stringify({ message: "Product added to company" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
