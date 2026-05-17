// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Handle "Conocer más" button
document.getElementById('btnInfo').addEventListener('click', function () {
  document.getElementById('nosotros').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
});

// Handle contact form submission
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  
  const nombre = this.querySelector('input[type="text"]').value;
  const email = this.querySelector('input[type="email"]').value;
  const mensaje = this.querySelector('textarea').value;
  
  // Validate fields
  if (nombre && email && mensaje) {
    // Show success message
    alert(`Gracias ${nombre}, tu mensaje ha sido enviado. Nos pondremos en contacto pronto.`);
    
    // Reset form
    this.reset();
  } else {
    alert('Por favor completa todos los campos.');
  }
});

// Optional: Add active link highlighting based on scroll position
window.addEventListener('scroll', function () {
  let current = '';
  const sections = document.querySelectorAll('section[id]');
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  document.querySelectorAll('nav a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('active');
    }
  });
});