import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const subcategoryId = parseInt(resolvedParams.id);

    if (isNaN(subcategoryId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid subcategory ID' },
        { status: 400 }
      );
    }

    // Fetch subcategory with products
    const subcategory = await prisma.subcategory.findUnique({
      where: { id: subcategoryId },
      include: {
        category: {
          include: {
            sector: true
          }
        },
        products: {
          include: {
            supplier: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 3
        },
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    if (!subcategory) {
      return NextResponse.json(
        { success: false, error: 'Subcategory not found' },
        { status: 404 }
      );
    }

    // Transform the data
    const transformedData = {
      id: subcategory.id,
      name: subcategory.name,
      category: {
        name: subcategory.category.name,
        sector: {
          name: subcategory.category.sector.name
        }
      },
      products: subcategory.products.map((product: any) => ({
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        priceUnit: product.priceUnit,
        brand: product.brand,
        specifications: product.specifications,
        supplierId: product.supplierId, // Direct supplier ID from product
        supplier: {
          id: product.supplier?.id || product.supplierId,
          name: product.supplier?.name || 'Unknown Supplier',
          location: product.supplier?.location || 'Unknown Location'
        }
      })),
      totalProducts: subcategory._count.products
    };

    return NextResponse.json({
      success: true,
      data: transformedData
    });
  } catch (error) {
    console.error('Error fetching subcategory data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch subcategory data', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}