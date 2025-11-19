import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Optimized query - only get essential fields, no deep includes
    const products = await prisma.product.findMany({
      take: 5, // Reduce to only 5 for faster loading
      select: {
        id: true,
        name: true,
        modifiedName: true,
        modifiedDescription: true,
        imageUrl: true,
        modifiedImageUrl: true,
        imageDescription: true,
        price: true,
        priceUnit: true,
        brand: true,
        supplier: {
          select: {
            name: true,
            location: true
          }
        },
        subcategory: {
          select: {
            name: true
          }
        }
      },
      where: {
        // Only get products from our 8 launch sectors for faster query
        subcategory: {
          category: {
            sector: {
              id: { in: [2, 5, 8, 9, 10, 11, 13, 15] }
            }
          }
        }
      },
      orderBy: {
        id: 'desc' // Faster than createdAt
      }
    });

    // Minimal transformation for speed
    const featuredProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      modifiedName: product.modifiedName,
      modifiedDescription: product.modifiedDescription,
      imageUrl: product.modifiedImageUrl || product.imageUrl,
      imageDescription: product.imageDescription,
      price: product.price,
      priceUnit: product.priceUnit,
      brand: product.brand,
      supplier: {
        name: product.supplier?.name || 'Unknown Supplier',
        location: product.supplier?.location || 'Unknown Location'
      },
      subcategory: {
        name: product.subcategory?.name || 'Unknown Category'
      }
    }));

    return NextResponse.json({
      success: true,
      data: featuredProducts
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured products', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}