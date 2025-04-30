// Advanced loader that ensures navigation is hidden on playwright.dev
(function () {
  console.log('wrapper-dj-version: v1.6');

  // Initialize by creating our loader
  function initialize() {
    // Only create the loader if we're on the initial page, not on playwright.dev
    if (window.location.hostname !== 'playwright.dev') {
      console.log('On initial page, preparing to load playwright.dev');
      redirectToPlaywright();
    } else {
      console.log('Already on playwright.dev, applying nav removal');
      injectLoaderAndHideNav();
    }
  }

  // Redirect to playwright.dev
  function redirectToPlaywright() {
    // Store our instructions for the next page
    const instructions = {
      timestamp: Date.now(),
      action: 'removeNav'
    };

    // Use sessionStorage instead of localStorage for reliability across page loads
    sessionStorage.setItem('playwright_wrapper_instructions', JSON.stringify(instructions));

    // Redirect to playwright.dev
    window.location.href = 'https://playwright.dev/';
  }

  // Function that runs on playwright.dev to inject loader and hide nav
  function injectLoaderAndHideNav() {
    // Check if we need to run the nav removal
    const instructionsJson = sessionStorage.getItem('playwright_wrapper_instructions');
    if (!instructionsJson) {
      console.log('No instructions found, script may be running directly on playwright.dev');
      return;
    }

    // Parse instructions
    try {
      const instructions = JSON.parse(instructionsJson);

      // Check if instructions are recent (within last 30 seconds)
      const now = Date.now();
      const isRecent = (now - instructions.timestamp) < 30000;

      if (!isRecent) {
        console.log('Instructions are too old, skipping');
        sessionStorage.removeItem('playwright_wrapper_instructions');
        return;
      }

      // Clear instructions to prevent repeated execution
      sessionStorage.removeItem('playwright_wrapper_instructions');

      // If we're supposed to remove the nav, proceed with the main functionality
      if (instructions.action === 'removeNav') {
        injectLoader();
      }
    } catch (e) {
      console.error('Failed to parse instructions:', e);
    }
  }

  // Inject the loader and set up the DOM hiding process
  function injectLoader() {
    // First, hide the body content immediately to prevent flash of content
    const originalBody = document.body;
    originalBody.style.visibility = 'hidden';

    // Create a loader element
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

    // Add loader to the body
    document.body.appendChild(loader);
    console.log('Loader injected');

    // Create a MutationObserver to watch for the navbar to appear in the DOM
    setupDOMObserver();

    // Also set direct timeouts to attempt navigation removal
    attemptNavRemoval(1000);
    attemptNavRemoval(2000);
    attemptNavRemoval(3000);

    // Final fallback - reveal the page after maximum wait time
    setTimeout(function () {
      revealPageContent();
    }, 8000);
  }

  // Set up an observer to watch for DOM changes
  function setupDOMObserver() {
    // Only proceed if MutationObserver is available
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(function (mutations) {
        // For each mutation, check if our target elements have been added
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // After any DOM change, attempt to find and remove the nav
            attemptNavRemoval(100);
          }
        }
      });

      // Start observing the document body for DOM changes
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      console.log('DOM observer started');

      // Store the observer for cleanup
      window._navObserver = observer;

      // Stop observing after a certain time to avoid performance issues
      setTimeout(function () {
        if (window._navObserver) {
          window._navObserver.disconnect();
          console.log('DOM observer stopped');
        }
      }, 8000);
    }
  }

  // Function to hide loader and reveal page
  function revealPageContent() {
    console.log('Revealing page content');

    // Make the body visible again
    document.body.style.visibility = 'visible';

    // Fade out and remove the loader
    const loader = document.getElementById('page-loader');
    if (loader) {
      loader.style.opacity = '0';
      loader.style.transition = 'opacity 0.5s';
      setTimeout(function () {
        if (loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 500);
    }

    // Clean up our observer if it exists
    if (window._navObserver) {
      window._navObserver.disconnect();
      delete window._navObserver;
    }

    console.log('Page revealed');
  }

  // Attempt to find and remove the navigation element
  function attemptNavRemoval(delay) {
    setTimeout(function () {
      console.log('Attempting to remove nav element');
      let navRemoved = false;

      try {
        // Try different strategies to find the navigation element
        const selectors = [
          'nav.navbar.navbar--fixed-top',
          'nav[class*="navbar--fixed-top"]',
          'nav[aria-label="Main"]',
          'header nav',
          '#__docusaurus nav',
          'nav'
        ];

        // Try each selector in order
        for (const selector of selectors) {
          const navElement = document.querySelector(selector);
          if (navElement) {
            console.log(`Found nav element with selector: ${selector}`);

            // Use CSS to hide it rather than removing it (more reliable)
            navElement.style.display = 'none';
            navElement.style.visibility = 'hidden';
            navElement.style.opacity = '0';
            navElement.style.height = '0';
            navElement.style.overflow = 'hidden';
            navElement.style.position = 'absolute';
            navElement.style.pointerEvents = 'none';

            // Also try to actually remove it from DOM
            try {
              navElement.remove();
            } catch (e) {
              console.log('Could not remove nav element, but it is hidden via CSS');
            }

            console.log('Nav element hidden/removed');
            navRemoved = true;
            break;
          }
        }

        if (!navRemoved) {
          console.log('No nav element found with any selector');
        } else {
          // Only reveal the page if we successfully removed the nav
          revealPageContent();
        }
      } catch (error) {
        console.error('Error during nav removal:', error);
      }
    }, delay);
  }

  // Run the initialization
  initialize();
})();