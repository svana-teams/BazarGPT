const { PrismaClient } = require('@prisma/client');

async function restoreProductNames() {
  const prisma = new PrismaClient();
  
  try {
    // Get all damaged products with their subcategory info
    const damagedProducts = await prisma.product.findMany({
      where: {
        OR: [
          { name: { in: ['Control', 'Machine', 'System', 'Equipment', 'Device', 'Unit', 'Tool', 'Kit', 'Set', 'Parts', 'Components', 'Cable', 'Wheel', 'Fan', 'Pump', 'Tank', 'Box', 'Panel', 'Switch', 'Meter', 'Sensor', 'Motor', 'Valve', 'Filter', 'Heater', 'Cooler', 'Display', 'Screen', 'Board', 'Card', 'Drive', 'Power', 'Battery', 'Charger'] } }
        ]
      },
      include: {
        supplier: true,
        subcategory: {
          include: {
            category: {
              include: {
                sector: true
              }
            }
          }
        }
      }
    });

    console.log(`Found ${damagedProducts.length} products with damaged names`);

    // Restore names based on subcategory and context
    const restorations = [];
    
    for (const product of damagedProducts) {
      const subcategoryName = product.subcategory?.name || 'Unknown';
      const categoryName = product.subcategory?.category?.name || '';
      const sectorName = product.subcategory?.category?.sector?.name || '';
      const supplierName = product.supplier?.name || '';
      
      let newName = '';
      
      // Create contextually appropriate names
      switch (product.name) {
        case 'Control':
          if (subcategoryName.includes('Biometric')) {
            newName = 'Biometric Access Control System';
          } else if (subcategoryName.includes('Temperature')) {
            newName = 'Digital Temperature Control Unit';
          } else if (subcategoryName.includes('Access')) {
            newName = 'Electronic Access Control Device';
          } else {
            newName = `${subcategoryName.replace('Systems', 'System').replace('Controls', 'Control')}`;
          }
          break;
          
        case 'Machine':
          if (subcategoryName.includes('Fumigation')) {
            newName = 'Commercial Fumigation Machine';
          } else if (subcategoryName.includes('Fogging')) {
            newName = 'Industrial Fogging Machine';
          } else if (subcategoryName.includes('Cutting')) {
            newName = 'Industrial Cutting Machine';
          } else if (subcategoryName.includes('Filling')) {
            newName = 'Automatic Filling Machine';
          } else if (subcategoryName.includes('Chilli')) {
            newName = 'Commercial Chilli Processing Machine';
          } else if (subcategoryName.includes('Coconut')) {
            newName = 'Coconut Deshelling Machine';
          } else {
            newName = `Professional ${subcategoryName.replace('Machine', '').trim()} Machine`;
          }
          break;
          
        case 'System':
          if (subcategoryName.includes('Biometric')) {
            newName = 'Biometric Attendance Management System';
          } else {
            newName = `Advanced ${subcategoryName.replace('System', '').trim()} System`;
          }
          break;
          
        case 'Equipment':
          if (subcategoryName.includes('Flange')) {
            newName = 'Industrial Flange Equipment';
          } else {
            newName = `Professional ${subcategoryName} Equipment`;
          }
          break;
          
        case 'Motor':
          if (subcategoryName.includes('Electric')) {
            newName = 'Industrial Electric Motor';
          } else {
            newName = `${subcategoryName} - High Performance Motor`;
          }
          break;
          
        case 'Fan':
          if (subcategoryName.includes('Cooling')) {
            newName = 'Computer Cooling Fan System';
          } else {
            newName = `Industrial ${subcategoryName} Fan`;
          }
          break;
          
        case 'Pump':
          if (subcategoryName.includes('Monoblock')) {
            newName = 'Monoblock Water Pump';
          } else if (subcategoryName.includes('High Pressure')) {
            newName = 'High Pressure Water Pump System';
          } else {
            newName = `Commercial ${subcategoryName} Pump`;
          }
          break;
          
        case 'Cable':
          if (subcategoryName.includes('Armoured')) {
            newName = 'Industrial Armoured Power Cable';
          } else if (subcategoryName.includes('Welding')) {
            newName = 'Heavy Duty Welding Cable';
          } else if (subcategoryName.includes('PVC')) {
            newName = 'PVC Insulated Wire Cable';
          } else {
            newName = `${subcategoryName} - Professional Grade`;
          }
          break;
          
        case 'Wheel':
          if (subcategoryName.includes('Gate')) {
            newName = 'Heavy Duty Gate Wheel System';
          } else if (subcategoryName.includes('Caster')) {
            newName = 'Industrial Mobility Caster Wheel';
          } else if (subcategoryName.includes('Handling')) {
            newName = 'Material Handling Wheel Assembly';
          } else {
            newName = `Industrial ${subcategoryName} Wheel`;
          }
          break;
          
        case 'Switch':
          if (subcategoryName.includes('Battery')) {
            newName = 'Battery Disconnect Switch';
          } else if (subcategoryName.includes('Disconnect')) {
            newName = 'Heavy Duty Disconnect Switch';
          } else {
            newName = `${subcategoryName} Switch`;
          }
          break;
          
        case 'Sensor':
          if (subcategoryName.includes('Proximity')) {
            newName = 'Industrial Proximity Sensor';
          } else {
            newName = `${subcategoryName} - Professional Grade`;
          }
          break;
          
        case 'Valve':
          if (subcategoryName.includes('Multiport')) {
            newName = 'Multiport Control Valve';
          } else if (subcategoryName.includes('Pneumatic')) {
            newName = 'Industrial Pneumatic Valve';
          } else {
            newName = `${subcategoryName} - Commercial Grade`;
          }
          break;
          
        case 'Filter':
          if (subcategoryName.includes('Bag')) {
            newName = 'RO Bag Filter System';
          } else {
            newName = `Industrial ${subcategoryName} Filter`;
          }
          break;
          
        case 'Unit':
          if (subcategoryName.includes('Laminar')) {
            newName = 'Ceiling Mounted Laminar Airflow Unit';
          } else {
            newName = `${subcategoryName} Unit`;
          }
          break;
          
        case 'Kit':
          if (subcategoryName.includes('Compressor')) {
            newName = 'Air Compressor Maintenance Kit';
          } else {
            newName = `${subcategoryName} Service Kit`;
          }
          break;
          
        case 'Parts':
          if (subcategoryName.includes('Welding')) {
            newName = 'Welding Cable Spare Parts';
          } else {
            newName = `${subcategoryName} Replacement Parts`;
          }
          break;
          
        default:
          newName = `Professional ${subcategoryName}`;
      }
      
      // Clean up the name
      newName = newName.replace(/\s+/g, ' ').trim();
      if (newName.length < 10) {
        newName = `Commercial ${subcategoryName}`;
      }
      
      restorations.push({
        id: product.id,
        oldName: product.name,
        newName: newName
      });
    }

    console.log('\\nStarting restoration...');
    
    let successCount = 0;
    
    for (const restoration of restorations) {
      try {
        await prisma.product.update({
          where: { id: restoration.id },
          data: { name: restoration.newName }
        });
        
        console.log(`✓ Restored: "${restoration.oldName}" → "${restoration.newName}"`);
        successCount++;
      } catch (error) {
        console.log(`✗ Error restoring product ${restoration.id}: ${error.message}`);
      }
    }
    
    console.log(`\\nRestoration Summary:`);
    console.log(`✓ Successfully restored: ${successCount}`);
    console.log(`📊 Total products processed: ${restorations.length}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreProductNames();