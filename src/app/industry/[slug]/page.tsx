'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, X } from 'lucide-react';

interface Subcategory {
  id: number;
  name: string;
  url: string | null;
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
  const [modalCategory, setModalCategory] = useState<Category | null>(null);

  const handleOpenModal = (category: Category) => {
    setModalCategory(category);
  };

  const handleCloseModal = () => {
    setModalCategory(null);
  };

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    // Create URL-friendly slug from subcategory name
    const subcategorySlug = subcategory.name
      .toLowerCase()
      .replace(/[&]/g, 'and')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    router.push(`/subcategory/${subcategorySlug}?id=${subcategory.id}`);
  };

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
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-3">
            <button 
              onClick={() => router.push('/')}
              className="hover:text-orange-600 transition-colors cursor-pointer"
            >
              Home
            </button>
            {' → '}
            <span className="text-gray-700">{industryData.name}</span>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold" style={{ color: '#2D2C2C' }}>
            {industryData.name}
          </h1>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {industryData.categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all"
              style={{ borderColor: '#e5e5e5' }}
            >
              <h3 className="text-lg font-semibold mb-3" style={{ color: '#2D2C2C' }}>
                {category.name}
              </h3>
              
              <div className="space-y-1">
                {category.subcategories.slice(0, 5).map((subcategory) => (
                  <div
                    key={subcategory.id}
                    className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-gray-50 cursor-pointer group transition-colors"
                    onClick={() => handleSubcategoryClick(subcategory)}
                  >
                    <span className="text-sm text-gray-700 group-hover:text-orange-600 transition-colors">
                      {subcategory.name}
                    </span>
                    <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-orange-600 transition-colors" />
                  </div>
                ))}
                
                {category.subcategories.length > 5 && (
                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <button 
                      onClick={() => handleOpenModal(category)}
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

      {/* Subcategories Modal */}
      {modalCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold" style={{ color: '#2D2C2C' }}>
                {modalCategory.name}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {modalCategory.subcategories.map((subcategory) => (
                  <div
                    key={subcategory.id}
                    className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-50 cursor-pointer group transition-colors border border-gray-100"
                    onClick={() => {
                      handleSubcategoryClick(subcategory);
                      handleCloseModal();
                    }}
                  >
                    <span className="text-sm text-gray-700 group-hover:text-orange-600 transition-colors">
                      {subcategory.name}
                    </span>
                    <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-orange-600 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}