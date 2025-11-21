export default function CriticalCSS() {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        /* Critical CSS for above-the-fold content */
        .hero-section {
          background-color: #0D1B2A;
          contain: layout style;
        }
        
        .hero-title {
          color: #f0f0f0;
          font-weight: 700;
          font-display: swap;
          text-rendering: optimizeLegibility;
        }
        
        /* Critical search bar styles */
        .search-container {
          max-width: 1000px;
          min-height: 48px;
        }
        
        /* Critical header styles */
        .header-sticky {
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(8px);
        }
        
        /* Minimize layout shift */
        .content-wrapper {
          min-height: 100vh;
          contain: layout;
        }
        
        /* Optimize font rendering */
        * {
          font-synthesis: none;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Critical layout for first paint */
        .grid-responsive {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
          contain: layout;
        }
      `
    }} />
  );
}