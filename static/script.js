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

function toggleSidebar() {
  const layout = document.getElementById('mainLayout');
  layout.classList.toggle('sidebar-collapsed');
}