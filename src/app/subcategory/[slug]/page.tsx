'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Filter, Grid, List, X } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  imageUrl: string | null;
  price: string | null;
  priceUnit: string | null;
  brand: string | null;
  specifications: any;
  supplierId: number;
  supplier: {
    id?: number;
    name: string;
    location: string;
  };
}

interface SubcategoryData {
  id: number;
  name: string;
  category: {
    name: string;
    sector: {
      name: string;
    };
  };
  products: Product[];
  totalProducts: number;
}

export default function SubcategoryPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [subcategoryData, setSubcategoryData] = useState<SubcategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [contactForm, setContactForm] = useState({
    quantity: '',
    location: '',
    phoneNumber: ''
  });
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSubcategoryData = async () => {
      try {
        const subcategoryId = searchParams.get('id');
        
        if (!subcategoryId) {
          setError('Subcategory ID not provided');
          return;
        }

        const response = await fetch(`/api/subcategory/${subcategoryId}`);
        const result = await response.json();
        
        if (result.success) {
          setSubcategoryData(result.data);
        } else {
          setError(result.error || 'Failed to fetch subcategory data');
        }
      } catch (err) {
        setError('Error fetching subcategory data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategoryData();
  }, [searchParams]);

  const handleContactSupplier = (product: Product) => {
    setSelectedProduct(product);
    setShowContactModal(true);
  };

  const handleCloseModal = () => {
    setShowContactModal(false);
    setSelectedProduct(null);
    setContactForm({
      quantity: '',
      location: '',
      phoneNumber: ''
    });
    setValidationError('');
    setIsSubmitting(false);
  };

  const handleSubmitContact = async () => {
    // Clear previous validation error
    setValidationError('');

    // Only phone number is mandatory
    if (!contactForm.phoneNumber.trim()) {
      setValidationError('Please enter your phone number');
      return;
    }

    if (!selectedProduct) {
      setValidationError('Product information is missing');
      return;
    }

    if (!selectedProduct.supplier.id && !selectedProduct.supplierId) {
      setValidationError('Supplier information is missing');
      return;
    }

    setIsSubmitting(true);

    // Debug logging
    console.log('Selected product:', selectedProduct);
    console.log('Supplier ID:', selectedProduct.supplier.id);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          supplierId: selectedProduct.supplier.id || selectedProduct.supplierId,
          quantity: contactForm.quantity.trim() || null,
          location: contactForm.location.trim() || null,
          phoneNumber: contactForm.phoneNumber.trim()
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('Your contact request has been sent to the supplier!');
        handleCloseModal();
      } else {
        setValidationError(result.error || 'Failed to submit enquiry');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setValidationError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FAF8F4' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 border">
                  <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !subcategoryData) {
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
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Subcategory Not Found</h1>
            <p className="text-gray-600">{error || 'The requested subcategory could not be found.'}</p>
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
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-4">
            <button 
              onClick={() => router.push('/')}
              className="hover:text-orange-600 transition-colors cursor-pointer"
            >
              Home
            </button>
            {' → '}
            <button 
              onClick={() => {
                const sectorSlug = subcategoryData.category.sector.name
                  .toLowerCase()
                  .replace(/[&]/g, 'and')
                  .replace(/[^a-z0-9\s]/g, '')
                  .replace(/\s+/g, '-')
                  .replace(/-+/g, '-')
                  .replace(/^-|-$/g, '');
                router.push(`/industry/${sectorSlug}`);
              }}
              className="hover:text-orange-600 transition-colors cursor-pointer"
            >
              {subcategoryData.category.sector.name}
            </button>
            {' → '}
            <button 
              onClick={() => {
                const sectorSlug = subcategoryData.category.sector.name
                  .toLowerCase()
                  .replace(/[&]/g, 'and')
                  .replace(/[^a-z0-9\s]/g, '')
                  .replace(/\s+/g, '-')
                  .replace(/-+/g, '-')
                  .replace(/^-|-$/g, '');
                router.push(`/industry/${sectorSlug}`);
              }}
              className="hover:text-orange-600 transition-colors cursor-pointer"
            >
              {subcategoryData.category.name}
            </button>
            {' → '}
            <span className="text-gray-700">{subcategoryData.name}</span>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#2D2C2C' }}>
            {subcategoryData.name}
          </h1>
          <p className="text-gray-600">
            {subcategoryData.totalProducts} products available
          </p>
        </div>

        {/* Main Content Area */}
        <div className="flex gap-6">
          {/* Left Sidebar - Filter Space */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium text-gray-800 mb-4">Filters</h3>
              <p className="text-sm text-gray-500">Filter options will be available here</p>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1">
            {/* View Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">
                Showing {subcategoryData.products.length} of {subcategoryData.totalProducts} products
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {subcategoryData.products.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
            {subcategoryData.products.map((product) => (
              viewMode === 'grid' ? (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="bg-gray-100 h-48 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div className={`text-6xl ${product.imageUrl ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                      📦
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2 text-sm line-clamp-2 transition-colors group-hover:text-[#FF6B00]" style={{ color: '#2D2C2C' }}>
                      {product.name}
                    </h3>
                    <p className="font-bold text-base mb-2" style={{ color: '#FF6B00' }}>
                      {product.price ? `${product.price}${product.priceUnit ? `/${product.priceUnit}` : ''}` : 'Price on request'}
                    </p>
                    {product.brand && (
                      <p className="text-xs text-gray-500 mb-2">Brand: {product.brand}</p>
                    )}
                    <p className="text-xs text-gray-600 truncate">{product.supplier.name}</p>
                    <p className="text-xs text-gray-500 truncate mb-3">{product.supplier.location}</p>
                    <button
                      className="w-full py-2 border rounded-md transition-colors text-sm font-medium"
                      style={{ borderColor: '#FF6B00', color: '#FF6B00' }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffe8d9';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      onClick={() => handleContactSupplier(product)}
                    >
                      Contact supplier
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="max-w-full max-h-full object-contain rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div className={`text-2xl ${product.imageUrl ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                        📦
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium mb-1 text-gray-800 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="font-bold text-lg mb-2" style={{ color: '#FF6B00' }}>
                        {product.price ? `${product.price}${product.priceUnit ? `/${product.priceUnit}` : ''}` : 'Price on request'}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        {product.brand && <span>Brand: {product.brand}</span>}
                        <span>{product.supplier.name}</span>
                        <span>{product.supplier.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <button
                        className="px-6 py-2 border rounded-md transition-colors text-sm font-medium"
                        style={{ borderColor: '#FF6B00', color: '#FF6B00' }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffe8d9';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        onClick={() => handleContactSupplier(product)}
                      >
                        Contact supplier
                      </button>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h2>
            <p className="text-gray-600">This subcategory doesn't have any products yet.</p>
          </div>
        )}
          </div>
        </div>

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
                  onClick={handleCloseModal}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Product Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Product Details</h3>
                  <p className="text-sm text-gray-600 mb-1">{selectedProduct.name}</p>
                  <p className="text-sm font-semibold" style={{ color: '#FF6B00' }}>
                    {selectedProduct.price ? `${selectedProduct.price}${selectedProduct.priceUnit ? `/${selectedProduct.priceUnit}` : ''}` : 'Price on request'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Supplier: {selectedProduct.supplier.name} - {selectedProduct.supplier.location}
                  </p>
                </div>

                {/* Validation Error */}
                {validationError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{validationError}</p>
                  </div>
                )}

                {/* Contact Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity Required
                    </label>
                    <input
                      type="text"
                      value={contactForm.quantity}
                      onChange={(e) => setContactForm({ ...contactForm, quantity: e.target.value })}
                      placeholder="e.g., 100 pieces, 500 kg, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Location
                    </label>
                    <input
                      type="text"
                      value={contactForm.location}
                      onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })}
                      placeholder="City, State, Country"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={contactForm.phoneNumber}
                      onChange={(e) => setContactForm({ ...contactForm, phoneNumber: e.target.value })}
                      placeholder="+1 234 567 8900"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitContact}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 rounded-md text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: isSubmitting ? '#ccc' : '#FF6B00' }}
                    onMouseOver={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.backgroundColor = '#e55e00';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.backgroundColor = '#FF6B00';
                      }
                    }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Request'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}