export default function CriticalCSS() {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        /* Critical CSS for above-the-fold content - Prevent forced reflows */
        .hero-section {
          background-color: #0D1B2A;
          contain: layout style paint;
          transform: translateZ(0);
          will-change: auto;
        }
        
        .hero-title {
          color: #f0f0f0;
          font-weight: 700;
          font-display: swap;
          text-rendering: optimizeLegibility;
          will-change: auto;
          transform: translateZ(0);
        }
        
        /* Prevent layout thrashing */
        * {
          box-sizing: border-box;
          font-synthesis: none;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Critical search bar styles */
        .search-container {
          max-width: 1000px;
          min-height: 48px;
          contain: layout;
        }
        
        /* Critical header styles */
        .header-sticky {
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(8px);
          contain: layout style;
        }
        
        /* Minimize layout shift and forced reflows */
        .content-wrapper {
          min-height: 100vh;
          contain: layout style;
        }
        
        /* Critical layout for first paint - prevent reflows */
        .grid-responsive {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
          contain: layout style;
          content-visibility: auto;
        }
        
        /* Optimize image containers to prevent layout shifts */
        .image-container {
          aspect-ratio: 4/3;
          contain: layout style;
          content-visibility: auto;
        }
        
        /* Prevent forced reflows from dynamic content */
        .dynamic-content {
          contain: layout style;
          will-change: auto;
        }
        
        /* Performance optimizations for scrolling */
        .scroll-optimized {
          transform: translateZ(0);
          will-change: scroll-position;
        }
      `
    }} />
  );
}