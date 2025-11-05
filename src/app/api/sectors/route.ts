import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const sectors = await prisma.sector.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: {
            categories: {
              where: {
                subcategories: {
                  some: {
                    products: {
                      some: {}
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    // Transform the data to include product counts
    const sectorsWithCounts = sectors.map((sector: any) => ({
      id: sector.id,
      name: sector.name,
      productCount: sector._count.categories
    }));

    return NextResponse.json({
      success: true,
      data: sectorsWithCounts
    });
  } catch (error) {
    console.error('Error fetching sectors:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sectors', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}