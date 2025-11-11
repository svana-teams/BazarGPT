const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

async function exportFinalLaunchStructure() {
  const prisma = new PrismaClient();
  
  try {
    // Get 8 sectors with 3 categories each, 3 subcategories each, 3 products each
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
                  orderBy: { id: 'desc' }
                }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    const summary = {
      exportInfo: {
        timestamp: new Date().toISOString(),
        structure: '3 categories × 3 subcategories × 3 products per sector',
        description: 'Final BazarGPT launch structure'
      },
      sectors: sectors.map(sector => ({
        sectorId: sector.id,
        sectorName: sector.name,
        categoriesCount: sector.categories.length,
        subcategoriesCount: sector.categories.reduce((sum, cat) => sum + cat.subcategories.length, 0),
        productsCount: sector.categories.reduce((sum, cat) => 
          sum + cat.subcategories.reduce((subSum, sub) => subSum + sub.products.length, 0), 0),
        categories: sector.categories.map(category => ({
          categoryName: category.name,
          subcategoriesCount: category.subcategories.length,
          subcategories: category.subcategories.map(sub => ({
            subcategoryName: sub.name,
            productsCount: sub.products.length
          }))
        }))
      })),
      totals: {
        sectors: sectors.length,
        categories: sectors.reduce((sum, s) => sum + s.categories.length, 0),
        subcategories: sectors.reduce((sum, s) => sum + s.categories.reduce((catSum, c) => catSum + c.subcategories.length, 0), 0),
        products: sectors.reduce((sum, s) => sum + s.categories.reduce((catSum, c) => catSum + c.subcategories.reduce((subSum, sub) => subSum + sub.products.length, 0), 0), 0)
      }
    };

    // Ensure launch-exports directory exists
    if (!fs.existsSync('./launch-exports')) {
      fs.mkdirSync('./launch-exports');
    }

    // Write the final summary
    fs.writeFileSync('./launch-exports/final-launch-summary.json', JSON.stringify(summary, null, 2));
    
    console.log('✅ Final BazarGPT Launch Structure:');
    console.log(`📊 ${summary.totals.sectors} sectors × ${(summary.totals.categories/summary.totals.sectors).toFixed(1)} categories × ${(summary.totals.subcategories/summary.totals.categories).toFixed(1)} subcategories × ${(summary.totals.products/summary.totals.subcategories).toFixed(1)} products`);
    console.log(`🎯 Total products for launch: ${summary.totals.products}`);
    console.log(`📁 Summary saved to: ./launch-exports/final-launch-summary.json`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportFinalLaunchStructure();