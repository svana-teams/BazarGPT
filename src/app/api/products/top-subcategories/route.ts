import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get top 100 subcategories with the most products
    const topSubcategories = await prisma.subcategory.findMany({
      include: {
        _count: {
          select: { products: true }
        },
        category: {
          include: {
            sector: true
          }
        },
        products: {
          take: 1, // Get just one representative product per subcategory
          include: {
            supplier: true
          },
          orderBy: {
            createdAt: 'desc' // Get the most recent product
          }
        }
      },
      orderBy: {
        products: {
          _count: 'desc' // Order by product count descending
        }
      },
      take: 100 // Take top 100 subcategories
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