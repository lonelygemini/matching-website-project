//================================
// Header
//================================

const openButton = document.querySelector('.open-menu')
const sluitButton = document.querySelector('.sluit-menu')
const deNav = document.querySelector('.nav-menu')

openButton.addEventListener('click', function() {
  deNav.classList.add('toonMenu')
})

sluitButton.addEventListener('click', function() {
  deNav.classList.remove('toonMenu')
})

window.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    deNav.classList.remove('toonMenu')
  }
})
'', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('inbeeld')
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('h1, h2, p').forEach((el) => {
    observer.observe(el)
  })
}


const toggle = document.getElementById('darkToggle')

toggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode')
})

const logo = document.getElementById('logo')
const icon = document.getElementById('profileIcon')

toggle.addEventListener('change', () => {
  if (document.body.classList.contains('dark-mode')) {
    logo.src = '/logo-variants/text-only-logo-dark.png'
    icon.src = '/images/profiel-dark.png'
  } else {
    logo.src = '/logo-variants/text-only-logo.png'
    icon.src = '/images/profiel.png'
  }
})


function toggleSidebar() {
  const layout = document.getElementById('mainLayout')
  layout.classList.toggle('sidebar-collapsed')
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
        if (fotoInput.files.length > 0) {
          melding.classList.add('show');
        } else {
          melding.classList.remove('show');
        }
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFotoMelding);
  } else {
    initFotoMelding();
  }
}

//================================
// Melding weet je zeker dat je wilt verwijderen
//================================

{
  const initDeleteDialog = () => {
      const dialog = document.getElementById('delete-dialog');
      const openBtn = document.getElementById('open-delete-dialog');
      const closeBtn = document.getElementById('close-delete-dialog');

      if (dialog && openBtn && closeBtn) {
          openBtn.addEventListener('click', () => {
              dialog.showModal(); 
          });

          closeBtn.addEventListener('click', () => {
              dialog.close(); 
          });
// favorites
//================================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.favorite-btn').forEach(btn => {

    btn.addEventListener('click', async () => {
      const jobId = btn.dataset.id

      const isActive = btn.classList.contains('active')

      const url = isActive 
        ? `/favorites/remove/${jobId}` 
        : `/favorites/add/${jobId}`

      const response = await fetch(url, {
        method: 'POST'
      })

      const data = await response.json()

      if (data.success) {
        btn.classList.toggle('active')

        if (btn.classList.contains('active')) {
          btn.textContent = 'Opgeslagen aan favorieten'
        } else {
          btn.textContent = 'Toevoegen aan favorieten'
        }
      }
    })

  })
})



 
          dialog.addEventListener('click', (e) => {
              if (e.target === dialog) {
                  dialog.close();
              }
          });
      }
  };

  if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initDeleteDialog);
  } else {
      initDeleteDialog();
  }
}
