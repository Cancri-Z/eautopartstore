document.addEventListener('DOMContentLoaded', function () {
  // Product Image Scroll
  const productImageScroll = document.querySelector('.product_image');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  prevBtn.addEventListener('click', () => {
    productImageScroll.scrollBy({
      left: -productImageScroll.offsetWidth,
      behavior: 'smooth'
    });
  });

  nextBtn.addEventListener('click', () => {
    productImageScroll.scrollBy({
      left: productImageScroll.offsetWidth,
      behavior: 'smooth'
    });
  });


  //Show and hide contact info
  let ctText = document.getElementById('ct-text');
  let ctInfo = document.getElementById('ct-info');

  ctText.addEventListener('click', function (event) {
    // Check if the user is logged in based on the presence of `ct-info`
    if (!ctInfo) {
      // If `ct-info` is not in the DOM, the user is not logged in
      window.location.href = '/login'; // Redirect to login
      return;
    }

    // If logged in, toggle visibility of the contact info
    ctInfo.style.display = (ctInfo.style.display === 'none' || ctInfo.style.display === '') ? 'flex' : 'none';
  });
});

// Function to copy the current page URL to the clipboard
function copyToClipboard() {
  const pageUrl = window.location.href;
  const tempInput = document.createElement('input');
  tempInput.value = pageUrl;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  
  // Show the modal after copying
  document.getElementById('copy-modal').style.display = 'block';
}

// Event listener for the 'Copy link' action
document.getElementById('copy-link').addEventListener('click', function() {
  copyToClipboard();
});

// Event listener for closing the modal
document.getElementById('close-modal').addEventListener('click', function() {
  document.getElementById('copy-modal').style.display = 'none';
});

