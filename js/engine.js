// MarketingCloud Studio - Interactive Engine
// 1. Live Santiago Timecode & Chilean Economic Indicators (USD / UF)
// 2. 80's Micro-Operatives (H.E.R.O. Style Miniature Sprites):
//    - Miniature 80s pixel art (p = 1.15) with delicate 4-frame prop-pack rotor
//    - Radar Device: Concentric sonar pings & rotating scan beam
//    - Gentle Magnetic Attraction to Cursor: curious drift & orbital cushion
//    - Collision EXCLUSIVELY with foreground content (Cards, Boxes, Buttons)
//    - Sub-surface escape: when trapped against an object, dives underneath and emerges from below
//    - ZERO interaction with background letters ("VENTAJA COMPETITIVA DIGITAL")
// 3. 6 Planetary Environments with Full Color Shift & Key Shortcuts:
//    - [E] Espacio (Negro, Zero-G)
//    - [T] Tierra (Verde, 1.0g)
//    - [M] Marte (Rojo, 0.38g)
//    - [A] Agua (Azul, Oleaje)
//    - [P] Plasma (Verde Neón, Resistencia Magnética)
//    - [C] Cuántico (Púrpura Iridiscente, Gravedad Oscilante)
// 4. Reticle Cursor, Left Scroll Spy & Economic Tickers

