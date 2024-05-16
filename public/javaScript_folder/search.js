document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.querySelector('.search input');
    const dropdown = document.createElement('div');
    dropdown.className = 'search-dropdown';
    dropdown.style.position = 'absolute';
    dropdown.style.top = '15vh';
    dropdown.style.width = '60%';
    dropdown.style.minWidth = '250px';
    dropdown.style.maxWidth = '450px';
    dropdown.style.height = 'fit-content';
    dropdown.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    dropdown.style.display = 'none';
    searchInput.parentNode.appendChild(dropdown);

    function searchProducts(searchTerm) {
        // Redirect to search results page with the search term as a query parameter
        window.location.href = "search-results?q=" + encodeURIComponent(searchTerm);
    }

    function matchProduct(productName, searchWords) {
        // Check if all search words are included in the product name
        return searchWords.every(word => productName.includes(word));
    }

    searchInput.addEventListener('input', function() {
        const value = searchInput.value.toLowerCase().trim();
        dropdown.innerHTML = ''; // Clear previous results
        if (value) {
            fetch('/json_folder/products.json')
                .then(response => response.json())
                .then(data => {
                    const searchWords = value.split(' ');
                    const uniqueProducts = new Set(); // Set to store unique product names
                    data.products.forEach(product => {
                        const productName = product.name.toLowerCase();
                        if (matchProduct(productName, searchWords)) {
                            uniqueProducts.add(productName);
                        }
                    });

                    uniqueProducts.forEach(productName => {
                        const productElement = document.createElement('div');
                        productElement.textContent = productName;
                        productElement.style.padding = '10px';
                        productElement.style.cursor = 'pointer';
                        productElement.addEventListener('click', () => {
                            searchInput.value = productName;
                            dropdown.style.display = 'none';
                            searchProducts(productName); // Redirect to search results
                        });
                        dropdown.appendChild(productElement);
                    });

                    if (uniqueProducts.size > 0) {
                        dropdown.style.display = 'block';
                    } else {
                        dropdown.style.display = 'none';
                    }
                });
        } else {
            dropdown.style.display = 'none';
        }
    });

    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target)) {
            dropdown.style.display = 'none';
        }
    });
});
