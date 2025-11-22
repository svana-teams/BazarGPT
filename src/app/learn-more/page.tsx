'use client';

import { useRouter } from 'next/navigation';
import { Shield, CheckCircle, Lock, TrendingUp, Award, Users, CreditCard, FileText, AlertCircle, Star } from 'lucide-react';

export default function TradeAssurancePage() {
  const router = useRouter();

  const benefits = [
    {
      icon: <Shield className="w-10 h-10" />,
      title: 'Payment Protection',
      description: 'Your payments are held securely until you confirm receipt of quality products',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <CheckCircle className="w-10 h-10" />,
      title: 'Quality Assurance',
      description: 'All suppliers are verified and products are quality checked before shipping',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Lock className="w-10 h-10" />,
      title: 'Secure Transactions',
      description: '256-bit SSL encryption ensures all your financial data is completely secure',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: 'On-Time Delivery',
      description: 'Guaranteed delivery within agreed timelines or get full refund',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: 'Dispute Resolution',
      description: 'Fair and quick dispute resolution with dedicated support team',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to help with any concerns',
      color: 'from-teal-500 to-green-500'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Place Your Order',
      description: 'Select products and place your order with Trade Assurance protection'
    },
    {
      step: '2',
      title: 'Secure Payment',
      description: 'Make payment which is held securely in escrow until delivery'
    },
    {
      step: '3',
      title: 'Supplier Ships',
      description: 'Supplier processes and ships your order within agreed timeline'
    },
    {
      step: '4',
      title: 'Receive & Verify',
      description: 'Receive your products and verify quality and quantity'
    },
    {
      step: '5',
      title: 'Payment Released',
      description: 'Once confirmed, payment is released to the supplier'
    }
  ];

  const stats = [
    { number: '₹500Cr+', label: 'Protected Transactions' },
    { number: '50,000+', label: 'Happy Buyers' },
    { number: '99.8%', label: 'Success Rate' },
    { number: '24hrs', label: 'Dispute Resolution' }
  ];

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
            <li className="text-gray-900 font-semibold">Trade Assurance</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#0D1B2A] to-[#1E293B] rounded-2xl p-8 lg:p-12 text-white mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <Shield className="w-16 h-16 text-[#FF6B00]" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-center">Trade Assurance</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto text-center">
            Buy with confidence. Your payments are protected until you receive quality products on time.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100">
              <p className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#FF6B00' }}>
                {stat.number}
              </p>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#2D2C2C' }}>
            Why Choose Trade Assurance?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${benefit.color} text-white mb-4`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#2D2C2C' }}>
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#2D2C2C' }}>
            How It Works
          </h2>
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B00] to-[#e55e00] transform -translate-y-1/2 mx-20"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative">
              {howItWorks.map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 text-center hover:border-[#FF6B00] transition-all duration-300">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#e55e00] text-white text-2xl font-bold mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#2D2C2C' }}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 mb-12">
          <div className="text-center mb-8">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-[#FF6B00]" />
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#2D2C2C' }}>
              Secure Payment Options
            </h2>
            <p className="text-gray-600">We accept multiple payment methods for your convenience</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 border-2 border-gray-100 rounded-xl hover:border-[#FF6B00] transition-colors">
              <div className="text-4xl mb-2">💳</div>
              <p className="font-semibold text-gray-700">Credit Card</p>
            </div>
            <div className="text-center p-4 border-2 border-gray-100 rounded-xl hover:border-[#FF6B00] transition-colors">
              <div className="text-4xl mb-2">🏦</div>
              <p className="font-semibold text-gray-700">Bank Transfer</p>
            </div>
            <div className="text-center p-4 border-2 border-gray-100 rounded-xl hover:border-[#FF6B00] transition-colors">
              <div className="text-4xl mb-2">📱</div>
              <p className="font-semibold text-gray-700">UPI</p>
            </div>
            <div className="text-center p-4 border-2 border-gray-100 rounded-xl hover:border-[#FF6B00] transition-colors">
              <div className="text-4xl mb-2">💰</div>
              <p className="font-semibold text-gray-700">Net Banking</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: '#2D2C2C' }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold text-lg mb-2 flex items-start gap-2" style={{ color: '#2D2C2C' }}>
                <AlertCircle className="w-5 h-5 text-[#FF6B00] flex-shrink-0 mt-1" />
                Is there any extra charge for Trade Assurance?
              </h3>
              <p className="text-gray-600 ml-7">
                No, Trade Assurance is completely free for buyers. It's our way of ensuring safe transactions.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold text-lg mb-2 flex items-start gap-2" style={{ color: '#2D2C2C' }}>
                <AlertCircle className="w-5 h-5 text-[#FF6B00] flex-shrink-0 mt-1" />
                What if I receive defective products?
              </h3>
              <p className="text-gray-600 ml-7">
                You can raise a dispute within 7 days of delivery. Our team will investigate and ensure resolution.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold text-lg mb-2 flex items-start gap-2" style={{ color: '#2D2C2C' }}>
                <AlertCircle className="w-5 h-5 text-[#FF6B00] flex-shrink-0 mt-1" />
                How long does dispute resolution take?
              </h3>
              <p className="text-gray-600 ml-7">
                Most disputes are resolved within 24-48 hours. Complex cases may take up to 7 days.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#FF6B00] to-[#e55e00] rounded-2xl p-8 lg:p-12 text-white text-center">
          <Star className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to Trade Safely?</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Start buying with confidence. All orders are automatically protected with Trade Assurance.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 bg-white text-[#FF6B00] rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl transform hover:-translate-y-1"
          >
            Start Shopping Now
          </button>
        </div>
      </main>
    </div>
  );
}