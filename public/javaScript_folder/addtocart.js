function addToCart() {
  // Retrieve the product details
  let productDetails = {
      name: document.getElementById('title').textContent,
      condition: document.getElementById('condition').textContent,
      description: document.getElementById('description').textContent,
      price: document.getElementById('price').textContent,
      image: document.getElementById('image1').src
  };

  // Retrieve the existing cart items from local storage
  var cartItems = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

  // Check if the product is already in the cart
  var isProductInCart = cartItems.some(function(item) {
      return item.name === productDetails.name;
  });

  // If the product is not already in the cart, add it
  if (!isProductInCart) {
      cartItems.push(productDetails);
      localStorage.setItem('cart', JSON.stringify(cartItems));
      // Update cart count
      updateCartCount();
  } else {
      alert('This product is already in your cart.');
  }
}

function updateCartCount() {
    var cartItems = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    var cartItemCount = cartItems.length;
    var cartCountElement = document.getElementById('cart-item-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartItemCount;
    } else {
        console.error('Cart item count element not found');
    }
}

// Ensure cart count persists after page refresh
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});




document.addEventListener("DOMContentLoaded", function () {
    var button = document.getElementById("toggleButton");
    var list = document.getElementById("list");

    button.addEventListener("click", function () {
        list.classList.toggle("hidden");
    });
    });

     //Toggle Dropdown
     function toggleDropdown() {
    var toggleButton = document.getElementById('toggleButton');
    var list = document.getElementById('list');

    // Toggle between bars and x icons
    toggleButton.classList.toggle('fa-bars');
    toggleButton.classList.toggle('fa-times');
  }
