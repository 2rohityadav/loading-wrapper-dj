// Enhanced loader script that loads playwright.dev in iframe, removes nav, then redirects
(function () {
  console.log('wrapper-dj-version: v1.3');

  // Create an invisible iframe to load the target page
  function loadTargetInBackground() {
    // Create container for the hidden iframe
    const container = document.createElement('div');
    container.id = 'hidden-iframe-container';
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;opacity:0;pointer-events:none;';

    // Create the iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'target-iframe';
    iframe.style.cssText = 'width:100%;height:100%;border:none;';
    iframe.src = 'https://playwright.dev/';

    // Add iframe to container
    container.appendChild(iframe);
    document.body.appendChild(container);

    console.log('Target page loading in background iframe');

    // Add load event listener to the iframe
    iframe.addEventListener('load', function () {
      console.log('Iframe loaded, processing DOM...');

      try {
        // Access iframe content
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        // Find and remove the navigation element
        const mainNav = iframeDoc.querySelector('nav.navbar--fixed-top');
        if (mainNav) {
          mainNav.remove();
          console.log('Nav element removed successfully from iframe');
        } else {
          // Fallback to any nav
          const anyNav = iframeDoc.querySelector('nav');
          if (anyNav) {
            anyNav.remove();
            console.log('General nav element removed from iframe');
          } else {
            console.log('No nav elements found in iframe');
          }
        }

        // Since we've handled the nav in the iframe, proceed to real redirect
        // Store necessary information in sessionStorage (more reliable than localStorage for redirects)
        sessionStorage.setItem('navRemoved', 'true');

        // Redirect to the actual page
        window.location.href = 'https://playwright.dev/';
      } catch (error) {
        console.error('Error processing iframe:', error);
        // Fallback to direct navigation if iframe manipulation fails
        window.location.href = 'https://playwright.dev/';
      }
    });

    // Set a fallback timeout in case iframe doesn't load properly
    setTimeout(function () {
      if (document.getElementById('loader-container')) {
        console.log('Fallback timeout reached, redirecting to target');
        window.location.href = 'https://playwright.dev/';
      }
    }, 8000);
  }

  // Start the loading process after a brief delay
  // This ensures our loader is visible before starting the process
  setTimeout(loadTargetInBackground, 500);

  // Handle the case when the page is loaded after redirect
  if (window.location.hostname === 'playwright.dev') {
    console.log('On target site, executing nav removal');

    // Create and insert the final loader
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:white;display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:9999;';

    // Add the company logo
    const logo = document.createElement('div');
    logo.textContent = 'Playwright';
    logo.style.cssText = 'margin-bottom:30px;font-size:24px;font-weight:bold;color:#333;';

    // Create spinner
    const spinner = document.createElement('div');
    spinner.style.cssText = 'width:40px;height:40px;border:4px solid rgba(0,0,0,0.1);border-radius:50%;border-top-color:#3498db;margin-bottom:20px;animation:spin 1s linear infinite;';

    // Create text
    const text = document.createElement('div');
    text.textContent = 'Loading documentation...';
    text.style.cssText = 'font-family:sans-serif;font-size:16px;color:#333;';

    // Add animation style
    const style = document.createElement('style');
    style.textContent = '@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}';

    // Append elements
    document.head.appendChild(style);
    loader.appendChild(logo);
    loader.appendChild(spinner);
    loader.appendChild(text);

    // Add loader as soon as possible during page load
    if (document.body) {
      document.body.appendChild(loader);
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        document.body.appendChild(loader);
      });
    }

    // Function to hide loader and reveal page
    function hideLoader() {
      const loader = document.getElementById('page-loader');
      if (loader) {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.5s';
        setTimeout(() => loader.remove(), 500);
        console.log('Loader removed, page revealed');
      }
    }

    // Execute nav removal and page reveal
    function processPage() {
      console.log('DOM fully loaded, removing nav element');

      // Process with a slight delay to ensure DOM is accessible
      setTimeout(function () {
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
      }, 500);
    }

    // Execute when DOM is fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', processPage);
    } else {
      processPage();
    }

    // Fallback timeout to ensure loader doesn't get stuck
    setTimeout(hideLoader, 10000);
  }
})();