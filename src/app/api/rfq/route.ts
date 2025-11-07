import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Request body:', body);
    const { productName, quantity, location, phoneNumber } = body;

    // Validate required fields
    if (!phoneNumber) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Phone number is required' 
        },
        { status: 400 }
      );
    }

    // Create the RFQ
    const rfq = await prisma.rFQ.create({
      data: {
        productName: productName || null,
        quantity: quantity || null,
        location: location || null,
        phoneNumber: phoneNumber.trim(),
        status: 'pending'
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: rfq.id,
        productName: rfq.productName,
        quantity: rfq.quantity,
        location: rfq.location,
        phoneNumber: rfq.phoneNumber,
        status: rfq.status,
        createdAt: rfq.createdAt
      },
      message: 'Request for Quotation submitted successfully'
    });

  } catch (error) {
    console.error('Error creating RFQ:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit RFQ', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // This could be used later to fetch RFQs for admin dashboard
    const rfqs = await prisma.rFQ.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to recent 50 RFQs
    });

    return NextResponse.json({
      success: true,
      data: rfqs
    });

  } catch (error) {
    console.error('Error fetching RFQs:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch RFQs', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}