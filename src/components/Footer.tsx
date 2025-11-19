'use client';

import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="text-white mt-8 lg:mt-16" style={{ backgroundColor: '#0D1B2A' }}>
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="flex justify-center">
          <div>
            <h4 className="font-semibold mb-4 text-center">Help & Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button 
                  onClick={() => router.push('/help')} 
                  className="transition-colors" 
                  onMouseOver={(e) => e.currentTarget.style.color = '#FF6B00'} 
                  onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
                  aria-label="Access help center and customer support"
                >
                  Help Center
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 lg:mt-8 pt-6 lg:pt-8 text-center text-xs lg:text-sm text-gray-400" style={{ borderTop: '1px solid #1a2f47' }}>
          <p>&copy; 2024 BazarGPT. All rights reserved.</p>
          <p className="mt-2 lg:mt-0 lg:inline"> | Privacy Policy | Terms of Use</p>
        </div>
      </div>
    </footer>
  );
}