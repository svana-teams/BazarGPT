export default function CriticalCSS() {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        /* Critical CSS for above-the-fold content */
        .hero-section {
          background-color: #0D1B2A;
        }
        
        .hero-title {
          color: #f0f0f0;
          font-weight: 700;
          text-rendering: optimizeLegibility;
        }
        
        /* Essential box-sizing and font rendering */
        * {
          box-sizing: border-box;
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
        }
        
        /* Minimize layout shift */
        .content-wrapper {
          min-height: 100vh;
        }
        
        /* Critical layout for first paint */
        .grid-responsive {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }
      `
    }} />
  );
}