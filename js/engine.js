// MarketingCloud Studio - Interactive Engine
// Physics Mediums: Space Zero-G, Lunar Gravity, Water Viscosity, Plasma, Antigravity
// Keyboard: Hold [Ctrl] for Gravitational Freefall
// Economic Indicators: Dólar & UF Chile
(function() {
  'use strict';

  // 1. Reloj de Estudio - Santiago de Chile (UTC-3)
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

  // 2. Indicadores Económicos de Chile (Dólar y UF)
  function initEconomicIndicators() {
    var usdEl = document.getElementById('val-dolar');
    var ufEl = document.getElementById('val-uf');
    if (usdEl && !usdEl.textContent.trim()) usdEl.textContent = '$972,60';
    if (ufEl && !ufEl.textContent.trim()) ufEl.textContent = '$41.252,94';

    try {
      fetch('https://mindicador.cl/api')
        .then(function(res) { return res.json(); })
        .then(function(data) {
          if (data && data.dolar && usdEl) {
            usdEl.textContent = '$' + data.dolar.valor.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
          }
          if (data && data.uf && ufEl) {
            ufEl.textContent = '$' + data.uf.valor.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          }
        })
        .catch(function() {});
    } catch (e) {}
  }
  initEconomicIndicators();

  // 3. Cursor Reticular y Canvas Cósmico
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

  // 4. Modos de Medio Físico y Gravedad
  // Opciones: 'space' (Zero-G), 'moon' (Lunar), 'water' (Líquido), 'plasma' (Denso), 'antigravity' (Flotación)
  var currentMedium = 'space';
  var isCtrlPressed = false;

  window.addEventListener('keydown', function(e) {
    if (e.key === 'Control' || e.ctrlKey) {
      isCtrlPressed = true;
      var tip = document.getElementById('ctrl-tip');
      if (tip) tip.classList.add('active');
    }
  });

  window.addEventListener('keyup', function(e) {
    if (e.key === 'Control' || !e.ctrlKey) {
      isCtrlPressed = false;
      var tip = document.getElementById('ctrl-tip');
      if (tip) tip.classList.remove('active');
    }
  });

  // Selector de gravedades y medios líquidos
  var mediumSelect = document.getElementById('gravity-fluid-switch');
  if (mediumSelect) {
    mediumSelect.addEventListener('change', function(e) {
      currentMedium = e.target.value;
    });
  }

  var mediumButtons = document.querySelectorAll('.medium-btn');
  mediumButtons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      mediumButtons.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentMedium = btn.getAttribute('data-medium') || 'space';
      if (mediumSelect) mediumSelect.value = currentMedium;
    });
  });

  // 5. Simulación Física de 240 Micro-Partículas
  var PARTICLE_COUNT = 240;
  var particles = [];

  var colorOptions = [
    'rgba(255, 255, 255, ',     // Blanco estelar
    'rgba(245, 158, 11, ',      // Ámbar
    'rgba(56, 189, 248, ',      // Cyan
    'rgba(167, 139, 250, '      // Púrpura
  ];

  for (var i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      baseRadius: Math.random() * 1.5 + 0.5,
      color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
      alpha: Math.random() * 0.45 + 0.2,
      baseAlpha: Math.random() * 0.45 + 0.2,
      baseVx: (Math.random() - 0.5) * 0.16,
      baseVy: (Math.random() - 0.5) * 0.16,
      vx: 0,
      vy: 0,
      mass: Math.random() * 0.8 + 0.4,
      waveOffset: Math.random() * Math.PI * 2
    });
  }

  // Estela suave de ratón
  var smokeTrail = [];

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

    smokeTrail.push({
      x: targetMouseX + (Math.random() - 0.5) * 6,
      y: targetMouseY + (Math.random() - 0.5) * 6,
      radius: Math.random() * 14 + 8,
      alpha: 0.22,
      color: colorOptions[Math.floor(Math.random() * colorOptions.length)]
    });
    if (smokeTrail.length > 18) smokeTrail.shift();
  });

  document.addEventListener('mouseleave', function() {
    isVisible = false;
    if (dot) dot.style.opacity = '0';
    if (ring) ring.style.opacity = '0';
  });

  var timeTick = 0;

  // Bucle de Física Cuántica y Fluidos
  function loop() {
    timeTick += 0.02;

    mouseX += (targetMouseX - mouseX) * 0.28;
    mouseY += (targetMouseY - mouseY) * 0.28;
    ringX += (targetMouseX - ringX) * 0.14;
    ringY += (targetMouseY - ringY) * 0.14;

    if (ring && isVisible) {
      ring.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px) translate(-50%, -50%)';
    }

    ctx.clearRect(0, 0, width, height);

    // 1. Dibujar humo sutil
    for (var s = 0; s < smokeTrail.length; s++) {
      var sm = smokeTrail[s];
      sm.alpha *= 0.92;
      sm.radius += 0.3;
      if (sm.alpha > 0.01) {
        ctx.beginPath();
        ctx.arc(sm.x, sm.y, sm.radius, 0, Math.PI * 2);
        ctx.fillStyle = sm.color + sm.alpha + ')';
        ctx.fill();
      }
    }

    // 2. Parámetros del medio físico actual
    var friction = 0.965;
    var gravityY = 0;
    var fluidWave = false;

    if (isCtrlPressed) {
      // APAGADO DE INGRAVIDEZ / CAÍDA LIBRE AL PRESIONAR CONTROL
      gravityY = 0.42;
      friction = 0.98;
    } else {
      if (currentMedium === 'space') {
        gravityY = 0;
        friction = 0.965;
      } else if (currentMedium === 'moon') {
        gravityY = 0.12;
        friction = 0.975;
      } else if (currentMedium === 'water') {
        gravityY = 0.04;
        friction = 0.91; // Viscosidad líquida
        fluidWave = true;
      } else if (currentMedium === 'plasma') {
        gravityY = 0;
        friction = 0.85; // Miel / Plasma denso
      } else if (currentMedium === 'antigravity') {
        gravityY = -0.22; // Elevación gravitacional
        friction = 0.97;
      }
    }

    var INFLUENCE_RADIUS = 150;

    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var p = particles[i];

      // Aceleración de gravedad del medio
      p.vy += gravityY * p.mass;

      // Ondulación fluida si es medio líquido
      if (fluidWave) {
        p.vx += Math.sin(timeTick + p.waveOffset) * 0.06;
      }

      // Perturbación cósmica aleatoria suave
      p.vx += (Math.random() - 0.5) * 0.03;
      p.vy += (Math.random() - 0.5) * 0.03;

      // Interacción con ratón (si no está cayendo por Ctrl)
      if (isVisible && !isCtrlPressed) {
        var dx = mouseX - p.x;
        var dy = mouseY - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < INFLUENCE_RADIUS && dist > 5) {
          var normDist = 1 - dist / INFLUENCE_RADIUS;
          var pull = normDist * 0.18 / p.mass;
          p.vx += (dx / dist) * pull;
          p.vy += (dy / dist) * pull;
          // Pequeña curvatura
          p.vx += (-dy / dist) * pull * 0.15;
          p.vy += (dx / dist) * pull * 0.15;
          p.alpha = Math.min(0.85, p.baseAlpha + normDist * 0.3);
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.03;
        }
      }

      // Fricción / resistencia del medio
      p.vx *= friction;
      p.vy *= friction;

      p.x += p.vx + p.baseVx;
      p.y += p.vy + p.baseVy;

      // Rebote o retorno por bordes
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      if (isCtrlPressed || currentMedium === 'moon') {
        // En caída libre, si tocan el fondo rebotan sutilmente
        if (p.y > height - 5) {
          p.y = height - 5;
          p.vy = -p.vy * 0.35;
        }
      } else if (currentMedium === 'antigravity') {
        if (p.y < 0) p.y = height;
      } else {
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      }

      // Renderizar partícula
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // 6. Efecto Hover de Alto Contraste
  var hoverElements = document.querySelectorAll('a, button, .service-card, .tile, .project-giant-item, h1, h2, h3, .chip, select');
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

  // 7. Inclinación 3D en Tarjetas
  var tiltCards = document.querySelectorAll('.service-card, .tile');
  tiltCards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'perspective(900px) rotateX(' + (-y * 4) + 'deg) rotateY(' + (x * 4) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function() {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // 8. Kinetic Scroll Parallax en Tipografía Brutalista
  var kLine2 = document.querySelector('.kinetic-line-2');
  var kLine3 = document.querySelector('.kinetic-line-3');
  window.addEventListener('scroll', function() {
    var scrolled = window.pageYOffset || document.documentElement.scrollTop;
    if (kLine2) {
      kLine2.style.transform = 'translateX(' + (-scrolled * 0.16) + 'px)';
    }
    if (kLine3) {
      kLine3.style.transform = 'translateX(' + (scrolled * 0.16) + 'px)';
    }
  }, { passive: true });


  // 9. Left Vertical Scroll-Rail Progress Tracker ("Menú que se arma al bajar")
  var railFill = document.getElementById('scroll-rail-fill');
  var railItems = document.querySelectorAll('.rail-item');
  var trackedSections = ['inicio', 'servicios', 'menu-inteligente', 'proyectos', 'contacto'];

  window.addEventListener('scroll', function() {
    var winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolledPercent = height > 0 ? (winScroll / height) * 100 : 0;

    if (railFill) {
      railFill.style.height = scrolledPercent + '%';
    }

    var currentSec = 'inicio';
    trackedSections.forEach(function(secId) {
      var el = document.getElementById(secId);
      if (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45) {
          currentSec = secId;
        }
      }
    });

    railItems.forEach(function(item) {
      if (item.getAttribute('data-section') === currentSec) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }, { passive: true });

})();
