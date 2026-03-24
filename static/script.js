//================================
// Header
//================================

const openButton = document.querySelector(".open-menu");
const sluitButton = document.querySelector(".sluit-menu");
const deNav = document.querySelector(".nav-menu");

openButton.addEventListener("click", function() {
  deNav.classList.add("toonMenu");
});

sluitButton.addEventListener("click", function() {
  deNav.classList.remove("toonMenu");
});

window.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    deNav.classList.remove("toonMenu");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("inbeeld");
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll("h1, h2, p").forEach((el) => {
    observer.observe(el);
  });
});


const toggle = document.getElementById("darkToggle");

toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
});
 
