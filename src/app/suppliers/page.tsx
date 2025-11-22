'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Star, Package, TrendingUp, Phone, Building2, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface Supplier {
  id: number;
  name: string;
  location: string;
  verified: boolean;
  years: string;
  products: string;
  rating: string;
  gst?: string;
  mobile?: string;
  email?: string;
  website?: string;
  specialization?: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AllSuppliersPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterVerified, setFilterVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  });

  const fetchSuppliers = async (page: number, search: string = '', verified: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      
      if (search) {
        params.append('search', search);
      }
      
      if (verified) {
        params.append('verified', 'true');
      }

      const response = await fetch(`/api/suppliers/all?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setSuppliers(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.error || 'Failed to fetch suppliers');
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setError('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers(1);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput);
      fetchSuppliers(1, searchInput, filterVerified);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput, filterVerified]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchSuppliers(newPage, searchQuery, filterVerified);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContactSupplier = () => {
    window.open('tel:9228847777', '_self');
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, pagination.page - Math.floor(maxVisible / 2));
    let end = Math.min(pagination.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF8F4' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/')}
              className="hover:opacity-80 transition-opacity"
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
            <li className="text-gray-900 font-semibold">All Suppliers</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#2D2C2C' }}>
                Verified Suppliers
              </h1>
              <p className="text-gray-600 text-lg">
                {loading ? 'Loading suppliers...' : `Connect with ${pagination.total.toLocaleString()} trusted suppliers across India`}
              </p>
            </div>
            
            {/* Stats Cards */}
            {!loading && !error && (
              <div className="flex gap-3">
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-5 h-5 text-[#FF6B00]" />
                    <span className="text-sm text-gray-600">Total Suppliers</span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: '#2D2C2C' }}>{pagination.total.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search suppliers by name or location..."
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B00] transition-colors text-gray-900 bg-white shadow-sm"
                disabled={loading}
              />
            </div>
            <button
              onClick={() => setFilterVerified(!filterVerified)}
              disabled={loading}
              className={`px-6 py-4 rounded-xl font-semibold transition-all shadow-sm flex items-center gap-2 whitespace-nowrap ${
                filterVerified 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 border-2 border-gray-200'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              Verified Only
            </button>
          </div>
        </div>

        {/* Results Info */}
        {!loading && !error && suppliers.length > 0 && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total.toLocaleString()} suppliers
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Failed to Load Suppliers</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => fetchSuppliers(pagination.page, searchQuery, filterVerified)}
              className="px-6 py-2 bg-[#FF6B00] text-white rounded-lg hover:bg-[#e55e00] transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Suppliers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border rounded-xl p-6 animate-pulse"
                style={{ borderColor: '#e5e5e5' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                  <div className="w-16 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="h-5 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="mt-4 h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : !error && suppliers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
              {suppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="bg-white border rounded-xl p-6 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1 flex flex-col"
                  style={{ borderColor: '#e5e5e5', minHeight: '420px' }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl" 
                      style={{ backgroundColor: '#ffe8d9' }}>
                      🏭
                    </div>
                    {supplier.verified && (
                      <span className="text-green-600 text-xs bg-green-50 px-3 py-1.5 rounded-full flex items-center gap-1 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Supplier Name - Fixed Height */}
                  <h3 className="font-bold mb-2 line-clamp-2 text-lg group-hover:text-[#FF6B00] transition-colors h-14" 
                    style={{ color: '#2D2C2C' }}>
                    {supplier.name}
                  </h3>

                  {/* Specialization - Fixed Height */}
                  <div className="h-8 mb-3">
                    {supplier.specialization && (
                      <p className="text-sm text-[#FF6B00] font-medium flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {supplier.specialization}
                      </p>
                    )}
                  </div>

                  {/* Details - Fixed Height */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4 flex-grow">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-1">{supplier.location}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      {supplier.rating} Rating
                    </p>
                    <p className="flex items-center gap-2">
                      <Package className="w-4 h-4 flex-shrink-0" />
                      {supplier.products} Products
                    </p>
                    <p className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 flex-shrink-0" />
                      {supplier.years} Experience
                    </p>
                  </div>

                  {/* Contact Button - Always at Bottom */}
                  <button
                    onClick={handleContactSupplier}
                    className="w-full py-3 border-2 rounded-lg transition-all font-semibold text-sm flex items-center justify-center gap-2 group-hover:bg-[#FF6B00] group-hover:text-white group-hover:border-[#FF6B00] cursor-pointer mt-auto"
                    style={{ borderColor: '#000000', color: '#000000' }}
                  >
                    <Phone className="w-4 h-4" />
                    Contact Supplier
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 bg-white rounded-xl p-4 shadow-md border border-gray-100">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                  style={{ color: '#2D2C2C' }}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-2">
                  {pagination.page > 3 && (
                    <>
                      <button
                        onClick={() => handlePageChange(1)}
                        className="w-10 h-10 rounded-lg font-semibold transition-all hover:bg-gray-100"
                        style={{ color: '#2D2C2C' }}
                      >
                        1
                      </button>
                      {pagination.page > 4 && (
                        <span className="text-gray-400">...</span>
                      )}
                    </>
                  )}
                  
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        pageNum === pagination.page
                          ? 'text-white shadow-md'
                          : 'hover:bg-gray-100'
                      }`}
                      style={{
                        backgroundColor: pageNum === pagination.page ? '#FF6B00' : 'transparent',
                        color: pageNum === pagination.page ? 'white' : '#2D2C2C'
                      }}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {pagination.page < pagination.totalPages - 2 && (
                    <>
                      {pagination.page < pagination.totalPages - 3 && (
                        <span className="text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(pagination.totalPages)}
                        className="w-10 h-10 rounded-lg font-semibold transition-all hover:bg-gray-100"
                        style={{ color: '#2D2C2C' }}
                      >
                        {pagination.totalPages}
                      </button>
                    </>
                  )}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                  style={{ color: '#2D2C2C' }}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-[#0D1B2A] to-[#1E293B] rounded-2xl p-8 text-white text-center mt-12">
              <div className="max-w-2xl mx-auto">
                <Building2 className="w-12 h-12 mx-auto mb-4 text-[#FF6B00]" />
                <h2 className="text-2xl font-bold mb-3">Want to Become a Supplier?</h2>
                <p className="text-gray-300 mb-6">
                  Join our network of trusted suppliers and reach thousands of buyers across India
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                  style={{ backgroundColor: '#FF6B00' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e55e00'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF6B00'}
                >
                  Register as Supplier
                </button>
              </div>
            </div>
          </>
        ) : !error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Suppliers Found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchInput('');
                setSearchQuery('');
                setFilterVerified(false);
                fetchSuppliers(1);
              }}
              className="mt-4 px-6 py-2 bg-[#FF6B00] text-white rounded-lg hover:bg-[#e55e00] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}