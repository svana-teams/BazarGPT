const { PrismaClient } = require('@prisma/client');

async function improveAllProductNames() {
  const prisma = new PrismaClient();
  
  try {
    // Get all launch products
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

    function improveProductName(originalName) {
      let name = originalName;
      
      // Skip if already looks good or too short
      if (!name || name.length < 10) {
        return name;
      }
      
      // Remove common unwanted patterns while preserving the core product name
      const patterns = [
        // Remove packaging details but keep the main name
        /,\s*Packaging Type:\s*[^,]+/gi,
        /,\s*Package Type:\s*[^,]+/gi,
        
        // Remove size details that come after commas
        /,\s*Size:\s*[^,]+/gi,
        /,\s*Dimension:\s*[^,]+/gi,
        
        // Remove application details that come after commas  
        /,\s*For\s+[^,]+$/gi,
        /,\s*Application:\s*[^,]+/gi,
        /,\s*Usage:\s*[^,]+/gi,
        
        // Remove grade/purity details
        /,\s*Grade:\s*[^,]+/gi,
        /,\s*Purity:\s*[^,]+/gi,
        
        // Remove color when it comes after comma
        /,\s*Color:\s*[^,]+/gi,
        /,\s*Colour:\s*[^,]+/gi,
        
        // Remove capacity when it comes after comma
        /,\s*Capacity:\s*[^,]+/gi,
        /,\s*Load Capacity:\s*[^,]+/gi,
        
        // Remove model/brand when it comes after comma  
        /,\s*Model Name\/Number:\s*[^,]+/gi,
        /,\s*Brand:\s*[^,]+/gi,
        
        // Remove shape/form details
        /,\s*Shape:\s*[^,]+/gi,
        /,\s*Form:\s*[^,]+/gi,
        
        // Remove material when it comes after comma
        /,\s*Material:\s*[^,]+/gi,
        
        // Remove voltage/power when it comes after comma
        /,\s*Voltage:\s*[^,]+/gi,
        /,\s*Power:\s*[^,]+/gi,
        
        // Remove screen size details
        /,\s*Screen Size:\s*[^,]+/gi,
      ];
      
      // Apply all cleaning patterns
      for (const pattern of patterns) {
        name = name.replace(pattern, '');
      }
      
      // Clean up extra commas and spaces
      name = name.replace(/,+/g, ',').replace(/,\s*$/, '').replace(/^\s*,/, '');
      name = name.replace(/\s+/g, ' ').trim();
      
      // Fix common spelling/formatting issues
      const fixes = [
        { from: /\bdeckorative\b/gi, to: 'Decorative' },
        { from: /\binflataion\b/gi, to: 'Inflation' },
        { from: /\bbanch\b/gi, to: 'Bench' },
        { from: /\bLAED ACID\b/gi, to: 'Lead Acid' },
        { from: /\btruffing\b/gi, to: 'Trunking' },
        { from: /\bflenge\b/gi, to: 'Flange' },
        { from: /\bSquarte\b/gi, to: 'Square' },
        { from: /\bRectuangle\b/gi, to: 'Rectangle' },
        { from: /\bsaiz\b/gi, to: 'Size' },
        { from: /\bANCER\b/gi, to: 'Dancer' },
        { from: /\bBODI\b/gi, to: 'BOD' },
      ];
      
      for (const fix of fixes) {
        name = name.replace(fix.from, fix.to);
      }
      
      // Ensure proper capitalization
      if (name && name.length > 1) {
        name = name.charAt(0).toUpperCase() + name.slice(1);
      }
      
      return name;
    }

    console.log('Starting comprehensive product name improvements...');
    
    let updateCount = 0;
    let totalProducts = 0;
    
    for (const sector of sectors) {
      for (const category of sector.categories) {
        for (const subcategory of category.subcategories) {
          for (const product of subcategory.products) {
            totalProducts++;
            const improvedName = improveProductName(product.name);
            
            // Only update if name actually improved and is different
            if (improvedName !== product.name && improvedName && improvedName.length > 3) {
              try {
                await prisma.product.update({
                  where: { id: product.id },
                  data: { name: improvedName }
                });
                
                console.log(`✓ Improved: "${product.name}" → "${improvedName}"`);
                updateCount++;
              } catch (error) {
                console.log(`✗ Error updating product ${product.id}: ${error.message}`);
              }
            }
          }
        }
      }
    }
    
    console.log(`\nImprovement Summary:`);
    console.log(`📊 Total products checked: ${totalProducts}`);
    console.log(`✓ Successfully improved: ${updateCount}`);
    console.log(`📈 Improvement percentage: ${((updateCount/totalProducts) * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

improveAllProductNames();