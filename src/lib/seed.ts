const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Step 1: Create an industry
  const industry = await prisma.industry.create({
    data: {
      name: 'Technology',
    },
  });

  console.log('Industry created:', industry);

  // Step 2: Create products
  const product1 = await prisma.product.create({
    data: {
      name: 'Product A',
      description: 'A powerful technology product.',
      category: 'Software', // Category for the product
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Product B',
      description: 'An innovative finance product.',
      category: 'Financial Service', // Category for the product
    },
  });

  console.log('Products created:', product1, product2);

  // Step 3: Create a company and assign the industry
  const company = await prisma.company.create({
    data: {
      companyName: 'Tech Innovators',
      email: 'info@techinnovators.com',
      password: 'securepassword', // In production, hash the password
      programStartDate: new Date('2024-01-01'), // Program start date
      industry: {
        connect: { id: industry.id }, // Link the company to the industry
      },
      // Step 4: Assign the products to the company, with implementation status
      products: {
        create: [
          { productId: product1.id, implemented: true },  // Set Product A as implemented
          { productId: product2.id, implemented: false }, // Set Product B as not implemented
        ],
      },
    },
  });

  console.log('Company created:', company);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
