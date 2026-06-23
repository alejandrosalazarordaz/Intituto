Sí, hay un conflicto. El problema es que tienes **dos listeners de click en los mismos links**:

1. El primero al inicio del archivo atrapa **todos** los `a[href^="#"]` con `e.preventDefault()` y hace scroll
2. El del buscador también agrega un listener — pero como el primero ya llamó `preventDefault()`, el `href` nativo nunca ejecuta

Además, el listener del buscador en tu versión actual **no tiene** `e.preventDefault()` ni `scrollIntoView`, así que ninguno de los dos llega a navegar correctamente.

Reemplaza tu `script.js` completo con esto:

```javascript
// Smooth scrolling para links normales del nav
document.querySelectorAll('nav ul li a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Botón "Conocer más"
document.getElementById('btnInfo').addEventListener('click', function () {
  document.getElementById('nosotros').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Formulario de contacto
document.getElementById('contactForm').addEventListener('submit', function (e) {
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

// Resaltar link activo al hacer scroll
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

// ── BUSCADOR ──
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
```

El cambio clave: el primer selector cambió de `a[href^="#"]` a `nav ul li a[href^="#"]` para que **no atrape los links del dropdown**, y el buscador ahora maneja su propio `preventDefault` + `scrollIntoView` de forma independiente.
