import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    console.log('POST /api/enquiries called');
    console.log('Prisma client available:', !!prisma);
    console.log('Prisma enquiry model available:', !!prisma.enquiry);
    console.log('Available Prisma models:', Object.keys(prisma));
    
    const body = await request.json();
    console.log('Request body:', body);
    const { productId, supplierId, quantity, location, phoneNumber } = body;

    // Validate required fields
    if (!productId || !supplierId || !phoneNumber) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: productId, supplierId, and phoneNumber are required' 
        },
        { status: 400 }
      );
    }

    // Validate that product and supplier exist
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
      include: { supplier: true }
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.supplierId !== parseInt(supplierId)) {
      return NextResponse.json(
        { success: false, error: 'Supplier does not match product supplier' },
        { status: 400 }
      );
    }

    // Create the enquiry
    console.log('About to create enquiry with data:', {
      productId: parseInt(productId),
      supplierId: parseInt(supplierId),
      quantity: quantity || null,
      location: location || null,
      phoneNumber: phoneNumber.trim()
    });
    
    const enquiry = await prisma.enquiry.create({
      data: {
        productId: parseInt(productId),
        supplierId: parseInt(supplierId),
        quantity: quantity || null,
        location: location || null,
        phoneNumber: phoneNumber.trim(),
        status: 'pending'
      },
      include: {
        product: {
          include: {
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
        },
        supplier: true
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: enquiry.id,
        productName: enquiry.product.name,
        supplierName: enquiry.supplier.name,
        quantity: enquiry.quantity,
        location: enquiry.location,
        phoneNumber: enquiry.phoneNumber,
        status: enquiry.status,
        createdAt: enquiry.createdAt
      },
      message: 'Enquiry submitted successfully'
    });

  } catch (error) {
    console.error('Error creating enquiry:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit enquiry', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // This could be used later to fetch enquiries for admin dashboard
    const enquiries = await prisma.enquiry.findMany({
      include: {
        product: true,
        supplier: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to recent 50 enquiries
    });

    return NextResponse.json({
      success: true,
      data: enquiries
    });

  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch enquiries', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}