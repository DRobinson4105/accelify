const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getCompanyId() {
  const company = await prisma.company.findUnique({
    where: {
      email: 'info@techinnovators.com', // Lookup by email
    },
  });

  return company?.id;
}

async function getCompanyProducts(companyId: string) {
  const companyProducts = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
  });

  console.log('All Products (Implemented or Not):', companyProducts?.products);
}

async function getImplementedProducts(companyId: string) {
  const implementedProducts = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
    include: {
      products: {
        where: {
          implemented: true, // Only fetch implemented products
        },
        include: {
          product: true,
        },
      },
    },
  });

  console.log('Implemented Products:', implementedProducts?.products);
}

async function getNotImplementedProducts(companyId: string) {
  const notImplementedProducts = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
    include: {
      products: {
        where: {
          implemented: false, // Only fetch not implemented products
        },
        include: {
          product: true,
        },
      },
    },
  });

  console.log('Not Implemented Products:', notImplementedProducts?.products);
}

async function main() {
  // Step 1: Fetch the company ID for "Tech Innovators"
  const companyId = await getCompanyId();

  if (!companyId) {
    console.log('Company not found.');
    return;
  }

  // Step 2: Fetch all products (both implemented and not implemented)
  await getCompanyProducts(companyId);

  // Step 3: Fetch only implemented products
  await getImplementedProducts(companyId);

  // Step 4: Fetch only not implemented products
  await getNotImplementedProducts(companyId);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
