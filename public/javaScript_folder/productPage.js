
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

  // Toggle ct-info visibility
  let ctInfo = document.getElementById('ct-info');
  ctInfo.style.display = 'none';

  let ctText = document.getElementById('ct-text');

  ctText.addEventListener('click', function (event) {
    if (ctText.querySelector('a')) {
      event.preventDefault();
    }

    ctInfo.style.display = (ctInfo.style.display === 'none') ? 'block' : 'none';
  });

  // Copy link to clipboard with modal
  let copyLinkElement = document.getElementById('copy-link');
  let modal = document.getElementById('copy-modal');

  copyLinkElement.addEventListener('click', function () {
    navigator.clipboard.writeText(window.location.href).then(function () {
             // Show the modal
    modal.style.display = 'block';
    
    // Hide the modal after 2 seconds
    setTimeout(function () {
      modal.style.display = 'none';
    }, 1000);
  }).catch(function (err) {
    console.error('Failed to copy: ', err);
  });
});
});
