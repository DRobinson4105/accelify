// api/updateProduct.js
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { productName, companyId, implemented } = req.body;

    try {
      // Find the productOnCompany record by product and company
      const productOnCompany = await prisma.productOnCompany.findFirst({
        where: {
          companyId: companyId,
          product: {
            name: productName,
          },
        },
      });

      if (!productOnCompany) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Update the implemented status
      await prisma.productOnCompany.update({
        where: { id: productOnCompany.id },
        data: {
          implemented: implemented,
        },
      });

      res.status(200).json({ message: "Product status updated" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update product status" });
    }
  }
}
