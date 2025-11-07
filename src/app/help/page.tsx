'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, ArrowRight, HelpCircle, MessageCircle, Phone, Mail } from 'lucide-react';

interface SimilarItem {
  id: number;
  name: string;
  category: string;
  imageEmoji: string;
  priceRange: string;
  suppliersCount: number;
}

interface HelpCategory {
  id: number;
  title: string;
  description: string;
  icon: string;
  itemsCount: number;
}

export default function HelpPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');

  const similarItems: SimilarItem[] = [
    { id: 1, name: 'Solar Panels 300W', category: 'Electronics', imageEmoji: '☀️', priceRange: '$85-$150', suppliersCount: 1250 },
    { id: 2, name: 'CNC Machines', category: 'Machinery', imageEmoji: '⚙️', priceRange: '$8,500-$25,000', suppliersCount: 850 },
    { id: 3, name: 'Air Compressors', category: 'Industrial Equipment', imageEmoji: '💨', priceRange: '$450-$1,200', suppliersCount: 620 },
    { id: 4, name: 'LED Strip Lights', category: 'Electrical', imageEmoji: '💡', priceRange: '$12-$45', suppliersCount: 1850 },
    { id: 5, name: 'Water Pumps', category: 'Agriculture', imageEmoji: '💧', priceRange: '$180-$850', suppliersCount: 920 },
    { id: 6, name: 'Plastic Injection Molds', category: 'Manufacturing', imageEmoji: '🔧', priceRange: '$2,500-$15,000', suppliersCount: 450 },
    { id: 7, name: 'Steel Pipes', category: 'Construction', imageEmoji: '🏗️', priceRange: '$380-$1,200', suppliersCount: 750 },
    { id: 8, name: 'Electric Motors', category: 'Electrical', imageEmoji: '⚡', priceRange: '$125-$850', suppliersCount: 1150 },
  ];

  const helpCategories: HelpCategory[] = [
    { id: 1, title: 'Getting Started', description: 'Learn the basics of using BazarGPT', icon: '🚀', itemsCount: 12 },
    { id: 2, title: 'Finding Suppliers', description: 'How to search and connect with suppliers', icon: '🔍', itemsCount: 8 },
    { id: 3, title: 'Product Sourcing', description: 'Tips for effective product sourcing', icon: '📦', itemsCount: 15 },
    { id: 4, title: 'Payment & Security', description: 'Safe payment methods and security tips', icon: '🛡️', itemsCount: 6 },
    { id: 5, title: 'Order Management', description: 'Managing your orders and shipments', icon: '📋', itemsCount: 10 },
    { id: 6, title: 'Quality Control', description: 'Ensuring product quality and inspections', icon: '✅', itemsCount: 9 },
  ];

  const popularSearches = [
    'How to verify suppliers?',
    'Payment methods',
    'Shipping options',
    'Return policy',
    'Trade assurance',
    'Quality inspection',
    'Bulk pricing',
    'Custom manufacturing'
  ];

  const handleSearch = () => {
    if (searchValue.trim()) {
      console.log('Searching help for:', searchValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF8F4' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center gap-2"
            >
              <div className="text-2xl font-bold" style={{ color: '#FF6B00' }}>BazarGPT</div>
              <div className="text-sm" style={{ color: '#2D2C2C' }}>Help Center</div>
            </button>
            <div className="flex items-center gap-4">
              <button className="text-sm transition-colors" style={{ color: '#2D2C2C' }} onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} onMouseOut={(e) => e.currentTarget.style.color = '#2D2C2C'}>
                Contact Support
              </button>
              <button 
                onClick={() => router.push('/')}
                className="px-4 py-2 text-sm bg-gray-100 rounded-md transition-colors hover:bg-gray-200"
              >
                Back to BazarGPT
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="py-12" style={{ backgroundColor: '#0D1B2A' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">How can we help you?</h1>
          <p className="text-lg text-gray-300 mb-8">Find answers to your questions and discover similar products</p>
          
          {/* Search Bar */}
          <div className="flex max-w-2xl mx-auto">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for help topics, products, or suppliers..."
              className="flex-1 px-6 py-4 border border-gray-300 rounded-l-lg text-gray-900 text-lg focus:outline-none focus:border-orange-500"
            />
            <button
              onClick={handleSearch}
              className="px-8 py-4 text-white rounded-r-lg transition-colors"
              style={{ backgroundColor: '#FF6B00' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e55e00'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF6B00'}
            >
              <Search className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Popular Searches */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#2D2C2C' }}>Popular Help Topics:</h2>
          <div className="flex flex-wrap gap-3">
            {popularSearches.map((term, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-white border rounded-full text-sm transition-all shadow-sm"
                style={{ borderColor: '#d1d5db', color: '#2D2C2C' }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#FF6B00';
                  e.currentTarget.style.color = '#FF6B00';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.color = '#2D2C2C';
                }}
                onClick={() => setSearchValue(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Help Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#2D2C2C' }}>Browse Help Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer group"
                style={{ borderColor: '#e5e5e5' }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#FF6B00'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e5e5'}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{category.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2 group-hover:text-[#FF6B00] transition-colors" style={{ color: '#2D2C2C' }}>
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{category.itemsCount} articles</span>
                      <ArrowRight className="w-4 h-4 group-hover:text-[#FF6B00] transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Items Section - Main Feature */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: '#2D2C2C' }}>Explore Similar Items</h2>
            <button
              className="font-medium text-sm flex items-center gap-1 transition-colors"
              style={{ color: '#FF6B00' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#e55e00'}
              onMouseOut={(e) => e.currentTarget.style.color = '#FF6B00'}
            >
              View All Categories
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {similarItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                style={{ borderColor: '#e5e5e5' }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#FF6B00'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e5e5'}
              >
                <div className="bg-gray-50 h-32 flex items-center justify-center text-4xl group-hover:bg-gray-100 transition-colors">
                  {item.imageEmoji}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 group-hover:text-[#FF6B00] transition-colors" style={{ color: '#2D2C2C' }}>
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">{item.category}</p>
                  <p className="font-bold text-sm mb-2" style={{ color: '#FF6B00' }}>{item.priceRange}</p>
                  <p className="text-xs text-gray-500">{item.suppliersCount.toLocaleString()} suppliers</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="bg-white rounded-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#2D2C2C' }}>Still need help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#ffe8d9' }}>
                <MessageCircle className="w-8 h-8" style={{ color: '#FF6B00' }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#2D2C2C' }}>Live Chat</h3>
              <p className="text-sm text-gray-600 mb-4">Chat with our support team</p>
              <button
                className="px-6 py-2 border rounded-md transition-colors text-sm"
                style={{ borderColor: '#FF6B00', color: '#FF6B00' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ffe8d9'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Start Chat
              </button>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#e6f7ff' }}>
                <Phone className="w-8 h-8" style={{ color: '#00C8FF' }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#2D2C2C' }}>Phone Support</h3>
              <p className="text-sm text-gray-600 mb-4">Call us for immediate help</p>
              <button
                className="px-6 py-2 border rounded-md transition-colors text-sm"
                style={{ borderColor: '#00C8FF', color: '#00C8FF' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e6f7ff'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                +91-1800-XXX-XXXX
              </button>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f0f9ff' }}>
                <Mail className="w-8 h-8" style={{ color: '#0D1B2A' }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#2D2C2C' }}>Email Support</h3>
              <p className="text-sm text-gray-600 mb-4">Send us a detailed message</p>
              <button
                className="px-6 py-2 border rounded-md transition-colors text-sm"
                style={{ borderColor: '#0D1B2A', color: '#0D1B2A' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                support@bazargpt.com
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-white mt-16" style={{ backgroundColor: '#0D1B2A' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-400">
            <p>&copy; 2024 BazarGPT Help Center. All rights reserved.</p>
            <div className="mt-2">
              <button 
                onClick={() => router.push('/')}
                className="transition-colors mr-4" 
                onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} 
                onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                Back to BazarGPT
              </button>
              <span>|</span>
              <button 
                className="transition-colors ml-4" 
                onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} 
                onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                Privacy Policy
              </button>
              <span className="mx-2">|</span>
              <button 
                className="transition-colors" 
                onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} 
                onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                Terms of Use
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}