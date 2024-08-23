document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.querySelector('.search input');
    const dropdown = document.createElement('div');
    dropdown.className = 'search-dropdown';
    dropdown.style.position = 'absolute';
    dropdown.style.width = '100%';
    dropdown.style.maxHeight = '300px';
    dropdown.style.overflowY = 'auto';
    dropdown.style.backgroundColor = '#fff';
    dropdown.style.display = 'none';
    dropdown.style.zIndex = '1000';
    searchInput.parentNode.appendChild(dropdown);

    function searchProducts(searchTerm) {
        window.location.href = "/search-results?q=" + encodeURIComponent(searchTerm);
    }

    function navigateToBrandPage(brand) {
        window.location.href = "/brand?name=" + encodeURIComponent(brand);
    }

    function matchProduct(text, searchWords) {
        return searchWords.every(word => text.includes(word));
    }

    searchInput.addEventListener('input', function() {
        const value = searchInput.value.toLowerCase().trim();
        dropdown.innerHTML = '';
        if (value) {
            fetch('/json_folder/products.json')
                .then(response => response.json())
                .then(data => {
                    const searchWords = value.split(' ');
                    const uniqueResults = new Map();

                    data.products.forEach(product => {
                        if (product.name && matchProduct(product.name.toLowerCase(), searchWords)) {
                            uniqueResults.set(product.name.toLowerCase(), { type: 'product', name: product.name });
                        }
                        if (product.brand && matchProduct(product.brand.toLowerCase(), searchWords)) {
                            uniqueResults.set(product.brand.toLowerCase(), { type: 'brand', name: product.brand });
                        }
                    });

                    uniqueResults.forEach(({ type, name, productId }) => {
                        const resultElement = document.createElement('div');
                        resultElement.textContent = name;
                        resultElement.style.padding = '10px';
                        resultElement.style.cursor = 'pointer';
                        
                        if (type === 'brand') {
                            const brandIndicator = document.createElement('span');
                            brandIndicator.textContent = ' (Brand)';
                            brandIndicator.style.fontSize = '0.8em';
                            brandIndicator.style.color = '#666';
                            resultElement.appendChild(brandIndicator);
                        }

                        resultElement.addEventListener('click', () => {
                            searchInput.value = name;
                            dropdown.style.display = 'none';
                            if (type === 'product') {
                                searchProducts(name);
                            } else {
                                navigateToBrandPage(name);
                            }
                        });
                        dropdown.appendChild(resultElement);
                    });

                    dropdown.style.display = uniqueResults.size > 0 ? 'block' : 'none';
                });
        } else {
            dropdown.style.display = 'none';
        }
    });

    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.style.display = 'none';
        }
    });
});

function searchProducts() {
    const searchInput = document.querySelector('.search input');
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        window.location.href = "/search-results?q=" + encodeURIComponent(searchTerm);
    }
}