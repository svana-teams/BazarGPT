const { PrismaClient } = require('@prisma/client');

async function addImageDescriptions() {
  const prisma = new PrismaClient();
  
  try {
    // Get launch products with images but no descriptions
    const products = await prisma.product.findMany({
      where: {
        AND: [
          { imageUrl: { not: null } },
          { 
            subcategory: {
              category: {
                sector: {
                  id: { in: [2, 5, 8, 9, 10, 11, 13, 15] } // Our 8 launch sectors
                }
              }
            }
          }
        ]
      },
      include: {
        subcategory: {
          include: {
            category: {
              include: {
                sector: true
              }
            }
          }
        }
      },
      take: 50 // Start with first 50 for testing
    });

    console.log(`Found ${products.length} products with images to add descriptions for`);

    // Generate image descriptions based on product context
    const updates = [];
    
    for (const product of products) {
      const subcategoryName = product.subcategory?.name || '';
      const categoryName = product.subcategory?.category?.name || '';
      const sectorName = product.subcategory?.category?.sector?.name || '';
      const productName = product.name;
      
      let description = '';
      
      // Generate contextual image descriptions
      if (sectorName.includes('Electronics')) {
        if (subcategoryName.includes('Biometric') || subcategoryName.includes('Access')) {
          description = `${productName} - Professional biometric access control device for secure entry systems`;
        } else if (subcategoryName.includes('Computing') || subcategoryName.includes('Computer')) {
          description = `${productName} - High-performance computing component for professional applications`;
        } else {
          description = `${productName} - Professional electronic equipment for commercial and industrial applications`;
        }
      } else if (sectorName.includes('Electrical')) {
        if (subcategoryName.includes('Battery') || subcategoryName.includes('Energy')) {
          description = `${productName} - Industrial battery and energy storage solution for commercial applications`;
        } else if (subcategoryName.includes('Cable') || subcategoryName.includes('Wire')) {
          description = `${productName} - High-quality electrical cable for industrial and commercial wiring applications`;
        } else if (subcategoryName.includes('Conduit') || subcategoryName.includes('Management')) {
          description = `${productName} - Professional cable management and conduit system for electrical installations`;
        } else {
          description = `${productName} - Professional electrical component for industrial and commercial applications`;
        }
      } else if (sectorName.includes('Medical') || sectorName.includes('Hospital')) {
        if (subcategoryName.includes('Sterilizer') || subcategoryName.includes('Autoclave')) {
          description = `${productName} - Medical sterilization equipment for healthcare facilities and laboratories`;
        } else if (subcategoryName.includes('Cleanroom') || subcategoryName.includes('Safety')) {
          description = `${productName} - Cleanroom safety equipment for medical and pharmaceutical facilities`;
        } else if (subcategoryName.includes('Diagnostic') || subcategoryName.includes('Scanner')) {
          description = `${productName} - Advanced medical diagnostic equipment for healthcare professionals`;
        } else {
          description = `${productName} - Professional medical equipment for healthcare facilities`;
        }
      } else if (sectorName.includes('Machinery')) {
        if (subcategoryName.includes('Agricultural') || subcategoryName.includes('Processing')) {
          description = `${productName} - Industrial agricultural processing machinery for commercial food production`;
        } else if (subcategoryName.includes('Compression') || subcategoryName.includes('Compressor')) {
          description = `${productName} - Heavy-duty air compression system for industrial applications`;
        } else if (subcategoryName.includes('Filling') || subcategoryName.includes('Packaging')) {
          description = `${productName} - Automated filling and packaging machinery for commercial production`;
        } else {
          description = `${productName} - Professional industrial machinery for commercial manufacturing`;
        }
      } else if (sectorName.includes('Industrial')) {
        if (subcategoryName.includes('Caster') || subcategoryName.includes('Wheel')) {
          description = `${productName} - Heavy-duty industrial wheel and caster system for material handling`;
        } else if (subcategoryName.includes('Disinfection') || subcategoryName.includes('Cleaning')) {
          description = `${productName} - Commercial disinfection equipment for industrial hygiene applications`;
        } else if (subcategoryName.includes('Flange') || subcategoryName.includes('Fitting')) {
          description = `${productName} - Industrial pipe flange and fitting for commercial plumbing systems`;
        } else {
          description = `${productName} - Professional industrial product for commercial and manufacturing applications`;
        }
      } else if (sectorName.includes('Furniture')) {
        if (subcategoryName.includes('Commercial') || subcategoryName.includes('Office')) {
          description = `${productName} - Commercial furniture solution for office and business environments`;
        } else if (subcategoryName.includes('Decorative') || subcategoryName.includes('Display')) {
          description = `${productName} - Professional decorative item for commercial spaces and displays`;
        } else if (subcategoryName.includes('Door') || subcategoryName.includes('Entry')) {
          description = `${productName} - Commercial door and entryway solution for business establishments`;
        } else {
          description = `${productName} - Professional furniture for commercial and office applications`;
        }
      } else if (sectorName.includes('Commercial Appliances') || sectorName.includes('Appliances')) {
        if (subcategoryName.includes('Aqua') || subcategoryName.includes('Fish')) {
          description = `${productName} - Commercial aquaculture equipment for fish farming and aquatic systems`;
        } else if (subcategoryName.includes('Plant') || subcategoryName.includes('Artificial')) {
          description = `${productName} - Commercial artificial plant for business decoration and landscaping`;
        } else if (subcategoryName.includes('Cleaning') || subcategoryName.includes('Sanitiz')) {
          description = `${productName} - Professional cleaning and sanitization solution for commercial facilities`;
        } else {
          description = `${productName} - Commercial appliance for business and institutional applications`;
        }
      } else if (sectorName.includes('Refrigeration')) {
        if (subcategoryName.includes('Beverage') || subcategoryName.includes('Cooler')) {
          description = `${productName} - Commercial beverage cooling system for restaurants and hospitality`;
        } else if (subcategoryName.includes('Freezer') || subcategoryName.includes('Blast')) {
          description = `${productName} - Industrial blast freezing equipment for food processing and storage`;
        } else if (subcategoryName.includes('Dispenser') || subcategoryName.includes('Water')) {
          description = `${productName} - Commercial water dispensing system for office and public spaces`;
        } else {
          description = `${productName} - Professional refrigeration equipment for commercial food service`;
        }
      } else {
        description = `${productName} - Professional industrial equipment for commercial and business applications`;
      }
      
      // Ensure description is not too long and is properly formatted
      if (description.length > 500) {
        description = description.substring(0, 497) + '...';
      }
      
      updates.push({
        id: product.id,
        description: description
      });
    }

    console.log('\\nStarting description updates...');
    
    let successCount = 0;
    
    for (const update of updates) {
      try {
        await prisma.product.update({
          where: { id: update.id },
          data: { imageDescription: update.description }
        });
        
        console.log(`✓ Added description for product ${update.id}`);
        successCount++;
      } catch (error) {
        console.log(`✗ Error updating product ${update.id}: ${error.message}`);
      }
    }
    
    console.log(`\\nDescription Update Summary:`);
    console.log(`✓ Successfully updated: ${successCount}`);
    console.log(`📊 Total products processed: ${updates.length}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addImageDescriptions();