(function() {
  'use strict';

  // ==========================================================================
  // 1. TIMECODE EN VIVO - SANTIAGO DE CHILE (UTC-3)
  // ==========================================================================
  function updateSantiagoTime() {
    var timeEl = document.getElementById('live-timecode');
    if (!timeEl) return;
    try {
      var santiagoTime = new Intl.DateTimeFormat('es-CL', {
        timeZone: 'America/Santiago',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(new Date());
      timeEl.textContent = santiagoTime;
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
  // 3. CANVAS CÓSMICO Y CURSOR RETICULAR (CERO DESENFOQUE EN CONTENIDO)
  // ==========================================================================
  var dot = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');
  var canvas = document.getElementById('nebula-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var width = window.innerWidth;
  var height = window.innerHeight;

  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
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

  // ==========================================================================
  // 4. PLANETAS Y MEDIOS FÍSICOS (ATAJOS E, T, M, A, P, C)
  // ==========================================================================
  var PLANETS = [
    { id: 'espacio', key: 'e', name: 'Espacio', color: 'Negro', icon: '🌌', gravityY: 0.012, friction: 0.985, desc: 'Zero-G cósmico y flotación libre' },
    { id: 'tierra', key: 't', name: 'Tierra', color: 'Verde', icon: '🌍', gravityY: 0.22, friction: 0.97, desc: 'Gravedad estándar 1.0g y biomecánica verde' },
    { id: 'marte', key: 'm', name: 'Marte', color: 'Rojo', icon: '🪐', gravityY: 0.08, friction: 0.98, desc: 'Gravedad 0.38g y polvo carmesí' },
    { id: 'agua', key: 'a', name: 'Agua', color: 'Azul', icon: '💧', gravityY: 0.035, friction: 0.88, fluidWave: true, desc: 'Viscosidad hidrodinámica y oleaje abisal' },
    { id: 'plasma', key: 'p', name: 'Plasma', color: 'Verde Neón', icon: '⚡', gravityY: 0, friction: 0.82, plasma: true, desc: 'Amortiguación magnética y alta fricción' },
    { id: 'cuantico', key: 'c', name: 'Cuántico', color: 'Púrpura', icon: '✦', surreal: true, friction: 0.95, desc: 'Gravedad multidireccional oscilante y destellos' }
  ];

  var currentPlanetIndex = 0;
  var currentPlanet = PLANETS[0];
  var isCtrlPressed = false;

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

    // Cambiar color ambiental de toda la página
    document.body.className = 'mode-' + currentPlanet.id;

    // Actualizar botones de la barra superior
    var btns = document.querySelectorAll('.gravity-btn');
    btns.forEach(function(b) {
      if (b.getAttribute('data-mode') === currentPlanet.id) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    showHudToast('<strong>' + currentPlanet.icon + ' ' + currentPlanet.name + ' (' + currentPlanet.color + ')</strong> &nbsp;·&nbsp; ' + currentPlanet.desc.toUpperCase());
  }

  // Atajos de teclado para cambio de planetas: [E], [T], [M], [A], [P], [C]
  window.addEventListener('keydown', function(e) {
    var k = e.key.toLowerCase();
    if (k === 'e') setPlanet('espacio');
    else if (k === 't') setPlanet('tierra');
    else if (k === 'm') setPlanet('marte');
    else if (k === 'a') setPlanet('agua');
    else if (k === 'p') setPlanet('plasma');
    else if (k === 'c' || k === 's') setPlanet('cuantico');

    if (e.key === 'Control' || e.ctrlKey) {
      isCtrlPressed = true;
      var tip = document.getElementById('ctrl-tip');
      if (tip) tip.style.background = 'rgba(245, 158, 11, 0.2)';
    }
  });

  window.addEventListener('keyup', function(e) {
    if (e.key === 'Control' || !e.ctrlKey) {
      isCtrlPressed = false;
      var tip = document.getElementById('ctrl-tip');
      if (tip) tip.style.background = '';
    }
  });

  // Listeners para los botones directos de la barra superior
  var planetButtons = document.querySelectorAll('.gravity-btn');
  planetButtons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var mode = btn.getAttribute('data-mode');
      if (mode) setPlanet(mode);
    });
  });

  // ==========================================================================
  // 5. ESTRELLAS DE FONDO Y PARTÍCULAS
  // ==========================================================================
  var STAR_COUNT = 90;
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
  // 6. OPERATIVOS MICRO 80's CON HÉLICE PEQUEÑA Y ARMA DE RADAR
  // ==========================================================================
  var OPERATIVE_COUNT = 16;
  var operatives = [];

  for (var i = 0; i < OPERATIVE_COUNT; i++) {
    operatives.push({
      x: Math.random() * width,
      y: Math.random() * (height * 0.7) + 50,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 0.6,
      facingLeft: Math.random() < 0.5,
      scale: 1.0,

      // Hélice chiquita
      rotorAngle: Math.random() * 10,
      rotorSpeed: 0.45,

      // Arma de Radar
      radarAngle: Math.random() * Math.PI * 2,
      radarSweepSpeed: 0.05 + Math.random() * 0.02,
      radarPingRadius: 0,
      radarPingActive: true,
      radarDetectedTarget: null,

      // Físicas y escape de trampas ("cuando queden atrapados que pasen por debajo del objeto")
      stuckCounter: 0,
      isTunneling: false,
      tunnelTargetY: 0,

      mass: Math.random() * 0.25 + 0.85,
      waveOffset: Math.random() * Math.PI * 2
    });
  }

  function drawPixelRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  // Dibuja el astronauta micro (p = 1.15) con hélice pequeña y arma de radar
  function drawMicroAstronaut(ctx, op, timeTick) {
    ctx.save();
    ctx.translate(Math.round(op.x), Math.round(op.y));
    ctx.scale(op.facingLeft ? -1 : 1, 1);

    var p = 1.15; // Escala micro arcade

    // 1. ARMA DE RADAR (Sutil escaneo y pulsos de sonar)
    var radarOriginX = 4 * p;
    var radarOriginY = -1 * p;

    // Dispositivo receptor en la mano
    drawPixelRect(ctx, radarOriginX - p, radarOriginY - p, 2 * p, 3 * p, '#475569');
    drawPixelRect(ctx, radarOriginX + p, radarOriginY - 2 * p, 1.2 * p, 2 * p, '#38BDF8');

    // Haz de barrido de radar (subtle sweep line)
    var sweepLen = 28;
    var sweepAngle = op.radarAngle;
    var sweepEndX = radarOriginX + Math.cos(sweepAngle) * sweepLen;
    var sweepEndY = radarOriginY + Math.sin(sweepAngle) * sweepLen;

    ctx.save();
    ctx.strokeStyle = (currentPlanet.id === 'tierra' || currentPlanet.id === 'plasma') ? 'rgba(74, 222, 128, 0.45)' :
                      (currentPlanet.id === 'marte') ? 'rgba(248, 113, 113, 0.45)' :
                      (currentPlanet.id === 'cuantico') ? 'rgba(192, 132, 252, 0.55)' :
                      'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(radarOriginX, radarOriginY);
    ctx.lineTo(sweepEndX, sweepEndY);
    ctx.stroke();

    // Ondas concéntricas de pulso radar (Sonar ping)
    if (op.radarPingActive && op.radarPingRadius > 2) {
      var pingAlpha = Math.max(0, 0.4 - (op.radarPingRadius / 35));
      ctx.strokeStyle = ctx.strokeStyle.replace(/[\d\.]+\)$/, pingAlpha + ')');
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.arc(radarOriginX, radarOriginY, op.radarPingRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // 2. HÉLICE CHIQUITA (Prop-pack de Rod Hero miniaturizado)
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
    drawPixelRect(ctx, 0.8 * p, -4 * p, 2 * p, 1.5 * p, '#FFEA00');

    // 5. CUERPO Y TRAJE BLANCO CON CINTURÓN CYAN
    drawPixelRect(ctx, -2 * p, -2 * p, 4.5 * p, 4.5 * p, '#FFFFFF');
    drawPixelRect(ctx, -2 * p, 0.5 * p, 4.5 * p, 1.2 * p, '#0284C7');

    // 6. BRAZOS Y BOTAS
    drawPixelRect(ctx, -3 * p, -1.5 * p, 1.5 * p, 2.5 * p, '#FFFFFF');
    drawPixelRect(ctx, 2.5 * p, -1.5 * p, 1.5 * p, 2.5 * p, '#FFFFFF');

    drawPixelRect(ctx, -1.8 * p, 2.5 * p, 1.8 * p, 2.5 * p, '#FFFFFF');
    drawPixelRect(ctx, 0.8 * p, 2.5 * p, 1.8 * p, 2.5 * p, '#FFFFFF');
    drawPixelRect(ctx, -2.2 * p, 4.5 * p, 2.2 * p, 1.5 * p, '#1E293B');
    drawPixelRect(ctx, 0.8 * p, 4.5 * p, 2.2 * p, 1.5 * p, '#1E293B');

    // Efecto sutil si está pasando por debajo de un objeto (túnel de escape)
    if (op.isTunneling) {
      drawPixelRect(ctx, -p, 6 * p, 2 * p, 2 * p, '#FFEA00');
    }

    ctx.restore();
  }

  // ==========================================================================
  // 7. SEGUNDA CAPA: MONOLITOS CIFRADOS DE FONDO (SIN INTERACCIÓN CON ASTRONAUTAS)
  // ==========================================================================
  var currentScrollY = 0;
  var lastScrollY = 0;
  var scrollVelocity = 0;
  var cityOffsetX = 0;
  var cityOpacity = 0;

  window.addEventListener('scroll', function() {
    currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
    scrollVelocity = Math.abs(currentScrollY - lastScrollY);
    lastScrollY = currentScrollY;
  }, { passive: true });

  var timeTick = 0;

  function renderAtmosphericBackgroundLetters(ctx) {
    if (cityOpacity <= 0.01) return;

    ctx.save();
    ctx.globalAlpha = cityOpacity;

    var buildingH = Math.min(300, Math.max(160, height * 0.38));
    var baseY = height;

    // Niebla ambiental cósmica difuminada al pie
    var mistGrad = ctx.createLinearGradient(0, height - buildingH * 1.2, 0, height);
    mistGrad.addColorStop(0, 'rgba(0,0,0,0)');
    mistGrad.addColorStop(0.7, 'rgba(7, 8, 10, 0.65)');
    mistGrad.addColorStop(1, 'rgba(5, 5, 7, 0.95)');
    ctx.fillStyle = mistGrad;
    ctx.fillRect(0, height - buildingH * 1.25, width, buildingH * 1.25);

    // LETRAS GIGANTES Y DIFUMINADAS (SÓLO DECORATIVO DE SEGUNDA CAPA)
    var fontSize = Math.min(320, Math.max(150, width * 0.20));
    ctx.font = '900 ' + fontSize + 'px "Space Grotesk", sans-serif';
    ctx.textBaseline = 'bottom';

    var w1 = 'VENTAJA';
    var w2 = 'COMPETITIVA';
    var w3 = 'DIGITAL';

    var widthW1 = ctx.measureText(w1).width;
    var widthW2 = ctx.measureText(w2).width;
    var widthW3 = ctx.measureText(w3).width;

    var wordGap = 60;
    var phraseGap = 160;
    var singlePhraseWidth = widthW1 + widthW2 + widthW3 + (wordGap * 2) + phraseGap;

    var startX = -(cityOffsetX % singlePhraseWidth);
    var repeatCount = Math.ceil(width / singlePhraseWidth) + 2;

    ctx.save();
    try {
      ctx.filter = 'blur(10px)';
    } catch (e) {}

    for (var r = 0; r < repeatCount; r++) {
      var curX = startX + (r * singlePhraseWidth);

      // Monolito 1: VENTAJA
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.fillText(w1, curX, baseY);
      curX += widthW1 + wordGap;

      // Monolito 2: COMPETITIVA
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
      ctx.lineWidth = 6;
      ctx.strokeText(w2, curX, baseY);
      curX += widthW2 + wordGap;

      // Monolito 3: DIGITAL
      var grad = ctx.createLinearGradient(curX, baseY - fontSize, curX + widthW3, baseY);
      grad.addColorStop(0, '#F59E0B');
      grad.addColorStop(0.5, '#EC4899');
      grad.addColorStop(1, '#8B5CF6');
      ctx.fillStyle = grad;
      ctx.fillText(w3, curX, baseY);
    }

    try {
      ctx.filter = 'none';
    } catch (e) {}
    ctx.restore();

    ctx.restore();
  }

  // ==========================================================================
  // 8. BUCLE PRINCIPAL DE FÍSICA Y SIMULACIÓN
  // ==========================================================================
  function loop() {
    timeTick += 0.02;
    scrollVelocity *= 0.90;

    mouseX += (targetMouseX - mouseX) * 0.28;
    mouseY += (targetMouseY - mouseY) * 0.28;
    ringX += (targetMouseX - ringX) * 0.14;
    ringY += (targetMouseY - ringY) * 0.14;

    if (ring && isVisible) {
      ring.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px) translate(-50%, -50%)';
    }

    ctx.clearRect(0, 0, width, height);

    // Ocultar letras gigantes en el Hero (scroll <= 220)
    var isCityActive = (currentScrollY > 220);
    var targetCityOpacity = isCityActive ? 0.22 : 0;
    cityOpacity += (targetCityOpacity - cityOpacity) * 0.08;

    var citySpeed = 1.2 + (scrollVelocity * 0.5);
    if (cityOpacity > 0.02) {
      cityOffsetX += citySpeed;
    }

    // 1. Estrellas de fondo
    for (var s = 0; s < STAR_COUNT; s++) {
      var st = stars[s];
      var tw = Math.sin(timeTick * 2 + s) * 0.16;
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

    // 2. Monolitos de fondo (Sin interacción física, 100% fondo)
    renderAtmosphericBackgroundLetters(ctx);

    // 3. Chispas de impacto o escape
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

    // 4. DETECCIÓN DE CONTENIDO FRONTAL (Tarjetas, botones, cajas)
    // "que NO interactue con las letras de atras solo con el contenido"
    var contentBoxes = [];
    var frontElements = document.querySelectorAll('.service-card, .tile, .price-card, .project-giant-item, .brutalist-grid-meta > div');
    frontElements.forEach(function(el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < height && rect.bottom > 0 && rect.width > 50 && rect.height > 50) {
        contentBoxes.push({
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom
        });
      }
    });

    // 5. Parámetros físicos del planeta actual
    var friction = currentPlanet.friction || 0.98;
    var gravX = 0;
    var gravY = currentPlanet.gravityY || 0;

    if (isCtrlPressed) {
      gravY = 0.52;
      friction = 0.985;
    } else if (currentPlanet.surreal) {
      // Física cuántica entretenida oscilante
      gravX = Math.sin(timeTick * 2.2) * 0.24;
      gravY = Math.cos(timeTick * 1.6) * 0.22;
    }

    // ======================================================================
    // 6. OPERATIVOS MICRO: MAGNETISMO, RADAR, CHOQUE Y PASO SUBTERRÁNEO
    // ======================================================================
    for (var opIdx = 0; opIdx < OPERATIVE_COUNT; opIdx++) {
      var op = operatives[opIdx];

      op.rotorAngle += op.rotorSpeed;
      op.radarAngle += op.radarSweepSpeed;

      // Pulso de sonar del radar
      op.radarPingRadius += 0.8;
      if (op.radarPingRadius > 35) {
        op.radarPingRadius = 2;
      }

      // Oleaje en planetas acuáticos
      if (currentPlanet.fluidWave) {
        op.vx += Math.sin(timeTick * 2 + op.waveOffset) * 0.06;
        op.vy += Math.cos(timeTick * 1.5 + op.waveOffset) * 0.04;
      }

      // A. MAGNETISMO SUAVE CON EL MOUSE ("sea magnetico suave con el mouse")
      if (isVisible) {
        var mdx = mouseX - op.x;
        var mdy = mouseY - op.y;
        var mDist = Math.hypot(mdx, mdy);

        if (mDist < 260 && mDist > 55) {
          // Atracción magnética suave y progresiva
          var pull = Math.min(0.24, (260 - mDist) / 260 * 0.12);
          op.vx += (mdx / mDist) * pull;
          op.vy += (mdy / mDist) * pull;
          op.facingLeft = (mdx < 0);

          // Apuntar el radar hacia el cursor
          var targetAngle = Math.atan2(mdy, mdx * (op.facingLeft ? -1 : 1));
          op.radarAngle += (targetAngle - op.radarAngle) * 0.1;
        } else if (mDist <= 55) {
          // Amortiguación orbital suave alrededor del cursor (no chocan de golpe)
          var orbAngle = Math.atan2(mdy, mdx) + 0.05;
          op.vx += -Math.sin(orbAngle) * 0.18;
          op.vy += Math.cos(orbAngle) * 0.18;
        }
      }

      // B. CHOQUE EXCLUSIVO CON TARJETAS Y CONTENIDO FRONTAL
      // "y cuando queden atrapados que pasen por debajo del objeto"
      var isCollidingWithCard = false;
      var pad = 8; // Hitbox adaptada a la escala micro

      if (!op.isTunneling && contentBoxes.length > 0) {
        for (var cbIdx = 0; cbIdx < contentBoxes.length; cbIdx++) {
          var cb = contentBoxes[cbIdx];
          if (op.x > cb.left - pad && op.x < cb.right + pad && op.y > cb.top - pad && op.y < cb.bottom + pad) {
            isCollidingWithCard = true;
            op.stuckCounter++;

            // Si queda atrapado (3 o más frames encajado), pasa por debajo del objeto
            if (op.stuckCounter >= 3) {
              op.isTunneling = true;
              op.tunnelTargetY = cb.bottom + 12;
              break;
            }

            var ovL = op.x - (cb.left - pad);
            var ovR = (cb.right + pad) - op.x;
            var ovT = op.y - (cb.top - pad);
            var ovB = (cb.bottom + pad) - op.y;
            var minOv = Math.min(ovL, ovR, ovT, ovB);

            if (minOv === ovT) {
              op.y = cb.top - pad;
              op.vy = -Math.abs(op.vy) * 0.75 - 0.6;
            } else if (minOv === ovB) {
              op.y = cb.bottom + pad;
              op.vy = Math.abs(op.vy) * 0.75 + 0.6;
            } else if (minOv === ovL) {
              op.x = cb.left - pad;
              op.vx = -Math.abs(op.vx) * 0.75 - 0.6;
              op.facingLeft = true;
            } else {
              op.x = cb.right + pad;
              op.vx = Math.abs(op.vx) * 0.75 + 0.6;
              op.facingLeft = false;
            }

            // Chispas arcade del choque
            for (var sp = 0; sp < 2; sp++) {
              sparks.push({
                x: op.x,
                y: op.y,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                life: 0.8,
                color: (currentPlanet.id === 'marte') ? '#F87171' :
                       (currentPlanet.id === 'tierra' || currentPlanet.id === 'plasma') ? '#4ADE80' :
                       (currentPlanet.id === 'cuantico') ? '#C084FC' : '#FFEA00'
              });
            }
            break;
          }
        }
      }

      if (!isCollidingWithCard && !op.isTunneling) {
        op.stuckCounter = Math.max(0, op.stuckCounter - 1);
      }

      // C. FASE SUBTERRÁNEA: PASAR POR DEBAJO DEL OBJETO ("que pasen por debajo del objeto")
      if (op.isTunneling) {
        op.vy = 2.4; // Descenso firme por debajo de la tarjeta
        op.vx *= 0.5;
        op.radarAngle = Math.PI / 2; // Radar escaneando hacia abajo
        op.rotorSpeed = 0.85; // Prop-pack activo al máximo

        // Si ya superó el borde inferior de la tarjeta, emerge libremente
        if (op.y >= op.tunnelTargetY) {
          op.isTunneling = false;
          op.stuckCounter = 0;
          op.vy = 1.0;
          op.vx = op.facingLeft ? -1.8 : 1.8;
          op.rotorSpeed = 0.45;

          // Chispas de liberación al salir de abajo
          for (var esc = 0; esc < 3; esc++) {
            sparks.push({
              x: op.x,
              y: op.y,
              vx: (Math.random() - 0.5) * 4,
              vy: Math.random() * 2,
              life: 0.9,
              color: '#FFEA00'
            });
          }
        }
      }

      // D. APLICACIÓN DE FUERZAS Y DESPLAZAMIENTO
      op.vx += gravX;
      op.vy += gravY * op.mass;

      // Inclinación al scrollear
      if (scrollVelocity > 3) {
        op.vx += (op.facingLeft ? -0.1 : 0.1) * (scrollVelocity * 0.2);
      }

      op.vx *= friction;
      op.vy *= friction;
      op.x += op.vx;
      op.y += op.vy;

      // Bordes de la pantalla
      if (op.x < -30) {
        op.x = width + 30;
      } else if (op.x > width + 30) {
        op.x = -30;
      }

      if (op.y < -20) {
        op.y = height + 10;
      } else if (op.y > height + 25) {
        op.y = -15;
      }

      drawMicroAstronaut(ctx, op, timeTick);
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // ==========================================================================
  // 9. EFECTOS HOVER Y CONTROL DE TARJETAS
  // ==========================================================================
  var hoverElements = document.querySelectorAll('a, button, .service-card, .tile, .project-giant-item, h1, h2, h3, .chip, .gravity-btn');
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

  // ==========================================================================
  // 10. SEGUIMIENTO DE PROGRESO EN BARRA LATERAL (SCROLL-RAIL)
  // ==========================================================================
  var railFill = document.getElementById('scroll-rail-fill');
  var railItems = document.querySelectorAll('.rail-item');
  var trackedSections = ['inicio', 'servicios', 'menu-inteligente', 'proyectos', 'contacto'];

  window.addEventListener('scroll', function() {
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

})();
