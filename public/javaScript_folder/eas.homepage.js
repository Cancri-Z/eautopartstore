(function() {
  const toggleButton = document.getElementById('toggleButton');
  const list = document.getElementById('list');
  const hide1 = document.getElementById('hide1');
  const brands = document.getElementById('brands');
  const brdhide = document.getElementById('brdhide');
  const closeBrandsList = document.getElementById('cnl');

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
    if (brdhide.style.display === '' || brdhide.style.display === 'none') {
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


    //Back to top scroll button
    document.addEventListener("DOMContentLoaded", function() {
        const backToTopBtn = document.getElementById("backToTopBtn");

        window.addEventListener("scroll", function() {
          const viewportHeight = window.innerHeight;
          const scrollPosition = window.scrollY;

          if (scrollPosition > viewportHeight) {
            backToTopBtn.style.display = "block";
          } else {
            backToTopBtn.style.display = "none";
          }
        });
         backToTopBtn.addEventListener("click", function() {
          window.scrollTo({ top: 0, behavior: "smooth"});
        });
      });


  //to change top banner image
  const imageSources = [
                  "/poster_images/flat-design-car-a4-poster-with-photo-horizontal_23-2148981630.avif",
                  "/public/poster_images/cardboard-car-parts-various-auto-600nw-1635956590.webp", 
                  "/public/poster_images/stock-vector-mobile-tyre-solution-web-banner-advertisement-red-poster-with-car-tyre-wheel-rim-with-rubber-2208694109.jpg", 
                  "/public/poster_images/tire-car-advertisement-poster-black-260nw-2028988058.webp", 
                  "/public/poster_images/tires-horizontal-banner-properties-car-600nw-2159254589.webp"
                  ];

  let currentImageIndex = 0;
  const imageElement = document.getElementById("banner");

  function changeImage() {
        imageElement.style.opacity = 0.7;

        setTimeout(() => {
        imageElement.src = imageSources[currentImageIndex];
        imageElement.style.opacity = 1;
        currentImageIndex = (currentImageIndex + 1)  % imageSources.length;
  }, 1000);}

  //set interval to change image every 2secs/2000ms
  setInterval(changeImage, 4000);


  //For changing text at the top
  
  const divElement = document.getElementById('changetxt');
      const textArray = ['Welcome!👋', 'Explore our best prices', 'Enjoy the unlimited discounts']; // Array of texts

      let currentIndex = 0;

      function changeText() {
        divElement.style.transform = 'translateX(-100%)'; // Move text out of the viewport
        setTimeout(() => {
          divElement.textContent = textArray[currentIndex];
          divElement.style.transform = 'translateX(0)'; // Move text back to its original position
          currentIndex = (currentIndex + 1) % textArray.length; // Increment index, loop back to 0 when reaches end
        }, 500); // Delay to allow the text to move out of the viewport before changing content
      }

      setInterval(changeText, 5000); // Change text every 5 seconds


          // flash  products 
          document.addEventListener('DOMContentLoaded', function() {
            fetch('/json_folder/products.json')
              .then(response => response.json())
              .then(data => {
                console.log('Fetched data:', data);
          
                const productsArray = data.products;
          
                if (!Array.isArray(productsArray)) {
                  throw new Error('Products data is not an array');
                }
          
                function shuffleArray(array) {
                  return array.sort(() => 0.5 - Math.random());
                }
          
                function createProductHTML(product) {
                  const productImage = product.photos && product.photos.length > 0 ? product.photos[0] : '/path/to/default-image.jpg';
                  
                  return `
                    <a href="/product/${product.productId}" class="pd_cd">
                      <div class="product-card">
                        <img src="${productImage}" alt="${product.name || 'Product Image'}">
                        <article>
                          <p>${product.description || 'No description available'}</p>
                          <p class="price">
                            <span class="priceDiv">${product.price || 'Price not available'}</span>
                            <span>${product.condition || 'Condition not specified'}</span>
                          </p>
                        </article>
                      </div>
                    </a>
                  `;
                }
          
                function displayProductsByBrand(brand, limit = 10) {
                  const brandSection = document.querySelector(`.hrsc.${brand.toUpperCase()}`);
                  if (brandSection) {
                    const brandProducts = productsArray.filter(product => 
                      product.brand && product.brand.toLowerCase() === brand.toLowerCase()
                    );
                    const shuffledBrandProducts = shuffleArray(brandProducts);
                    const selectedBrandProducts = shuffledBrandProducts.slice(0, limit);
                    
                    brandSection.innerHTML = selectedBrandProducts.map(createProductHTML).join('');
                    
                  }
                }
          
                // Handle flash products
                const flashDiv = document.querySelector('.flash');
                if (flashDiv) {
                  const shuffledProducts = shuffleArray([...productsArray]);
                  const selectedFlashProducts = shuffledProducts.slice(0, 30);
                  
                  flashDiv.innerHTML = selectedFlashProducts.map(product => {
                    const productImage = product.photos && product.photos.length > 0 ? product.photos[0] : '/path/to/default-image.jpg';
                    return `
                      <div class="prod">
                        <a href="/product/${product.productId}">
                          <img src="${productImage}" alt="${product.name || 'Product Image'}">
                          <div class="text">
                            <span>${product.name || 'Unnamed Product'}</span>
                            <span class="priceDiv">${product.price || 'Price not available'}</span>
                             <span>${product.condition || 'Condition not specified'}</span> 
                          </div>
                        </a>
                      </div>
                    `;
                  }).join('');
                }
          
                // Display products for each brand
                const brands = ['Toyota', 'lexus', 'Mercedes-Benz', 'ford', 'Honda', 'Nissan', 'Volkswagen', 'bmw', 'suzuki', 'peugeot', 'audi']; // Add more brands as needed
                brands.forEach(brand => displayProductsByBrand(brand));
              })
              .catch(error => console.error('Error:', error));
          });
     
    
    