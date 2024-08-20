document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchResultsList = document.getElementById('searchResultsList');
    const allProducts = document.getElementById('allProducts');

    function searchProducts() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            // Filter products based on the search term
            const filteredProducts = Array.from(allProducts.querySelectorAll('.product-card')).filter(product => {
                const productName = product.querySelector('h3').textContent.toLowerCase();
                return productName.includes(searchTerm);
            });

            // Display search results
            searchResultsList.innerHTML = '';
            if (filteredProducts.length > 0) {
                filteredProducts.forEach(product => {
                    searchResultsList.appendChild(product.cloneNode(true));
                });
                searchResults.style.display = 'block';
                allProducts.style.display = 'none';
            } else {
                searchResults.style.display = 'none';
                allProducts.style.display = 'block';
                alert('No products found matching your search.');
            }
        } else {
            searchResults.style.display = 'none';
            allProducts.style.display = 'block';
        }
    }

    // Add event listener for the search input
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchProducts();
        }
    });

    // Make the searchProducts function global so it can be called from the HTML
    window.searchProducts = searchProducts;
});