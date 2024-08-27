(function() {
  const toggleButton = document.getElementById('toggleButton');
  const list = document.getElementById('list');
  const hide1 = document.getElementById('hide1');
  const brands = document.getElementById('brands');
  const brdhide = document.getElementById('brdhide');
  const closeBrandsList = document.getElementById('cnl');

  // Ensure initial state is set correctly
  list.style.display = 'none';
  brdhide.style.display = 'none';

  // Add click event listener to the toggleButton
  toggleButton.addEventListener('click', toggleListVisibility);

  // Add click event listener to the hide1
  hide1.addEventListener('click', hideList);

  // Add click event listener to brands
  brands.addEventListener('click', toggleBrandsVisibility);

  // Add click event listener to closeBrandsList
  closeBrandsList.addEventListener('click', hideBrandsList);

  // Function to toggle the visibility of the list
  function toggleListVisibility() {
    if (list.style.display === 'none') {
      list.style.display = 'block';
    } else {
      list.style.display = 'none';
    }
  }

  // Function to hide the list
  function hideList() {
    list.style.display = 'none';
  }

  // Function to toggle the visibility of brands
  function toggleBrandsVisibility() {
    if (brdhide.style.display === 'none') {
      brdhide.style.display = 'flex';
    } else {
      brdhide.style.display = 'none';
    }
  }

  // Function to hide the brands list
  function hideBrandsList() {
    brdhide.style.display = 'none';
  }

  // Add click event listener to the document
  document.addEventListener('click', function(event) {
    const clickedElement = event.target;

    // Check if the clicked element is not inside the list or brands elements
    if (!list.contains(clickedElement) && !brdhide.contains(clickedElement) && clickedElement !== toggleButton && clickedElement !== closeBrandsList) {
      hideList();
      hideBrandsList();
    }
  });

})();

