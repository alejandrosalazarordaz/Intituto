// ══════════════════════════════════════
// MODO MANTENIMIENTO
// Puedes activarlo de 2 formas:
// 1) Cambiando esta variable a "true" y subiendo el cambio a GitHub.
// 2) Usando el botón "⚙️ Mantenimiento" en la esquina (queda guardado
//    en este navegador con localStorage, útil para pruebas rápidas).
// ══════════════════════════════════════
const MODO_MANTENIMIENTO = false;

const mantenimientoActivo =
  MODO_MANTENIMIENTO || localStorage.getItem('maintenanceMode') === 'true';

if (mantenimientoActivo) {
  mostrarPantallaMantenimiento();
} else {
  iniciarSitio();
}

function mostrarPantallaMantenimiento() {
  document.body.innerHTML = `
    <div class="maintenance-screen">
      <h1>🚧 Estamos mejorando el sitio</h1>
      <p>Volvemos pronto. Gracias por tu paciencia.</p>
      <p>Para dudas, contáctanos por WhatsApp.</p>
      <button id="salirMantenimiento" class="maintenance-exit-btn">
        Salir del modo mantenimiento
      </button>
    </div>
  `;

  // Botón discreto para que el administrador pueda desactivarlo
  // sin tener que tocar el código (solo afecta a este navegador).
  document.getElementById('salirMantenimiento').addEventListener('click', () => {
    localStorage.setItem('maintenanceMode', 'false');
    location.reload();
  });
}

