//================================
// Header
//================================
const openButton = document.querySelector(".open-menu");
const sluitButton = document.querySelector(".sluit-menu");
const deNav = document.querySelector(".nav-menu");

if (openButton && deNav) {
  openButton.addEventListener("click", () => deNav.classList.add("toonMenu"));
}

if (sluitButton && deNav) {
  sluitButton.addEventListener("click", () => deNav.classList.remove("toonMenu"));
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && deNav) {
    deNav.classList.remove("toonMenu");
  }
});

// Intersection Observer voor animaties
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("inbeeld");
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll("h1, h2, p").forEach((el) => observer.observe(el));
});

// Dark Mode
const toggle = document.getElementById("darkToggle");
if (toggle) {
  toggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
    const logo = document.getElementById("logo");
    const icon = document.getElementById("profileIcon");
    
    if (document.body.classList.contains("dark-mode")) {
      if (logo) logo.src = "/logo-variants/text-only-logo-dark.png";
      if (icon) icon.src = "/images/profiel-dark.png";
    } else {
      if (logo) logo.src = "/logo-variants/text-only-logo.png";
      if (icon) icon.src = "/images/profiel.png";
    }
  });
}

//================================
// Melding profielfoto
//================================
{
  const initFotoMelding = () => {
    const fotoInput = document.getElementById('profielfoto-input');
    const melding = document.getElementById('upload-melding');

    if (fotoInput && melding) {
      fotoInput.addEventListener('change', () => {
        fotoInput.files.length > 0 ? melding.classList.add('show') : melding.classList.remove('show');
      });
    }
  };
  document.addEventListener('DOMContentLoaded', initFotoMelding);
}

//================================
// Delete Account Dialog
//================================
{
  const initDeleteDialog = () => {
    const dialog = document.getElementById('delete-dialog');
    const openBtn = document.getElementById('open-delete-dialog');
    const closeBtn = document.getElementById('close-delete-dialog');

    if (dialog && openBtn && closeBtn) {
      openBtn.addEventListener('click', () => dialog.showModal());
      closeBtn.addEventListener('click', () => dialog.close());
      dialog.addEventListener('click', (e) => {
        if (e.target === dialog) dialog.close();
      });
    }
  };
  document.addEventListener('DOMContentLoaded', initDeleteDialog);
}

//================================
// Favorites (Code van teamgenoot)
//================================
{
  const initFavorites = () => {
    document.querySelectorAll(".favorite-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const jobId = btn.dataset.id;
        const isActive = btn.classList.contains("active");
        const url = isActive ? `/favorites/remove/${jobId}` : `/favorites/add/${jobId}`;

        try {
          const response = await fetch(url, { method: "POST" });
          const data = await response.json();

          if (data.success) {
            btn.classList.toggle("active");
            btn.textContent = btn.classList.contains("active") 
              ? "Opgeslagen aan favorieten" 
              : "Toevoegen aan favorieten";
          }
        } catch (err) {
          console.error("Fout bij favorieten:", err);
        }
      });
    });
  };
  document.addEventListener('DOMContentLoaded', initFavorites);
}
