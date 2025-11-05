'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface Subcategory {
  id: number;
  name: string;
  url: string | null;
  productCount: number;
}

interface Category {
  id: number;
  name: string;
  url: string | null;
  subcategories: Subcategory[];
}

interface IndustryData {
  id: number;
  name: string;
  categories: Category[];
}

export default function IndustryPage() {
  const params = useParams();
  const router = useRouter();
  const [industryData, setIndustryData] = useState<IndustryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIndustryData = async () => {
      try {
        const response = await fetch(`/api/industry/${params.slug}`);
        const result = await response.json();
        
        if (result.success) {
          setIndustryData(result.data);
        } else {
          setError(result.error || 'Failed to fetch industry data');
        }
      } catch (err) {
        setError('Error fetching industry data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchIndustryData();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FAF8F4' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-lg p-6 border">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, subIdx) => (
                      <div key={subIdx} className="h-4 bg-gray-100 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !industryData) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FAF8F4' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Industry Not Found</h1>
            <p className="text-gray-600">{error || 'The requested industry could not be found.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF8F4' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Industries
          </button>
          
          <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#2D2C2C' }}>
            {industryData.name}
          </h1>
          <p className="text-gray-600">
            {industryData.categories.length} categories • {' '}
            {industryData.categories.reduce((total, cat) => total + cat.subcategories.length, 0)} subcategories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industryData.categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all"
              style={{ borderColor: '#e5e5e5' }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#2D2C2C' }}>
                {category.name}
              </h3>
              
              <div className="space-y-2">
                {category.subcategories.slice(0, 5).map((subcategory) => (
                  <div
                    key={subcategory.id}
                    className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-50 cursor-pointer group transition-colors"
                  >
                    <span className="text-sm text-gray-700 group-hover:text-orange-600 transition-colors">
                      {subcategory.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {subcategory.productCount > 0 ? `${subcategory.productCount} products` : 'Available'}
                      </span>
                      <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-orange-600 transition-colors" />
                    </div>
                  </div>
                ))}
                
                {category.subcategories.length > 5 && (
                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <button 
                      className="text-sm font-medium flex items-center gap-1 transition-colors"
                      style={{ color: '#FF6B00' }}
                      onMouseOver={(e) => e.currentTarget.style.color = '#e55e00'}
                      onMouseOut={(e) => e.currentTarget.style.color = '#FF6B00'}
                    >
                      View {category.subcategories.length - 5} more
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {industryData.categories.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Categories Found</h2>
            <p className="text-gray-600">This industry doesn't have any categories yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}