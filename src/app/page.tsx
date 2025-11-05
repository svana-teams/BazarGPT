'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, Menu, ChevronDown, Mail, Phone, MapPin } from 'lucide-react';

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
  productCount: number;
}

interface Product {
  id: number;
  name: string;
  imageUrl: string | null;
  price: string | null;
  priceUnit: string | null;
  brand: string | null;
  supplier: {
    name: string;
    location: string;
  };
  category: string;
  industry: string;
}

export default function Home() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showCategories, setShowCategories] = useState(false);
  const [featuredSuppliers, setFeaturedSuppliers] = useState<Supplier[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [industriesLoading, setIndustriesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  const categories = ['All Categories', ...industries.map(industry => industry.name)];

  const popularSearches = [
    'LED lights', 'Solar panels', 'Water pump', 'Plastic mold',
    'Steel pipe', 'Motor', 'Bearing', 'Valve'
  ];

  const getIndustryIcon = (industryName: string): string => {
    const iconMap: { [key: string]: string } = {
      'Agriculture': '🌾',
      'Air Conditioning': '❄️',
      'Apparel, Clothing & Garments': '👔',
      'Bags, Handbags, Luggage Bags, Belts, Wallets and Accessories': '👜',
      'Building Construction': '🏗️',
      'Commercial Kitchen': '🍽️',
      'Cosmetics & Personal Care': '💄',
      'Dairy Equipments': '🥛',
      'Education Classes': '📚',
      'Educational & Professional Training Institutes': '🎓',
      'Electrical': '⚡',
      'Electronics': '💻',
      'Fashion Accessories & Gear': '👒',
      'Food & Beverages': '🍕',
      'Furniture': '🪑',
      'Home Appliances': '🏠',
      'Hospital Equipments': '🏥',
      'Industrial Supplies': '🏭',
      'Information Technology': '💻',
      'Interior Designing & Decoration': '🎨',
      'Machinery': '⚙️',
      'Railway, Shipping & Aviation Products, Spares & Equipment': '🚂',
      'Refrigeration': '🧊',
      'Security': '🔒',
      'Service': '🔧',
      'Sports Goods, Toys & Games': '⚽',
      'Telecom Products, Equipment & Supplies': '📡',
      'Transportation & Logistics - Services': '🚛'
    };
    return iconMap[industryName] || '📦';
  };

  const topCategories = industriesLoading 
    ? Array.from({ length: 8 }, (_, i) => ({
        name: 'Loading...',
        icon: '⏳',
        items: '...'
      }))
    : industries.slice(0, 8).map(industry => ({
        name: industry.name,
        icon: getIndustryIcon(industry.name),
        items: `${industry.productCount > 0 ? industry.productCount + ' categories' : 'Available'}`
      }));

  const handleSearch = () => {
    if (searchValue.trim()) {
      console.log('Searching for:', searchValue);
      // Add search logic here
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
      case 'trending':
        router.push('/trending');
        break;
      default:
        console.log(`View all clicked for: ${section}`);
    }
  };

  useEffect(() => {
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

    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products/featured');
        const result = await response.json();
        
        if (result.success) {
          setFeaturedProducts(result.data);
        } else {
          console.error('Failed to fetch featured products:', result.error);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchFeaturedSuppliers();
    fetchIndustries();
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#FAF8F4' }}>
      {/* Top Bar */}
      <div style={{ backgroundColor: '#0D1B2A' }} className="text-white text-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center overflow-hidden">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              +91-1800-XXX-XXXX
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              support@bizgpt.com
            </span>
          </div>
          <div className="flex gap-4">
            <button className="transition-colors" style={{ color: 'white' }} onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = 'white'}>Buyer Central</button>
            <button className="transition-colors" style={{ color: 'white' }} onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = 'white'}>Seller Central</button>
            <button className="transition-colors" style={{ color: 'white' }} onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = 'white'}>Help</button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 overflow-hidden">
          <div className="flex items-center gap-4 lg:gap-8 min-w-0">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="text-xl lg:text-2xl font-bold" style={{ color: '#FF6B00' }}>BizGPT</div>
              <div className="text-xs hidden sm:block" style={{ color: '#2D2C2C' }}>B2B Marketplace</div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 flex items-center max-w-3xl min-w-0">
              <div className="relative flex-1 flex flex-col sm:flex-row min-w-0">
                {/* Category Dropdown */}
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className="px-3 lg:px-4 py-2 lg:py-3 bg-gray-50 border border-gray-300 sm:border-r-0 rounded-md sm:rounded-l-md sm:rounded-r-none hover:bg-gray-100 flex items-center gap-2 w-full sm:min-w-[120px] lg:min-w-[160px] justify-between text-xs lg:text-sm mb-2 sm:mb-0"
                >
                  <span className="text-gray-700 truncate">{selectedCategory}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {showCategories && (
                  <div className="absolute top-full left-0 mt-1 w-[200px] lg:w-[250px] bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-y-auto z-50">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setShowCategories(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}

                {/* Search Input */}
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="What are you looking for..."
                  className="flex-1 px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 focus:outline-none text-gray-900 text-sm lg:text-base rounded-md sm:rounded-none min-w-0 w-full"
                  style={{ borderColor: '#e5e5e5' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#FF6B00'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e5'}
                />

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="px-4 lg:px-8 py-2 lg:py-3 text-white rounded-md sm:rounded-l-none sm:rounded-r-md transition-colors flex items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto justify-center sm:justify-start"
                  style={{ backgroundColor: '#FF6B00' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e55e00'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF6B00'}
                >
                  <Search className="w-4 lg:w-5 h-4 lg:h-5" />
                  <span className="font-medium text-sm lg:text-base">Search</span>
                </button>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 lg:gap-4">
              <button className="flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-2 transition-colors" style={{ color: '#2D2C2C' }} onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = '#2D2C2C'}>
                <ShoppingCart className="w-4 lg:w-5 h-4 lg:h-5" />
                <span className="text-xs lg:text-sm font-medium hidden sm:inline">Cart</span>
              </button>
              <button className="flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-2 transition-colors" style={{ color: '#2D2C2C' }} onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = '#2D2C2C'}>
                <User className="w-4 lg:w-5 h-4 lg:h-5" />
                <span className="text-xs lg:text-sm font-medium hidden sm:inline">Sign In</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ backgroundColor: '#0D1B2A' }} className="text-white hidden lg:block">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-6 py-2 text-sm">
              <button className="transition-colors font-medium" onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = 'white'}>All Categories</button>
              <button className="transition-colors" onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = 'white'}>Featured Selections</button>
              <button className="transition-colors" onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = 'white'}>Trade Assurance</button>
              <button className="transition-colors" onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = 'white'}>Buyer Protection</button>
              <button className="transition-colors" onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = 'white'}>Help Center</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 lg:py-8 overflow-hidden">
        {/* Hero Banner */}
        <div className="rounded-lg p-6 lg:p-10 mb-6 lg:mb-8" style={{ backgroundColor: '#0D1B2A' }}>
          <h1 className="text-2xl lg:text-4xl font-bold mb-3" style={{ color: '#f0f0f0' }}>Find Quality Products from Verified Suppliers</h1>
          <p className="mb-6 text-base lg:text-lg" style={{ color: '#e0e0e0' }}>Connect with millions of B2B buyers and sellers worldwide</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="px-6 lg:px-8 py-3 rounded-md font-semibold transition-all shadow-md hover:shadow-lg text-sm lg:text-base"
              style={{ backgroundColor: '#FF6B00', color: 'white' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e55e00'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF6B00'}
            >
              Request for Quotation
            </button>
            <button
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
                className="px-4 py-2 bg-white border rounded-full text-sm transition-all shadow-sm"
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
              onClick={() => handleViewAll('industries')}
              className="font-medium text-sm flex items-center gap-1 transition-colors"
              style={{ color: '#FF6B00' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#e55e00'}
              onMouseOut={(e) => e.currentTarget.style.color = '#FF6B00'}
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 w-full">
            {topCategories.map((category, index) => (
              <div
                key={industriesLoading ? `loading-${index}` : category.name}
                className="bg-white border rounded-lg p-4 lg:p-6 hover:shadow-lg transition-all cursor-pointer group"
                style={{ borderColor: '#e5e5e5' }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#FF6B00'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e5e5'}
                onClick={() => handleIndustryClick(category.name)}
              >
                <div className="text-3xl lg:text-4xl mb-2 lg:mb-3">{category.icon}</div>
                <h3 className="font-semibold mb-1 transition-colors group-hover:text-[#FF6B00] text-sm lg:text-base truncate" style={{ color: '#2D2C2C' }}>
                  {category.name}
                </h3>
                <p className="text-xs lg:text-sm text-gray-500">{category.items}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-xl lg:text-2xl font-bold" style={{ color: '#2D2C2C' }}>Top Products</h2>
            <button
              onClick={() => handleViewAll('products')}
              className="font-medium text-sm flex items-center gap-1 transition-colors"
              style={{ color: '#FF6B00' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#e55e00'}
              onMouseOut={(e) => e.currentTarget.style.color = '#FF6B00'}
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4 w-full">
            {productsLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
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
              featuredProducts.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="bg-gray-100 h-32 lg:h-40 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`text-4xl lg:text-6xl ${product.imageUrl ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                      📦
                    </div>
                  </div>
                  <div className="p-3 lg:p-4">
                    <h3 className="font-medium mb-2 text-xs lg:text-sm line-clamp-2 transition-colors group-hover:text-[#FF6B00]" style={{ color: '#2D2C2C' }}>
                      {product.name}
                    </h3>
                    <p className="font-bold text-sm lg:text-base mb-1" style={{ color: '#FF6B00' }}>
                      {product.price ? `${product.price}${product.priceUnit ? `/${product.priceUnit}` : ''}` : 'Price on request'}
                    </p>
                    {product.brand && (
                      <p className="text-xs text-gray-500 mb-2">Brand: {product.brand}</p>
                    )}
                    <p className="text-xs text-gray-600 truncate">{product.supplier.name}</p>
                    <p className="text-xs text-gray-500 truncate">{product.supplier.location}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Promotional Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8 lg:mb-12">
          <div className="rounded-lg p-4 lg:p-6 flex flex-col lg:flex-row items-center justify-between border-2" style={{ backgroundColor: '#e6f7ff', borderColor: '#00C8FF' }}>
            <div className="text-center lg:text-left mb-4 lg:mb-0">
              <h3 className="text-lg lg:text-xl font-bold mb-2" style={{ color: '#0D1B2A' }}>Get Your First Order</h3>
              <p className="mb-3 text-sm lg:text-base text-gray-700">Special discount for new buyers</p>
              <button
                className="px-5 py-2 rounded-md font-semibold transition-all text-sm text-white shadow-sm"
                style={{ backgroundColor: '#00C8FF' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0096cc'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#00C8FF'}
              >
                Claim Offer
              </button>
            </div>
            <div className="text-4xl lg:text-6xl">🎁</div>
          </div>
          <div className="rounded-lg p-4 lg:p-6 flex flex-col lg:flex-row items-center justify-between border-2" style={{ backgroundColor: '#ffe8d9', borderColor: '#FF6B00' }}>
            <div className="text-center lg:text-left mb-4 lg:mb-0">
              <h3 className="text-lg lg:text-xl font-bold mb-2" style={{ color: '#0D1B2A' }}>Trade Assurance</h3>
              <p className="mb-3 text-sm lg:text-base text-gray-700">Protected payment for safe trading</p>
              <button
                className="px-5 py-2 rounded-md font-semibold transition-all text-sm text-white shadow-sm"
                style={{ backgroundColor: '#FF6B00' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e55e00'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF6B00'}
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
              onClick={() => handleViewAll('suppliers')}
              className="font-medium text-sm flex items-center gap-1 transition-colors"
              style={{ color: '#FF6B00' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#e55e00'}
              onMouseOut={(e) => e.currentTarget.style.color = '#FF6B00'}
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white border rounded-lg p-4 lg:p-6 animate-pulse"
                  style={{ borderColor: '#e5e5e5' }}
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
                className="bg-white border rounded-lg p-4 lg:p-6 hover:shadow-lg transition-all cursor-pointer"
                style={{ borderColor: '#e5e5e5' }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#FF6B00'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e5e5'}
              >
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
                <h3 className="font-semibold mb-2 line-clamp-2" style={{ color: '#2D2C2C' }}>{supplier.name}</h3>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>⭐ {supplier.rating} Rating</p>
                  <p>📦 {supplier.products} Products</p>
                  <p>📅 {supplier.years} Experience</p>
                  {supplier.location && <p>📍 {supplier.location}</p>}
                </div>
                <button
                  className="mt-4 w-full py-2 border rounded-md transition-colors text-sm font-medium"
                  style={{ borderColor: '#FF6B00', color: '#FF6B00' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ffe8d9'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={() => {
                    if (supplier.mobile) {
                      window.open(`tel:${supplier.mobile}`, '_self');
                    }
                  }}
                >
                  Contact Supplier
                </button>
              </div>
              ))
            )}
          </div>
        </div>

        {/* Trending Products */}
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-xl lg:text-2xl font-bold" style={{ color: '#2D2C2C' }}>Trending This Week</h2>
            <button
              onClick={() => handleViewAll('trending')}
              className="font-medium text-sm flex items-center gap-1 transition-colors"
              style={{ color: '#FF6B00' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#e55e00'}
              onMouseOut={(e) => e.currentTarget.style.color = '#FF6B00'}
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
            {[
              { name: 'Solar Panel 300W', price: '$85-$150', image: '☀️' },
              { name: 'CNC Machine', price: '$8,500-$25,000', image: '🔩' },
              { name: 'Air Compressor', price: '$450-$1,200', image: '💨' },
              { name: 'Hydraulic Press', price: '$3,500-$12,000', image: '🏭' },
              { name: 'Conveyor Belt', price: '$280-$850', image: '📦' },
              { name: 'LED Display', price: '$120-$450', image: '📺' },
            ].map((product, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="bg-gray-50 h-24 lg:h-32 flex items-center justify-center text-3xl lg:text-5xl group-hover:bg-gray-100 transition-colors">
                  {product.image}
                </div>
                <div className="p-2 lg:p-3">
                  <h3 className="font-medium text-xs mb-1 line-clamp-2 transition-colors group-hover:text-[#FF6B00]" style={{ color: '#2D2C2C' }}>
                    {product.name}
                  </h3>
                  <p className="font-bold text-xs lg:text-sm" style={{ color: '#FF6B00' }}>{product.price}</p>
                </div>
              </div>
            ))}
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
      </main>

      {/* Footer */}
      <footer className="text-white mt-8 lg:mt-16" style={{ backgroundColor: '#0D1B2A' }}>
        <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full">
            <div>
              <h4 className="font-semibold mb-4">About Us</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="transition-colors" onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}>Company Profile</a></li>
                <li><a href="#" className="transition-colors" onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}>Contact Us</a></li>
                <li><a href="#" className="transition-colors" onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}>Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Buyers</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="transition-colors" onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}>Post Buying Request</a></li>
                <li><a href="#" className="transition-colors" onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}>Browse Products</a></li>
                <li><a href="#" className="transition-colors" onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}>Buyer Protection</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Suppliers</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="transition-colors" onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}>Sell on BizGPT</a></li>
                <li><a href="#" className="transition-colors" onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}>Supplier Membership</a></li>
                <li><a href="#" className="transition-colors" onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}>Learning Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Help & Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="transition-colors" onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}>Help Center</a></li>
                <li><a href="#" className="transition-colors" onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}>Report Abuse</a></li>
                <li><a href="#" className="transition-colors" onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}>Submit Dispute</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-6 lg:mt-8 pt-6 lg:pt-8 text-center text-xs lg:text-sm text-gray-400" style={{ borderTop: '1px solid #1a2f47' }}>
            <p>&copy; 2024 BizGPT. All rights reserved.</p>
            <p className="mt-2 lg:mt-0 lg:inline"> | Privacy Policy | Terms of Use</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
