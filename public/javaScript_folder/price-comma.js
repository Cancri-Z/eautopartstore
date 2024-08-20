 // Function to format a number with commas
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Get all the priceDiv elements
  const priceDivs = document.querySelectorAll(".priceDiv");

  // Loop through the priceDiv elements and format the prices
  priceDivs.forEach(priceDiv => {
    const price = parseInt(priceDiv.textContent.replace(/[^0-9]/g, ""));
    priceDiv.textContent = `₦${formatNumber(price)}`;
  });
