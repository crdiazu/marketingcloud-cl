// MarketingCloud Studio - Interactive Engine
// 1. Live Santiago Timecode & Chilean Economic Indicators (USD / UF)
// 2. Micro 80's Astronauts (H.E.R.O. Activision Style):
//    - VUELAN LIBREMENTE POR TODA LA PANTALLA EN 2D (NO CAEN NI SE QUEDAN EN EL SUELO)
//    - CHOQUE ELÁSTICO CON LETRAS Y TARJETAS con chispas de colores
//    - PISTOLA MARCIANA MAGNÉTICA: anclaje y tracción hacia tarjetas y títulos
//    - INTERACCIÓN ENTRE ELLOS: rebotes elásticos y enlaces de escuadrón
//    - ULTRA LIVIANO EN MODO CELULAR: DPR optimizado, conteo adaptativo (6 en móvil, 14 en PC)
//    - CERO interferencia con letras de fondo atmosféricas
// 3. 6 Entornos Planetarios con Cambio Total de Color y Atajos de Teclado:
//    - [E] Espacio (Negro, Zero-G)
//    - [T] Tierra (Verde, 1.0g)
//    - [M] Marte (Rojo, 0.38g)
//    - [A] Agua (Azul, Oleaje)
//    - [P] Plasma (Verde Neón, Resistencia)
//    - [C] Cuántico (Púrpura Iridiscente, Oscilante)

