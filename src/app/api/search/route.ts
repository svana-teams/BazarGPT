import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simple embedding function (same as used for generation)
function simpleEmbedding(text: string): number[] {
  const words = text.toLowerCase().split(/\W+/);
  const embedding = new Array(384).fill(0);
  
  words.forEach((word, index) => {
    for (let i = 0; i < word.length && i < 384; i++) {
      embedding[i] += word.charCodeAt(i % word.length) * (index + 1);
    }
  });
  
  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => magnitude > 0 ? val / magnitude : 0);
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    // Generate embedding for search query
    const queryEmbedding = simpleEmbedding(query);
    const vectorString = `[${queryEmbedding.join(',')}]`;

    // Try vector similarity search first (if embeddings exist)
    let results = await prisma.$queryRaw`
      SELECT 
        id,
        name,
        COALESCE("modifiedName", name) as display_name,
        COALESCE("modifiedImageUrl", "imageUrl") as "imageUrl",
        price,
        brand,
        embedding <=> ${vectorString}::vector as similarity
      FROM "Product" 
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> ${vectorString}::vector
      LIMIT 10
    `;

    // If no good vector results or query doesn't match chocolate/biscuit domain, 
    // fall back to text search across all products
    const hasGoodVectorResults = Array.isArray(results) && results.length > 0 && (results[0] as any).similarity < 0.1;
    
    if (!hasGoodVectorResults) {
      console.log('Vector search yielded poor results, falling back to text search');
      
      results = await prisma.$queryRaw`
        SELECT 
          id,
          name,
          COALESCE("modifiedName", name) as display_name,
          COALESCE("modifiedImageUrl", "imageUrl") as "imageUrl",
          price,
          brand,
          0.5 as similarity
        FROM "Product" 
        WHERE 
          LOWER(COALESCE("modifiedName", name)) LIKE LOWER(${`%${query}%`})
          OR LOWER(name) LIKE LOWER(${`%${query}%`})
          OR LOWER(brand) LIKE LOWER(${`%${query}%`})
        ORDER BY 
          CASE 
            WHEN LOWER("modifiedName") LIKE LOWER(${`%${query}%`}) THEN 1
            WHEN LOWER(name) LIKE LOWER(${`%${query}%`}) THEN 2
            ELSE 3
          END,
          id DESC
        LIMIT 10
      `;
    }

    return NextResponse.json({
      success: true,
      query,
      results
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}