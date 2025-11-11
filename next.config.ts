import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  
  // Lightweight webpack optimization
  webpack: (config, { dev, isServer }) => {
    // Mark lucide-react as side-effect free for better tree shaking
    config.module.rules.push({
      test: /node_modules[\\/]lucide-react/,
      sideEffects: false,
    });
    
    return config;
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year cache
  },
  
  // Gzip compression
  compress: true,
  
  // Modular imports for tree shaking
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },

  // Optimize loading behavior 
  poweredByHeader: false,
  generateEtags: true,
};

export default nextConfig;
