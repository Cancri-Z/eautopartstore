 //Hide list by toggling
 document.addEventListener("DOMContentLoaded", function () {
    let button = document.getElementById("toggleButton");
    let list = document.getElementById("list");

    button.addEventListener("click", function () {
        list.classList.toggle("hidden");
      });
    });
