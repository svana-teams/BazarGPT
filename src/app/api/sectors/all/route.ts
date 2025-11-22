// app/api/sectors/all/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    // Fetch all sectors with product count
    const sectors = await prisma.sector.findMany({
      where: search ? {
        name: {
          contains: search,
          mode: 'insensitive'
        }
      } : {},
      include: {
        categories: {
          include: {
            subcategories: {
              include: {
                _count: {
                  select: { products: true }
                }
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Calculate total products for each sector
    const sectorsWithProductCount = sectors.map(sector => {
      const totalProducts = sector.categories.reduce((sum, category) => {
        const categoryProducts = category.subcategories.reduce((catSum, subcategory) => {
          return catSum + subcategory._count.products;
        }, 0);
        return sum + categoryProducts;
      }, 0);

      return {
        id: sector.id,
        name: sector.name,
        productCount: totalProducts,
        createdAt: sector.createdAt,
        updatedAt: sector.updatedAt
      };
    });

    return NextResponse.json({
      success: true,
      data: sectorsWithProductCount,
      total: sectorsWithProductCount.length
    });

  } catch (error) {
    console.error('Error fetching all sectors:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch sectors',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}