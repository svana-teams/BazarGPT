import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      take: 10, // Get top 10 products
      include: {
        subcategory: {
          include: {
            category: {
              include: {
                sector: true
              }
            }
          }
        },
        supplier: true
      },
      orderBy: [
        {
          createdAt: 'desc' // Most recent products first, you can change this logic
        }
      ]
    });

    // Transform the data for frontend
    const featuredProducts = products.map((product: any) => ({
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
      category: product.subcategory?.category?.name || 'Unknown Category',
      industry: product.subcategory?.category?.sector?.name || 'Unknown Industry'
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