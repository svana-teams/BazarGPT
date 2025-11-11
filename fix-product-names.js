const { PrismaClient } = require('@prisma/client');

async function fixProductNames() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Creating PROPER product name improvements...');
    
    // Only improve formatting and remove unnecessary details, but KEEP the specific product identity
    const properUpdates = [
      // Clean up specific products while keeping their identity
      { oldName: 'Aluminium ACO-500 Hailea Aquarium Air Pumps', newName: 'Hailea ACO-500 Aluminium Aquarium Air Pump' },
      { oldName: 'ARK AQUATECH Air Stones, Packaging Type: Box, Size: Multiple Sizes', newName: 'ARK AQUATECH Air Stones' },
      { oldName: 'Black 4 Inch Air Stone Aquarium Brass Nozzle Set, Size: 4inch (l)', newName: 'Black 4 Inch Aquarium Air Stone Brass Nozzle Set' },
      { oldName: 'Boyu On-Off Aquarium Temperature Controller', newName: 'Boyu Digital Aquarium Temperature Controller' },
      { oldName: 'Multicolor Natural decoractive shells, Packaging Type: Packet, Size: Variable', newName: 'Natural Decorative Shells - Multicolor' },
      
      { oldName: 'Plastic Artificial Plants, Size: 0.5 ft', newName: 'Small Plastic Artificial Plants' },
      { oldName: 'FRP Fiberglass Tree House, For Decoration', newName: 'FRP Fiberglass Decorative Tree House' },
      { oldName: 'Bamboo Green Artificial Plants, For Home', newName: 'Green Bamboo Artificial Plants' },
      { oldName: 'Icon Inflatables Red And Green Inflatable Lotus Flower, Size: 10 To 20 Feet', newName: 'Icon Inflatables Large Lotus Flower Display (10-20 ft)' },
      { oldName: 'Air Inflataion inflatable flowers Tooth Pillar Gallery, For Decorative Galleries', newName: 'Air Inflation Gallery Display Flowers' },
      
      { oldName: 'Silicon Polish for Cars and Bikes - 5Ltr', newName: 'Silicon Polish for Vehicles - 5 Liter' },
      { oldName: 'Liquid 250gm Afra Silicone Spray, For Mold Release Agent', newName: 'Afra Silicone Spray Mold Release Agent - 250gm' },
      { oldName: 'Liquid Epichlorohydrin Chemical, Grade: Technical,Reagent Grade, Purity: 99.9', newName: 'Technical Grade Epichlorohydrin Chemical (99.9% Purity)' },
      { oldName: 'Benzalkonium Chloride Chemical 50%, Liquid', newName: 'Benzalkonium Chloride Solution - 50%' },
      
      { oldName: 'LAED ACID Sip 6200 Battery Booster, 26', newName: 'Lead Acid Battery Booster - SIP 6200' },
      { oldName: '110 V Industrial Battery Charger', newName: 'Industrial Battery Charger - 110V' },
      
      // Fix the ones that got destroyed
      { oldName: 'Z Blade', newName: 'Industrial Z-Blade Mixer' },
      { oldName: 'Instec Mild Steel Liquid Crystal Cell Holder', newName: 'Instec Mild Steel Laboratory Cell Holder' },
      { oldName: 'Metal Liquid Cells Holder, For Laboratory & Chemical', newName: 'Metal Laboratory Cell Holder' },
      { oldName: 'Batteries & Charge Storage Devices', newName: 'Industrial Battery Storage Systems' }
    ];

    console.log(`Starting proper product name fixes for ${properUpdates.length} specific items...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const update of properUpdates) {
      try {
        const result = await prisma.product.updateMany({
          where: { name: update.oldName },
          data: { name: update.newName }
        });
        
        if (result.count > 0) {
          console.log(`✓ Fixed: "${update.oldName}" → "${update.newName}"`);
          successCount++;
        } else {
          console.log(`⚠ Not found: "${update.oldName}"`);
        }
      } catch (error) {
        console.log(`✗ Error updating "${update.oldName}": ${error.message}`);
        errorCount++;
      }
    }
    
    console.log(`\nFix Summary:`);
    console.log(`✓ Successfully fixed: ${successCount}`);
    console.log(`⚠ Not found: ${properUpdates.length - successCount - errorCount}`);
    console.log(`✗ Errors: ${errorCount}`);
    
  } catch (error) {
    console.error('Error during fixes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixProductNames();