'use client';

import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="text-white mt-8 lg:mt-16" style={{ backgroundColor: '#0D1B2A' }}>
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h4 className="font-bold text-lg mb-4" style={{ color: '#FF6B00' }}>BazarGPT</h4>
            <p className="text-sm text-gray-400 mb-4">India's leading B2B marketplace with thousands of products from verified suppliers.</p>
            <div className="text-sm text-gray-400">
              <p>📞 +91-8431209936</p>
              <p>✉️ support@bazargpt.com</p>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="font-semibold mb-4">Popular Categories</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/industry/machinery" className="hover:text-[#FF6B00] transition-colors">Machinery</a></li>
              <li><a href="/industry/electronics" className="hover:text-[#FF6B00] transition-colors">Electronics</a></li>
              <li><a href="/industry/industrial-supplies" className="hover:text-[#FF6B00] transition-colors">Industrial Supplies</a></li>
              <li><a href="/industry/electrical" className="hover:text-[#FF6B00] transition-colors">Electrical</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button 
                  onClick={() => router.push('/help')} 
                  className="hover:text-[#FF6B00] transition-colors text-left"
                  aria-label="Access help center and customer support"
                >
                  Help Center
                </button>
              </li>
              <li><a href="/sitemap.xml" className="hover:text-[#FF6B00] transition-colors">Sitemap</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Business Solutions */}
          <div>
            <h4 className="font-semibold mb-4">For Business</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">List Your Products</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Supplier Registration</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Bulk Orders</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Trade Assurance</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-6 lg:pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs lg:text-sm text-gray-400">
            <p>&copy; 2024 BazarGPT. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-[#FF6B00] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#FF6B00] transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-[#FF6B00] transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}