function iniciarSitio() {

  // Cada bloque va en su propio try/catch: si un elemento no existe en
  // esta página (por ejemplo, una página que no tiene formulario),
  // el resto de las funciones (dark mode, whatsapp, etc.) igual funcionan.

  // Smooth scrolling para links normales del nav
  try {
    document.querySelectorAll('nav ul li a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  } catch (err) {
    console.error('Error en smooth scroll:', err);
  }

  // Botón "Conocer más"
  try {
    const btnInfo = document.getElementById('btnInfo');
    if (btnInfo) {
      btnInfo.addEventListener('click', function () {
        document.getElementById('nosotros').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  } catch (err) {
    console.error('Error en btnInfo:', err);
  }

  // Formulario de contacto
  try {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const nombre = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const mensaje = this.querySelector('textarea').value;
        if (nombre && email && mensaje) {
          alert(`Gracias ${nombre}, tu mensaje ha sido enviado. Nos pondremos en contacto pronto.`);
          this.reset();
        } else {
          alert('Por favor completa todos los campos.');
        }
      });
    }
  } catch (err) {
    console.error('Error en contactForm:', err);
  }

  // Resaltar link activo al hacer scroll
  try {
    window.addEventListener('scroll', function () {
      let current = '';
      document.querySelectorAll('section[id]').forEach(section => {
        if (pageYOffset >= section.offsetTop - 200) {
          current = section.getAttribute('id');
        }
      });
      document.querySelectorAll('nav ul li a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });
  } catch (err) {
    console.error('Error en scroll spy:', err);
  }

  // ── BUSCADOR ──
  try {
    const searchIndex = [
      { title: "Nosotros", href: "#nosotros", desc: "Propósito, educación centrada en el niño" },
      { title: "Filosofía – Misión", href: "#filosofia", desc: "Formar niños seguros, creativos y autónomos" },
      { title: "Filosofía – Visión", href: "#filosofia", desc: "Aprendizaje constructivo y humano" },
      { title: "Filosofía – Valores", href: "#filosofia", desc: "Respeto, empatía, creatividad, responsabilidad" },
      { title: "Historia", href: "#historia", desc: "Origen y propósito de Kid's College" },
      { title: "Oferta Educativa – Maternal", href: "#oferta", desc: "Programa para los más pequeños" },
      { title: "Oferta Educativa – Preescolar", href: "#oferta", desc: "Etapa preescolar" },
      { title: "Oferta Educativa – Inglés", href: "#oferta", desc: "Aprendizaje del idioma inglés" },
      { title: "Oferta Educativa – Arte", href: "#oferta", desc: "Actividades artísticas y creativas" },
      { title: "Oferta Educativa – Emocional", href: "#oferta", desc: "Desarrollo emocional" },
      { title: "Inscripción", href: "#inscripcion", desc: "Inscripciones abiertas todo el año" },
      { title: "Colegiaturas", href: "#pago", desc: "Métodos de pago disponibles" },
      { title: "Instalaciones – Aulas", href: "#instalaciones", desc: "Espacios para aprendizaje activo" },
      { title: "Instalaciones – Área de juegos", href: "#instalaciones", desc: "Ambiente seguro y divertido" },
      { title: "Instalaciones – Zona creativa", href: "#instalaciones", desc: "Arte, música y creatividad" },
      { title: "Blog – Importancia del juego", href: "#blog", desc: "El juego fortalece la creatividad" },
      { title: "Blog – Educación emocional", href: "#blog", desc: "Reconocer emociones desde pequeños" },
      { title: "Ubicación", href: "#ubicacion", desc: "Monterrey, Nuevo León, México" },
      { title: "Contacto", href: "#contacto", desc: "Envíanos un mensaje" },
    ];

    const searchInput = document.getElementById('navSearch');
    const dropdown = document.getElementById('searchResults');

    if (searchInput && dropdown) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        dropdown.innerHTML = '';

        if (!q) {
          dropdown.classList.remove('visible');
          return;
        }

        const matches = searchIndex.filter(item =>
          item.title.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q)
        );

        if (matches.length === 0) {
          dropdown.innerHTML = '<li class="search-no-results">Sin resultados</li>';
        } else {
          matches.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${item.href}">${item.title}<span>${item.desc}</span></a>`;
            li.querySelector('a').addEventListener('click', (e) => {
              e.preventDefault();
              const target = document.querySelector(item.href);
              if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              searchInput.value = '';
              dropdown.classList.remove('visible');
            });
            dropdown.appendChild(li);
          });
        }

        dropdown.classList.add('visible');
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-search-wrap')) {
          dropdown.classList.remove('visible');
        }
      });
    }
  } catch (err) {
    console.error('Error en buscador:', err);
  }

  // ══════════════════════════════════════
  // MODO OSCURO
  // ══════════════════════════════════════
  try {
    const darkToggle = document.getElementById('darkToggle');
    const body = document.body;

    if (darkToggle) {
      if (localStorage.getItem('darkMode') === 'true') {
        body.classList.add('dark');
        darkToggle.textContent = '☀️';
      }

      darkToggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        const isDark = body.classList.contains('dark');
        darkToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('darkMode', isDark);
      });
    } else {
      console.warn('No se encontró el botón #darkToggle en esta página.');
    }
  } catch (err) {
    console.error('Error en modo oscuro:', err);
  }

  // ══════════════════════════════════════
  // POPUP DE WHATSAPP
  // ══════════════════════════════════════
  try {
    const popup = document.getElementById('whatsappPopup');
    const closePopup = document.getElementById('closePopup');

    if (popup && closePopup) {
      setTimeout(() => {
        popup.classList.add('show');
      }, 5000); // aparece a los 5 segundos

      closePopup.addEventListener('click', () => {
        popup.classList.remove('show');
      });
    }
  } catch (err) {
    console.error('Error en popup de WhatsApp:', err);
  }

  // ══════════════════════════════════════
  // BOTÓN PARA ACTIVAR MODO MANTENIMIENTO
  // (visible en el sitio; solo lo usa quien administra la página)
  // ══════════════════════════════════════
  try {
    const activarMantBtn = document.getElementById('activarMantenimiento');
    if (activarMantBtn) {
      activarMantBtn.addEventListener('click', () => {
        const confirmar = confirm(
          '¿Activar el modo mantenimiento? Los visitantes verán un aviso en lugar del sitio, hasta que lo desactives.'
        );
        if (confirmar) {
          localStorage.setItem('maintenanceMode', 'true');
          mostrarPantallaMantenimiento();
        }
      });
    }
  } catch (err) {
    console.error('Error en botón de mantenimiento:', err);
  }

}
