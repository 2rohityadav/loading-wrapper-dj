document.getElementById('removeNavButton').addEventListener('click', function () {
  console.log('wrapper-dj-version: v1.7');
  console.log('Remove button clicked. Navbar will be removed in 2 seconds...');

  setTimeout(() => {
    const navbar = document.querySelector('nav[aria-label="Main"]');
    if (navbar) {
      navbar.remove();
      console.log('✅ Navbar has been removed from the DOM.');
    } else {
      console.log('⚠️ Navbar not found.');
    }
  }, 2000); // 2000 milliseconds = 2 seconds
});
