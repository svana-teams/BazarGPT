const { PrismaClient } = require('@prisma/client');

async function updateProductNames() {
  const prisma = new PrismaClient();
  
  try {
    // Get all launch products that need name updates
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

    // Define product name improvement patterns
    const nameImprovements = [
      // General cleanup patterns
      { pattern: /^(.+?),\s*Packaging Type:.*$/i, replacement: '$1' },
      { pattern: /^(.+?),\s*Size:.*$/i, replacement: '$1' },
      { pattern: /^(.+?),\s*For.*$/i, replacement: '$1' },
      { pattern: /^(.+?),\s*Grade:.*$/i, replacement: '$1' },
      { pattern: /^(.+?),\s*Purity:.*$/i, replacement: '$1' },
      { pattern: /^(.+?),\s*Color:.*$/i, replacement: '$1' },
      { pattern: /^(.+?),\s*Brand:.*$/i, replacement: '$1' },
      { pattern: /^(.+?),\s*Voltage:.*$/i, replacement: '$1' },
      { pattern: /^(.+?),\s*Material:.*$/i, replacement: '$1' },
      { pattern: /^(.+?),\s*Capacity:.*$/i, replacement: '$1' },
      { pattern: /^(.+?),\s*Power:.*$/i, replacement: '$1' },
      
      // Remove measurement details
      { pattern: /\s+\d+\s*(mm|cm|inch|ft|meter|kg|gm|ltr|ml)\s*$/i, replacement: '' },
      { pattern: /\s+\d+\s*[x×]\s*\d+.*$/i, replacement: '' },
      { pattern: /\s*-\s*\d+.*$/i, replacement: '' },
      
      // Clean up brand names and model numbers
      { pattern: /^[A-Z\s]+\s+([A-Z][a-z].*)$/i, replacement: '$1' },
      { pattern: /\s+[A-Z]{2,}\d+.*$/i, replacement: '' },
      
      // Remove excessive details
      { pattern: /\s*\(.*\)\s*$/g, replacement: '' },
      { pattern: /\s*\[.*\]\s*$/g, replacement: '' },
    ];

    // Specific product name replacements
    const specificReplacements = {
      // Electronics
      'LAED ACID Sip 6200 Battery Booster, 26': 'Lead Acid Battery Booster',
      '110 V Industrial Battery Charger': 'Industrial Battery Charger 110V',
      'Aluminium ACO-500 Hailea Aquarium Air Pumps': 'Commercial Aquarium Air Pump',
      'ARK AQUATECH Air Stones, Packaging Type: Box, Size: Multiple Sizes': 'Commercial Aquarium Air Stones',
      'Black 4 Inch Air Stone Aquarium Brass Nozzle Set': 'Aquarium Air Stone Nozzle Set',
      'Boyu On-Off Aquarium Temperature Controller': 'Digital Temperature Controller',
      'Multicolor Natural decoractive shells, Packaging Type: Packet, Size: Variable': 'Natural Decorative Shells',
      'Artificial Plants': 'Commercial Artificial Plants',
      'Plastic Artificial Plants, Size: 0.5 ft': 'Small Plastic Artificial Plants',
      'FRP Fiberglass Tree House, For Decoration': 'Fiberglass Decorative Structure',
      'Bamboo Green Artificial Plants, For Home': 'Artificial Bamboo Plants',
      'Polyester Inflatable Flowers': 'Inflatable Display Flowers',
      'Icon Inflatables Red And Green Inflatable Lotus Flower, Size: 10 To 20 Feet': 'Large Inflatable Lotus Display',
      'Air Inflataion inflatable flowers Tooth Pillar Gallery, For Decorative Galleries': 'Gallery Display Inflatable Flowers',
      'Car Body Polish': 'Automotive Body Polish',
      'Silicon Polish for Cars and Bikes - 5Ltr': 'Silicon Polish 5L',
      'Liquid 250gm Afra Silicone Spray, For Mold Release Agent': 'Industrial Silicone Spray',
      'Liquid Epichlorohydrin Chemical, Grade: Technical,Reagent Grade, Purity: 99.9': 'Technical Grade Epichlorohydrin',
      'Benzalkonium Chloride Chemical 50%, Liquid': 'Benzalkonium Chloride Solution 50%',
      'Loctite Natural Blue Cleaner': 'Industrial Blue Cleaner',
      
      // Generic improvements for common patterns
      'Z Blade': 'Industrial Z-Blade Mixer',
      'Instec Mild Steel Liquid Crystal Cell Holder': 'Laboratory Cell Holder System',
      'Metal Liquid Cells Holder, For Laboratory & Chemical': 'Metal Laboratory Cell Holder',
      'Batteries & Charge Storage Devices': 'Industrial Battery Systems',
    };

    console.log('Starting product name updates...');
    
    let updateCount = 0;
    let totalProducts = 0;
    
    for (const sector of sectors) {
      for (const category of sector.categories) {
        for (const subcategory of category.subcategories) {
          for (const product of subcategory.products) {
            totalProducts++;
            let newName = product.name;
            
            // Apply specific replacements first
            if (specificReplacements[product.name]) {
              newName = specificReplacements[product.name];
            } else {
              // Apply general improvement patterns
              for (const improvement of nameImprovements) {
                newName = newName.replace(improvement.pattern, improvement.replacement);
              }
              
              // Clean up extra spaces and capitalize properly
              newName = newName.replace(/\s+/g, ' ').trim();
              
              // Ensure proper capitalization
              if (newName.length > 0) {
                newName = newName.charAt(0).toUpperCase() + newName.slice(1);
              }
            }
            
            // Update if name changed
            if (newName !== product.name && newName.length > 0) {
              try {
                await prisma.product.update({
                  where: { id: product.id },
                  data: { name: newName }
                });
                
                console.log(`✓ Updated: "${product.name}" → "${newName}"`);
                updateCount++;
              } catch (error) {
                console.log(`✗ Error updating product ${product.id}: ${error.message}`);
              }
            }
          }
        }
      }
    }
    
    console.log(`\nUpdate Summary:`);
    console.log(`📊 Total products checked: ${totalProducts}`);
    console.log(`✓ Successfully updated: ${updateCount}`);
    console.log(`📈 Update percentage: ${((updateCount/totalProducts) * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateProductNames();