import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Inserting new products and suppliers...');
  
  const newProducts = JSON.parse(fs.readFileSync('./data/new-products-not-in-products-folder.json', 'utf8'));
  console.log(`📦 Found ${newProducts.length.toLocaleString()} new products to insert`);
  
  // Get existing hierarchy data
  const sectors = await prisma.sector.findMany();
  const categories = await prisma.category.findMany();
  const subcategories = await prisma.subcategory.findMany();
  
  const sectorMap = new Map(sectors.map(s => [s.name, s.id]));
  const categoryMap = new Map(categories.map(c => [`${c.sectorId}:${c.name}`, c.id]));
  const subcategoryMap = new Map(subcategories.map(sc => [`${sc.categoryId}:${sc.name}`, sc.id]));
  
  console.log(`✓ Loaded ${sectors.length} sectors, ${categories.length} categories, ${subcategories.length} subcategories`);
  
  let processed = 0;
  const batchSize = 100;
  
  for (let i = 0; i < newProducts.length; i += batchSize) {
    const batch = newProducts.slice(i, i + batchSize);
    const productsToInsert = [];
    
    for (const product of batch) {
      try {
        if (!product.supplier?.name || !product.name) continue;
        
        // Get/create sector
        let sectorId = sectorMap.get(product.subcategory.sector);
        if (!sectorId) {
          const sector = await prisma.sector.create({ data: { name: product.subcategory.sector } });
          sectorId = sector.id;
          sectorMap.set(product.subcategory.sector, sectorId);
        }

        // Get/create category
        const categoryKey = `${sectorId}:${product.subcategory.category}`;
        let categoryId = categoryMap.get(categoryKey);
        if (!categoryId) {
          const category = await prisma.category.create({
            data: { name: product.subcategory.category, sectorId }
          });
          categoryId = category.id;
          categoryMap.set(categoryKey, categoryId);
        }

        // Get/create subcategory
        const subcategoryKey = `${categoryId}:${product.subcategory.name}`;
        let subcategoryId = subcategoryMap.get(subcategoryKey);
        if (!subcategoryId) {
          const subcategory = await prisma.subcategory.create({
            data: { name: product.subcategory.name, url: product.subcategory.url, categoryId }
          });
          subcategoryId = subcategory.id;
          subcategoryMap.set(subcategoryKey, subcategoryId);
        }

        // Get/create supplier
        const mobile = product.supplier.mobile || `NO-${Math.random().toString(36).substr(2, 8)}`;
        
        let supplier = await prisma.supplier.findFirst({
          where: product.supplier.mobile 
            ? { mobile: product.supplier.mobile, name: product.supplier.name }
            : { name: product.supplier.name }
        });

        if (!supplier) {
          supplier = await prisma.supplier.create({
            data: {
              name: product.supplier.name,
              location: product.supplier.location || '',
              gst: '',
              email: product.supplier.email,
              website: product.supplier.website,
              mobile: mobile,
            },
          });
        }

        // Add to batch
        productsToInsert.push({
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.price,
          priceUnit: product.priceUnit,
          brand: product.brand,
          specifications: product.specifications,
          productDetailUrl: product.productDetailUrl,
          subcategoryId: subcategoryId,
          supplierId: supplier.id,
        });
      } catch (error) {
        console.error(`❌ Error processing ${product.name}:`, error.message);
      }
    }

    // Insert batch
    if (productsToInsert.length > 0) {
      await prisma.product.createMany({
        data: productsToInsert,
        skipDuplicates: true,
      });
      processed += productsToInsert.length;
      
      console.log(`✅ Batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(newProducts.length/batchSize)} | ${processed.toLocaleString()}/${newProducts.length.toLocaleString()} products inserted`);
    }
  }

  const finalCount = await prisma.product.count();
  const supplierCount = await prisma.supplier.count();
  
  console.log(`\n🎉 Insertion completed!`);
  console.log(`📦 Total products in database: ${finalCount.toLocaleString()}`);
  console.log(`👥 Total suppliers in database: ${supplierCount.toLocaleString()}`);
  
  await prisma.$disconnect();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });