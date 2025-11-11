const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function exportLaunchProducts() {
  try {
    console.log('🚀 Starting export of launch products...\n');

    // Get all sectors with their complete hierarchy
    const sectors = await prisma.sector.findMany({
      include: {
        categories: {
          include: {
            subcategories: {
              include: {
                products: {
                  include: {
                    supplier: true
                  },
                  orderBy: {
                    createdAt: 'desc'
                  },
                  take: 3 // Only top 3 products per subcategory
                }
              },
              orderBy: {
                createdAt: 'desc'
              },
              take: 5 // Only top 5 subcategories per category
            }
          },
          orderBy: {
            name: 'asc'
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log(`📊 Found ${sectors.length} sectors`);

    // Flatten the data structure to get all launch products
    const launchProducts = [];
    let totalCategories = 0;
    let totalSubcategories = 0;
    let totalProducts = 0;

    sectors.forEach(sector => {
      totalCategories += sector.categories.length;
      
      sector.categories.forEach(category => {
        const displayedSubcategories = category.subcategories.slice(0, 5);
        totalSubcategories += displayedSubcategories.length;
        
        displayedSubcategories.forEach(subcategory => {
          const displayedProducts = subcategory.products.slice(0, 3);
          totalProducts += displayedProducts.length;
          
          displayedProducts.forEach(product => {
            launchProducts.push({
              // Hierarchy
              sectorId: sector.id,
              sectorName: sector.name,
              categoryId: category.id,
              categoryName: category.name,
              subcategoryId: subcategory.id,
              subcategoryName: subcategory.name,
              
              // Product details
              productId: product.id,
              productName: product.name,
              price: product.price,
              priceUnit: product.priceUnit,
              brand: product.brand,
              imageUrl: product.imageUrl,
              
              // Supplier details
              supplierId: product.supplierId,
              supplierName: product.supplier?.name || 'Unknown',
              supplierLocation: product.supplier?.location || 'Unknown',
              
              // URLs for frontend
              sectorUrl: `/industry/${sector.name.toLowerCase().replace(/[&]/g, 'and').replace(/[^a-z0-9\\s]/g, '').replace(/\\s+/g, '-')}`,
              subcategoryUrl: `/subcategory/${subcategory.name.toLowerCase().replace(/[&]/g, 'and').replace(/[^a-z0-9\\s]/g, '').replace(/\\s+/g, '-')}?id=${subcategory.id}`
            });
          });
        });
      });
    });

    console.log(`\n📈 Launch Statistics:`);
    console.log(`├── Sectors: ${sectors.length}`);
    console.log(`├── Categories: ${totalCategories}`);
    console.log(`├── Subcategories: ${totalSubcategories} (max 5 per category)`);
    console.log(`└── Products: ${totalProducts} (max 3 per subcategory)`);

    // Create exports directory
    const exportDir = path.join(__dirname, 'launch-exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    // Export as JSON
    const jsonData = {
      exportInfo: {
        timestamp: new Date().toISOString(),
        totalSectors: sectors.length,
        totalCategories,
        totalSubcategories,
        totalProducts,
        description: 'Launch products - 3 per subcategory, 5 subcategories per category, all categories per sector'
      },
      products: launchProducts
    };

    fs.writeFileSync(
      path.join(exportDir, 'launch-products.json'),
      JSON.stringify(jsonData, null, 2)
    );

    // Export as CSV
    const csvHeaders = [
      'Product ID', 'Product Name', 'Price', 'Price Unit', 'Brand',
      'Supplier Name', 'Supplier Location',
      'Subcategory', 'Category', 'Sector',
      'Image URL', 'Subcategory URL', 'Sector URL'
    ];

    const csvRows = launchProducts.map(product => [
      product.productId,
      `"${product.productName.replace(/"/g, '""')}"`, // Escape quotes
      product.price || '',
      product.priceUnit || '',
      product.brand || '',
      `"${product.supplierName.replace(/"/g, '""')}"`,
      `"${product.supplierLocation.replace(/"/g, '""')}"`,
      `"${product.subcategoryName.replace(/"/g, '""')}"`,
      `"${product.categoryName.replace(/"/g, '""')}"`,
      `"${product.sectorName.replace(/"/g, '""')}"`,
      product.imageUrl || '',
      product.subcategoryUrl,
      product.sectorUrl
    ]);

    const csvContent = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');

    fs.writeFileSync(
      path.join(exportDir, 'launch-products.csv'),
      csvContent
    );

    // Export summary by sector
    const sectorSummary = sectors.map(sector => {
      const sectorCategories = sector.categories.length;
      const sectorSubcategories = sector.categories.reduce((sum, cat) => sum + Math.min(cat.subcategories.length, 5), 0);
      const sectorProducts = sector.categories.reduce((sum, cat) => {
        return sum + cat.subcategories.slice(0, 5).reduce((subSum, sub) => subSum + Math.min(sub.products.length, 3), 0);
      }, 0);

      return {
        sectorId: sector.id,
        sectorName: sector.name,
        categoriesCount: sectorCategories,
        subcategoriesCount: sectorSubcategories,
        productsCount: sectorProducts,
        sectorUrl: `/industry/${sector.name.toLowerCase().replace(/[&]/g, 'and').replace(/[^a-z0-9\\s]/g, '').replace(/\\s+/g, '-')}`
      };
    });

    fs.writeFileSync(
      path.join(exportDir, 'launch-summary-by-sector.json'),
      JSON.stringify({
        exportInfo: {
          timestamp: new Date().toISOString(),
          description: 'Summary of launch content by sector'
        },
        sectors: sectorSummary,
        totals: {
          sectors: sectors.length,
          categories: totalCategories,
          subcategories: totalSubcategories,
          products: totalProducts
        }
      }, null, 2)
    );

    console.log(`\n✅ Export completed successfully!`);
    console.log(`\n📁 Files created in ./launch-exports/:`);
    console.log(`├── launch-products.json (${totalProducts} products with full details)`);
    console.log(`├── launch-products.csv (${totalProducts} products in spreadsheet format)`);
    console.log(`└── launch-summary-by-sector.json (sector breakdown)`);

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error exporting launch products:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Run the export
exportLaunchProducts();