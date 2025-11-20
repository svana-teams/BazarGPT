'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, X, Building2, MapPin } from 'lucide-react';

interface Supplier {
  id: number;
  name: string;
  location: string;
  email: string | null;
  phone: string | null;
}

interface SimilarProduct {
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
}

interface ProductData {
  id: number;
  name: string;
  imageUrl: string | null;
  price: string | null;
  priceUnit: string | null;
  brand: string | null;
  specifications: any;
  description: string | null;
  supplier: Supplier;
  breadcrumb: {
    sector: string;
    category: string;
    subcategory: string;
  };
  similarProducts: SimilarProduct[];
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    quantity: '',
    location: '',
    phoneNumber: ''
  });
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productId = searchParams.get('id');
        
        console.log('Product page loaded with ID:', productId);
        
        if (!productId) {
          setError('Product ID not provided');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/products/${productId}`);
        console.log('API Response status:', response.status);
        
        const result = await response.json();
        console.log('API Result:', result);
        
        if (result.success) {
          setProductData(result.data);
        } else {
          setError(result.error || 'Failed to fetch product data');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Error fetching product data');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [searchParams]);

  const handleContactSupplier = () => {
    setShowContactModal(true);
  };

  const handleCloseModal = () => {
    setShowContactModal(false);
    setContactForm({
      quantity: '',
      location: '',
      phoneNumber: ''
    });
    setValidationError('');
    setIsSubmitting(false);
  };

  const handleSubmitContact = async () => {
    setValidationError('');

    if (!contactForm.phoneNumber.trim()) {
      setValidationError('Please enter your phone number');
      return;
    }

    if (!productData) {
      setValidationError('Product information is missing');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productData.id,
          supplierId: productData.supplier.id,
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

  const handleSimilarProductClick = (product: SimilarProduct) => {
    const slug = product.name
      .toLowerCase()
      .replace(/[&]/g, 'and')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    console.log('Navigating to similar product:', slug, product.id);
    router.push(`/product/${slug}?id=${product.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FAF8F4' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FAF8F4' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
            <p className="text-gray-600">{error || 'The requested product could not be found.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF8F4' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Breadcrumb */}
        <div className="text-xs sm:text-sm text-gray-500 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => router.push('/')}
              className="hover:text-gray-800 transition-colors"
            >
              Home
            </button>
            <span>→</span>
            <span className="hover:text-gray-800 transition-colors cursor-pointer">
              {productData.breadcrumb.sector}
            </span>
            <span>→</span>
            <span className="hover:text-gray-800 transition-colors cursor-pointer">
              {productData.breadcrumb.category}
            </span>
            <span>→</span>
            <button 
              onClick={() => router.back()}
              className="hover:text-gray-800 transition-colors"
            >
              {productData.breadcrumb.subcategory}
            </button>
            <span>→</span>
            <span className="text-gray-700 font-medium">{productData.name}</span>
          </div>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Product Image */}
          <div className="bg-white rounded-lg p-6 lg:p-8 border border-gray-200 flex items-center justify-center">
            <div className="w-full aspect-square flex items-center justify-center">
              {productData.imageUrl ? (
                <img
                  src={productData.imageUrl}
                  alt={productData.name}
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
              <div className={`text-9xl ${productData.imageUrl ? 'hidden' : 'flex'} items-center justify-center`}>
                📦
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3" style={{ color: '#2D2C2C' }}>
                {productData.name}
              </h1>
              <p className="text-3xl font-bold mb-4" style={{ color: '#1f2937' }}>
                {productData.price ? `${productData.price}${productData.priceUnit ? `/${productData.priceUnit}` : ''}` : 'Price on request'}
              </p>
              {productData.brand && (
                <p className="text-lg text-gray-600 mb-2">
                  <span className="font-medium">Brand:</span> {productData.brand}
                </p>
              )}
            </div>

            {/* Supplier Information */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Supplier Information
              </h3>
              <div className="space-y-2">
                <p className="text-gray-800 font-medium">{productData.supplier.name}</p>
                <p className="text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {productData.supplier.location}
                </p>
              </div>
            </div>

            {/* Contact Button */}
            <button
              onClick={handleContactSupplier}
              className="w-full py-4 rounded-lg text-white font-semibold text-lg transition-all hover:shadow-lg"
              style={{ backgroundColor: '#1f2937' }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#374151';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#1f2937';
              }}
            >
              Contact Supplier
            </button>

            {/* Description */}
            {productData.description && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{productData.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Specifications */}
        {productData.specifications && Object.keys(productData.specifications).length > 0 && (
          <div className="bg-white rounded-lg p-6 lg:p-8 border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#2D2C2C' }}>
              Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(productData.specifications).map(([key, value]) => (
                <div key={key} className="flex py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-700 w-1/2">{key}:</span>
                  <span className="text-gray-600 w-1/2">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Products */}
        {productData.similarProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#2D2C2C' }}>
              Similar Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productData.similarProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSimilarProductClick(product)}
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
                    <h3 className="font-medium mb-2 text-sm line-clamp-2" style={{ color: '#2D2C2C' }}>
                      {product.name}
                    </h3>
                    <p className="font-bold text-base mb-2" style={{ color: '#1f2937' }}>
                      {product.price ? `${product.price}${product.priceUnit ? `/${product.priceUnit}` : ''}` : 'Price on request'}
                    </p>
                    {product.brand && (
                      <p className="text-xs text-gray-500 mb-1">Brand: {product.brand}</p>
                    )}
                    <p className="text-xs text-gray-600 truncate">{product.supplier.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto mx-4">
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

              <div className="p-6">
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Product Details</h3>
                  <p className="text-sm text-gray-600 mb-1">{productData.name}</p>
                  <p className="text-sm font-semibold" style={{ color: '#1f2937' }}>
                    {productData.price ? `${productData.price}${productData.priceUnit ? `/${productData.priceUnit}` : ''}` : 'Price on request'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Supplier: {productData.supplier.name} - {productData.supplier.location}
                  </p>
                </div>

                {validationError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{validationError}</p>
                  </div>
                )}

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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>
                </div>

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
                    style={{ backgroundColor: isSubmitting ? '#ccc' : '#1f2937' }}
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
