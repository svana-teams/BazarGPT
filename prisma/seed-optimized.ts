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

// In-memory caches to avoid repeated DB lookups
const sectorCache = new Map<string, number>();
const categoryCache = new Map<string, number>();
const subcategoryCache = new Map<string, number>();
const supplierCache = new Map<string, number>();

const BATCH_SIZE = 500; // Insert 500 products at a time
const LOG_INTERVAL = 1000; // Log every 1000 products

async function main() {
  console.log('🚀 Starting OPTIMIZED database seed...');
  console.log('📊 Expected: ~165,000 products\n');

  const startTime = Date.now();

  // Read all product JSON files
  const groups = ['Group-1', 'Group-2', 'Group-3', 'Group-4'];
  const productsDir = path.join(process.cwd(), 'products');

  let totalProducts = 0;
  let processedProducts = 0;
  let productBatch: any[] = [];

  // Pre-load existing data into cache
  console.log('📥 Loading existing data into cache...');
  const existingSectors = await prisma.sector.findMany();
  existingSectors.forEach((s: any) => sectorCache.set(s.name, s.id));

  const existingCategories = await prisma.category.findMany();
  existingCategories.forEach((c: any) => categoryCache.set(`${c.sectorId}:${c.name}`, c.id));

  const existingSubcategories = await prisma.subcategory.findMany();
  existingSubcategories.forEach((sc: any) => subcategoryCache.set(`${sc.categoryId}:${sc.name}`, sc.id));

  const existingSuppliers = await prisma.supplier.findMany();
  existingSuppliers.forEach((s: any) => {
    const key = `${s.gst}:${s.mobile}`;
    supplierCache.set(key, s.id);
  });
  console.log(`✓ Cached ${sectorCache.size} sectors, ${categoryCache.size} categories, ${subcategoryCache.size} subcategories, ${supplierCache.size} suppliers\n`);

  for (const group of groups) {
    const groupDir = path.join(productsDir, group);

    if (!fs.existsSync(groupDir)) {
      console.log(`⚠️  ${group} directory not found, skipping...`);
      continue;
    }

    const files = fs.readdirSync(groupDir)
      .filter(file => file.startsWith('aajjo-products-') && file.endsWith('.json'))
      .sort();

    console.log(`\n📂 Processing ${group} - ${files.length} files`);

    for (const file of files) {
      const filePath = path.join(groupDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const data: ProductData[] = JSON.parse(fileContent);

      console.log(`  📄 ${file} - ${data.length} categories`);

      for (const item of data) {
        try {
          // Get or create Sector (with caching)
          let sectorId = sectorCache.get(item.sector);
          if (!sectorId) {
            const sector = await prisma.sector.upsert({
              where: { name: item.sector },
              update: {},
              create: { name: item.sector },
            });
            sectorId = sector.id;
            sectorCache.set(item.sector, sectorId);
          }

          // Get or create Category (with caching)
          const categoryKey = `${sectorId}:${item.category}`;
          let categoryId = categoryCache.get(categoryKey);
          if (!categoryId) {
            const category = await prisma.category.upsert({
              where: {
                sectorId_name: {
                  sectorId: sectorId,
                  name: item.category,
                },
              },
              update: {},
              create: {
                name: item.category,
                sectorId: sectorId,
              },
            });
            categoryId = category.id;
            categoryCache.set(categoryKey, categoryId);
          }

          // Get or create Subcategory (with caching)
          const subcategoryKey = `${categoryId}:${item.subcategory.name}`;
          let subcategoryId = subcategoryCache.get(subcategoryKey);
          if (!subcategoryId) {
            const subcategory = await prisma.subcategory.upsert({
              where: {
                categoryId_name: {
                  categoryId: categoryId,
                  name: item.subcategory.name,
                },
              },
              update: {
                url: item.subcategory.url,
              },
              create: {
                name: item.subcategory.name,
                url: item.subcategory.url,
                categoryId: categoryId,
              },
            });
            subcategoryId = subcategory.id;
            subcategoryCache.set(subcategoryKey, subcategoryId);
          }

          // Process products in this subcategory
          for (const product of item.products) {
            totalProducts++;

            // Get or create Supplier (with caching)
            const supplierKey = `${product.supplier.gst || ''}:${product.supplier.mobile}`;
            let supplierId = supplierCache.get(supplierKey);

            if (!supplierId) {
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
                  name: product.supplier.name || `Supplier-${product.supplier.mobile}`,
                  location: product.supplier.location,
                  gst: product.supplier.gst || '',
                  email: product.supplier.email,
                  website: product.supplier.website,
                  mobile: product.supplier.mobile,
                },
              });
              supplierId = supplier.id;
              supplierCache.set(supplierKey, supplierId);
            }

            // Add to batch
            productBatch.push({
              name: product.name,
              imageUrl: product.imageUrl,
              price: product.price,
              priceUnit: product.priceUnit,
              brand: product.brand,
              specifications: product.specifications,
              productDetailUrl: product.productDetailUrl,
              subcategoryId: subcategoryId,
              supplierId: supplierId,
            });

            // Insert batch when it reaches BATCH_SIZE
            if (productBatch.length >= BATCH_SIZE) {
              await prisma.product.createMany({
                data: productBatch,
                skipDuplicates: true,
              });
              processedProducts += productBatch.length;
              productBatch = [];

              if (processedProducts % LOG_INTERVAL === 0) {
                const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
                const rate = Math.round(processedProducts / (Date.now() - startTime) * 1000);
                const remaining = Math.round((totalProducts - processedProducts) / rate / 60);
                console.log(`    ⚡ ${processedProducts.toLocaleString()}/${totalProducts.toLocaleString()} products | ${rate}/sec | ${elapsed}m elapsed | ~${remaining}m remaining`);
              }
            }
          }
        } catch (error) {
          console.error(`    ❌ Error processing item in ${file}:`, error);
        }
      }

      // Insert remaining products in batch
      if (productBatch.length > 0) {
        await prisma.product.createMany({
          data: productBatch,
          skipDuplicates: true,
        });
        processedProducts += productBatch.length;
        productBatch = [];
      }
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  const avgRate = Math.round(processedProducts / (Date.now() - startTime) * 1000);

  console.log(`\n✅ Import completed!`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📦 Total products imported: ${processedProducts.toLocaleString()}`);
  console.log(`⏱️  Total time: ${totalTime} minutes`);
  console.log(`⚡ Average rate: ${avgRate} products/second`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`\n📊 Database Summary:`);

  const counts = await Promise.all([
    prisma.sector.count(),
    prisma.category.count(),
    prisma.subcategory.count(),
    prisma.supplier.count(),
    prisma.product.count(),
  ]);

  console.log(`   Sectors: ${counts[0]}`);
  console.log(`   Categories: ${counts[1]}`);
  console.log(`   Subcategories: ${counts[2]}`);
  console.log(`   Suppliers: ${counts[3]}`);
  console.log(`   Products: ${counts[4]}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
