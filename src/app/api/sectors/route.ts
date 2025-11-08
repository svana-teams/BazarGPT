import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Super simple, fast query - just get sectors, no counting at all
    const sectors = await prisma.sector.findMany({
      orderBy: {
        name: 'asc',
      }
    });

    // Return clean, simple data
    const sectorsData = sectors.map((sector: any) => ({
      id: sector.id,
      name: sector.name
    }));

    return NextResponse.json({
      success: true,
      data: sectorsData
    });
  } catch (error) {
    console.error('Error fetching sectors:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sectors', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}