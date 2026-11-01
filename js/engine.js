// MarketingCloud Studio - Interactive Engine
(function() {
  'use strict';

  // 1. Timecode de Santiago de Chile (UTC-3)
  function updateSantiagoTime() {
    var timeEl = document.getElementById('live-timecode');
    if (!timeEl) return;
    var now = new Date();
    var santiagoTime = new Intl.DateTimeFormat('es-CL', {
      timeZone: 'America/Santiago',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(now);
    timeEl.textContent = santiagoTime;
  }
  setInterval(updateSantiagoTime, 1000);
  updateSantiagoTime();

  // 2. Cursor Reticular Espacial + Canvas de Nebulosa Cósmica
  var dot = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');
  var canvas = document.getElementById('nebula-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var width = (canvas.width = window.innerWidth);
  var height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', function() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  var mouseX = width / 2;
  var mouseY = height / 2;
  var targetMouseX = mouseX;
  var targetMouseY = mouseY;
  var ringX = mouseX;
  var ringY = mouseY;
  var isVisible = false;

  // Partículas de estela de ratón y estrellas de fondo
  var particles = [];
  var ambientStars = [];

  // Crear 50 estrellas de fondo sutiles que flotan lentamente
  for (var s = 0; s < 50; s++) {
    ambientStars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.4 + 0.1,
      speedY: (Math.random() - 0.5) * 0.15,
      speedX: (Math.random() - 0.5) * 0.15
    });
  }

  // Paleta cósmica: Ámbar estelar, Cyan hiperespacial, Púrpura nebulosa, Esmeralda
  var nebulaPalettes = [
    { r: 245, g: 158, b: 11 },   // Ámbar
    { r: 56,  g: 189, b: 248 },  // Cyan
    { r: 167, g: 139, b: 250 },  // Púrpura
    { r: 16,  g: 185, b: 129 }   // Esmeralda
  ];

  window.addEventListener('mousemove', function(e) {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      if (dot) dot.style.opacity = '1';
      if (ring) ring.style.opacity = '1';
    }

    if (dot) {
      dot.style.transform = 'translate(' + targetMouseX + 'px, ' + targetMouseY + 'px) translate(-50%, -50%)';
    }

    // Generar bocanadas de nube cósmica con disipación etérea prolongada
    for (var i = 0; i < 3; i++) {
      var col = nebulaPalettes[Math.floor(Math.random() * nebulaPalettes.length)];
      particles.push({
        x: targetMouseX + (Math.random() - 0.5) * 14,
        y: targetMouseY + (Math.random() - 0.5) * 14,
        radius: Math.random() * 24 + 16,
        r: col.r,
        g: col.g,
        b: col.b,
        alpha: 0.58,
        decay: Math.random() * 0.005 + 0.004, // Desvanecimiento suave y lento
        grow: Math.random() * 0.5 + 0.35,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6
      });
    }
  });

  document.addEventListener('mouseleave', function() {
    isVisible = false;
    if (dot) dot.style.opacity = '0';
    if (ring) ring.style.opacity = '0';
  });

  // Animación interactiva en Loop
  function render() {
    mouseX += (targetMouseX - mouseX) * 0.35;
    mouseY += (targetMouseY - mouseY) * 0.35;
    ringX += (targetMouseX - ringX) * 0.18;
    ringY += (targetMouseY - ringY) * 0.18;

    if (ring && isVisible) {
      ring.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px) translate(-50%, -50%)';
    }

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);

    // 1. Dibujar polvo estelar ambiental suave
    for (var a = 0; a < ambientStars.length; a++) {
      var st = ambientStars[a];
      st.x += st.speedX;
      st.y += st.speedY;
      if (st.x < 0) st.x = width;
      if (st.x > width) st.x = 0;
      if (st.y < 0) st.y = height;
      if (st.y > height) st.y = 0;

      ctx.beginPath();
      ctx.arc(st.x, st.y, st.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, ' + st.alpha + ')';
      ctx.fill();
    }

    // 2. Dibujar estela de nube de ratón con mezcla aditiva
    ctx.globalCompositeOperation = 'lighter';

    for (var j = particles.length - 1; j >= 0; j--) {
      var p = particles[j];
      p.x += p.vx;
      p.y += p.vy;
      p.radius += p.grow;
      p.alpha -= p.decay;

      if (p.alpha <= 0.01) {
        particles.splice(j, 1);
        continue;
      }

      var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
      grad.addColorStop(0, 'rgba(' + p.r + ',' + p.g + ',' + p.b + ',' + (p.alpha * 0.85) + ')');
      grad.addColorStop(0.45, 'rgba(' + p.r + ',' + p.g + ',' + p.b + ',' + (p.alpha * 0.35) + ')');
      grad.addColorStop(1, 'rgba(' + p.r + ',' + p.g + ',' + p.b + ', 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // 3. Efectos de Alto Contraste en Hover (CERO desenfoque en textos al apuntar)
  var hoverElements = document.querySelectorAll('a, button, .service-card, .tile, .project-giant-item, h1, h2, h3, .chip');
  hoverElements.forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      if (ring) ring.classList.add('active');
      if (dot) dot.classList.add('active');
    });
    el.addEventListener('mouseleave', function() {
      if (ring) ring.classList.remove('active');
      if (dot) dot.classList.remove('active');
    });
  });

  // 4. Inclinación 3D en Tarjetas
  var tiltCards = document.querySelectorAll('.service-card, .tile');
  tiltCards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'perspective(900px) rotateX(' + (-y * 6) + 'deg) rotateY(' + (x * 6) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function() {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // 5. ENFOQUE SPOTLIGHT: Atenúa y difumina todas las demás tarjetas al enfocar una
  var allCards = document.querySelectorAll('.service-card, .tile, .project-giant-item');
  allCards.forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      document.body.classList.add('spotlight-active');
      card.classList.add('is-focused');
    });
    card.addEventListener('mouseleave', function() {
      card.classList.remove('is-focused');
      document.body.classList.remove('spotlight-active');
    });
  });

  // 6. ASIGNACIÓN ALEATORIA: Efecto Glitch y Desfase Z-Index (Texto pasa atrás de partículas)
  function applyRandomGlitchModes() {
    var serviceCards = Array.from(document.querySelectorAll('.service-card'));
    var projectCards = Array.from(document.querySelectorAll('.project-giant-item'));

    // Limpiar clases previas
    serviceCards.forEach(function(c) { c.classList.remove('glitch-depth-mode'); });
    projectCards.forEach(function(c) { c.classList.remove('glitch-depth-mode'); });

    // Elegir aleatoriamente 2 servicios y 2 proyectos
    function pickRandom(arr, count) {
      var shuffled = arr.slice().sort(function() { return 0.5 - Math.random(); });
      return shuffled.slice(0, count);
    }

    var selectedServices = pickRandom(serviceCards, 2);
    selectedServices.forEach(function(c) { c.classList.add('glitch-depth-mode'); });

    var selectedProjects = pickRandom(projectCards, 2);
    selectedProjects.forEach(function(c) { c.classList.add('glitch-depth-mode'); });
  }

  applyRandomGlitchModes();

  // Rotar aleatoriamente los modos glitch cada 45 segundos para mantener la web viva
  setInterval(applyRandomGlitchModes, 45000);

})();