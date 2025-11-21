import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "../components/Footer";
import CriticalCSS from "../components/CriticalCSS";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "BazarGPT - Find B2B Products & Verified Suppliers | AI-Powered Marketplace",
  description: "Discover thousands of industrial products from verified suppliers on BazarGPT. Get instant quotes for machinery, equipment, electronics & more. AI-powered search for B2B procurement.",
  keywords: "B2B marketplace, industrial products, suppliers, machinery, equipment, electronics, manufacturing, procurement, quotes, verified suppliers",
  openGraph: {
    title: "BazarGPT - Find B2B Products & Verified Suppliers",
    description: "Discover thousands of industrial products from verified suppliers. Get instant quotes for machinery, equipment, electronics & more.",
    url: "https://bazargpt.com",
    siteName: "BazarGPT",
    type: "website",
    images: [
      {
        url: "/logo1.png",
        width: 1008,
        height: 391,
        alt: "BazarGPT - B2B Marketplace"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "BazarGPT - Find B2B Products & Verified Suppliers",
    description: "Discover thousands of industrial products from verified suppliers. Get instant quotes for machinery, equipment, electronics & more.",
    images: ["/logo1.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://bazargpt.com",
  },
  verification: {
    google: "your-google-site-verification-code",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/logo1.png" as="image" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" as="style" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap" as="style" />
        
        {/* Performance hints for critical request chains */}
        <link rel="preload" href="/_next/static/chunks/webpack.js" as="script" />
        <link rel="preload" href="/_next/static/chunks/main-app.js" as="script" />
        <link rel="modulepreload" href="/_next/static/chunks/512.js" />
        <link rel="modulepreload" href="/_next/static/chunks/4bd1b696.js" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "BazarGPT",
              "description": "AI-powered B2B marketplace with thousands of industrial products from verified suppliers",
              "url": "https://bazargpt.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://bazargpt.com/?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              "sameAs": [
                "https://linkedin.com/company/bazargpt",
                "https://twitter.com/bazargpt"
              ]
            })
          }}
        />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "BazarGPT",
              "description": "Leading B2B marketplace connecting buyers with verified suppliers worldwide",
              "url": "https://bazargpt.com",
              "logo": "https://bazargpt.com/logo1.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-8431209936",
                "contactType": "customer service",
                "areaServed": "IN"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ fontDisplay: 'swap' }}
      >
        <CriticalCSS />
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
