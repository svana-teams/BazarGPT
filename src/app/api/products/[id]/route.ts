import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const productId = parseInt(resolvedParams.id);

    console.log('Fetching product with ID:', productId);

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Fetch product with all details
    const product = await prisma.product.findUnique({
      where: { id: productId },
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

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Fetch similar products from same subcategory (exclude current product)
    const similarProducts = await prisma.product.findMany({
      where: {
        subcategoryId: product.subcategoryId,
        id: { not: productId }
      },
      include: {
        supplier: true
      },
      take: 4,
      orderBy: {
        createdAt: 'desc'
      }
    });

    const transformedData = {
      id: product.id,
      // Use modifiedName if available, otherwise use name
      name: product.modifiedName || product.name,
      // Use modifiedImageUrl if available, otherwise use imageUrl
      imageUrl: product.modifiedImageUrl || product.imageUrl,
      price: product.price,
      priceUnit: product.priceUnit,
      brand: product.brand,
      specifications: product.specifications,
      // Use modifiedDescription if available, otherwise null
      description: product.modifiedDescription || null,
      supplier: {
        id: product.supplier.id,
        name: product.supplier.name,
        location: product.supplier.location,
        // Mask email - show only first 2 and last 4 digits
        email: product.supplier.email
          ? `${product.supplier.email.slice(0, 2)}xxxxxxxxxx@${product.supplier.email.slice(-4)}`
          : null,
        // Mask phone number - show only last 2 digits
        phone: product.supplier.mobile 
          ? `+91XXXXXXXX${product.supplier.mobile.slice(-2)}` 
          : null
      },
      breadcrumb: {
        sector: product.subcategory.category.sector.name,
        category: product.subcategory.category.name,
        subcategory: product.subcategory.name
      },
      similarProducts: similarProducts.map(p => ({
        id: p.id,
        // Use modifiedName if available, otherwise use name
        name: p.modifiedName || p.name,
        // Use modifiedImageUrl if available, otherwise use imageUrl
        imageUrl: p.modifiedImageUrl || p.imageUrl,
        price: p.price,
        priceUnit: p.priceUnit,
        brand: p.brand,
        supplier: {
          name: p.supplier.name,
          location: p.supplier.location
        }
      }))
    };

    console.log('Product fetched successfully:', product.name);

    return NextResponse.json({
      success: true,
      data: transformedData
    });
  } catch (error) {
    console.error('Error fetching product data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch product data', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
