
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

        //.oth categories scroll button
      document.addEventListener("DOMContentLoaded", function() {
        const scrollContainer = document.getElementById("scrollContainer");
        const btn1 = document.getElementById("btn1");
        const btn2 = document.getElementById("btn2");

        btn1.addEventListener("click", function () {
          scrollContainer.scrollLeft -= 300;
        });

        btn2.addEventListener("click", function () {
          scrollContainer.scrollLeft += 300;
        })
      });
      

      