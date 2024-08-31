
//Mutation observer deployed for dynamically loaded price data

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
}

function formatPrices() {
  const priceDivs = document.querySelectorAll(".priceDiv");
  priceDivs.forEach(priceDiv => {
    const price = parseInt(priceDiv.textContent.replace(/[^0-9]/g,""));
    if (!isNaN(price)) {
      priceDiv.textContent = `₦${formatNumber(price)}`;
    }
  });
}

// Run formatting on initial load
formatPrices();

// Observe for changes in the DOM and format any new priceDiv elements
const observer = new MutationObserver(formatPrices);

observer.observe(document.body, {
  childList: true,
  subtree: true
});

