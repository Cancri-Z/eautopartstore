// Utility function for safe DOM operations
const safeDOM = {
  getElement: (selector) => document.querySelector(selector),
  getAllElements: (selector) => document.querySelectorAll(selector),
  setText: (element, text) => {
    if (element) element.textContent = text;
  }
};

// Single DOMContentLoaded event for all initializations
document.addEventListener("DOMContentLoaded", function() {
  initBackToTop();
  initTextAnimation();
  initBanner();
  initProducts();
});

function initBackToTop() {
  const backToTopBtn = document.getElementById("backToTopBtn");
  if (!backToTopBtn) return;

  window.addEventListener("scroll", function() {
    const viewportHeight = window.innerHeight;
    const scrollPosition = window.scrollY;
    backToTopBtn.style.display = scrollPosition > viewportHeight ? "block" : "none";
  });

  backToTopBtn.addEventListener("click", function() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initTextAnimation() {
  const texts = [
    "Connecting Car Enthusiasts with Quality Auto Parts. Sellers List, Buyers Find, We Bridge the Gap!",
    "Your One-Stop Platform for Auto Parts. Sellers Post, Buyers Find – We Make it Happen!",
    "Where Auto Parts Meet Their Perfect Match – Bridging Sellers and Buyers!"
  ];
  
  const textContainer = safeDOM.getElement('#text-container');
  if (!textContainer) return;

  let state = {
    currentTextIndex: 0,
    currentCharIndex: 0,
    isErasing: false
  };

  function updateText() {
    const currentText = texts[state.currentTextIndex];
    
    if (!state.isErasing) {
      if (state.currentCharIndex < currentText.length) {
        safeDOM.setText(textContainer, currentText.substring(0, state.currentCharIndex + 1));
        state.currentCharIndex++;
        setTimeout(updateText, 100);
      } else {
        setTimeout(() => {
          state.isErasing = true;
          updateText();
        }, 1000);
      }
    } else {
      if (state.currentCharIndex > 0) {
        safeDOM.setText(textContainer, currentText.substring(0, state.currentCharIndex - 1));
        state.currentCharIndex--;
        setTimeout(updateText, 50);
      } else {
        state.isErasing = false;
        state.currentTextIndex = (state.currentTextIndex + 1) % texts.length;
        setTimeout(updateText, 100);
      }
    }
  }

  updateText();
}

function initBanner() {
  const imageElement = safeDOM.getElement("#banner");
  if (!imageElement) return;

  const imageSources = [
    "public/poster_images/1dab9dfa-34ba-476d-9ef3-ac5c2436674e.jfif",
    "public/poster_images/4cf78686-6967-4274-ac1a-5523389beefc.jfif",
    "public/poster_images/5ae3de25-1ee8-470b-a852-94a3ea88b579.jfif",
    "public/poster_images/a82e07fa-2731-4ec6-a840-9a87abfe618c.jfif",
    "public/poster_images/e24b273b-cc4f-464e-b6c8-7cd31ecd2f6f.jfif"
  ];

  let currentIndex = 0;
  const preloadedImages = new Map();

  // Preload images
  imageSources.forEach(src => {
    const img = new Image();
    img.src = src;
    preloadedImages.set(src, img);
  });

  function updateImage() {
    const nextImage = preloadedImages.get(imageSources[currentIndex]);
    if (nextImage.complete) {
      imageElement.style.opacity = "0.7";
      setTimeout(() => {
        imageElement.src = nextImage.src;
        imageElement.style.opacity = "1";
        currentIndex = (currentIndex + 1) % imageSources.length;
      }, 1000);
    }
  }

  // Start rotation once first image is loaded
  const firstImage = preloadedImages.get(imageSources[0]);
  firstImage.onload = () => {
    updateImage();
    setInterval(updateImage, 4000);
  };
}

function initProducts() {
  const brands = [
    'Toyota', 'lexus', 'Mercedes-Benz', 'ford', 'Honda',
    'Nissan', 'Volkswagen', 'bmw', 'suzuki', 'peugeot', 'audi'
  ];

  function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return '';
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function createProductHTML(product) {
    const productImage = product.photos?.[0] ?? '/path/to/default-image.jpg';
    return `
    <div class="prod">
      <a href="/product/${escapeHtml(product.productId)}" class="pd_cd">
        <div class="product-card">
          <img src="${escapeHtml(productImage)}" alt="${escapeHtml(product.name || 'Product Image')}" loading="lazy">
          <article>
            <p>${escapeHtml(product.name || 'No name available')}</p>
            <p>${escapeHtml(product.description || 'No description available')}</p>
            <p class="price">
              <span class="priceDiv">${escapeHtml(product.price || 'Price not available')}</span>
              <span>${escapeHtml(product.condition || 'Condition not specified')}</span>
            </p>
          </article>
        </div>
      </a>
    </div>  
    `;
  }

  function displayProducts(products, container) {
    if (!container || !Array.isArray(products)) return;
    
    // Create document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    products.forEach(product => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = createProductHTML(product);
      fragment.appendChild(tempDiv.firstElementChild);
    });
    
    container.innerHTML = '';
    container.appendChild(fragment);
  }

  // Fetch and display products
  fetch('/json_folder/products.json')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      if (!data?.products?.length) throw new Error('No products found');
      
      const productsArray = data.products;
      
      // Display brand products
      brands.forEach(brand => {
        const container = safeDOM.getElement(`.hrsc.${brand.toUpperCase()}`);
        if (container) {
          const brandProducts = productsArray
            .filter(p => p.brand?.toLowerCase() === brand.toLowerCase())
            .slice(0, 10);
          displayProducts(brandProducts, container);
        }
      });

      // Display flash products
      const flashDiv = safeDOM.getElement('.flash');
      if (flashDiv) {
        const flashProducts = [...productsArray]
          .sort(() => 0.5 - Math.random())
          .slice(0, 30);
        displayProducts(flashProducts, flashDiv);
      }
    })
    .catch(error => {
      console.error('Error loading products:', error);
      safeDOM.getAllElements('.hrsc, .flash').forEach(el => {
        el.innerHTML = '<p class="error-message">Unable to load products. Please refresh the page.</p>';
      });
    });
}