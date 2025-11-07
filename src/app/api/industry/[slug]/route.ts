import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Handle both sync and async params (Next.js 13+ compatibility)
    const resolvedParams = await params;
    console.log('Raw params:', resolvedParams);
    console.log('Looking for industry with slug:', resolvedParams?.slug);
    
    if (!resolvedParams?.slug) {
      return NextResponse.json(
        { success: false, error: 'No slug provided' },
        { status: 400 }
      );
    }

    // Try multiple approaches to match the industry
    let industry = null;
    
    // First, try exact slug-to-name conversion
    const exactName = resolvedParams.slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    console.log('Trying exact name match:', exactName);
    
    // Handle special cases for common industry names
    const nameVariations = [
      exactName,
      exactName.replace(' And ', ' & '),
      exactName.replace(' & ', ' And '),
      exactName.replace(' and ', ' & '),  // Convert 'and' to '&'
      exactName.replace(' And', ' &'),    // Handle end cases
      exactName.replace('and ', '& '),    // Handle start cases
      'Cosmetics & Personal Care'         // specific case for this industry
    ];
    
    // Try each variation
    for (const variation of nameVariations) {
      console.log('Trying variation:', variation);
      
      industry = await prisma.sector.findFirst({
        where: {
          name: {
            equals: variation,
            mode: 'insensitive'
          }
        },
        include: {
          categories: {
            include: {
              subcategories: {
                include: {
                  _count: {
                    select: {
                      products: true
                    }
                  }
                }
              }
            }
          }
        }
      });
      
      if (industry) {
        console.log('Found industry with variation:', variation, '-> ', industry.name);
        break;
      }
    }
    
    // If still not found, try partial matching
    if (!industry) {
      console.log('Exact matches failed, trying partial matching...');
      
      industry = await prisma.sector.findFirst({
        where: {
          name: {
            contains: exactName.split(' ')[0], // Try first word
            mode: 'insensitive'
          }
        },
        include: {
          categories: {
            include: {
              subcategories: {
                include: {
                  _count: {
                    select: {
                      products: true
                    }
                  }
                }
              }
            }
          }
        }
      });
    }

    if (!industry) {
      console.log('Industry not found for slug:', resolvedParams.slug);
      return NextResponse.json(
        { success: false, error: 'Industry not found' },
        { status: 404 }
      );
    }

    console.log('Found industry:', industry.name);

    // Transform the data
    const transformedData = {
      id: industry.id,
      name: industry.name,
      categories: industry.categories.map((category: any) => ({
        id: category.id,
        name: category.name,
        url: category.url,
        subcategories: category.subcategories.map((subcategory: any) => ({
          id: subcategory.id,
          name: subcategory.name,
          url: subcategory.url,
          productCount: subcategory._count.products,
        }))
      }))
    };

    return NextResponse.json({
      success: true,
      data: transformedData
    });
  } catch (error) {
    console.error('Error fetching industry data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch industry data', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}