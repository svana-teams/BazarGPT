const { PrismaClient } = require('@prisma/client');

async function getLaunchProducts() {
  const prisma = new PrismaClient();
  
  try {
    // Get products from our 8 launch sectors with 3×3×3 structure
    const sectors = await prisma.sector.findMany({
      where: {
        id: { in: [2, 5, 8, 9, 10, 11, 13, 15] }
      },
      include: {
        categories: {
          take: 3,
          orderBy: { name: 'asc' },
          include: {
            subcategories: {
              take: 3,
              orderBy: { name: 'asc' },
              include: {
                products: {
                  take: 3,
                  orderBy: { id: 'desc' },
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    const allProducts = [];
    
    sectors.forEach(sector => {
      sector.categories.forEach(category => {
        category.subcategories.forEach(subcategory => {
          subcategory.products.forEach(product => {
            allProducts.push({
              productId: product.id,
              productName: product.name,
              sectorName: sector.name,
              categoryName: category.name,
              subcategoryName: subcategory.name
            });
          });
        });
      });
    });

    console.log(`Found ${allProducts.length} products in launch structure`);
    
    // Show first 20 for inspection
    console.log('\nSample product names:');
    allProducts.slice(0, 20).forEach((product, index) => {
      console.log(`${index + 1}. "${product.productName}" (ID: ${product.productId})`);
    });
    
    return allProducts;
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getLaunchProducts();