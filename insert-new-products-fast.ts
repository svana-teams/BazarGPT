import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 FAST insertion of new products...');
  
  const newProducts = JSON.parse(fs.readFileSync('./data/new-products-not-in-products-folder.json', 'utf8'));
  console.log(`📦 Found ${newProducts.length.toLocaleString()} new products`);
  
  // Pre-load ALL existing data into memory for speed
  console.log('📥 Loading all existing data...');
  const [sectors, categories, subcategories, suppliers] = await Promise.all([
    prisma.sector.findMany(),
    prisma.category.findMany(), 
    prisma.subcategory.findMany(),
    prisma.supplier.findMany()
  ]);
  
  // Create lookup maps
  const sectorMap = new Map(sectors.map(s => [s.name, s.id]));
  const categoryMap = new Map(categories.map(c => [`${c.sectorId}:${c.name}`, c.id]));
  const subcategoryMap = new Map(subcategories.map(sc => [`${sc.categoryId}:${sc.name}`, sc.id]));
  const supplierMap = new Map(suppliers.map(s => [`${s.name}:${s.location || ''}`, s.id]));
  
  console.log(`✓ Loaded: ${sectors.length} sectors, ${categories.length} categories, ${subcategories.length} subcategories, ${suppliers.length} suppliers`);
  
  // Pre-create all missing hierarchy and suppliers in bulk
  console.log('🔧 Creating missing hierarchy and suppliers...');
  
  const newSectors = new Set<string>();
  const newCategories = new Set<string>();
  const newSubcategories = new Set<string>();
  const newSuppliers = new Set<string>();
  
  // Analyze what's missing
  for (const product of newProducts) {
    if (!product.supplier?.name || !product.name) continue;
    
    const sector = product.subcategory.sector;
    const category = product.subcategory.category;
    const subcategory = product.subcategory.name;
    const supplierKey = `${product.supplier.name}:${product.supplier.location || ''}`;
    
    if (!sectorMap.has(sector)) newSectors.add(sector);
    if (!supplierMap.has(supplierKey)) newSuppliers.add(supplierKey);
  }
  
  // Bulk create sectors
  if (newSectors.size > 0) {
    console.log(`Creating ${newSectors.size} new sectors...`);
    const sectorData = Array.from(newSectors).map(name => ({ name }));
    await prisma.sector.createMany({ data: sectorData, skipDuplicates: true });
    
    // Reload sectors
    const updatedSectors = await prisma.sector.findMany();
    sectorMap.clear();
    updatedSectors.forEach(s => sectorMap.set(s.name, s.id));
  }
  
  // Bulk create categories  
  for (const product of newProducts) {
    if (!product.supplier?.name || !product.name) continue;
    const sectorId = sectorMap.get(product.subcategory.sector);
    const categoryKey = `${sectorId}:${product.subcategory.category}`;
    if (sectorId && !categoryMap.has(categoryKey)) {
      newCategories.add(`${product.subcategory.category}:${sectorId}`);
    }
  }
  
  if (newCategories.size > 0) {
    console.log(`Creating ${newCategories.size} new categories...`);
    const categoryData = Array.from(newCategories).map(item => {
      const [name, sectorId] = item.split(':');
      return { name, sectorId: parseInt(sectorId) };
    });
    await prisma.category.createMany({ data: categoryData, skipDuplicates: true });
    
    // Reload categories
    const updatedCategories = await prisma.category.findMany();
    categoryMap.clear();
    updatedCategories.forEach(c => categoryMap.set(`${c.sectorId}:${c.name}`, c.id));
  }
  
  // Similar for subcategories
  for (const product of newProducts) {
    if (!product.supplier?.name || !product.name) continue;
    const sectorId = sectorMap.get(product.subcategory.sector);
    const categoryId = categoryMap.get(`${sectorId}:${product.subcategory.category}`);
    const subcategoryKey = `${categoryId}:${product.subcategory.name}`;
    if (categoryId && !subcategoryMap.has(subcategoryKey)) {
      newSubcategories.add(`${product.subcategory.name}:${categoryId}:${product.subcategory.url}`);
    }
  }
  
  if (newSubcategories.size > 0) {
    console.log(`Creating ${newSubcategories.size} new subcategories...`);
    const subcategoryData = Array.from(newSubcategories).map(item => {
      const [name, categoryId, url] = item.split(':');
      return { name, categoryId: parseInt(categoryId), url };
    });
    await prisma.subcategory.createMany({ data: subcategoryData, skipDuplicates: true });
    
    // Reload subcategories
    const updatedSubcategories = await prisma.subcategory.findMany();
    subcategoryMap.clear();
    updatedSubcategories.forEach(sc => subcategoryMap.set(`${sc.categoryId}:${sc.name}`, sc.id));
  }
  
  // Bulk create suppliers
  if (newSuppliers.size > 0) {
    console.log(`Creating ${newSuppliers.size} new suppliers...`);
    const supplierData = Array.from(newSuppliers).map(key => {
      const [name, location] = key.split(':');
      const product = newProducts.find(p => p.supplier?.name === name && (p.supplier?.location || '') === location);
      const mobile = product?.supplier?.mobile || `NO-${Math.random().toString(36).substring(2, 10)}`;
      return {
        name,
        mobile,
        location: location || '',
        gst: '',
        email: product?.supplier?.email,
        website: product?.supplier?.website,
      };
    });
    
    // Insert in smaller batches to avoid conflicts
    const batchSize = 1000;
    for (let i = 0; i < supplierData.length; i += batchSize) {
      const batch = supplierData.slice(i, i + batchSize);
      await prisma.supplier.createMany({ data: batch, skipDuplicates: true });
      console.log(`Created supplier batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(supplierData.length/batchSize)}`);
    }
    
    // Reload suppliers
    const updatedSuppliers = await prisma.supplier.findMany();
    supplierMap.clear();
    updatedSuppliers.forEach(s => supplierMap.set(`${s.name}:${s.location || ''}`, s.id));
  }
  
  console.log('✅ All hierarchy and suppliers created!');
  
  // Now bulk insert products - this will be FAST
  console.log('📦 Bulk inserting products...');
  const productsToInsert = [];
  let skipped = 0;
  
  for (const product of newProducts) {
    if (!product.supplier?.name || !product.name) {
      skipped++;
      continue;
    }
    
    const sectorId = sectorMap.get(product.subcategory.sector);
    const categoryId = categoryMap.get(`${sectorId}:${product.subcategory.category}`);
    const subcategoryId = subcategoryMap.get(`${categoryId}:${product.subcategory.name}`);
    const supplierId = supplierMap.get(`${product.supplier.name}:${product.supplier.location || ''}`);
    
    if (subcategoryId && supplierId) {
      productsToInsert.push({
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        priceUnit: product.priceUnit,
        brand: product.brand,
        specifications: product.specifications,
        productDetailUrl: product.productDetailUrl,
        subcategoryId,
        supplierId,
      });
    } else {
      skipped++;
    }
  }
  
  console.log(`📊 Products to insert: ${productsToInsert.length.toLocaleString()}, Skipped: ${skipped}`);
  
  // Insert products in large batches
  const insertBatchSize = 2000;
  for (let i = 0; i < productsToInsert.length; i += insertBatchSize) {
    const batch = productsToInsert.slice(i, i + insertBatchSize);
    await prisma.product.createMany({ data: batch, skipDuplicates: true });
    console.log(`✅ Inserted batch ${Math.floor(i/insertBatchSize) + 1}/${Math.ceil(productsToInsert.length/insertBatchSize)} (${batch.length} products)`);
  }
  
  const finalCount = await prisma.product.count();
  console.log(`\n🎉 COMPLETED! Final product count: ${finalCount.toLocaleString()}`);
  
  await prisma.$disconnect();
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error('Error:', error);
    process.exit(1);
  });