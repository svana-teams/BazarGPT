import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface ProductData {
  sector: string;
  category: string;
  subcategory: {
    name: string;
    url: string;
  };
  products: Array<{
    name: string;
    imageUrl: string;
    price: string;
    priceUnit: string | null;
    brand: string;
    specifications: Record<string, any>;
    supplier: {
      name: string;
      location: string;
      gst: string | null;
      email: string | null;
      website: string | null;
      mobile: string;
    };
    productDetailUrl: string;
  }>;
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Read all product JSON files from all groups
  const groups = ['Group-1', 'Group-2', 'Group-3', 'Group-4'];
  const productsDir = path.join(process.cwd(), 'products');

  let totalProducts = 0;
  let processedProducts = 0;

  for (const group of groups) {
    const groupDir = path.join(productsDir, group);

    if (!fs.existsSync(groupDir)) {
      console.log(`⚠️  ${group} directory not found, skipping...`);
      continue;
    }

    const files = fs.readdirSync(groupDir)
      .filter(file => file.startsWith('aajjo-products-') && file.endsWith('.json'));

    console.log(`\n📂 Processing ${group} - ${files.length} files`);

    for (const file of files) {
      console.log(`  📄 Reading ${file}...`);
      const filePath = path.join(groupDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const data: ProductData[] = JSON.parse(fileContent);

      for (const item of data) {
        try {
          // Upsert Sector
          const sector = await prisma.sector.upsert({
            where: { name: item.sector },
            update: {},
            create: { name: item.sector },
          });

          // Upsert Category
          const category = await prisma.category.upsert({
            where: {
              sectorId_name: {
                sectorId: sector.id,
                name: item.category,
              },
            },
            update: {},
            create: {
              name: item.category,
              sectorId: sector.id,
            },
          });

          // Upsert Subcategory
          const subcategory = await prisma.subcategory.upsert({
            where: {
              categoryId_name: {
                categoryId: category.id,
                name: item.subcategory.name,
              },
            },
            update: {
              url: item.subcategory.url,
            },
            create: {
              name: item.subcategory.name,
              url: item.subcategory.url,
              categoryId: category.id,
            },
          });

          // Process products
          for (const product of item.products) {
            totalProducts++;

            // Upsert Supplier
            const supplier = await prisma.supplier.upsert({
              where: {
                gst_mobile: {
                  gst: product.supplier.gst || '',
                  mobile: product.supplier.mobile,
                },
              },
              update: {
                location: product.supplier.location,
                email: product.supplier.email,
                website: product.supplier.website,
              },
              create: {
                name: product.supplier.name,
                location: product.supplier.location,
                gst: product.supplier.gst || undefined,
                email: product.supplier.email,
                website: product.supplier.website,
                mobile: product.supplier.mobile,
              },
            });

            // Create Product
            await prisma.product.create({
              data: {
                name: product.name,
                imageUrl: product.imageUrl,
                price: product.price,
                priceUnit: product.priceUnit,
                brand: product.brand,
                specifications: product.specifications,
                productDetailUrl: product.productDetailUrl,
                subcategoryId: subcategory.id,
                supplierId: supplier.id,
              },
            });

            processedProducts++;

            if (processedProducts % 100 === 0) {
              console.log(`    ✓ Processed ${processedProducts}/${totalProducts} products`);
            }
          }
        } catch (error) {
          console.error(`    ❌ Error processing item:`, error);
        }
      }
    }
  }

  console.log(`\n✅ Seed completed!`);
  console.log(`   Total products imported: ${processedProducts}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
