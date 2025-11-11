const { PrismaClient } = require('@prisma/client');

async function updateSubcategoryNames() {
  const prisma = new PrismaClient();
  
  try {
    const updates = [
      // Electronics - Biometric Systems
      { oldName: 'Access Cards', newName: 'Employee Access Cards' },
      { oldName: 'Access Control Systems', newName: 'Building Access Control' },
      { oldName: 'Billing Machines', newName: 'POS Billing Systems' },
      
      // Electronics - Commercial Electronics  
      { oldName: '5 Pin Socket', newName: 'Industrial Power Sockets' },
      { oldName: 'Air Sterilizer', newName: 'Commercial Air Sterilizers' },
      { oldName: 'Android TV Box', newName: 'Digital Media Players' },
      
      // Electronics - Computing Equipment
      { oldName: 'Adapter Card', newName: 'Network Adapter Cards' },
      { oldName: 'Analog IO Card', newName: 'Industrial I/O Cards' },
      { oldName: 'ATX Motherboard', newName: 'Server Motherboards' },
      
      // Electrical - Battery & Energy Storage
      { oldName: 'Ac Charger', newName: 'Industrial AC Chargers' },
      { oldName: 'AC Remote Control', newName: 'HVAC Remote Controls' },
      { oldName: 'Automotive Batteries', newName: 'Commercial Vehicle Batteries' },
      
      // Electrical - Cables & Wires
      { oldName: 'Aerial Bunched Cable', newName: 'Overhead Power Cables' },
      { oldName: 'Aluminium Welding Cable', newName: 'Industrial Welding Cables' },
      { oldName: 'Aluminum Cables', newName: 'Aluminium Power Cables' },
      
      // Electrical - Conduits and Fittings
      { oldName: 'Aluminium Cable Tray', newName: 'Cable Management Trays' },
      { oldName: 'Cable Ducts', newName: 'Cable Ducting Systems' },
      { oldName: 'Cable Management System', newName: 'Structured Cable Management' },
      
      // Furniture - Commercial Furniture
      { oldName: 'Casting Iron Bench', newName: 'Heavy Duty Steel Benches' },
      { oldName: 'FRP School Benches', newName: 'Educational Seating Solutions' },
      { oldName: 'Modular Wooden Rooms', newName: 'Prefabricated Office Cabins' },
      
      // Furniture - Decorative Items
      { oldName: 'Abstract Art', newName: 'Corporate Wall Art' },
      { oldName: 'Acrylic Temple', newName: 'Office Prayer Spaces' },
      { oldName: 'Advertising Danglers', newName: 'Promotional Display Items' },
      
      // Furniture - Doors & Entryways
      { oldName: 'MS Door', newName: 'Steel Security Doors' },
      { oldName: 'Wooden Flush Doors', newName: 'Commercial Flush Doors' },
      
      // Commercial Appliances - Aqua Culture
      { oldName: 'Aquaculture Tanks', newName: 'Commercial Fish Tanks' },
      { oldName: 'Aquarium Air Stone', newName: 'Aquaculture Aeration Systems' },
      { oldName: 'Aquarium Decoration', newName: 'Aquatic Display Elements' },
      
      // Commercial Appliances - Artificial Plants
      { oldName: 'Artificial Bamboo Plant', newName: 'Commercial Bamboo Décor' },
      { oldName: 'Artificial Flower', newName: 'Corporate Floral Arrangements' },
      { oldName: 'Artificial Rose', newName: 'Premium Artificial Flowers' },
      
      // Commercial Appliances - Cleaning
      { oldName: 'AC Coil Cleaner', newName: 'HVAC Coil Cleaning Solutions' },
      { oldName: 'Aerosol Disinfectant Spray', newName: 'Commercial Disinfectants' },
      { oldName: 'Alkaline Soak Cleaner', newName: 'Industrial Alkaline Cleaners' },
      
      // Industrial Products - Casters & Wheels
      { oldName: 'Gate Caster', newName: 'Heavy Duty Gate Wheels' },
      { oldName: 'Heavy Duty Casters', newName: 'Industrial Mobility Casters' },
      { oldName: 'Roller Wheel', newName: 'Material Handling Wheels' },
      
      // Industrial Products - Disinfection Equipment
      { oldName: 'Aerosol Disinfector', newName: 'Automated Disinfection Systems' },
      { oldName: 'Fogging Machine', newName: 'Industrial Fogging Equipment' },
      { oldName: 'Fumigation Machine', newName: 'Commercial Fumigation Systems' },
      
      // Industrial Products - Flanges
      { oldName: 'ALUMINUM FLANGE CAP GYM', newName: 'Aluminium Flange Caps' },
      { oldName: 'Cast Iron Flange', newName: 'Heavy Duty Cast Iron Flanges' },
      { oldName: 'HDPE Blind Flange', newName: 'Chemical Resistant Blind Flanges' },
      
      // Machinery - Agricultural Processing
      { oldName: 'Amla Processing Machine', newName: 'Fruit Processing Equipment' },
      { oldName: 'Amla Processing Plant', newName: 'Commercial Processing Plants' },
      { oldName: 'Blanching Machine', newName: 'Industrial Blanching Equipment' },
      
      // Machinery - Air Compression
      { oldName: 'Air Booster', newName: 'Pneumatic Pressure Boosters' },
      { oldName: 'Air Compressor Controller', newName: 'Compressor Control Systems' },
      { oldName: 'Air Compressor Head', newName: 'Compressor Cylinder Heads' },
      
      // Machinery - Automated Filling
      { oldName: 'Acid Filling Machine', newName: 'Chemical Filling Equipment' },
      { oldName: 'Aerosol Gas Filling Machines', newName: 'Aerosol Production Lines' },
      { oldName: 'Ampoule Filling Machine', newName: 'Pharmaceutical Filling Systems' },
      
      // Medical Equipment - Autoclave & Sterilizers
      { oldName: 'Automatic Sanitizer Dispenser', newName: 'Touchless Sanitizer Dispensers' },
      { oldName: 'Cryogenic Freezers', newName: 'Medical Cryogenic Storage' },
      { oldName: 'Dry Bath Incubator', newName: 'Laboratory Incubation Systems' },
      
      // Medical Equipment - Cleanroom
      { oldName: 'Air Shower Service', newName: 'Cleanroom Air Shower Systems' },
      { oldName: 'Aluminium Coving', newName: 'Cleanroom Wall Covings' },
      { oldName: 'Bio Safety Cabinets', newName: 'Laboratory Safety Cabinets' },
      
      // Medical Equipment - Diagnostic
      { oldName: 'Automatic Film Processor', newName: 'Medical Film Processing Equipment' },
      { oldName: 'BPL X Ray Machine', newName: 'Digital X-Ray Systems' },
      { oldName: 'DEXA Bone Densitometer', newName: 'Bone Density Scanners' },
      
      // Refrigeration - Beverage Coolers
      { oldName: 'Beer & Beverage Coolers', newName: 'Commercial Beverage Chillers' },
      { oldName: 'Beer Keg', newName: 'Beverage Keg Systems' },
      
      // Refrigeration - Blast Freezer
      { oldName: 'Plate Freezers', newName: 'Industrial Plate Freezing Systems' },
      { oldName: 'Portable Blast Freezer', newName: 'Mobile Blast Freezing Units' },
      { oldName: 'Tunnel Freezer', newName: 'Continuous Tunnel Freezers' },
      
      // Refrigeration - Bottle Dispenser
      { oldName: 'Bottled Dispenser', newName: 'Water Bottle Dispensers' },
      { oldName: 'SS bottle Glass Dispenser', newName: 'Stainless Steel Water Dispensers' }
    ];

    console.log(`Starting subcategory name updates for ${updates.length} items...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const update of updates) {
      try {
        const result = await prisma.subcategory.updateMany({
          where: { name: update.oldName },
          data: { name: update.newName }
        });
        
        if (result.count > 0) {
          console.log(`✓ Updated: "${update.oldName}" → "${update.newName}"`);
          successCount++;
        } else {
          console.log(`⚠ Not found: "${update.oldName}"`);
        }
      } catch (error) {
        console.log(`✗ Error updating "${update.oldName}": ${error.message}`);
        errorCount++;
      }
    }
    
    console.log(`\nUpdate Summary:`);
    console.log(`✓ Successfully updated: ${successCount}`);
    console.log(`⚠ Not found: ${updates.length - successCount - errorCount}`);
    console.log(`✗ Errors: ${errorCount}`);
    
  } catch (error) {
    console.error('Error during updates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateSubcategoryNames();