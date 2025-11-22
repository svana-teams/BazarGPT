'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Critical icons only - load immediately
import { Search } from 'lucide-react';

// Non-critical icons - load dynamically 
const Mail = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Mail })), { ssr: false });
const Phone = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Phone })), { ssr: false });
const X = dynamic(() => import('lucide-react').then(mod => ({ default: mod.X })), { ssr: false });

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

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
}

interface Industry {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  modifiedName?: string | null;
  modifiedDescription?: string | null;
  imageUrl: string | null;
  imageDescription?: string | null;
  price: string | null;
  priceUnit: string | null;
  brand: string | null;
  supplier: {
    name: string;
    location: string;
  };
  subcategory?: {
    name: string;
    productCount: number;
  };
  category: string;
  industry: string;
}

export default function Home() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [featuredSuppliers, setFeaturedSuppliers] = useState<Supplier[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  // Static products for instant LCP - real data from database
  const staticProducts: Product[] = [
    
  ];

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(staticProducts);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [allSubcategoryProducts, setAllSubcategoryProducts] = useState<Product[]>([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [industriesLoading, setIndustriesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false); // No loading since we start with content
  const [showRFQModal, setShowRFQModal] = useState(false);
  const [rfqForm, setRfqForm] = useState({
    productName: '',
    quantity: '',
    location: '',
    phoneNumber: ''
  });
  const [rfqValidationError, setRfqValidationError] = useState('');
  const [isRfqSubmitting, setIsRfqSubmitting] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);


  const popularSearches = [
    'LED lights', 'Solar panels', 'Water pump', 'Plastic mold',
    'Steel pipe', 'Motor', 'Bearing', 'Valve'
  ];

  const getIndustryIcon = (industryName: string): string => {
    const iconMap: { [key: string]: string } = {
      'Electrical': '⚡',
      'Electronics': '💻',
      'Furniture': '🪑',
      'Home Appliances': '🏠',
      'Hospital Equipments': '🏥',
      'Industrial Supplies': '🏭',
      'Machinery': '⚙️',
      'Refrigeration': '🧊',
      'Commercial Kitchen': '🍳',
      'Fashion Accessories & Gear': '👕',
      'Food & Beverages': '🍽️',
      'Interior Designing & Decoration': '🏡',
      'Sports Goods, Toys & Games': '⚽',
      'Agriculture & Food': '🌾',
      'Automotive': '🚗',
      'Textiles': '🧵',
      'Construction': '🏗️',
      'Chemical': '🧪',
      'Packaging': '📦',
      'Healthcare': '💊',
      'Beauty & Personal Care': '💄',
      'Education & Training': '📚'
    };
    return iconMap[industryName] || '🏢';
  };

  const topCategories = industriesLoading 
    ? Array.from({ length: 8 }, (_, i) => ({
        name: 'Loading...',
        icon: '⏳'
      }))
    : industries.slice(0, 8).map(industry => ({
        name: industry.name,
        icon: getIndustryIcon(industry.name)
      }));

  const handlePopularSearch = async (term: string) => {
    setSearchValue(term);
    console.log('Searching for:', term);
    setProductsLoading(true);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
      const data = await response.json();
      
      console.log('Search API response:', data);
      
      if (data.success && data.results) {
        // Transform results to match Product interface
        const transformedResults = data.results.map((result: any) => ({
          id: result.id,
          name: result.name,
          modifiedName: result.display_name,
          imageUrl: result.imageUrl,
          price: result.price,
          priceUnit: null,
          brand: result.brand,
          supplier: { name: 'Verified Supplier', location: 'India' },
          subcategory: { name: 'Industrial', productCount: 0 },
          category: 'Industrial Products',
          industry: 'Manufacturing'
        }));
        
        console.log('Popular search results:', transformedResults);
        setSearchResults(transformedResults);
        setCurrentProductIndex(0);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchValue.trim()) {
      console.log('Searching for:', searchValue);
      setProductsLoading(true);
      
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchValue)}`);
        const data = await response.json();
        
        console.log('Search API response:', data);
        
        if (data.success && data.results) {
          console.log('🔍 Raw API results count:', data.results.length);
          console.log('🔍 First 3 raw results:', data.results.slice(0, 3));
          
          // Transform results to match Product interface
          const transformedResults = data.results.map((result: any) => ({
            id: result.id,
            name: result.name,
            modifiedName: result.display_name,
            imageUrl: result.imageUrl,
            price: result.price,
            priceUnit: null,
            brand: result.brand,
            supplier: { name: 'Verified Supplier', location: 'India' },
            subcategory: { name: 'Industrial', productCount: 0 },
            category: 'Industrial Products',
            industry: 'Manufacturing'
          }));
          
          console.log('🔍 Transformed results count:', transformedResults.length);
          console.log('🔍 Setting search results state...');
          setSearchResults(transformedResults);
          setCurrentProductIndex(0);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setProductsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleIndustryClick = (industryName: string) => {
    if (industriesLoading || industryName === 'Loading...') return;
    
    // Convert industry name to URL slug with better handling
    const slug = industryName
      .toLowerCase()
      .replace(/[&]/g, 'and')  // Replace & with 'and'
      .replace(/[^a-z0-9\s]/g, '')  // Remove special characters except spaces
      .replace(/\s+/g, '-')  // Replace spaces with hyphens
      .replace(/-+/g, '-')   // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    
    console.log('Navigating to industry:', industryName, '-> slug:', slug);
    router.push(`/industry/${slug}`);
  };

  const handleViewAll = (section: string) => {
    switch (section) {
      case 'industries':
        router.push('/industries');
        break;
      case 'products':
        router.push('/products');
        break;
      case 'suppliers':
        router.push('/suppliers');
        break;
      default:
        console.log(`View all clicked for: ${section}`);
    }
  };

  const handleRFQOpen = () => {
    setShowRFQModal(true);
  };

  const handleContactSupplier = (product: Product) => {
    setSelectedProduct(product);
    setShowContactModal(true);
  };

  const handleRFQClose = () => {
    setShowRFQModal(false);
    setRfqForm({
      productName: '',
      quantity: '',
      location: '',
      phoneNumber: ''
    });
    setRfqValidationError('');
    setIsRfqSubmitting(false);
  };

  const handleRFQSubmit = async () => {
    // Clear previous validation error
    setRfqValidationError('');

    // Only phone number is mandatory
    if (!rfqForm.phoneNumber.trim()) {
      setRfqValidationError('Please enter your phone number');
      return;
    }

    setIsRfqSubmitting(true);

    try {
      const response = await fetch('/api/rfq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: rfqForm.productName.trim() || null,
          quantity: rfqForm.quantity.trim() || null,
          location: rfqForm.location.trim() || null,
          phoneNumber: rfqForm.phoneNumber.trim()
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('Your Request for Quotation has been submitted successfully!');
        handleRFQClose();
      } else {
        setRfqValidationError(result.error || 'Failed to submit RFQ');
      }
    } catch (error) {
      console.error('Error submitting RFQ:', error);
      setRfqValidationError('Network error. Please try again.');
    } finally {
      setIsRfqSubmitting(false);
    }
  };

  const handleScrollToProducts = () => {
    const element = document.getElementById('top-products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    // Optimize loading with setTimeout to avoid blocking initial render
    const timeoutIds: NodeJS.Timeout[] = [];
    
    // Load critical content first (industries for navigation)
    const fetchIndustries = async () => {
      try {
        const response = await fetch('/api/sectors');
        const result = await response.json();
        
        if (result.success) {
          setIndustries(result.data);
        } else {
          console.error('Failed to fetch industries:', result.error);
        }
      } catch (error) {
        console.error('Error fetching industries:', error);
      } finally {
        setIndustriesLoading(false);
      }
    };

    // Load less critical content with delay to avoid blocking
    const fetchFeaturedSuppliers = async () => {
      try {
        const response = await fetch('/api/suppliers/featured');
        const result = await response.json();
        
        if (result.success) {
          setFeaturedSuppliers(result.data);
        } else {
          console.error('Failed to fetch suppliers:', result.error);
        }
      } catch (error) {
        console.error('Error fetching featured suppliers:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products/featured');
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
          setAllSubcategoryProducts(result.data);
          // Replace static products with real ones after initial render
          setFeaturedProducts(result.data.slice(0, 20));
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // Keep static products if API fails
      }
    };

    // Load industries immediately (critical for LCP)
    fetchIndustries();
    
    // Load other content with small delays to prevent blocking
    timeoutIds.push(setTimeout(fetchFeaturedSuppliers, 100));
    timeoutIds.push(setTimeout(fetchFeaturedProducts, 200));
    
    // Cleanup timeouts
    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, []);


  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#FAF8F4' }}>
      {/* Top Bar */}
      <div style={{ backgroundColor: '#0D1B2A' }} className="text-white text-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center overflow-hidden">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              +91-7042692468
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              support@bazargpt.com
            </span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => router.push('/help')} className="transition-colors" style={{ color: 'white' }} onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = 'white'} aria-label="Get help and support">Help</button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 overflow-hidden">
          <div className="flex items-center gap-4 lg:gap-8 min-w-0">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button 
                onClick={() => router.push('/')}
                className="hover:opacity-80 transition-opacity"
                aria-label="Go to BazarGPT homepage"
              >
                <div className="flex flex-col">
                  <div className="text-xl lg:text-2xl font-bold" style={{ color: '#FF6B00' }}>BazarGPT</div>
                  <div className="text-xs hidden sm:block" style={{ color: '#2D2C2C' }}>B2B Marketplace</div>
                </div>
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex-1 flex items-stretch max-w-4xl min-w-0">
              <div className="relative flex-1 flex min-w-0">
                {/* Search Input */}
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search products, suppliers, categories..."
                  className="flex-1 px-3 sm:px-4 lg:px-5 py-2 lg:py-3 border border-gray-300 rounded-l-md focus:outline-none text-gray-900 text-sm lg:text-base min-w-0"
                  style={{ borderColor: '#e5e5e5' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#FF6B00'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e5'}
                />

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="px-4 sm:px-6 lg:px-8 py-2 lg:py-3 text-white rounded-r-md border-l-0 transition-colors flex items-center gap-2 justify-center flex-shrink-0"
                  style={{ backgroundColor: '#FF6B00' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e55e00'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF6B00'}
                  aria-label="Search products and suppliers"
                >
                  <Search className="w-4 lg:w-5 h-4 lg:h-5" />
                  <span className="font-medium text-sm lg:text-base hidden sm:inline">Search</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Navigation */}
        <div style={{ backgroundColor: '#0D1B2A' }} className="text-white hidden lg:block">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-6 py-2 text-sm">
              <button className="transition-colors font-medium" onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = 'white'} aria-label="Browse all product categories">All Categories</button>
              <button onClick={() => router.push('/help')} className="transition-colors" onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = 'white'} aria-label="Access help center and support">Help Center</button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <nav className="max-w-7xl mx-auto px-4 py-2 text-sm text-gray-600" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <a href="/" className="hover:text-[#FF6B00] transition-colors">Home</a>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium">B2B Marketplace</li>
        </ol>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 lg:py-8 overflow-hidden">
        {!searchValue.trim() && (
          <>
            {/* Hero Banner - Optimized for LCP */}
            <div className="hero-section rounded-lg p-6 lg:p-10 mb-6 lg:mb-8" style={{ backgroundColor: '#0D1B2A' }}>
          <h1 className="hero-title text-2xl lg:text-4xl font-bold mb-3 font-sans" style={{ color: '#f0f0f0' }}>Find Quality Products from Verified Suppliers</h1>
          <p className="mb-6 text-base lg:text-lg" style={{ color: '#e0e0e0' }}>Discover thousands of industrial products, machinery, and equipment from verified suppliers across India. Get instant quotes and connect with trusted manufacturers.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRFQOpen}
              className="px-6 lg:px-8 py-3 rounded-md font-semibold transition-all shadow-md hover:shadow-lg text-sm lg:text-base"
              style={{ backgroundColor: '#E85A00', color: 'white' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#D14E00'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#E85A00'}
              aria-label="Request quotation for products from suppliers"
            >
              Request for Quotation
            </button>
            <button
              onClick={handleScrollToProducts}
              className="px-6 lg:px-8 py-3 border-2 rounded-md font-semibold transition-all text-sm lg:text-base"
              style={{ borderColor: 'white', color: 'white', backgroundColor: 'transparent' }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#0D1B2A';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'white';
              }}
              aria-label="Explore our featured products catalog"
            >
              Explore Products
            </button>
          </div>
        </div>

            {/* Popular Searches */}
            <div className="mb-8">
              <h2 className="text-base font-semibold mb-3" style={{ color: '#2D2C2C' }}>Popular Searches:</h2>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handlePopularSearch(term)}
                    className="px-4 py-2 bg-white border rounded-full text-sm transition-all shadow-sm hover:cursor-pointer"
                    style={{ borderColor: '#d1d5db', color: '#2D2C2C' }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#FF6B00';
                      e.currentTarget.style.color = '#FF6B00';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(255, 107, 0, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.color = '#2D2C2C';
                      e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                    }}
                    aria-label={`Search for ${term}`}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Categories */}
            <div className="mb-8 lg:mb-12">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h2 className="text-xl lg:text-2xl font-bold" style={{ color: '#2D2C2C' }}>Browse by Industry</h2>
                <button
                  onClick={() => router.push('/industries')}
                  className="text-sm lg:text-base font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  style={{ color: '#FF6B00' }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#e55e00'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#FF6B00'}
                >
                  View All
                  <span>→</span>
                </button>
              </div>
              <div className="grid-responsive grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 w-full">
                {topCategories.map((category, index) => {
                  const slug = industriesLoading || category.name === 'Loading...' ? '#' : 
                    `/industry/${category.name
                      .toLowerCase()
                      .replace(/[&]/g, 'and')
                      .replace(/[^a-z0-9\s]/g, '')
                      .replace(/\s+/g, '-')
                      .replace(/-+/g, '-')
                      .replace(/^-|-$/g, '')}`;
                  
                  return (
                    <a
                      key={industriesLoading ? `loading-${index}` : category.name}
                      href={slug}
                      className="bg-white border rounded-lg p-4 lg:p-6 hover:shadow-lg transition-all cursor-pointer group block"
                      style={{ borderColor: '#e5e5e5' }}
                      onMouseOver={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                      onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e5e5'}
                      aria-label={`Browse ${category.name} products and suppliers`}
                    >
                      <div className="text-3xl lg:text-4xl mb-2 lg:mb-3" aria-hidden="true">{category.icon}</div>
                      <h3 className="font-semibold transition-colors group-hover:text-[#FF6B00] text-sm lg:text-base truncate" style={{ color: '#2D2C2C' }}>
                        {category.name}
                      </h3>
                    </a>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Top Products */}
        <div id="top-products" className="mb-8 lg:mb-12">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-xl lg:text-2xl font-bold" style={{ color: '#2D2C2C' }}>
              {searchValue.trim() ? `Search Results for "${searchValue}"` : 'Top Products'}
            </h2>
            {searchValue.trim() && (
              <button
                onClick={() => {
                  setSearchValue('');
                  setSearchResults([]);
                  setCurrentProductIndex(0);
                }}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Clear Search
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 w-full">
            {productsLoading ? (
              Array.from({ length: 20 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse"
                >
                  <div className="bg-gray-200 h-32 lg:h-40"></div>
                  <div className="p-3 lg:p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2 w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))
            ) : (
              (() => {
                const productsToShow = searchValue.trim() ? searchResults : featuredProducts;
                console.log('🎨 Rendering products. Search active:', !!searchValue.trim());
                console.log('🎨 Search value:', searchValue);
                console.log('🎨 SearchResults array length:', searchResults.length);
                console.log('🎨 FeaturedProducts array length:', featuredProducts.length);
                console.log('🎨 Products to show length:', productsToShow.length);
                console.log('🎨 Will display:', productsToShow.slice(0, 20).length, 'products');
                return productsToShow.slice(0, 20);
              })().map((product, index) => (
                <div
                  key={`${product.id}-${currentProductIndex}`}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all group animate-fadeIn"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                  title={product.modifiedDescription || `${product.modifiedName || product.name} - ${product.supplier.name}`}
                >
                  <div className="bg-gray-100 h-48 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.imageDescription || `${product.modifiedName || product.name} - Professional ${product.subcategory?.name || 'industrial product'} for commercial applications`}
                        className="w-full h-full object-cover"
                        loading={index < 4 ? "eager" : "lazy"} // Load first 4 images eagerly for better LCP
                        decoding="async"
                        fetchPriority={index < 2 ? "high" : "auto"}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div className={`text-4xl lg:text-6xl ${product.imageUrl ? 'hidden' : 'flex'} items-center justify-center w-full h-full text-gray-400`}>
                      📦
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2 text-base line-clamp-2 transition-colors group-hover:text-gray-800" style={{ color: '#2D2C2C' }}>
                      {product.modifiedName || product.name}
                    </h3>
                    <p className="font-bold text-lg mb-2" style={{ color: '#1f2937' }}>
                      {product.price ? `${product.price}${product.priceUnit ? `/${product.priceUnit}` : ''}` : 'Price on request'}
                    </p>
                    {product.brand && (
                      <p className="text-sm text-gray-600 mb-1">Brand: {product.brand}</p>
                    )}
                    
                    {/* Supplier Information */}
                    <div className="mt-3 mb-4">
                      <p className="text-sm font-medium text-gray-800">{product.supplier.name}</p>
                      <p className="text-sm text-gray-500">{product.supplier.location}</p>
                    </div>
                    
                    {/* Contact Supplier Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContactSupplier(product);
                      }}
                      className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
                    >
                      Contact supplier
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {!searchValue.trim() && (
          <>
            {/* Promotional Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8 lg:mb-12">
              <div className="rounded-lg p-4 lg:p-6 flex flex-col lg:flex-row items-center justify-between border-2" style={{ backgroundColor: '#f1f5f9', borderColor: '#0D1B2A' }}>
                <div className="text-center lg:text-left mb-4 lg:mb-0">
                  <h3 className="text-lg lg:text-xl font-bold mb-2" style={{ color: '#0D1B2A' }}>Get Your First Order</h3>
                  <p className="mb-3 text-sm lg:text-base text-gray-700">Special discount for new buyers</p>
                  <button
                    onClick={() => router.push('/claim-offer')}
                    className="px-5 py-2 rounded-md font-semibold transition-all text-sm text-white shadow-sm"
                    style={{ backgroundColor: '#0D1B2A' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1E293B'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0D1B2A'}
                    aria-label="Claim special discount offer for new buyers"

                  >
                    Claim Offer
                  </button>
                </div>
                <div className="text-4xl lg:text-6xl">🎁</div>
              </div>
              <div className="rounded-lg p-4 lg:p-6 flex flex-col lg:flex-row items-center justify-between border-2" style={{ backgroundColor: '#f9fafb', borderColor: '#374151' }}>
                <div className="text-center lg:text-left mb-4 lg:mb-0">
                  <h3 className="text-lg lg:text-xl font-bold mb-2" style={{ color: '#0D1B2A' }}>Trade Assurance</h3>
                  <p className="mb-3 text-sm lg:text-base text-gray-700">Protected payment for safe trading</p>
                  <button
                    onClick={() => router.push('/learn-more')}
                    className="px-5 py-2 rounded-md font-semibold transition-all text-sm text-white shadow-sm"
                    style={{ backgroundColor: '#FF6B00' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e55e00'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF6B00'}
                    aria-label="Learn more about Trade Assurance and protected payments"
                  >
                    Learn More
                  </button>
                </div>
                <div className="text-4xl lg:text-6xl">🛡️</div>
              </div>
            </div>

            {/* Featured Suppliers */}
            <div className="mb-8 lg:mb-12">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h2 className="text-xl lg:text-2xl font-bold" style={{ color: '#2D2C2C' }}>Featured Suppliers</h2>
                <button
                  onClick={() => router.push('/suppliers')}
                  className="text-sm lg:text-base font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  style={{ color: '#FF6B00' }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#e55e00'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#FF6B00'}
                >
                  View All
                  <span>→</span>
                </button>
              </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white border rounded-lg p-4 lg:p-6 animate-pulse"
                  style={{ borderColor: '#e5e5e5', minHeight: '280px' }}
                >
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
              ))
            ) : (
              featuredSuppliers.map((supplier, idx) => (
              <div
                key={supplier.id}
                className="bg-white border rounded-lg p-4 lg:p-6 hover:shadow-lg transition-all cursor-pointer flex flex-col"
                style={{ borderColor: '#e5e5e5', minHeight: '280px' }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e5e5'}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: '#ffe8d9' }}>
                    🏭
                  </div>
                  {supplier.verified && (
                    <span className="text-green-600 text-xs bg-green-50 px-2 py-1 rounded flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
                
                {/* Supplier Name - Fixed Height */}
                <h3 className="font-semibold mb-2 line-clamp-2 h-12" style={{ color: '#2D2C2C' }}>{supplier.name}</h3>
                
                {/* Details - Fixed Height, Flex-grow for spacing */}
                <div className="space-y-1 text-xs text-gray-600 flex-grow mb-4">
                  <p>⭐ {supplier.rating} Rating</p>
                  <p>📦 {supplier.products} Products</p>
                  <p>📅 {supplier.years} Experience</p>
                  {supplier.location && <p>📍 {supplier.location}</p>}
                </div>
                
                {/* Contact Button - Always at Bottom */}
                <button
                  className="w-full py-2 border rounded-md transition-colors text-sm font-medium cursor-pointer mt-auto"
                  style={{ borderColor: '#000000', color: '#000000' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={() => {
                    window.open(`tel:9228847777`, '_self');
                  }}
                  aria-label={`Contact ${supplier.name} - Call 9228847777`}
                >
                  Contact Supplier
                </button>
              </div>
              ))
            )}
          </div>
        </div>

            {/* Features Section */}
        <div className="mt-8 lg:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 w-full">
          <div className="bg-white rounded-lg p-4 lg:p-6 border border-gray-200 shadow-sm">
            <div className="w-12 lg:w-14 h-12 lg:h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#FF6B00' }}>
              <svg className="w-6 lg:w-7 h-6 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-base lg:text-lg mb-2" style={{ color: '#0D1B2A' }}>Verified Suppliers</h3>
            <p className="text-gray-700 text-sm leading-relaxed">All suppliers are verified and quality assured</p>
          </div>
          <div className="bg-white rounded-lg p-4 lg:p-6 border border-gray-200 shadow-sm">
            <div className="w-12 lg:w-14 h-12 lg:h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#0D1B2A' }}>
              <svg className="w-6 lg:w-7 h-6 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-bold text-base lg:text-lg mb-2" style={{ color: '#0D1B2A' }}>Secure Trading</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Protected payments and buyer protection program</p>
          </div>
          <div className="bg-white rounded-lg p-4 lg:p-6 border border-gray-200 shadow-sm">
            <div className="w-12 lg:w-14 h-12 lg:h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#FF6B00' }}>
              <svg className="w-6 lg:w-7 h-6 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-base lg:text-lg mb-2" style={{ color: '#0D1B2A' }}>Quick Response</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Get quotes from suppliers within 24 hours</p>
          </div>
        </div>
          </>
        )}
      </main>

      {/* Request for Quotation Modal */}
      {showRFQModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold" style={{ color: '#2D2C2C' }}>
                Request for Quotation
              </h2>
              <button
                onClick={handleRFQClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close Request for Quotation modal"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Validation Error */}
              {rfqValidationError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{rfqValidationError}</p>
                </div>
              )}

              {/* RFQ Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={rfqForm.productName}
                    onChange={(e) => setRfqForm({ ...rfqForm, productName: e.target.value })}
                    placeholder="e.g., LED Light Bulbs, Steel Pipes, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity Required
                  </label>
                  <input
                    type="text"
                    value={rfqForm.quantity}
                    onChange={(e) => setRfqForm({ ...rfqForm, quantity: e.target.value })}
                    placeholder="e.g., 100 pieces, 500 kg, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Location
                  </label>
                  <input
                    type="text"
                    value={rfqForm.location}
                    onChange={(e) => setRfqForm({ ...rfqForm, location: e.target.value })}
                    placeholder="City, State, Country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={rfqForm.phoneNumber}
                    onChange={(e) => setRfqForm({ ...rfqForm, phoneNumber: e.target.value })}
                    placeholder="+1 234 567 8900"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handleRFQClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  aria-label="Cancel and close RFQ form"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRFQSubmit}
                  disabled={isRfqSubmitting}
                  className="flex-1 px-4 py-2 rounded-md text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: isRfqSubmitting ? '#ccc' : '#FF6B00' }}
                  onMouseOver={(e) => {
                    if (!isRfqSubmitting) {
                      e.currentTarget.style.backgroundColor = '#e55e00';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isRfqSubmitting) {
                      e.currentTarget.style.backgroundColor = '#FF6B00';
                    }
                  }}
                  aria-label="Submit request for quotation to suppliers"
                >
                  {isRfqSubmitting ? 'Sending...' : 'Submit Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Supplier Modal */}
      {showContactModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold" style={{ color: '#2D2C2C' }}>
                Contact Supplier
              </h2>
              <button
                onClick={() => setShowContactModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close contact supplier modal"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Product Details Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Details
                </label>
                <div className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                  <div className="font-medium">{selectedProduct.modifiedName || selectedProduct.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {selectedProduct.price && `Price: ${selectedProduct.price}`}
                    {selectedProduct.brand && ` • Brand: ${selectedProduct.brand}`}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Supplier: {selectedProduct.supplier.name} • {selectedProduct.supplier.location}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="space-y-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity Required
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 100 pieces, 500 kg, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Location
                  </label>
                  <input
                    type="text"
                    placeholder="City, State, Country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 234 567 8900"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  aria-label="Cancel and close contact form"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle form submission here
                    alert('Contact request sent successfully!');
                    setShowContactModal(false);
                  }}
                  className="flex-1 px-4 py-2 rounded-md text-white font-medium transition-colors"
                  style={{ backgroundColor: '#FF6B00' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e55e00'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF6B00'}
                  aria-label="Send contact request to supplier"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
