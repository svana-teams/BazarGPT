'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Gift, Star, CheckCircle, Tag, TrendingUp, Users, Zap, Phone, Mail } from 'lucide-react';

export default function ClaimOfferPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    businessType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const offers = [
    {
      id: 1,
      title: '25% Off on First Order',
      description: 'Get instant 25% discount on your first purchase above ₹50,000',
      icon: <Tag className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500',
      terms: ['Valid for first-time buyers', 'Minimum order value ₹50,000', 'Valid for 30 days']
    },
    {
      id: 2,
      title: 'Free Shipping',
      description: 'Enjoy free shipping on orders above ₹25,000 across India',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'from-blue-500 to-purple-500',
      terms: ['All India delivery', 'No weight limit', 'Valid for 60 days']
    },
    {
      id: 3,
      title: 'Priority Support',
      description: 'Get dedicated account manager and 24/7 priority customer support',
      icon: <Users className="w-8 h-8" />,
      color: 'from-green-500 to-teal-500',
      terms: ['Dedicated manager', '24/7 support', 'Lifetime benefit']
    },
    {
      id: 4,
      title: 'Extended Credit Terms',
      description: 'Flexible payment terms up to 60 days for verified businesses',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-indigo-500 to-purple-500',
      terms: ['Up to 60 days credit', 'No interest', 'Subject to verification']
    }
  ];

  const handleSubmit = () => {
    if (!formData.companyName || !formData.contactPerson || !formData.email || !formData.phone || !formData.businessType) {
      alert('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setShowSuccess(true);
      setIsSubmitting(false);
      
      setTimeout(() => {
        router.push('/');
      }, 3000);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF8F4' }}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Offer Claimed Successfully! 🎉</h2>
          <p className="text-gray-600 text-lg mb-4">
            Our team will contact you within 24 hours to activate your benefits
          </p>
          <p className="text-sm text-gray-500">Redirecting to homepage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF8F4' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
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
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
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
            <li className="text-gray-900 font-semibold">Special Offers</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#FF6B00] to-[#e55e00] rounded-2xl p-8 lg:p-12 text-white mb-12 text-center">
          <Gift className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Exclusive Offers for New Buyers</h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            Get started with amazing benefits designed to help your business grow
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${offer.color} text-white mb-4`}>
                {offer.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#2D2C2C' }}>
                {offer.title}
              </h3>
              <p className="text-gray-600 mb-4 text-lg">{offer.description}</p>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Terms & Conditions:</p>
                <ul className="space-y-1">
                  {offer.terms.map((term, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <Star className="w-4 h-4 text-[#FF6B00] flex-shrink-0 mt-0.5" />
                      {term}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Claim Form */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#2D2C2C' }}>
              Claim Your Offers Now
            </h2>
            <p className="text-gray-600">Fill in your details and our team will activate all benefits for you</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Enter your company name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B00] transition-colors text-gray-900 bg-gray-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Contact Person *
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Your full name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B00] transition-colors text-gray-900 bg-gray-50 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B00] transition-colors text-gray-900 bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B00] transition-colors text-gray-900 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Business Type *
              </label>
              <select
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B00] transition-colors text-gray-900 bg-gray-50 focus:bg-white"
              >
                <option value="">Select business type</option>
                <option value="manufacturer">Manufacturer</option>
                <option value="wholesaler">Wholesaler</option>
                <option value="retailer">Retailer</option>
                <option value="distributor">Distributor</option>
                <option value="trader">Trader</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
              style={{ backgroundColor: isSubmitting ? '#ccc' : '#FF6B00' }}
              onMouseOver={(e) => {
                if (!isSubmitting) e.currentTarget.style.backgroundColor = '#e55e00';
              }}
              onMouseOut={(e) => {
                if (!isSubmitting) e.currentTarget.style.backgroundColor = '#FF6B00';
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </span>
              ) : (
                'Claim All Offers'
              )}
            </button>

            <p className="text-sm text-gray-500 text-center">
              By submitting, you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}