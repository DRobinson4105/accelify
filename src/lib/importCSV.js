import fs from 'fs';
import { parse } from 'csv-parse'; // Use csv-parse for ESM support
import { prisma } from "../lib/prisma.js";

// Function to import the CSV
async function importCSV() {
  const results = [];

  // Parse the CSV file
  fs.createReadStream("woosh.csv") // Replace with your CSV file path
    .pipe(parse({ columns: true })) // Automatically convert the first row into column headers
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      for (const row of results) {
        const { Company, Implemented, Product } = row;

        try {
          // Find the company by its name
          const company = await prisma.company.findFirst({
            where: { companyName: Company },
          });

          if (!company) {
            console.error(`Company ${Company} not found.`);
            continue;
          }

          // Find the product by its name
          const product = await prisma.product.findFirst({
            where: { name: Product },
          });

          if (!product) {
            console.error(`Product ${Product} not found.`);
            continue;
          }

          // Check if the product is already linked to the company
          const existingEntry = await prisma.productOnCompany.findFirst({
            where: {
              companyId: company.id,
              productId: product.id,
            },
          });

          if (existingEntry) {
            console.log(
              `Product ${Product} is already associated with ${Company}. Skipping.`
            );
            continue;
          }

          // Create the ProductOnCompany entry
          await prisma.productOnCompany.create({
            data: {
              companyId: company.id,
              productId: product.id,
              implemented: Implemented.toLowerCase() === "true", // Convert string "TRUE" or "FALSE" to boolean
            },
          });

          console.log(
            `Successfully added ${Product} to ${Company} with implemented status: ${Implemented}`
          );
        } catch (error) {
          console.error(`Error processing ${Company} / ${Product}:`, error);
        }
      }

      console.log("CSV Import Completed.");
    });
}

// Execute the import
importCSV();
