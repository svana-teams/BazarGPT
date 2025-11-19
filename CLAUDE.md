# BazarGPT - B2B Marketplace

## Project Overview
BazarGPT is a Next.js-based B2B marketplace connecting buyers with verified suppliers. The platform features 165,000+ products with semantic search capabilities powered by vector embeddings.

## Key Features
- **Product Database**: 165,081 products across multiple industrial categories
- **Semantic Search**: Vector embeddings for intelligent product discovery
- **Enhanced Product Data**: Modified names, descriptions, and AI-generated image descriptions
- **CDN Integration**: S3-backed CDN for optimized image delivery
- **Supplier Network**: Verified suppliers with ratings and contact information

## Database Schema
- **Products**: Enhanced with `modifiedName`, `modifiedDescription`, `imageDescription`, and `embedding` fields
- **Vector Search**: PostgreSQL with pgvector extension for similarity search
- **Prisma ORM**: Type-safe database operations

## Embedding Generation
The platform uses vector embeddings for semantic search:

### Current Status
- **Total Products**: 165,081
- **With Embeddings**: ~161,000+ (97.3% complete)
- **Remaining**: <4,000 products

### Embedding Scripts
- `generate-embeddings-individual.js` - Individual product processing (most reliable)
- `generate-embeddings-parallel-optimized.js` - Parallel processing for speed
- `generate-embeddings.js` - Original embedding generation script

### Check Embedding Progress
```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const stats = await prisma.\$queryRaw\`
    SELECT 
      COUNT(*) as total,
      COUNT(CASE WHEN embedding IS NOT NULL THEN 1 END) as with_embeddings
    FROM \"Product\"
  \`;
  console.log('Total:', Number(stats[0].total).toLocaleString());
  console.log('With embeddings:', Number(stats[0].with_embeddings).toLocaleString()); 
  console.log('Remaining:', (Number(stats[0].total) - Number(stats[0].with_embeddings)).toLocaleString());
  const percentage = (Number(stats[0].with_embeddings) / Number(stats[0].total)) * 100;
  console.log('Completion:', percentage.toFixed(1) + '%');
  await prisma.\$disconnect();
})();
"
```

### Complete Remaining Embeddings
```bash
node generate-embeddings-individual.js
```

## Development Commands

### Start Development Server
```bash
npm run dev
```

### Database Operations
```bash
# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# View database in Prisma Studio
npx prisma studio
```

### Build and Production
```bash
# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run type checking
npm run typecheck
```

## Search API
The semantic search is implemented in `/src/app/api/search/route.ts`:
- Uses vector similarity search with pgvector
- Returns top 10 most relevant products
- Searches across product names, brands, categories, and subcategories

## CDN Structure
Images are stored on S3 and served via CDN:
- **CDN URL Format**: `https://cdn.bazargpt.com/images/[seo-friendly-filename].jpg`
- **SEO Optimization**: Filenames include product names and specifications

## Project Structure
```
/src
  /app
    /api          # API routes (search, products, etc.)
    /components   # React components
    page.tsx      # Main homepage with search functionality
/prisma           # Database schema and migrations
/products         # Raw product data (Groups 1-4)
/processed_products # Enhanced product data with AI improvements
/downloaded_images_seo # Optimized product images
```

## Key Files
- `src/app/page.tsx` - Main homepage with search functionality
- `src/app/api/search/route.ts` - Semantic search API
- `prisma/schema.prisma` - Database schema
- `generate-embeddings-*.js` - Embedding generation scripts
- `query_embeddings.py` - Python script for embedding queries

## Search Functionality
When users search:
1. Input is converted to vector embedding
2. Database performs similarity search using pgvector
3. Results replace homepage content (hero, categories, suppliers hidden)
4. Only search results are displayed for clean UX

## Performance Optimizations
- **Lighthouse Score**: 98/100 with excellent Core Web Vitals
- **Image Optimization**: Lazy loading and CDN delivery
- **Database**: Optimized queries with proper indexing
- **Vector Search**: Efficient similarity search with normalized embeddings

## Important: Claude Development Guidelines

**⚠️ CRITICAL DEVELOPMENT RULES FOR CLAUDE:**

### Script Creation and Management
- **NEVER create multiple script files for the same task**
- **ALWAYS improve existing scripts in the same file instead of creating new ones**
- **Do not pollute the repository with script after script**
- **If a script has issues, debug and fix it in place**

### Solution Approach
- **Think holistically before providing solutions**
- **Analyze the full problem scope before writing any code**
- **Consider performance, memory, and scalability from the start**
- **Avoid the pattern: create script → find issue → create new script → repeat**

### File Management
- **Prefer editing existing files over creating new ones**
- **Only create new files when absolutely necessary for the specific goal**
- **Clean up temporary or failed scripts**

## Important: Long-Running Commands

**⚠️ CRITICAL FOR CLAUDE**: Do not run commands that take longer than 1 minute. Instead, provide the command to the user to run in their terminal.

### Long-running commands to avoid running directly:
- `node generate-embeddings-individual.js` (takes 30+ minutes)
- `node generate-embeddings-parallel-optimized.js` (takes 15+ minutes)
- `npm run build` (can take 2-5 minutes)
- Any embedding generation scripts
- Large data import operations

### Quick commands safe to run:
- Status checks (embedding progress, database queries)
- `npm run dev` (starts quickly, user can stop)
- `npx prisma generate`
- File operations (read, write, edit)

## Troubleshooting

### Embedding Generation Issues
- Use `generate-embeddings-individual.js` for reliability
- Monitor progress with the status check command
- Parallel processing may hit database connection limits

### Search Issues
- Ensure all products have embeddings for accurate results
- Check vector similarity thresholds in search API
- Verify product categories are properly indexed

## Data Sources
- **Original Data**: Scraped from Aajjo marketplace
- **Enhanced Data**: AI-processed product names and descriptions
- **Images**: Downloaded, renamed, and optimized for SEO
- **Categories**: Hierarchical structure (Sectors > Categories > Subcategories)