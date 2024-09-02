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


//Change top banner image
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
    // Array of texts
    const textArray = [
                      'Welcome!👋',
                      'Explore our best prices',
                      'Enjoy the unlimited discounts'
                      ]; 

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


// Brands  products 
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
            <p>${product.name || 'No name available'}</p>
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
                <span>${product.description || 'Unnamed Product'}</span>
                <span class="priceDiv">${product.price || 'Price not available'}</span>
                <span>${product.condition || 'Condition not specified'}</span> 
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="#777" class="location-icon">
                    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 5.2 10.7 6.5 12 1.3-1.3 6.5-6.8 6.5-12 0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5 14.5 7.6 14.5 9 13.4 11.5 12 11.5z"/>
                    </svg>
                    ${product.location || 'Location not specified'}
                </span> 
            </div>
        </a>
    </div>
  `;
}).join('');
}

// Display products for each brand
const brands = [
                'Toyota',
                'lexus',
                'Mercedes-Benz',
                'ford',
                'Honda',
                'Nissan',
                'Volkswagen',
                'bmw',
                'suzuki',
                'peugeot',
                'audi'
                ]; // Add more brands as needed

brands.forEach(brand => displayProductsByBrand(brand));
})
.catch(error => console.error('Error:', error));
});


