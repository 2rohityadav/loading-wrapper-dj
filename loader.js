// Simple loader script that injects a loader and removes nav element on playwright.dev
(function () {
  console.log('wrapper-dj-version: v1.4');

  // Function to inject the loader directly on the playwright.dev page
  function injectLoader() {
    // Create a simple loader element that covers the entire page
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

    // Function to hide loader
    function hideLoader() {
      const loader = document.getElementById('page-loader');
      if (loader) {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.5s';
        setTimeout(() => {
          if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
        }, 500);
        console.log('Loader removed, page revealed');
      }
    }

    // Function to remove nav and hide loader
    function removeNavAndShowPage() {
      console.log('Attempting to remove nav element');

      try {
        // Try to find and remove the navigation element with specific class
        const mainNav = document.querySelector('nav.navbar--fixed-top');
        if (mainNav) {
          mainNav.remove();
          console.log('Nav element removed successfully');
          hideLoader();
        } else {
          // Fallback to trying any nav element
          console.log('Nav element not found with specific class, trying general nav');

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
    }

    // Handle the nav removal with multiple attempts to ensure it works
    // First attempt - immediate try for very fast loads
    setTimeout(removeNavAndShowPage, 300);

    // Second attempt - wait for DOM content loaded
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(removeNavAndShowPage, 300);
    });

    // Third attempt - after a longer delay
    setTimeout(removeNavAndShowPage, 2000);

    // Fallback timeout to ensure loader doesn't get stuck
    setTimeout(hideLoader, 8000);
  }

  // Store the loader script in localStorage
  localStorage.setItem('navRemovalScript', injectLoader.toString());

  // Create a script to be run immediately when the target page loads
  const bootstrapScript = `
    (function() {
      // Function to run our script as early as possible
      function runEarlyScript() {
        const scriptFn = ${injectLoader.toString()};
        scriptFn();
      }

      // Try to run as early as possible
      try {
        runEarlyScript();
      } catch (e) {
        console.error('Early script execution failed:', e);
      }

      // Also run on DOMContentLoaded as a backup
      document.addEventListener('DOMContentLoaded', function() {
        const script = localStorage.getItem('navRemovalScript');
        if (script) {
          try {
            eval('(' + script + ')()');
            localStorage.removeItem('navRemovalScript');
          } catch (e) {
            console.error('Script execution error:', e);
          }
        }
      });
    })();
  `;

  // Create a link element that will navigate to playwright.dev
  const targetLink = document.createElement('a');
  targetLink.href = 'https://playwright.dev/';
  targetLink.id = 'navigation-link';
  targetLink.style.display = 'none';
  document.body.appendChild(targetLink);

  // Immediately redirect to playwright.dev with the script injection
  const script = document.createElement('script');
  script.textContent = bootstrapScript;
  document.head.appendChild(script);

  // Trigger the navigation to playwright.dev
  setTimeout(function () {
    document.getElementById('navigation-link').click();
  }, 500);
})();