'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, Factory, Zap } from 'lucide-react';

interface Industry {
  id: number;
  name: string;
  productCount: number;
  icon: string;
}

export default function AllIndustriesPage() {
  const router = useRouter();
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [filteredIndustries, setFilteredIndustries] = useState<Industry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getIndustryIcon = (industryName: string): string => {
    const iconMap: { [key: string]: string } = {
      'Commercial Kitchen': '🍳',
      'Electronics': '💻',
      'Beauty & Personal Care': '💄',
      'Agriculture & Food': '🌾',
      'Electrical': '⚡',
      'Fashion Accessories & Gear': '👕',
      'Food & Beverages': '🍽️',
      'Hospital Equipments': '🏥',
      'Industrial Supplies': '🏭',
      'Furniture': '🪑',
      'Home Appliances': '🏠',
      'Interior Designing & Decoration': '🏡',
      'Machinery': '⚙️',
      'Packaging': '📦',
      'Refrigeration': '🧊',
      'Healthcare': '💊',
      'Sports Goods, Toys & Games': '⚽',
      'Automotive': '🚗',
      'Textiles': '🧵',
      'Construction': '🏗️',
      'Chemical': '🧪',
      'Education & Training': '📚',
      'Paper & Printing': '📄',
      'Metal & Steel': '🔩',
      'Plastic & Rubber': '🔧'
    };
    return iconMap[industryName] || '🏢';
  };

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/sectors/all');
        const result = await response.json();
        
        if (result.success) {
          const industriesWithIcons = result.data.map((industry: any) => ({
            ...industry,
            icon: getIndustryIcon(industry.name)
          }));
          setIndustries(industriesWithIcons);
          setFilteredIndustries(industriesWithIcons);
        } else {
          setError(result.error || 'Failed to fetch industries');
        }
      } catch (error) {
        console.error('Error fetching industries:', error);
        setError('Failed to load industries');
      } finally {
        setLoading(false);
      }
    };

    fetchIndustries();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = industries.filter(industry =>
        industry.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredIndustries(filtered);
    } else {
      setFilteredIndustries(industries);
    }
  }, [searchQuery, industries]);

  const handleIndustryClick = (industryName: string) => {
    const slug = industryName
      .toLowerCase()
      .replace(/[&]/g, 'and')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    router.push(`/industry/${slug}`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF8F4' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/')}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="flex flex-col">
                <div className="text-2xl font-bold" style={{ color: '#FF6B00' }}>BazarGPT</div>
                <div className="text-xs" style={{ color: '#2D2C2C' }}>B2B Marketplace</div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-3 shadow-sm border border-gray-100">
            <li>
              <button 
                onClick={() => router.push('/')}
                className="hover:text-[#FF6B00] transition-colors font-medium"
              >
                Home
              </button>
            </li>
            <li className="text-gray-400">→</li>
            <li className="text-gray-900 font-semibold">All Industries</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#2D2C2C' }}>
                Browse All Industries
              </h1>
              <p className="text-gray-600 text-lg">
                {loading ? 'Loading industries...' : `Explore ${industries.length} industries and find the right suppliers for your business`}
              </p>
            </div>
            
            {/* Stats Card */}
            {!loading && !error && (
              <div className="flex gap-3">
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Factory className="w-5 h-5 text-[#FF6B00]" />
                    <span className="text-sm text-gray-600">Total Industries</span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: '#2D2C2C' }}>{industries.length}</p>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search industries..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B00] transition-colors text-gray-900 bg-white shadow-sm"
              disabled={loading}
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Failed to Load Industries</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#FF6B00] text-white rounded-lg hover:bg-[#e55e00] transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Industries Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 25 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border rounded-xl p-6 animate-pulse"
                style={{ borderColor: '#e5e5e5' }}
              >
                <div className="w-12 h-12 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-5 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : !error && filteredIndustries.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
              {filteredIndustries.map((industry) => {
                const slug = industry.name
                  .toLowerCase()
                  .replace(/[&]/g, 'and')
                  .replace(/[^a-z0-9\s]/g, '')
                  .replace(/\s+/g, '-')
                  .replace(/-+/g, '-')
                  .replace(/^-|-$/g, '');
                
                return (
                  <button
                    key={industry.id}
                    onClick={() => handleIndustryClick(industry.name)}
                    className="bg-white border rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group text-left transform hover:-translate-y-1"
                    style={{ borderColor: '#e5e5e5' }}
                  >
                    <div className="flex flex-col h-full">
                      <div 
                        className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300"
                      >
                        {industry.icon}
                      </div>
                      <h3 
                        className="font-semibold mb-2 line-clamp-2 transition-colors group-hover:text-[#FF6B00] text-base"
                        style={{ color: '#2D2C2C' }}
                      >
                        {industry.name}
                      </h3>
                      {industry.productCount > 0 && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-auto">
                          <TrendingUp className="w-4 h-4" />
                          <span>{industry.productCount.toLocaleString()} products</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-[#0D1B2A] to-[#1E293B] rounded-2xl p-8 text-white text-center">
              <div className="max-w-2xl mx-auto">
                <Zap className="w-12 h-12 mx-auto mb-4 text-[#FF6B00]" />
                <h2 className="text-2xl font-bold mb-3">Can't Find What You're Looking For?</h2>
                <p className="text-gray-300 mb-6">
                  Tell us what you need and we'll help you connect with the right suppliers
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                  style={{ backgroundColor: '#FF6B00' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e55e00'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF6B00'}
                >
                  Request for Quotation
                </button>
              </div>
            </div>
          </>
        ) : !error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Industries Found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}
      </main>
    </div>
  );
}