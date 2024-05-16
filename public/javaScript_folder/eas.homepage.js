(function() {
  const toggleButton = document.getElementById('toggleButton');
  const list = document.getElementById('list');
  const hide1 = document.getElementById('hide1');
  const brands = document.getElementById('brands');
  const brdhide = document.getElementById('brdhide');
  const closeBrandsList = document.getElementById('cnl');

  // Add click event listener to the toggleButton
  toggleButton.addEventListener('click', toggleListVisibility);

  // Add click event listener to the hide1
  hide1.addEventListener('click', hideList);

  // Add click event listener to brands
  brands.addEventListener('click', toggleBrandsVisibility);

  // Add click event listener to closeBrandsList
  closeBrandsList.addEventListener('click', hideBrandsList);

  // Function to toggle the visibility of the list
  function toggleListVisibility() {
    if (list.style.display === 'none') {
      list.style.display = 'block';
    } else {
      list.style.display = 'none';
    }
  }

  // Function to hide the list
  function hideList() {
    list.style.display = 'none';
  }

  // Function to toggle the visibility of brands
  function toggleBrandsVisibility() {
    if (brdhide.style.display === '' || brdhide.style.display === 'none') {
      brdhide.style.display = 'flex';
    } else {
      brdhide.style.display = 'none';
    }
  }

  // Function to hide the brands list
  function hideBrandsList() {
    brdhide.style.display = 'none';
  }

  // Add click event listener to the document
  document.addEventListener('click', function(event) {
    const clickedElement = event.target;

    // Check if the clicked element is not inside the list or brands elements
    if (!list.contains(clickedElement) && !brdhide.contains(clickedElement) && clickedElement !== toggleButton && clickedElement !== closeBrandsList) {
      hideList();
      hideBrandsList();
    }
  });

})();











    //Back to top scroll button
    document.addEventListener("DOMContentLoaded", function() {
        const backToTopBtn = document.getElementById("backToTopBtn");

        window.addEventListener("scroll", function() {
          const viewportHeight = window.innerHeight;
          const scrollPosition = window.scrollY;

          if (scrollPosition > viewportHeight) {
            backToTopBtn.style.display = "block";
          } else {
            backToTopBtn.style.display = "none";
          }
        });
         backToTopBtn.addEventListener("click", function() {
          window.scrollTo({ top: 0, behavior: "smooth"});
        });
      });


  //to change top banner image
  const imageSources = ["../img_folder/banner1.jpeg", "../img_folder/banner2.jpeg", "../img_folder/banner3.jpeg", "../img_folder/banner4.jpeg", "../img_folder/banner5.jpeg", "../img_folder/AutoPartsBanner.jpg"];

  let currentImageIndex = 0;
  const imageElement = document.getElementById("banner");

  function changeImage() {
        imageElement.style.opacity = 0.7;

        setTimeout(() => {
        imageElement.src = imageSources[currentImageIndex];
        imageElement.style.opacity = 1;
        currentImageIndex = (currentImageIndex + 1)  % imageSources.length;
  }, 1000);}

  //set interval to change image every 2secs/2000ms
  setInterval(changeImage, 4000);


  //For changing text at the top
  
  const divElement = document.getElementById('changetxt');
      const textArray = ['Welcome!👋', 'Explore our best prices', 'Enjoy the unlimited discounts']; // Array of texts

      let currentIndex = 0;

      function changeText() {
        divElement.style.transform = 'translateX(-100%)'; // Move text out of the viewport
        setTimeout(() => {
          divElement.textContent = textArray[currentIndex];
          divElement.style.transform = 'translateX(0)'; // Move text back to its original position
          currentIndex = (currentIndex + 1) % textArray.length; // Increment index, loop back to 0 when reaches end
        }, 500); // Delay to allow the text to move out of the viewport before changing content
      }

      setInterval(changeText, 5000); // Change text every 5 seconds





     
    
    