import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const baseUrl = 'https://bazargpt.com';
  
  try {
    // Get all sectors for industry pages
    const sectors = await prisma.sector.findMany({
      select: { name: true }
    });

    // Get all subcategories for subcategory pages
    const subcategories = await prisma.subcategory.findMany({
      select: { id: true, name: true }
    });

    // Static pages
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' }, // Homepage
      { url: '/help', priority: '0.8', changefreq: 'monthly' }
    ];

    // Industry pages (using sectors)
    const industryPages = sectors.map(sector => ({
      url: `/industry/${sector.name
        .toLowerCase()
        .replace(/[&]/g, 'and')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      }`,
      priority: '0.9',
      changefreq: 'weekly'
    }));

    // Subcategory pages
    const subcategoryPages = subcategories.map(subcategory => ({
      url: `/subcategory/${subcategory.name
        .toLowerCase()
        .replace(/[&]/g, 'and')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      }`,
      priority: '0.8',
      changefreq: 'weekly'
    }));

    const allPages = [...staticPages, ...industryPages, ...subcategoryPages];
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return basic sitemap if database fails
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/help</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

    return new Response(basicSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } finally {
    await prisma.$disconnect();
  }
}