(function() {
  'use strict';

  var isMobile = (window.innerWidth <= 768) || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // ==========================================================================
  // 1. TIMECODE EN VIVO - SANTIAGO DE CHILE (UTC-3)
  // ==========================================================================
  function updateSantiagoTime() {
    var timeEl = document.getElementById('live-timecode');
    var mobileTimeEl = document.getElementById('mobile-live-time');
    try {
      var santiagoTime = new Intl.DateTimeFormat('es-CL', {
        timeZone: 'America/Santiago',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(new Date());
      if (timeEl) timeEl.textContent = santiagoTime;
      if (mobileTimeEl) mobileTimeEl.textContent = santiagoTime;
    } catch (e) {}
  }
  setInterval(updateSantiagoTime, 1000);
  updateSantiagoTime();

  // ==========================================================================
  // 2. INDICADORES ECONÓMICOS DE CHILE (DÓLAR Y UF)
  // ==========================================================================
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

  // ==========================================================================
  // 3. CANVAS CÓSMICO Y ADAPTACIÓN LIVIANA MÓVIL
  // ==========================================================================
  var dot = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');
  var canvas = document.getElementById('nebula-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  // En móvil limitamos el DPR a 1.0 para que la GPU rinda a 60 FPS estables sin calentar el teléfono
  var dpr = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.75);
  var width = window.innerWidth;
  var height = window.innerHeight;

  function resizeCanvas() {
    isMobile = (window.innerWidth <= 768) || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    dpr = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.75);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  var mouseX = width / 2;
  var mouseY = height / 2;
  var targetMouseX = mouseX;
  var targetMouseY = mouseY;
  var ringX = mouseX;
  var ringY = mouseY;
  var isVisible = false;

  // Interacción de mouse (solo activa en escritorio o cuando hay cursor)
  if (!isMobile) {
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
    });

    document.addEventListener('mouseleave', function() {
      isVisible = false;
      if (dot) dot.style.opacity = '0';
      if (ring) ring.style.opacity = '0';
    });
  }

  // Interacción táctil en celular (Toque suave atrae al astronauta más cercano)
  window.addEventListener('touchstart', function(e) {
    if (e.touches && e.touches[0]) {
      targetMouseX = e.touches[0].clientX;
      targetMouseY = e.touches[0].clientY;
      mouseX = targetMouseX;
      mouseY = targetMouseY;
      isVisible = true;
    }
  }, { passive: true });

  window.addEventListener('touchmove', function(e) {
    if (e.touches && e.touches[0]) {
      targetMouseX = e.touches[0].clientX;
      targetMouseY = e.touches[0].clientY;
      isVisible = true;
    }
  }, { passive: true });

  window.addEventListener('touchend', function() {
    setTimeout(function() { isVisible = false; }, 800);
  }, { passive: true });

  // ==========================================================================
  // 4. PLANETAS Y MEDIOS FÍSICOS (ATAJOS E, T, M, A, P, C)
  // ==========================================================================
  var PLANETS = [
    { id: 'espacio', key: 'e', name: 'Espacio', color: 'Negro', icon: '🌌', gravityY: 0.0, friction: 0.985, desc: 'Zero-G cósmico y navegación libre' },
    { id: 'tierra', key: 't', name: 'Tierra', color: 'Verde', icon: '🌍', gravityY: 0.08, friction: 0.98, desc: 'Gravedad terrestre con sustentación activa' },
    { id: 'marte', key: 'm', name: 'Marte', color: 'Rojo', icon: '🪐', gravityY: 0.04, friction: 0.985, desc: 'Gravedad reducida 0.38g y polvo carmesí' },
    { id: 'agua', key: 'a', name: 'Agua', color: 'Azul', icon: '💧', gravityY: 0.02, friction: 0.92, fluidWave: true, desc: 'Viscosidad hidrodinámica y oleaje abisal' },
    { id: 'plasma', key: 'p', name: 'Plasma', color: 'Verde Neón', icon: '⚡', gravityY: 0.015, friction: 0.88, plasma: true, desc: 'Amortiguación magnética y alta fricción' },
    { id: 'cuantico', key: 'c', name: 'Cuántico', color: 'Púrpura', icon: '✦', surreal: true, friction: 0.96, desc: 'Gravedad multidireccional oscilante y destellos' }
  ];

  var currentPlanetIndex = 0;
  var currentPlanet = PLANETS[0];

  var hudToast = document.getElementById('physics-hud-toast');
  var toastTimer = null;

  function showHudToast(text) {
    if (!hudToast) return;
    hudToast.innerHTML = text;
    hudToast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
      hudToast.classList.remove('is-show');
    }, 2200);
  }

  function setPlanet(indexOrId) {
    var foundIndex = 0;
    if (typeof indexOrId === 'number') {
      foundIndex = (indexOrId + PLANETS.length) % PLANETS.length;
    } else {
      for (var i = 0; i < PLANETS.length; i++) {
        if (PLANETS[i].id === indexOrId || PLANETS[i].key === indexOrId) {
          foundIndex = i;
          break;
        }
      }
    }

    currentPlanetIndex = foundIndex;
    currentPlanet = PLANETS[currentPlanetIndex];

    document.body.className = 'mode-' + currentPlanet.id;

    var btns = document.querySelectorAll('.gravity-btn');
    btns.forEach(function(b) {
      if (b.getAttribute('data-mode') === currentPlanet.id) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    var mobilePlanetBtn = document.getElementById('mobile-planet-btn');
    if (mobilePlanetBtn) {
      mobilePlanetBtn.innerHTML = currentPlanet.icon + ' ' + currentPlanet.name;
    }

    showHudToast('<strong>' + currentPlanet.icon + ' ' + currentPlanet.name + ' (' + currentPlanet.color + ')</strong> &nbsp;·&nbsp; ' + currentPlanet.desc.toUpperCase());
  }

  // Atajos de teclado: [E], [T], [M], [A], [P], [C] y [Ctrl]/[Espacio]
  window.addEventListener('keydown', function(e) {
    var k = e.key.toLowerCase();
    if (k === 'e') setPlanet('espacio');
    else if (k === 't') setPlanet('tierra');
    else if (k === 'm') setPlanet('marte');
    else if (k === 'a') setPlanet('agua');
    else if (k === 'p') setPlanet('plasma');
    else if (k === 'c' || k === 's') setPlanet('cuantico');


  });

  // Botones de planetas en barra de estudio
  var planetButtons = document.querySelectorAll('.gravity-btn');
  planetButtons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var mode = btn.getAttribute('data-mode');
      if (mode) setPlanet(mode);
    });
  });

  // Botón ciclar planetas en cabecera móvil
  var mobilePlanetBtn = document.getElementById('mobile-planet-btn');
  if (mobilePlanetBtn) {
    mobilePlanetBtn.addEventListener('click', function(e) {
      e.preventDefault();
      setPlanet(currentPlanetIndex + 1);
    });
  }

  // ==========================================================================
  // 5. ESTRELLAS DE FONDO (ADAPTATIVO)
  // ==========================================================================
  var STAR_COUNT = isMobile ? 32 : 80;
  var stars = [];
  for (var s = 0; s < STAR_COUNT; s++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.2 + 0.35,
      alpha: Math.random() * 0.45 + 0.15,
      twinkleSpeed: Math.random() * 0.03 + 0.01
    });
  }

  var sparks = [];

  // ==========================================================================
  // 6. OPERATIVOS MICRO 80's: VUELO LIBRE 2D (NUNCA CAEN AL FONDO)
  // ==========================================================================
  var OPERATIVE_COUNT = isMobile ? 6 : 14;
  var operatives = [];

  for (var i = 0; i < OPERATIVE_COUNT; i++) {
    operatives.push({
      id: i,
      // Distribuidos naturalmente por toda la pantalla (entre el 10% y el 80% de la altura)
      x: Math.random() * (width - 100) + 50,
      y: Math.random() * (height * 0.70) + 70,

      // Velocidades 2D equilibradas de crucero
      vx: (Math.random() - 0.5) * 1.8,
      vy: (Math.random() - 0.5) * 1.4,
      targetVx: (Math.random() - 0.5) * 2.0,
      targetVy: (Math.random() - 0.5) * 1.6,
      wanderTimer: Math.random() * 90 + 30,

      facingLeft: Math.random() < 0.5,
      tilt: 0,

      // Hélice propulsora chiquita
      rotorAngle: Math.random() * 10,
      rotorSpeed: 0.55,

      // PISTOLA MARCIANA MAGNÉTICA
      magneticBeamActive: false,
      magneticTargetX: 0,
      magneticTargetY: 0,
      magneticBeamTimer: 0,
      magneticCooldown: Math.random() * 80 + 30,

      // INTERACCIÓN ENTRE ELLOS (SQUAD BEAM)
      peerBeamActive: false,
      peerTargetOp: null,
      peerBeamTimer: 0,

      waveOffset: Math.random() * Math.PI * 2
    });
  }

  function drawPixelRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  // Render del astronauta micro con prop-pack y pistola marciana
  function drawMicroAstronaut(ctx, op) {
    ctx.save();
    ctx.translate(Math.round(op.x), Math.round(op.y));

    // Inclinación aerodinámica natural
    ctx.rotate(op.tilt);
    ctx.scale(op.facingLeft ? -1 : 1, 1);

    var p = 1.15; // Escala micro arcade

    // 1. PISTOLA MARCIANA MAGNÉTICA
    var gunX = 3 * p;
    var gunY = -1.5 * p;

    drawPixelRect(ctx, gunX, gunY - p, 4 * p, 2.2 * p, '#E11D48');
    drawPixelRect(ctx, gunX + 2.5 * p, gunY - 1.8 * p, 1.2 * p, 3.8 * p, '#FFEA00');
    drawPixelRect(ctx, gunX + 4.5 * p, gunY - 0.5 * p, 1.5 * p, 1.2 * p, '#38BDF8');

    // 2. HÉLICE CHIQUITA
    var mastX = -0.5 * p;
    var mastY = -8 * p;
    drawPixelRect(ctx, mastX, mastY, 1.2 * p, 2.5 * p, '#CBD5E1');

    var rFrame = Math.floor(op.rotorAngle) % 4;
    var bladeColor = '#FFEA00';
    var hubColor = '#DC2626';

    if (rFrame === 0) {
      drawPixelRect(ctx, -3.5 * p, mastY - p, 7 * p, 1.2 * p, bladeColor);
      drawPixelRect(ctx, -0.6 * p, mastY - p, 1.4 * p, 1.2 * p, hubColor);
    } else if (rFrame === 1) {
      drawPixelRect(ctx, -2.5 * p, mastY - 2 * p, 2 * p, 1.2 * p, bladeColor);
      drawPixelRect(ctx, -0.6 * p, mastY - p, 1.4 * p, 1.2 * p, hubColor);
      drawPixelRect(ctx, 1 * p, mastY, 2 * p, 1.2 * p, bladeColor);
    } else if (rFrame === 2) {
      drawPixelRect(ctx, -0.6 * p, mastY - 3 * p, 1.2 * p, 5 * p, bladeColor);
      drawPixelRect(ctx, -0.6 * p, mastY - p, 1.4 * p, 1.2 * p, hubColor);
    } else {
      drawPixelRect(ctx, 1 * p, mastY - 2 * p, 2 * p, 1.2 * p, bladeColor);
      drawPixelRect(ctx, -0.6 * p, mastY - p, 1.4 * p, 1.2 * p, hubColor);
      drawPixelRect(ctx, -2.5 * p, mastY, 2 * p, 1.2 * p, bladeColor);
    }

    // 3. MOCHILA ROJA PROP-PACK
    drawPixelRect(ctx, -4 * p, -4 * p, 2.5 * p, 5 * p, '#DC2626');
    drawPixelRect(ctx, -4.5 * p, -2.5 * p, 1 * p, 2 * p, '#FFEA00');

    // 4. CASCO CON LENTES AMARILLOS Y BANDA ROJA
    drawPixelRect(ctx, -2 * p, -5.5 * p, 4.5 * p, 3.5 * p, '#FFFFFF');
    drawPixelRect(ctx, -2 * p, -4 * p, 4.5 * p, 1 * p, '#DC2626');
    drawPixelRect(ctx, 0.8 * p, -4.2 * p, 1.8 * p, 1.8 * p, '#FFEA00');

    // 5. CUERPO BLANCO CON CINTURÓN AZUL
    drawPixelRect(ctx, -2 * p, -2 * p, 4.5 * p, 4 * p, '#FFFFFF');
    drawPixelRect(ctx, -2 * p, 0.2 * p, 4.5 * p, 0.9 * p, '#0284C7');

    // 6. PIERNAS Y BOTAS NEGRAS
    drawPixelRect(ctx, -2 * p, 2 * p, 1.6 * p, 2.2 * p, '#FFFFFF');
    drawPixelRect(ctx, 0.9 * p, 2 * p, 1.6 * p, 2.2 * p, '#FFFFFF');
    drawPixelRect(ctx, -2.6 * p, 4.2 * p, 2.2 * p, 1.4 * p, '#0F172A');
    drawPixelRect(ctx, 0.9 * p, 4.2 * p, 2.2 * p, 1.4 * p, '#0F172A');

    ctx.restore();
  }

  // Dibujar el rayo magnético con anillos pulsantes hacia tarjetas o letras
  function drawMartianMagneticRay(ctx, op, timeTick) {
    if (!op.magneticBeamActive) return;

    var startX = op.x + (op.facingLeft ? -10 : 10);
    var startY = op.y - 1;
    var targetX = op.magneticTargetX;
    var targetY = op.magneticTargetY;

    var beamColor = (currentPlanet.id === 'marte') ? '#F87171' :
                    (currentPlanet.id === 'tierra' || currentPlanet.id === 'plasma') ? '#34D399' :
                    (currentPlanet.id === 'agua') ? '#38BDF8' :
                    (currentPlanet.id === 'cuantico') ? '#C084FC' : '#38BDF8';

    // Línea base del rayo tractor
    ctx.save();
    ctx.strokeStyle = beamColor;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(targetX, targetY);
    ctx.stroke();

    // Anillos magnéticos pulsantes concéntricos a lo largo del rayo
    for (var rStep = 0.25; rStep <= 0.85; rStep += 0.3) {
      var pulseOffset = (timeTick * 4 + rStep * 2) % 1;
      var ringT = Math.min(0.95, rStep + pulseOffset * 0.15);
      var rx = startX + (targetX - startX) * ringT;
      var ry = startY + (targetY - startY) * ringT;
      var ringSize = 4 + pulseOffset * 5;

      ctx.beginPath();
      ctx.arc(rx, ry, ringSize, 0, Math.PI * 2);
      ctx.strokeStyle = beamColor;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    // Chispa de impacto en el destino
    ctx.beginPath();
    ctx.arc(targetX, targetY, 3 + Math.sin(timeTick * 12) * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFEA00';
    ctx.fill();

    ctx.restore();
  }

  // Rayo de interacción entre compañeros de escuadrón
  function drawPeerInteractionRay(ctx, op1, op2, timeTick) {
    ctx.save();
    ctx.strokeStyle = (currentPlanet.id === 'plasma') ? 'rgba(52, 211, 153, 0.7)' : 'rgba(56, 189, 248, 0.7)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.lineDashOffset = -timeTick * 20;
    ctx.beginPath();
    ctx.moveTo(op1.x, op1.y);
    ctx.lineTo(op2.x, op2.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  // ==========================================================================
  // 7. LETRAS ATMOSFÉRICAS TRASERAS (SEGUNDA CAPA, CERO COLISIÓN)
  // ==========================================================================
  var cityOffsetX = 0;
  var cityOpacity = 0.20;
  var currentScrollY = window.pageYOffset || 0;
  var lastScrollY = currentScrollY;
  var scrollVelocity = 0;

  window.addEventListener('scroll', function() {
    currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
    scrollVelocity = Math.abs(currentScrollY - lastScrollY);
    lastScrollY = currentScrollY;
  }, { passive: true });

  function renderAtmosphericBackgroundLetters(ctx) {
    if (cityOpacity <= 0.01) return;

    ctx.save();
    ctx.globalAlpha = Math.min(0.18, cityOpacity);

    var fontSize = Math.max(50, Math.round(width * (isMobile ? 0.08 : 0.065)));
    ctx.font = '900 ' + fontSize + 'px "Space Grotesk", sans-serif';
    ctx.textBaseline = 'alphabetic';

    var baseY = height * 0.88;
    var w1 = 'VENTAJA';
    var w2 = 'COMPETITIVA';
    var w3 = 'DIGITAL';

    var widthW1 = ctx.measureText(w1).width;
    var widthW2 = ctx.measureText(w2).width;
    var widthW3 = ctx.measureText(w3).width;
    var wordGap = fontSize * 0.25;
    var phraseGap = fontSize * 1.2;
    var singlePhraseWidth = widthW1 + widthW2 + widthW3 + (wordGap * 2) + phraseGap;

    var startX = -(cityOffsetX % singlePhraseWidth);
    var repeatCount = Math.ceil(width / singlePhraseWidth) + 2;

    for (var r = 0; r < repeatCount; r++) {
      var curX = startX + (r * singlePhraseWidth);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillText(w1, curX, baseY);
      curX += widthW1 + wordGap;

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.40)';
      ctx.lineWidth = 4;
      ctx.strokeText(w2, curX, baseY);
      curX += widthW2 + wordGap;

      ctx.fillStyle = 'rgba(245, 158, 11, 0.50)';
      ctx.fillText(w3, curX, baseY);
    }

    ctx.restore();
  }

  // ==========================================================================
  // 8. CACHÉ INTELIGENTE DE OBSTÁCULOS (TARJETAS Y LETRAS DESTACADAS)
  // ==========================================================================
  // "Y QUE CHOQUEN CON LAS LETRAS, LAS TARJETAS SOLIDAS CON IMAGEN DIFUMINADA ESTA PERFECT"
  var contentBoxes = [];
  var boxUpdateCooldown = 0;

  function refreshContentBoxes() {
    contentBoxes = [];
    var selectors = '.service-card, .tile, .price-card, .project-giant-item, .chroma-title, .brutalist-title, .kinetic-text-wrap, .stat-tile, .card';
    var elements = document.querySelectorAll(selectors);

    for (var i = 0; i < elements.length; i++) {
      var rect = elements[i].getBoundingClientRect();
      // Solo consideramos elementos actualmente visibles en el viewport
      if (rect.bottom > 20 && rect.top < height - 20 && rect.width > 30 && rect.height > 20) {
        contentBoxes.push({
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
          centerX: (rect.left + rect.right) / 2,
          centerY: (rect.top + rect.bottom) / 2
        });
      }
    }
  }

  refreshContentBoxes();
  window.addEventListener('resize', refreshContentBoxes);
  window.addEventListener('scroll', function() {
    if (boxUpdateCooldown <= 0) {
      refreshContentBoxes();
      boxUpdateCooldown = 15;
    }
  }, { passive: true });

  // ==========================================================================

  // ==========================================================================
  // 5.1 EFECTOS ATMOSFÉRICOS ESPECIALIZADOS POR PLANETA
  // (Marte con viento, Agua con plantas, Espacio con más estrellas)
  // ==========================================================================
  
  // A. VIENTO Y TORMENTA DE POLVO EN MARTE
  var martianWinds = [];
  var WIND_COUNT = isMobile ? 18 : 36;
  for (var wIdx = 0; wIdx < WIND_COUNT; wIdx++) {
    martianWinds.push({
      x: Math.random() * width,
      y: Math.random() * height,
      len: Math.random() * 45 + 25,
      speed: Math.random() * 4 + 3.5,
      alpha: Math.random() * 0.35 + 0.15,
      thick: Math.random() * 1.5 + 0.8
    });
  }

  function renderMartianWind(ctx) {
    if (currentPlanet.id !== 'marte') return;
    ctx.save();
    for (var w = 0; w < martianWinds.length; w++) {
      var wind = martianWinds[w];
      wind.x -= wind.speed; // Viento sopla de derecha a izquierda
      wind.y += Math.sin(timeTick * 3 + w) * 0.4;
      if (wind.x < -60) {
        wind.x = width + 60;
        wind.y = Math.random() * height;
      }

      ctx.strokeStyle = 'rgba(239, 68, 68, ' + wind.alpha + ')';
      ctx.lineWidth = wind.thick;
      ctx.beginPath();
      ctx.moveTo(wind.x, wind.y);
      ctx.lineTo(wind.x + wind.len, wind.y);
      ctx.stroke();

      // Partículas pequeñas de polvo carmesí arrastradas por la ráfaga
      if (w % 3 === 0) {
        ctx.fillStyle = 'rgba(248, 113, 113, ' + (wind.alpha * 1.2) + ')';
        ctx.fillRect(wind.x - 4, wind.y - 1, 2, 2);
      }
    }
    ctx.restore();
  }

  // B. PLANTAS MARINAS Y BURBUJAS EN AGUA
  var waterPlants = [];
  var PLANT_COUNT = isMobile ? 5 : 9;
  for (var pIdx = 0; pIdx < PLANT_COUNT; pIdx++) {
    waterPlants.push({
      id: pIdx,
      baseX: (width / (PLANT_COUNT + 1)) * (pIdx + 1) + (Math.random() - 0.5) * 40,
      height: Math.random() * 160 + 120,
      swaySpeed: Math.random() * 0.02 + 0.015,
      swayAmount: Math.random() * 35 + 25,
      widthFrond: Math.random() * 4 + 3
    });
  }

  var waterBubbles = [];
  var BUBBLE_COUNT = isMobile ? 12 : 24;
  for (var bIdx = 0; bIdx < BUBBLE_COUNT; bIdx++) {
    waterBubbles.push({
      id: bIdx,
      x: Math.random() * width,
      y: height + Math.random() * 100,
      radius: Math.random() * 3 + 1.5,
      speed: Math.random() * 1.2 + 0.6,
      wobbleSpeed: Math.random() * 0.04 + 0.02,
      alpha: Math.random() * 0.4 + 0.2
    });
  }

  function renderWaterEnvironment(ctx) {
    if (currentPlanet.id !== 'agua') return;
    ctx.save();

    // 1. Plantas marinas / algas abisales ondulantes
    for (var p = 0; p < waterPlants.length; p++) {
      var pl = waterPlants[p];
      var baseY = height;
      var tipY = height - pl.height;
      var tipX = pl.baseX + Math.sin(timeTick * 2.2 + pl.id) * pl.swayAmount;
      var cp1X = pl.baseX + Math.sin(timeTick * 1.5 + pl.id) * (pl.swayAmount * 0.4);
      var cp1Y = height - (pl.height * 0.4);
      var cp2X = pl.baseX + Math.sin(timeTick * 2.0 + pl.id) * (pl.swayAmount * 0.8);
      var cp2Y = height - (pl.height * 0.75);

      var grad = ctx.createLinearGradient(pl.baseX, baseY, tipX, tipY);
      grad.addColorStop(0, 'rgba(6, 78, 59, 0.45)');
      grad.addColorStop(0.5, 'rgba(16, 185, 129, 0.35)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0.55)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = pl.widthFrond;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(pl.baseX, baseY);
      ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, tipX, tipY);
      ctx.stroke();

      // Hoja bioluminiscente en la punta
      ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.beginPath();
      ctx.arc(tipX, tipY, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Burbujas subiendo
    for (var b = 0; b < waterBubbles.length; b++) {
      var bub = waterBubbles[b];
      bub.y -= bub.speed;
      bub.x += Math.sin(timeTick * 3 + bub.id) * 0.6;
      if (bub.y < -20) {
        bub.y = height + 20;
        bub.x = Math.random() * width;
      }

      ctx.strokeStyle = 'rgba(125, 211, 252, ' + bub.alpha + ')';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(bub.x, bub.y, bub.radius, 0, Math.PI * 2);
      ctx.stroke();
      // Pequeño reflejo
      ctx.fillStyle = 'rgba(255, 255, 255, ' + (bub.alpha * 0.8) + ')';
      ctx.fillRect(bub.x - bub.radius * 0.4, bub.y - bub.radius * 0.4, 1.2, 1.2);
    }

    ctx.restore();
  }

  // C. MARCAS DE LÁSER Y SOLDADURA EN LAS TARJETAS
  // "y que los astronautas con su rayo hagan marcas en la tarjetas"
  var laserMarks = [];
  var MAX_LASER_MARKS = 40;

  function addLaserMark(x, y) {
    if (laserMarks.length >= MAX_LASER_MARKS) {
      laserMarks.shift(); // Quitar la más vieja
    }
    laserMarks.push({
      x: x,
      y: y,
      radius: Math.random() * 4 + 3.5,
      life: 1.0,
      decay: 0.0035, // Dura varios segundos
      color: (currentPlanet.id === 'marte') ? '#F87171' :
             (currentPlanet.id === 'plasma') ? '#4ADE80' :
             (currentPlanet.id === 'agua') ? '#38BDF8' :
             (currentPlanet.id === 'cuantico') ? '#C084FC' : '#FFEA00'
    });
  }

  function renderLaserMarks(ctx) {
    for (var mIdx = laserMarks.length - 1; mIdx >= 0; mIdx--) {
      var mark = laserMarks[mIdx];
      mark.life -= mark.decay;
      if (mark.life <= 0) {
        laserMarks.splice(mIdx, 1);
        continue;
      }

      ctx.save();
      // 1. Halo incandescente
      var glowRad = mark.radius * (1.5 + mark.life);
      var grad = ctx.createRadialGradient(mark.x, mark.y, 0, mark.x, mark.y, glowRad);
      grad.addColorStop(0, mark.color);
      grad.addColorStop(0.4, 'rgba(255, 234, 0, ' + (mark.life * 0.8) + ')');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(mark.x, mark.y, glowRad, 0, Math.PI * 2);
      ctx.fill();

      // 2. Quemadura o cicatriz oscura central
      ctx.fillStyle = 'rgba(20, 20, 20, ' + (mark.life * 0.9) + ')';
      ctx.beginPath();
      ctx.arc(mark.x, mark.y, mark.radius * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // 3. Destello ardiente en el centro si es reciente
      if (mark.life > 0.4) {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(mark.x, mark.y, mark.radius * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // 9. BUCLE PRINCIPAL DE FÍSICA Y SIMULACIÓN
  // ==========================================================================
  var timeTick = 0;

  function loop() {
    timeTick += 0.02;
    scrollVelocity *= 0.90;

    if (boxUpdateCooldown > 0) {
      boxUpdateCooldown--;
    } else {
      // Actualización periódica liviana (cada 35 frames)
      refreshContentBoxes();
      boxUpdateCooldown = 35;
    }

    // Suavizado de cursor en escritorio
    if (!isMobile && isVisible) {
      mouseX += (targetMouseX - mouseX) * 0.28;
      mouseY += (targetMouseY - mouseY) * 0.28;
      ringX += (targetMouseX - ringX) * 0.14;
      ringY += (targetMouseY - ringY) * 0.14;

      if (ring) {
        ring.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px) translate(-50%, -50%)';
      }
    }

    ctx.clearRect(0, 0, width, height);

    // Movimiento sutil de monolitos de fondo
    var isCityActive = (currentScrollY > 180);
    var targetCityOpacity = isCityActive ? 0.20 : 0;
    cityOpacity += (targetCityOpacity - cityOpacity) * 0.08;

    if (cityOpacity > 0.01) {
      cityOffsetX += 1.0 + (scrollVelocity * 0.4);
    }

    // 1. Estrellas de fondo (densidad aumentada en Espacio)
    renderMartianWind(ctx);
    renderWaterEnvironment(ctx);
    renderLaserMarks(ctx);
    // 1. Estrellas de fondo
    for (var s = 0; s < STAR_COUNT; s++) {
      var st = stars[s];
      var tw = Math.sin(timeTick * 2 + s) * 0.15;
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.radius, 0, Math.PI * 2);

      var starColor = (currentPlanet.id === 'tierra') ? 'rgba(52, 211, 153, ' :
                      (currentPlanet.id === 'marte') ? 'rgba(248, 113, 113, ' :
                      (currentPlanet.id === 'agua') ? 'rgba(125, 211, 252, ' :
                      (currentPlanet.id === 'plasma') ? 'rgba(134, 239, 172, ' :
                      (currentPlanet.id === 'cuantico') ? 'rgba(233, 213, 255, ' :
                      'rgba(255, 255, 255, ';

      ctx.fillStyle = starColor + Math.max(0.06, st.alpha + tw) + ')';
      ctx.fill();
    }

    // 2. Letras atmosféricas traseras
    renderAtmosphericBackgroundLetters(ctx);

    // 3. Chispas de impacto con letras o tarjetas
    for (var spIdx = sparks.length - 1; spIdx >= 0; spIdx--) {
      var spk = sparks[spIdx];
      spk.x += spk.vx;
      spk.y += spk.vy;
      spk.life -= 0.05;
      if (spk.life <= 0) {
        sparks.splice(spIdx, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(spk.x, spk.y, spk.life * 2, 0, Math.PI * 2);
      ctx.fillStyle = spk.color;
      ctx.globalAlpha = spk.life;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    // 4. Parámetros del entorno
    var friction = currentPlanet.friction || 0.98;

    // ======================================================================
    // 5. OPERATIVOS MICRO: VUELO LIBRE 2D CONTINUO (NO CAEN AL FONDO)
    // ======================================================================
    for (var opIdx = 0; opIdx < OPERATIVE_COUNT; opIdx++) {
      var op = operatives[opIdx];

      op.rotorAngle += op.rotorSpeed;

      // Inclinación aerodinámica natural
      var targetTilt = Math.max(-0.35, Math.min(0.35, op.vx * 0.16));
      op.tilt += (targetTilt - op.tilt) * 0.12;

      // A. NAVEGACIÓN 2D AUTÓNOMA: VUELO POR TODO EL PLANO
      op.wanderTimer--;
      if (op.wanderTimer <= 0) {
        op.wanderTimer = Math.random() * 110 + 50;
        // Rumbo 2D equilibrado en los 4 cuadrantes
        op.targetVx = (Math.random() - 0.5) * (isMobile ? 1.8 : 2.4);
        op.targetVy = (Math.random() - 0.5) * (isMobile ? 1.5 : 2.0);
      }

      // Propulsión activa del prop-pack: vuela hacia su objetivo 2D
      op.vx += (op.targetVx - op.vx) * 0.045;
      op.vy += (op.targetVy - op.vy) * 0.045;

      // Flotación senoidal de vuelo
      op.vy += Math.sin(timeTick * 2.8 + op.waveOffset) * 0.07;

      if (Math.abs(op.vx) > 0.15) {
        op.facingLeft = (op.vx < 0);
      }

      // Oleaje en planeta Agua
      if (currentPlanet.fluidWave) {
        op.vx += Math.sin(timeTick * 2 + op.waveOffset) * 0.06;
        op.vy += Math.cos(timeTick * 1.6 + op.waveOffset) * 0.04;
      }



      // B. ATRACCIÓN MAGNÉTICA CON MOUSE O TOQUE
      if (isVisible) {
        var mdx = (isMobile ? targetMouseX : mouseX) - op.x;
        var mdy = (isMobile ? targetMouseY : mouseY) - op.y;
        var mDist = Math.hypot(mdx, mdy);

        if (mDist < (isMobile ? 180 : 240) && mDist > 25) {
          var pull = Math.min(0.20, ((isMobile ? 180 : 240) - mDist) / 240 * 0.12);
          op.vx += (mdx / mDist) * pull;
          op.vy += (mdy / mDist) * pull;
          op.facingLeft = (mdx < 0);
        }
      }

      // C. INTERACCIÓN ENTRE ELLOS: REBOTES ELÁSTICOS Y VÍNCULOS
      for (var otherIdx = opIdx + 1; otherIdx < OPERATIVE_COUNT; otherIdx++) {
        var other = operatives[otherIdx];
        var dBetweenX = other.x - op.x;
        var dBetweenY = other.y - op.y;
        var distBetween = Math.hypot(dBetweenX, dBetweenY);

        // Rebote elástico juguetón entre astronautas (se esquivan en vuelo)
        if (distBetween < 22 && distBetween > 1) {
          var repulse = (22 - distBetween) * 0.14;
          op.vx -= (dBetweenX / distBetween) * repulse;
          op.vy -= (dBetweenY / distBetween) * repulse;
          other.vx += (dBetweenX / distBetween) * repulse;
          other.vy += (dBetweenY / distBetween) * repulse;

          if (sparks.length < 25) {
            sparks.push({
              x: (op.x + other.x) / 2,
              y: (op.y + other.y) / 2,
              vx: (Math.random() - 0.5) * 2.5,
              vy: (Math.random() - 0.5) * 2.5,
              life: 0.65,
              color: '#38BDF8'
            });
          }
        }

        // Vínculo magnético entre compañeros de escuadrón
        if (!isMobile && distBetween >= 45 && distBetween <= 85 && Math.random() < 0.007 && !op.peerBeamActive && !other.peerBeamActive) {
          op.peerBeamActive = true;
          op.peerTargetOp = other;
          op.peerBeamTimer = 16;
        }
      }

      if (op.peerBeamActive) {
        op.peerBeamTimer--;
        if (op.peerBeamTimer > 0 && op.peerTargetOp) {
          drawPeerInteractionRay(ctx, op, op.peerTargetOp, timeTick);
        } else {
          op.peerBeamActive = false;
          op.peerTargetOp = null;
        }
      }

      // D. PISTOLA MARCIANA MAGNÉTICA HACIA TARJETAS O TÍTULOS
      op.magneticCooldown--;
      if (contentBoxes.length > 0 && op.magneticCooldown <= 0 && !op.magneticBeamActive) {
        var closestBox = null;
        var closestDist = 999999;
        var hitX = 0;
        var hitY = 0;

        for (var b = 0; b < contentBoxes.length; b++) {
          var box = contentBoxes[b];
          var targetX = Math.max(box.left, Math.min(box.right, op.x));
          var targetY = Math.max(box.top, Math.min(box.bottom, op.y));
          var d = Math.hypot(targetX - op.x, targetY - op.y);
          if (d < closestDist && d < (isMobile ? 160 : 210)) {
            closestDist = d;
            closestBox = box;
            hitX = targetX;
            hitY = targetY;
          }
        }

        if (closestBox) {
          op.magneticBeamActive = true;
          op.magneticTargetX = hitX;
          op.magneticTargetY = hitY;
          op.magneticBeamTimer = isMobile ? 14 : 20;
          op.magneticCooldown = Math.random() * 100 + 50;

          // Suave tirón magnético
          var bdx = hitX - op.x;
          var bdy = hitY - op.y;
          var bDist = Math.max(20, Math.hypot(bdx, bdy));
          op.vx += (bdx / bDist) * 1.1;
          op.vy += (bdy / bDist) * 0.9;

          if (sparks.length < 25) {
            sparks.push({
              x: hitX,
              y: hitY,
              vx: (Math.random() - 0.5) * 2.5,
              vy: -Math.random() * 2,
              life: 0.7,
              color: '#FFEA00'
            });
          }
        } else {
          op.magneticCooldown = 40;
        }
      }

      if (op.magneticBeamActive) {
        op.magneticBeamTimer--;
        if (op.magneticBeamTimer <= 0) {
          op.magneticBeamActive = false;
        }
      }

      // E. CHOQUE ELÁSTICO CON LETRAS Y TARJETAS ("Y QUE CHOQUEN CON LAS LETRAS")
      var pad = 6;
      for (var cbIdx = 0; cbIdx < contentBoxes.length; cbIdx++) {
        var cb = contentBoxes[cbIdx];
        if (op.x > cb.left - pad && op.x < cb.right + pad && op.y > cb.top - pad && op.y < cb.bottom + pad) {
          // Calcular penetración
          var ovL = op.x - (cb.left - pad);
          var ovR = (cb.right + pad) - op.x;
          var ovT = op.y - (cb.top - pad);
          var ovB = (cb.bottom + pad) - op.y;
          var minOv = Math.min(ovL, ovR, ovT, ovB);

          if (minOv === ovT) {
            op.y = cb.top - pad;
            op.vy = -Math.abs(op.vy) * 0.85 - 0.6;
            op.targetVy = -1.2;
          } else if (minOv === ovB) {
            op.y = cb.bottom + pad;
            op.vy = Math.abs(op.vy) * 0.85 + 0.6;
            op.targetVy = 1.2;
          } else if (minOv === ovL) {
            op.x = cb.left - pad;
            op.vx = -Math.abs(op.vx) * 0.85 - 0.6;
            op.targetVx = -1.4;
            op.facingLeft = true;
          } else {
            op.x = cb.right + pad;
            op.vx = Math.abs(op.vx) * 0.85 + 0.6;
            op.targetVx = 1.4;
            op.facingLeft = false;
          }

          if (sparks.length < 25) {
            sparks.push({
              x: op.x,
              y: op.y,
              vx: (Math.random() - 0.5) * 3,
              vy: (Math.random() - 0.5) * 3,
              life: 0.75,
              color: (currentPlanet.id === 'marte') ? '#F87171' :
                     (currentPlanet.id === 'tierra' || currentPlanet.id === 'plasma') ? '#4ADE80' :
                     (currentPlanet.id === 'cuantico') ? '#C084FC' : '#FFEA00'
            });
          }
          break;
        }
      }

      // F. INTEGRACIÓN DE VELOCIDAD
      op.vx *= friction;
      op.vy *= friction;
      op.x += op.vx;
      op.y += op.vy;

      // G. LÍMITES DE PANTALLA: SUSTENTACIÓN Y VUELO LIBRE (NUNCA CAER AL FONDO)
      // Techo
      if (op.y < 60) {
        op.y = 60;
        op.vy = Math.abs(op.vy) * 0.8 + 0.5;
        op.targetVy = Math.random() * 1.2 + 0.5;
      }
      // Suelo (Repulsión activa para que sigan volando sin quedarse atrapados en fila)
      var floorLimit = height - (isMobile ? 85 : 70);
      if (op.y > floorLimit) {
        op.y = floorLimit;
        op.vy = -Math.abs(op.vy) * 0.85 - 0.8;
        op.targetVy = -(Math.random() * 1.5 + 0.8); // Impulso vertical hacia arriba
        op.rotorSpeed = 0.75;
      }

      // Paredes laterales
      if (op.x < 25) {
        op.x = 25;
        op.vx = Math.abs(op.vx) * 0.8 + 0.5;
        op.targetVx = Math.random() * 1.5 + 0.5;
        op.facingLeft = false;
      } else if (op.x > width - 25) {
        op.x = width - 25;
        op.vx = -Math.abs(op.vx) * 0.8 - 0.5;
        op.targetVx = -(Math.random() * 1.5 + 0.5);
        op.facingLeft = true;
      }

      // Dibujar rayo marciano si está disparando
      drawMartianMagneticRay(ctx, op, timeTick);

      // Dibujar astronauta
      drawMicroAstronaut(ctx, op);
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

  // ==========================================================================
  // 10. SCROLL-RAIL LATERAL (SOLO EN ESCRITORIO)
  // ==========================================================================
  var railFill = document.getElementById('scroll-rail-fill');
  var railItems = document.querySelectorAll('.rail-item');
  var trackedSections = ['inicio', 'servicios', 'menu-inteligente', 'proyectos', 'contacto'];

  window.addEventListener('scroll', function() {
    if (isMobile) return;
    var winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolledPercent = docHeight > 0 ? (winScroll / docHeight) * 100 : 0;

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

  // ==========================================================================
  // 11. EFECTO DE MOVIMIENTO E INCLINACIÓN 3D DINÁMICA EN TARJETAS Y CONTENEDORES
  // ==========================================================================
  var tiltCards = document.querySelectorAll('.service-card, .tile, .price-card, .project-giant-item, .card, .stat-tile');
  tiltCards.forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      card.style.transition = 'transform 0.08s ease-out, box-shadow 0.2s ease, border-color 0.2s ease';
    });

    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'perspective(1000px) rotateX(' + (-y * 12) + 'deg) rotateY(' + (x * 12) + 'deg) translateY(-8px) scale3d(1.025, 1.025, 1.025)';
      card.style.boxShadow = (-x * 20) + 'px ' + (-y * 20 + 20) + 'px 40px rgba(0, 0, 0, 0.65), 0 0 25px rgba(255, 255, 255, 0.06)';
      
      var ambient = card.querySelector('.card-ambient-bg');
      if (ambient) {
        ambient.style.transform = 'translate(' + (x * 24) + 'px, ' + (y * 24) + 'px) scale(1.12)';
        ambient.style.opacity = '0.70';
      }
    });

    card.addEventListener('mouseleave', function() {
      card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
      card.style.boxShadow = '';
      var ambient = card.querySelector('.card-ambient-bg');
      if (ambient) {
        ambient.style.transform = '';
        ambient.style.opacity = '';
      }
    });
  });

  // Parallax cinético brutalista en scroll
  var kLine2 = document.querySelector('.kinetic-line-2');
  var kLine3 = document.querySelector('.kinetic-line-3');
  window.addEventListener('scroll', function() {
    var scrolled = window.pageYOffset || document.documentElement.scrollTop;
    if (kLine2) {
      kLine2.style.transform = 'translateX(' + (-scrolled * 0.14) + 'px)';
    }
    if (kLine3) {
      kLine3.style.transform = 'translateX(' + (scrolled * 0.14) + 'px)';
    }
  }, { passive: true });


  // ==========================================================================
  // 12. CABECERA STICKY AL BAJAR (SE MANTIENE CON TODOS LOS MENÚS)
  // ==========================================================================
  var mainNav = document.querySelector('nav.main-nav');
  window.addEventListener('scroll', function() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (mainNav) {
      if (scrollY > 30) {
        mainNav.classList.add('is-scrolled');
      } else {
        mainNav.classList.remove('is-scrolled');
      }
    }
  }, { passive: true });

})();
