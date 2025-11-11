import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('Starting top subcategories API call...');
    
    // Get subcategories from our 8 launch sectors only, with better performance
    const topSubcategories = await prisma.subcategory.findMany({
      where: {
        category: {
          sector: {
            id: { in: [2, 5, 8, 9, 10, 11, 13, 15] } // Our 8 launch sectors
          }
        }
      },
      include: {
        _count: {
          select: { products: true }
        },
        category: {
          select: {
            name: true,
            sector: {
              select: {
                name: true
              }
            }
          }
        },
        products: {
          take: 1, // Get just one representative product per subcategory
          select: {
            id: true,
            name: true,
            imageUrl: true,
            price: true,
            priceUnit: true,
            brand: true,
            supplier: {
              select: {
                name: true,
                location: true
              }
            }
          },
          orderBy: {
            id: 'desc' // Get the most recent product by ID
          }
        }
      },
      orderBy: {
        products: {
          _count: 'desc' // Order by product count descending
        }
      },
      take: 50 // Reduce to 50 for better performance
    });

    // Filter out subcategories that have no products and transform the data
    const productsFromTopSubcategories = topSubcategories
      .filter(subcategory => subcategory.products.length > 0)
      .map((subcategory: any) => {
        const product = subcategory.products[0]; // Get the representative product
        return {
          id: product.id,
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.price,
          priceUnit: product.priceUnit,
          brand: product.brand,
          specifications: product.specifications,
          supplier: {
            name: product.supplier?.name || 'Unknown Supplier',
            location: product.supplier?.location || 'Unknown Location'
          },
          subcategory: {
            name: subcategory.name,
            productCount: subcategory._count.products
          },
          category: subcategory.category?.name || 'Unknown Category',
          industry: subcategory.category?.sector?.name || 'Unknown Industry'
        };
      });

    return NextResponse.json({
      success: true,
      data: productsFromTopSubcategories,
      totalSubcategories: productsFromTopSubcategories.length
    });
  } catch (error) {
    console.error('Error fetching top subcategory products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch top subcategory products', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}