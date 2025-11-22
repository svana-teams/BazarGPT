// app/api/suppliers/all/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const verifiedOnly = searchParams.get('verified') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          location: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    // For verified filter, we'll check if GST is not empty
    if (verifiedOnly) {
      whereClause.gst = {
        not: ''
      };
    }

    // Fetch suppliers with product count
    const [suppliers, totalCount] = await Promise.all([
      prisma.supplier.findMany({
        where: whereClause,
        include: {
          _count: {
            select: { products: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.supplier.count({ where: whereClause })
    ]);

    // Format response
    const formattedSuppliers = suppliers.map(supplier => {
      // Calculate experience years (random for now, we can add this field to later)
      const yearsInBusiness = Math.floor(Math.random() * 20) + 5;
      
      // Calculate rating (random for now, we can add this field later)
      const rating = (4.5 + Math.random() * 0.4).toFixed(1);

      // Determine if verified (has GST number)
      const verified = supplier.gst && supplier.gst.trim() !== '';

      return {
        id: supplier.id,
        name: supplier.name,
        location: supplier.location || 'India',
        verified: verified,
        years: `${yearsInBusiness}+ Years`,
        products: `${supplier._count.products}+`,
        rating: rating,
        gst: supplier.gst || undefined,
        mobile: supplier.mobile,
        email: supplier.email || undefined,
        website: supplier.website || undefined,
        specialization: 'Industrial Supplies', // we can add this field later
        createdAt: supplier.createdAt,
        updatedAt: supplier.updatedAt
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedSuppliers,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching all suppliers:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch suppliers',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}