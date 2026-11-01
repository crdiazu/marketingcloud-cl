// MarketingCloud Studio - Interactive Engine with Gravitational Space Physics
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

  // 2. Elementos del Cursor y Canvas de Fondo
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

  // 3. FÍSICA ESPACIAL: 240 micro-partículas magnéticas de fondo de diferentes tamaños
  var PARTICLE_COUNT = 240;
  var particles = [];

  var colorOptions = [
    'rgba(255, 255, 255, ',     // Blanco estelar
    'rgba(245, 158, 11, ',      // Ámbar cósmico
    'rgba(56, 189, 248, ',      // Cyan orbital
    'rgba(167, 139, 250, '      // Púrpura nebulosa
  ];

  for (var i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      // Tamaños pequeños y variados (entre 0.5px y 2.2px)
      radius: Math.random() * 1.6 + 0.6,
      baseRadius: Math.random() * 1.6 + 0.6,
      color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
      alpha: Math.random() * 0.5 + 0.25,
      baseAlpha: Math.random() * 0.5 + 0.25,
      // Velocidad natural de deriva cósmica
      baseVx: (Math.random() - 0.5) * 0.25,
      baseVy: (Math.random() - 0.5) * 0.25,
      // Velocidad reactiva inducida por gravedad
      vx: 0,
      vy: 0,
      // Masa y reactividad magnética
      mass: Math.random() * 0.8 + 0.4
    });
  }

  // Estela de humo cósmico etéreo
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

    // Bocanadas de estela suave
    smokeTrail.push({
      x: targetMouseX + (Math.random() - 0.5) * 8,
      y: targetMouseY + (Math.random() - 0.5) * 8,
      radius: Math.random() * 18 + 10,
      alpha: 0.35,
      color: colorOptions[Math.floor(Math.random() * colorOptions.length)]
    });
    if (smokeTrail.length > 25) smokeTrail.shift();
  });

  document.addEventListener('mouseleave', function() {
    isVisible = false;
    if (dot) dot.style.opacity = '0';
    if (ring) ring.style.opacity = '0';
  });

  // Bucle de renderizado y simulación física espacial
  function loop() {
    mouseX += (targetMouseX - mouseX) * 0.35;
    mouseY += (targetMouseY - mouseY) * 0.35;
    ringX += (targetMouseX - ringX) * 0.18;
    ringY += (targetMouseY - ringY) * 0.18;

    if (ring && isVisible) {
      ring.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px) translate(-50%, -50%)';
    }

    ctx.clearRect(0, 0, width, height);

    // 1. Dibujar estela de humo tenue detrás del cursor
    for (var s = 0; s < smokeTrail.length; s++) {
      var sm = smokeTrail[s];
      sm.alpha *= 0.92;
      sm.radius += 0.4;
      if (sm.alpha > 0.01) {
        ctx.beginPath();
        ctx.arc(sm.x, sm.y, sm.radius, 0, Math.PI * 2);
        ctx.fillStyle = sm.color + sm.alpha + ')';
        ctx.fill();
      }
    }

    // 2. Simulación de Gravedad y Magnetismo Espacial en las 240 partículas
    var MAGNETIC_RADIUS = 190;

    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var p = particles[i];

      if (isVisible) {
        var dx = mouseX - p.x;
        var dy = mouseY - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAGNETIC_RADIUS && dist > 2) {
          // Fuerza de atracción magnética no lineal
          var force = (1 - dist / MAGNETIC_RADIUS) * 0.65 / p.mass;
          // Atracción hacia el cursor
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;

          // Órbita / giro cósmico sutil
          p.vx += (-dy / dist) * force * 0.28;
          p.vy += (dx / dist) * force * 0.28;

          // Aumento sutil de brillo cerca del cursor
          p.alpha = Math.min(1, p.baseAlpha + (1 - dist / MAGNETIC_RADIUS) * 0.5);
          p.radius = p.baseRadius * (1 + (1 - dist / MAGNETIC_RADIUS) * 0.4);

          // Línea de filamento gravitacional magnético si está muy cerca
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = 'rgba(56, 189, 248, ' + (0.16 * (1 - dist / 110)) + ')';
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.05;
          p.radius += (p.baseRadius - p.radius) * 0.05;
        }
      }

      // Inercia en gravedad cero (fricción espacial)
      p.vx *= 0.94;
      p.vy *= 0.94;

      p.x += p.vx + p.baseVx;
      p.y += p.vy + p.baseVy;

      // Retorno toroidal a la pantalla
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      // Dibujar partícula
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      // Halo sutil para partículas brillantes
      if (p.radius > 1.5) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (p.alpha * 0.18) + ')';
        ctx.fill();
      }
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // 4. Efectos de Alto Contraste en Hover (Texto siempre 100% nítido, sin blur)
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

  // 5. Inclinación 3D Limpia en Tarjetas (Texto intacto y legible)
  var tiltCards = document.querySelectorAll('.service-card, .tile');
  tiltCards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'perspective(900px) rotateX(' + (-y * 5) + 'deg) rotateY(' + (x * 5) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function() {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

})();
