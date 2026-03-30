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

const logo = document.getElementById("logo");
const icon = document.getElementById("profileIcon");

toggle.addEventListener("change", () => {
  if (document.body.classList.contains("dark-mode")) {
    logo.src = "/logo-variants/text-only-logo-dark.png";
    icon.src = "/images/profiel-dark.png";
  } else {
    logo.src = "/logo-variants/text-only-logo.png";
    icon.src = "/images/profiel.png";
  }
});


function toggleSidebar() {
  const layout = document.getElementById("mainLayout");
  layout.classList.toggle("sidebar-collapsed");
}

//================================
// favorites
//================================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".favorite-btn").forEach(btn => {

    btn.addEventListener("click", async () => {
      const jobId = btn.dataset.id;

      const isActive = btn.classList.contains("active");

      const url = isActive 
        ? `/favorites/remove/${jobId}` 
        : `/favorites/add/${jobId}`;

      const response = await fetch(url, {
        method: "POST"
      });

      const data = await response.json();

      if (data.success) {
        btn.classList.toggle("active");

        if (btn.classList.contains("active")) {
          btn.textContent = "Opgeslagen aan favorieten";
        } else {
          btn.textContent = "Toevoegen aan favorieten";
        }
      }
    });

  });
});

 
