'use client';

import dynamic from 'next/dynamic';

// Lazy load non-critical components to reduce initial bundle
export const LazyFeaturedSuppliers = dynamic(() => import('./FeaturedSuppliers'), {
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="bg-white border rounded-lg p-4 lg:p-6 animate-pulse" style={{ borderColor: '#e5e5e5' }}>
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            <div className="w-16 h-6 bg-gray-200 rounded"></div>
          </div>
          <div className="w-3/4 h-5 bg-gray-200 rounded mb-2"></div>
          <div className="space-y-1">
            <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
            <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
            <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
          </div>
          <div className="mt-4 w-full h-8 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  ),
  ssr: false
});

export const LazyPromotionalBanner = dynamic(() => import('./PromotionalBanner'), {
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8 lg:mb-12">
      <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
      <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>
  ),
  ssr: false
});

export const LazyFeatures = dynamic(() => import('./Features'), {
  loading: () => (
    <div className="mt-8 lg:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 w-full">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-lg p-4 lg:p-6 border border-gray-200 shadow-sm">
          <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-5 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  ),
  ssr: false
});

export const LazyModals = dynamic(() => import('./Modals'), {
  loading: () => null,
  ssr: false
});