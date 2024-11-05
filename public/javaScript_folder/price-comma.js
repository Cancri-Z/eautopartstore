
// //Mutation observer deployed for dynamically loaded price data

// function formatNumber(num) {
//   return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
// }

// function formatPrices() {
//   const priceDivs = document.querySelectorAll(".priceDiv");
//   priceDivs.forEach(priceDiv => {
//     const price = parseInt(priceDiv.textContent.replace(/[^0-9]/g,""));
//     if (!isNaN(price)) {
//       priceDiv.textContent = `₦${formatNumber(price)}`;
//     }
//   });
// }

// // Run formatting on initial load
// formatPrices();

// // Observe for changes in the DOM and format any new priceDiv elements
// const observer = new MutationObserver(formatPrices);

// observer.observe(document.body, {
//   childList: true,
//   subtree: true
// });

// Debounce function to limit how often the formatter runs
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatPrices() {
  // Limit the selection to visible elements to improve performance
  const priceDivs = document.querySelectorAll(".priceDiv:not([data-formatted='true'])");
  
  priceDivs.forEach(priceDiv => {
    try {
      // Skip if already formatted
      if (priceDiv.getAttribute('data-formatted') === 'true') return;
      
      // Get the raw text content
      const rawPrice = priceDiv.textContent.trim();
      
      // Skip empty elements
      if (!rawPrice) return;
      
      // Extract numbers only
      const price = parseInt(rawPrice.replace(/[^0-9]/g, ""));
      
      if (!isNaN(price)) {
        priceDiv.textContent = `₦${formatNumber(price)}`;
        // Mark as formatted to avoid reprocessing
        priceDiv.setAttribute('data-formatted', 'true');
      }
    } catch (error) {
      console.error('Error formatting price:', error);
    }
  });
}

// Debounced version of formatPrices
const debouncedFormatPrices = debounce(formatPrices, 100);

// Run formatting on initial load
document.addEventListener('DOMContentLoaded', () => {
  formatPrices();
});

// Create a more efficient observer
const observer = new MutationObserver((mutations) => {
  // Check if any mutations actually added price elements
  const hasPriceChanges = mutations.some(mutation => {
    return Array.from(mutation.addedNodes).some(node => {
      return node.nodeType === 1 && (
        node.classList?.contains('priceDiv') ||
        node.querySelector?.('.priceDiv')
      );
    });
  });

  // Only run formatter if price elements were actually added
  if (hasPriceChanges) {
    debouncedFormatPrices();
  }
});

// Start observing with a more specific configuration
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false
});

// Cleanup function to prevent memory leaks
function cleanup() {
  observer.disconnect();
}

// Clean up observer when page is unloaded
window.addEventListener('unload', cleanup);