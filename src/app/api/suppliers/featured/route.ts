import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const featuredSuppliers = await prisma.supplier.findMany({
      select: {
        id: true,
        name: true,
        location: true,
        gst: true,
        mobile: true,
        email: true,
        website: true,
        createdAt: true,
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: [
        {
          products: {
            _count: 'desc'
          }
        },
        {
          createdAt: 'desc'
        }
      ],
      take: 8
    });

    const suppliersWithRating = featuredSuppliers.map((supplier, index) => ({
      id: supplier.id,
      name: supplier.name,
      location: supplier.location || 'Unknown Location',
      verified: true,
      years: Math.floor(Math.random() * 10) + 5 + ' years',
      products: supplier._count.products + '+',
      rating: (4.5 + Math.random() * 0.4).toFixed(1),
      gst: supplier.gst,
      mobile: supplier.mobile,
      email: supplier.email,
      website: supplier.website
    }));

    return NextResponse.json({
      success: true,
      data: suppliersWithRating
    });

  } catch (error) {
    console.error('Error fetching featured suppliers:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch featured suppliers' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}