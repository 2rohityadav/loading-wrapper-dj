// Simple loader script that redirects and removes nav element
(function () {
  console.log('wrapper-dj-version: v1.2');
  // Redirect after a brief delay to show initial loader
  setTimeout(function () {
    // Store the nav removal script in localStorage
    localStorage.setItem('simpleLoader', `
            // Create and insert a loader
            (function() {
                // Create a simple loader element
                const loader = document.createElement('div');
                loader.id = 'page-loader';
                loader.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:white;display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:9999;';
                
                // Create spinner
                const spinner = document.createElement('div');
                spinner.style.cssText = 'width:40px;height:40px;border:4px solid rgba(0,0,0,0.1);border-radius:50%;border-top-color:#3498db;margin-bottom:20px;animation:spin 1s linear infinite;';
                
                // Create text
                const text = document.createElement('div');
                text.textContent = 'Loading...';
                text.style.cssText = 'font-family:sans-serif;font-size:16px;color:#333;';
                
                // Add animation style
                const style = document.createElement('style');
                style.textContent = '@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}';
                
                // Append elements
                document.head.appendChild(style);
                loader.appendChild(spinner);
                loader.appendChild(text);
                document.body.appendChild(loader);
                
                // Log for debugging
                console.log('Loader injected');
                
                // Function to hide loader
                function hideLoader() {
                    loader.style.opacity = '0';
                    loader.style.transition = 'opacity 0.5s';
                    setTimeout(() => loader.remove(), 500);
                    console.log('Loader removed');
                }
                
                // Remove nav element after a short delay
                setTimeout(function() {
                    try {
                        // Simple one-liner to remove the nav element
                        const mainNav = document.querySelector('nav.navbar--fixed-top');
                        if (mainNav) {
                            mainNav.remove();
                            console.log('Nav element removed successfully');
                            hideLoader();
                        } else {
                            console.log('Nav element not found with specific class');
                            
                            // Fallback to any nav
                            const anyNav = document.querySelector('nav');
                            if (anyNav) {
                                anyNav.remove();
                                console.log('General nav element removed');
                                hideLoader();
                            } else {
                                console.log('No nav elements found');
                                hideLoader();
                            }
                        }
                    } catch (error) {
                        console.error('Error removing nav:', error);
                        hideLoader();
                    }
                }, 2000);
                
                // Fallback timeout
                setTimeout(hideLoader, 10000);
            })();
        `);

    // Redirect to the target page
    window.location.href = 'https://playwright.dev/';
  }, 1000);
})();

// This script runs when the page is loaded after redirect
window.addEventListener('DOMContentLoaded', function () {
  // Check if we're on the target site
  if (window.location.hostname === 'playwright.dev') {
    console.log('On target site, running loader script');

    // Get and execute the stored script
    const loaderScript = localStorage.getItem('simpleLoader');
    if (loaderScript) {
      // Create and execute the script
      const scriptElement = document.createElement('script');
      scriptElement.textContent = loaderScript;
      document.head.appendChild(scriptElement);

      // Clear storage
      localStorage.removeItem('simpleLoader');
    }
  }
});