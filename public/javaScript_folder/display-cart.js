  
  // Function to display all unique products in the cart
  function displayUniqueProductsInCart() {
    // Retrieve cart items from local storage
    let cartItems = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

    // Create a Set to store unique products based on product name
    const uniqueProducts = new Set();

    // Filter out duplicate products
    cartItems.forEach(product => {
      uniqueProducts.add(JSON.stringify(product));
    });

    // Display each unique product in the cart
    uniqueProducts.forEach(productJson => {
      const product = JSON.parse(productJson);
      displayProductInCart(product);
    });
  }

  // Clear the existing displayed products before showing unique products
  const cartItemsContainer = document.getElementById('cart-items-container');
  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = ''; // Clear the container
    displayUniqueProductsInCart(); // Display unique products
  } else {
    console.error("Cart items container not found.");
 }
// Add a clear button for each product div to clear that particular product div
function addClearButton(product, cartItem) {
  const clearButton = document.createElement('button');
  clearButton.textContent = 'Remove';
  clearButton.onclick = function() {
    // Remove the product from local storage
    let cartItems = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    const updatedCartItems = cartItems.filter(item => JSON.stringify(item) !== JSON.stringify(product));
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));

    // Remove the product div from the DOM
    cartItem.remove();

    // Optionally, update the cart count if there's a function to do so
    if (typeof updateCartCount === 'function') {
      updateCartCount();
    }
  };
  cartItem.appendChild(clearButton);
}

// Modify displayProductInCart to include a clear button
function displayProductInCart(product) {
  const cartItem = document.createElement('div');
  cartItem.innerHTML = `
    <img src="${product.image}" alt="${product.name}" style="width:100px;height:100px;">
    <h3>${product.name}</h3>
    <p>${product.condition}</p>
    <p>${product.description}</p>
    <p>${product.price}</p>
  `;

  // Append the clear button to the product div
  addClearButton(product, cartItem);

  // Append the product to the cart items container
  const cartItemsContainer = document.getElementById('cart-items-container');
  if (!cartItemsContainer) {
    console.error("Cart items container not found.");
    return; // Exit the function if the container doesn't exist
  }
  cartItemsContainer.appendChild(cartItem);
}


document.addEventListener('DOMContentLoaded', function() {
    // Retrieve product information from local storage
    let cartItems = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

    // Reference the empty div where products will be displayed
    let cartContainer = document.getElementById('cart-container');

    // Iterate over each product in the cart and create HTML elements
    cartItems.forEach(function(product) {
        // Create a div element for each product
        let productDiv = document.createElement('div');
        productDiv.classList.add('cart-item');

        // Create an img element for the product image
        let imgElement = document.createElement('img');
        imgElement.src = product.image;
        imgElement.alt = product.name;

        // Create a paragraph element for the product name
        let nameParagraph = document.createElement('p');
        nameParagraph.textContent = product.name;
        nameParagraph.classList.add('product-name');

        // Create a paragraph element for the product price
        let priceParagraph = document.createElement('p');
        priceParagraph.textContent = product.price;
        priceParagraph.classList.add('product-price');

        // Append image, name, and price elements to the product div
        productDiv.appendChild(imgElement);
        productDiv.appendChild(nameParagraph);
        productDiv.appendChild(priceParagraph);

        // Append the product div to the cart container
        cartContainer.appendChild(productDiv);
    });
});


// Retrieve the product details from local storage
let productDetails = JSON.parse(localStorage.getItem('product'));

// Create an image element
let imgElement = document.createElement('img');

// Set the src attribute of the image element to the product image URL
imgElement.src = productDetails.image;
// Apply CSS styles to customize the appearance of the image
imgElement.style.width = '400px !important'; // Set the width of the image
imgElement.style.height = 'auto'; // Maintain the aspect ratio of the image

// Add the image element to the HTML document
document.body.appendChild(imgElement);

 
