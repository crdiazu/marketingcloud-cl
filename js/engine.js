// MarketingCloud Studio - Interactive Engine
// 1. Live Santiago Timecode & Chilean Economic Indicators (USD / UF)
// 2. Micro 80's Astronauts (H.E.R.O. Activision Style):
//    - SE MUEVEN POR TODA LA PANTALLA (2D roaming, patrullaje horizontal, vertical y diagonal)
//    - Equilibrio aerodinámico: no se escapan hacia arriba, rebotan suavemente en los bordes de pantalla
//    - PISTOLA MARCIANA MAGNÉTICA: anclaje y tracción magnética hacia tarjetas en primera plana
//    - INTERACCIÓN ENTRE ELLOS: rebotes elásticos juguetones y enlaces magnéticos de escuadrón
//    - MAGNETISMO CON EL MOUSE: atracción directa suave (NO órbitas de planetas)
//    - [Ctrl] y [Espacio] activan sobrecarga de gravedad pesada (caída libre hacia las tarjetas)
//    - Escape subterráneo: si quedan atrapados contra un objeto, se sumergen y pasan por debajo
//    - CERO interferencia con letras de fondo ("VENTAJA COMPETITIVA DIGITAL")
// 3. 6 Entornos Planetarios con Cambio Total de Color y Atajos de Teclado:
//    - [E] Espacio (Negro, Zero-G)
//    - [T] Tierra (Verde, 1.0g)
//    - [M] Marte (Rojo, 0.38g)
//    - [A] Agua (Azul, Oleaje)
//    - [P] Plasma (Verde Neón, Resistencia Magnética)
//    - [C] Cuántico (Púrpura Iridiscente, Gravedad Oscilante)

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
    { id: 'espacio', key: 'e', name: 'Espacio', color: 'Negro', icon: '🌌', gravityY: 0.015, friction: 0.985, desc: 'Zero-G cósmico y navegación libre' },
    { id: 'tierra', key: 't', name: 'Tierra', color: 'Verde', icon: '🌍', gravityY: 0.18, friction: 0.97, desc: 'Gravedad estándar 1.0g y propulsión firme' },
    { id: 'marte', key: 'm', name: 'Marte', color: 'Rojo', icon: '🪐', gravityY: 0.08, friction: 0.98, desc: 'Gravedad reducida 0.38g y polvo carmesí' },
    { id: 'agua', key: 'a', name: 'Agua', color: 'Azul', icon: '💧', gravityY: 0.035, friction: 0.88, fluidWave: true, desc: 'Viscosidad hidrodinámica y oleaje abisal' },
    { id: 'plasma', key: 'p', name: 'Plasma', color: 'Verde Neón', icon: '⚡', gravityY: 0.02, friction: 0.84, plasma: true, desc: 'Amortiguación magnética y alta fricción' },
    { id: 'cuantico', key: 'c', name: 'Cuántico', color: 'Púrpura', icon: '✦', surreal: true, friction: 0.95, desc: 'Gravedad multidireccional oscilante y destellos' }
  ];

  var currentPlanetIndex = 0;
  var currentPlanet = PLANETS[0];
  var isGravitySurge = false; // Activado con [Ctrl] o [Espacio]

  var hudToast = document.getElementById('physics-hud-toast');
  var ctrlTip = document.getElementById('ctrl-tip');
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

    if (e.key === 'Control' || e.ctrlKey || e.code === 'Space') {
      if (e.code === 'Space') {
        e.preventDefault();
      }
      isGravitySurge = true;
      if (ctrlTip) {
        ctrlTip.style.background = 'rgba(245, 158, 11, 0.25)';
        ctrlTip.style.borderColor = 'var(--accent)';
      }
    }
  });

  window.addEventListener('keyup', function(e) {
    if (e.key === 'Control' || !e.ctrlKey || e.code === 'Space') {
      isGravitySurge = false;
      if (ctrlTip) {
        ctrlTip.style.background = '';
        ctrlTip.style.borderColor = 'rgba(245,158,11,0.25)';
      }
    }
  });

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
  // 6. OPERATIVOS MICRO 80's: NAVEGACIÓN 2D COMPLETA POR TODA LA PANTALLA
  // ==========================================================================
  var OPERATIVE_COUNT = 18;
  var operatives = [];

  for (var i = 0; i < OPERATIVE_COUNT; i++) {
    var isCruiser = (i % 2 === 0);
    operatives.push({
      id: i,
      // Distribuidos naturalmente por toda la pantalla
      x: Math.random() * (width - 120) + 60,
      y: Math.random() * (height - 180) + 90,

      // Velocidades 2D de crucero
      vx: (Math.random() - 0.5) * 1.6,
      vy: (Math.random() - 0.5) * 1.2,
      targetVx: (Math.random() - 0.5) * 1.8,
      targetVy: (Math.random() - 0.5) * 1.2,
      wanderTimer: Math.random() * 90 + 30,

      facingLeft: Math.random() < 0.5,
      tilt: 0,
      role: isCruiser ? 'flyer' : 'explorer',

      // Hélice chiquita
      rotorAngle: Math.random() * 10,
      rotorSpeed: 0.55,

      // PISTOLA MARCIANA MAGNÉTICA HACIA OBJETOS DE PRIMERA PLANA
      magneticBeamActive: false,
      magneticTargetX: 0,
      magneticTargetY: 0,
      magneticBeamTimer: 0,
      magneticCooldown: Math.random() * 90 + 40,

      // INTERACCIÓN ENTRE ELLOS (SQUAD BEAM)
      peerBeamActive: false,
      peerTargetOp: null,
      peerBeamTimer: 0,

      // Estado en repisa / caminante
      isOnLedge: false,

      // Escape de trampas ("cuando queden atrapados que pasen por debajo del objeto")
      stuckCounter: 0,
      isTunneling: false,
      tunnelTargetY: 0,

      mass: Math.random() * 0.2 + 0.9,
      waveOffset: Math.random() * Math.PI * 2
    });
  }

  function drawPixelRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  // Render del astronauta micro (p = 1.15) con pistola marciana magnética
  function drawMicroAstronaut(ctx, op, timeTick) {
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
    drawPixelRect(ctx, 0.8 * p, -4 * p, 2 * p, 1.5 * p, '#FFEA00');

    // 5. CUERPO Y TRAJE BLANCO CON CINTURÓN CYAN
    drawPixelRect(ctx, -2 * p, -2 * p, 4.5 * p, 4.5 * p, '#FFFFFF');
    drawPixelRect(ctx, -2 * p, 0.5 * p, 4.5 * p, 1.2 * p, '#0284C7');

    // 6. BRAZOS Y BOTAS
    if (op.isOnLedge) {
      var walkStep = Math.sin(timeTick * 8) * 1.5 * p;
      drawPixelRect(ctx, -3 * p, -1.5 * p, 1.5 * p, 2.5 * p, '#FFFFFF');
      drawPixelRect(ctx, 2.5 * p, -1.5 * p, 1.5 * p, 2.5 * p, '#FFFFFF');
      drawPixelRect(ctx, -2 * p + walkStep, 2.5 * p, 2 * p, 3 * p, '#FFFFFF');
      drawPixelRect(ctx, 0.5 * p - walkStep, 2.5 * p, 2 * p, 3 * p, '#FFFFFF');
      drawPixelRect(ctx, -2.2 * p + walkStep, 5 * p, 2.4 * p, 1.5 * p, '#1E293B');
      drawPixelRect(ctx, 0.5 * p - walkStep, 5 * p, 2.4 * p, 1.5 * p, '#1E293B');
    } else {
      drawPixelRect(ctx, -3 * p, -1.5 * p, 1.5 * p, 2.5 * p, '#FFFFFF');
      drawPixelRect(ctx, 2.5 * p, -1.5 * p, 1.5 * p, 2.5 * p, '#FFFFFF');
      drawPixelRect(ctx, -1.8 * p, 2.5 * p, 1.8 * p, 2.5 * p, '#FFFFFF');
      drawPixelRect(ctx, 0.8 * p, 2.5 * p, 1.8 * p, 2.5 * p, '#FFFFFF');
      drawPixelRect(ctx, -2.2 * p, 4.5 * p, 2.2 * p, 1.5 * p, '#1E293B');
      drawPixelRect(ctx, 0.8 * p, 4.5 * p, 2.2 * p, 1.5 * p, '#1E293B');
    }

    if (op.isTunneling) {
      drawPixelRect(ctx, -p, 6 * p, 2 * p, 2 * p, '#FF1744');
    }

    ctx.restore();
  }

  // Dibuja el Rayo Magnético Marciano hacia objetos en primera plana
  function drawMartianMagneticRay(ctx, op, timeTick) {
    if (!op.magneticBeamActive) return;

    var originX = op.x + (op.facingLeft ? -6 : 6);
    var originY = op.y - 2;
    var targetX = op.magneticTargetX;
    var targetY = op.magneticTargetY;

    var beamColor = (currentPlanet.id === 'marte') ? '#FF2255' :
                    (currentPlanet.id === 'tierra' || currentPlanet.id === 'plasma') ? '#34D399' :
                    (currentPlanet.id === 'cuantico') ? '#C084FC' : '#38BDF8';

    ctx.save();
    ctx.strokeStyle = beamColor;
    ctx.lineWidth = 1.0;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(targetX, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    for (var r = 0; r < 3; r++) {
      var progress = ((timeTick * 4 + r * 0.33) % 1);
      var rx = originX + (targetX - originX) * progress;
      var ry = originY + (targetY - originY) * progress;
      var ringR = 3 + progress * 5;

      ctx.beginPath();
      ctx.arc(rx, ry, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = beamColor;
      ctx.lineWidth = 0.8;
      ctx.globalAlpha = 0.75 - progress * 0.5;
      ctx.stroke();
    }

    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#FFEA00';
    ctx.beginPath();
    ctx.arc(targetX, targetY, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Dibuja el Rayo Magnético de Interacción entre Astronautas
  function drawPeerInteractionRay(ctx, a, b, timeTick) {
    ctx.save();
    var midX = (a.x + b.x) / 2;
    var midY = (a.y + b.y) / 2;

    ctx.strokeStyle = 'rgba(255, 234, 0, 0.45)';
    ctx.lineWidth = 0.8;
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.setLineDash([]);

    var pulseR = (timeTick * 12) % 12;
    ctx.beginPath();
    ctx.arc(midX, midY, pulseR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 0.6;
    ctx.stroke();
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

    var mistGrad = ctx.createLinearGradient(0, height - buildingH * 1.2, 0, height);
    mistGrad.addColorStop(0, 'rgba(0,0,0,0)');
    mistGrad.addColorStop(0.7, 'rgba(7, 8, 10, 0.65)');
    mistGrad.addColorStop(1, 'rgba(5, 5, 7, 0.95)');
    ctx.fillStyle = mistGrad;
    ctx.fillRect(0, height - buildingH * 1.25, width, buildingH * 1.25);

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

      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.fillText(w1, curX, baseY);
      curX += widthW1 + wordGap;

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
      ctx.lineWidth = 6;
      ctx.strokeText(w2, curX, baseY);
      curX += widthW2 + wordGap;

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

    // 2. Monolitos de fondo (Segunda capa)
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

    if (isGravitySurge) {
      // Sobrecarga de gravedad pesada con [Ctrl] o [Espacio]
      gravY = 0.54;
      friction = 0.985;
    } else if (currentPlanet.surreal) {
      // Física cuántica oscilante
      gravX = Math.sin(timeTick * 2.2) * 0.22;
      gravY = Math.cos(timeTick * 1.6) * 0.18;
    }

    // ======================================================================
    // 6. OPERATIVOS MICRO: NAVEGACIÓN 2D COMPLETA (NO SOLO SUBEN)
    // ======================================================================
    for (var opIdx = 0; opIdx < OPERATIVE_COUNT; opIdx++) {
      var op = operatives[opIdx];

      op.rotorAngle += op.rotorSpeed;

      // Inclinación aerodinámica natural según velocidad horizontal
      var targetTilt = Math.max(-0.35, Math.min(0.35, op.vx * 0.16));
      op.tilt += (targetTilt - op.tilt) * 0.12;

      // A. COMPORTAMIENTO AUTÓNOMO 2D: EXPLORACIÓN POR TODA LA PANTALLA
      op.wanderTimer--;
      if (op.wanderTimer <= 0) {
        op.wanderTimer = Math.random() * 120 + 60;
        // Nueva dirección de crucero 2D (izquierda/derecha, arriba/abajo equilibrado)
        op.targetVx = (Math.random() - 0.5) * 2.4;
        op.targetVy = (Math.random() - 0.5) * 1.6;
      }

      if (!op.isOnLedge && !isGravitySurge) {
        // Suave aceleración hacia su vector de crucero 2D
        op.vx += (op.targetVx - op.vx) * 0.04;
        op.vy += (op.targetVy - op.vy) * 0.04;

        // Balance de sustentación: contrarresta exactamente la gravedad para no caer ni salir disparado
        op.vy -= (gravY * 0.96);

        // Flotación senoidal natural
        op.vy += Math.sin(timeTick * 2.5 + op.waveOffset) * 0.04;

        if (Math.abs(op.vx) > 0.15) {
          op.facingLeft = (op.vx < 0);
        }
      }

      // Oleaje en planetas acuáticos
      if (currentPlanet.fluidWave) {
        op.vx += Math.sin(timeTick * 2 + op.waveOffset) * 0.05;
        op.vy += Math.cos(timeTick * 1.5 + op.waveOffset) * 0.03;
      }

      // B. MAGNETISMO PURO CON EL MOUSE (DIRECTO, SIN ÓRBITAS CIRCULARES)
      if (isVisible) {
        var mdx = mouseX - op.x;
        var mdy = mouseY - op.y;
        var mDist = Math.hypot(mdx, mdy);

        if (mDist < 260 && mDist > 20) {
          var pull = Math.min(0.24, (260 - mDist) / 260 * 0.14);
          op.vx += (mdx / mDist) * pull;
          op.vy += (mdy / mDist) * pull;
          op.facingLeft = (mdx < 0);

          if (mDist < 80) {
            op.vx *= 0.94;
            op.vy *= 0.94;
          }

          if (op.isOnLedge && pull > 0.08) {
            op.isOnLedge = false;
            op.vy = -1.2;
          }
        }
      }

      // C. INTERACCIÓN ENTRE ELLOS (SQUAD BEAM Y CHOQUES ELÁSTICOS)
      for (var otherIdx = opIdx + 1; otherIdx < OPERATIVE_COUNT; otherIdx++) {
        var other = operatives[otherIdx];
        var dBetweenX = other.x - op.x;
        var dBetweenY = other.y - op.y;
        var distBetween = Math.hypot(dBetweenX, dBetweenY);

        // 1. Choque elástico juguetón entre astronautas (se empujan en 2D)
        if (distBetween < 24 && distBetween > 1) {
          var repulse = (24 - distBetween) * 0.12;
          op.vx -= (dBetweenX / distBetween) * repulse;
          op.vy -= (dBetweenY / distBetween) * repulse;
          other.vx += (dBetweenX / distBetween) * repulse;
          other.vy += (dBetweenY / distBetween) * repulse;

          sparks.push({
            x: (op.x + other.x) / 2,
            y: (op.y + other.y) / 2,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            life: 0.7,
            color: '#38BDF8'
          });
        }

        // 2. Vínculo magnético entre compañeros
        if (distBetween >= 40 && distBetween <= 90 && Math.random() < 0.008 && !op.peerBeamActive && !other.peerBeamActive) {
          op.peerBeamActive = true;
          op.peerTargetOp = other;
          op.peerBeamTimer = 18;
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

      // D. PISTOLA MARCIANA MAGNÉTICA HACIA OBJETOS EN PRIMERA PLANA
      op.magneticCooldown--;
      if (contentBoxes.length > 0 && op.magneticCooldown <= 0 && !op.magneticBeamActive) {
        var closestBox = null;
        var closestDist = 999999;
        var hitX = 0;
        var hitY = 0;

        for (var b = 0; b < contentBoxes.length; b++) {
          var box = contentBoxes[b];
          var targetLedgeX = Math.max(box.left, Math.min(box.right, op.x + (op.facingLeft ? -45 : 45)));
          var targetLedgeY = box.top;
          var d = Math.hypot(targetLedgeX - op.x, targetLedgeY - op.y);
          if (d < closestDist && d < 220) {
            closestDist = d;
            closestBox = box;
            hitX = targetLedgeX;
            hitY = targetLedgeY;
          }
        }

        if (closestBox) {
          op.magneticBeamActive = true;
          op.magneticTargetX = hitX;
          op.magneticTargetY = hitY;
          op.magneticBeamTimer = 22;
          op.magneticCooldown = Math.random() * 110 + 60;

          var bdx = hitX - op.x;
          var bdy = hitY - op.y;
          var bDist = Math.max(20, Math.hypot(bdx, bdy));
          op.vx += (bdx / bDist) * 1.5;
          op.vy += (bdy / bDist) * 1.2;

          for (var ms = 0; ms < 2; ms++) {
            sparks.push({
              x: hitX,
              y: hitY,
              vx: (Math.random() - 0.5) * 3,
              vy: -Math.random() * 2,
              life: 0.8,
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

      // E. COMPORTAMIENTO EN REPISA
      if (op.isOnLedge) {
        op.vy = 0;
        op.rotorSpeed += (0.2 - op.rotorSpeed) * 0.1;
        op.vx = (op.facingLeft ? -0.7 : 0.7);

        var isStillOnTop = false;
        for (var c = 0; c < contentBoxes.length; c++) {
          var cbL = contentBoxes[c];
          if (op.x >= cbL.left && op.x <= cbL.right && Math.abs(op.y - (cbL.top - 8)) < 4) {
            isStillOnTop = true;
            break;
          }
        }

        if (!isStillOnTop || isGravitySurge) {
          op.isOnLedge = false;
          op.rotorSpeed = 0.55;
          if (!isGravitySurge) {
            op.vy = -1.6;
            op.vx = (op.facingLeft ? -1.5 : 1.5);
          }
        }
      }

      // F. CHOQUE EXCLUSIVO CON TARJETAS
      var isCollidingWithCard = false;
      var pad = 8;

      if (!op.isTunneling && !op.isOnLedge && contentBoxes.length > 0) {
        for (var cbIdx = 0; cbIdx < contentBoxes.length; cbIdx++) {
          var cb = contentBoxes[cbIdx];
          if (op.x > cb.left - pad && op.x < cb.right + pad && op.y > cb.top - pad && op.y < cb.bottom + pad) {
            isCollidingWithCard = true;
            op.stuckCounter++;

            // Escape subterráneo si queda atrapado
            if (op.stuckCounter >= 3) {
              op.isTunneling = true;
              op.tunnelTargetY = cb.bottom + 12;
              op.isOnLedge = false;
              break;
            }

            var ovL = op.x - (cb.left - pad);
            var ovR = (cb.right + pad) - op.x;
            var ovT = op.y - (cb.top - pad);
            var ovB = (cb.bottom + pad) - op.y;
            var minOv = Math.min(ovL, ovR, ovT, ovB);

            if (minOv === ovT) {
              if (op.role === 'explorer' && !isGravitySurge && Math.random() < 0.6) {
                op.y = cb.top - 8;
                op.isOnLedge = true;
                op.vy = 0;
                op.stuckCounter = 0;
                break;
              } else {
                op.y = cb.top - pad;
                op.vy = -Math.abs(op.vy) * 0.75 - 0.5;
                op.targetVy = -1.0;
              }
            } else if (minOv === ovB) {
              op.y = cb.bottom + pad;
              op.vy = Math.abs(op.vy) * 0.75 + 0.5;
              op.targetVy = 1.0;
            } else if (minOv === ovL) {
              op.x = cb.left - pad;
              op.vx = -Math.abs(op.vx) * 0.75 - 0.5;
              op.targetVx = -1.2;
              op.facingLeft = true;
            } else {
              op.x = cb.right + pad;
              op.vx = Math.abs(op.vx) * 0.75 + 0.5;
              op.targetVx = 1.2;
              op.facingLeft = false;
            }

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

      // G. FASE SUBTERRÁNEA: PASAR POR DEBAJO DEL OBJETO
      if (op.isTunneling) {
        op.vy = 2.4;
        op.vx *= 0.5;
        op.rotorSpeed = 0.85;

        if (op.y >= op.tunnelTargetY) {
          op.isTunneling = false;
          op.stuckCounter = 0;
          op.vy = 0.8;
          op.vx = op.facingLeft ? -1.8 : 1.8;
          op.rotorSpeed = 0.55;

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

      // H. APLICACIÓN DE FUERZAS Y DESPLAZAMIENTO
      if (!op.isOnLedge) {
        op.vx += gravX;
        op.vy += gravY * op.mass;

        op.vx *= friction;
        op.vy *= friction;
        op.x += op.vx;
        op.y += op.vy;
      }

      // I. LÍMITES DE PANTALLA: REBOTE SUAVE (SE MANTIENEN EN PANTALLA EN VEZ DE ESCAPARSE HACIA ARRIBA)
      // "QUE SE MUEVAN POR LA PANTALLA NO QUE SUBAN SOLAMENTE"
      if (op.y < 45) {
        op.y = 45;
        op.vy = Math.abs(op.vy) * 0.75 + 0.4;
        op.targetVy = Math.random() * 1.2 + 0.4; // Se orienta a navegar hacia abajo
      } else if (op.y > height - 55) {
        op.y = height - 55;
        op.vy = -Math.abs(op.vy) * 0.75 - 0.4;
        op.targetVy = -(Math.random() * 1.2 + 0.4); // Se orienta a navegar hacia arriba
      }

      if (op.x < 30) {
        op.x = 30;
        op.vx = Math.abs(op.vx) * 0.75 + 0.4;
        op.targetVx = Math.random() * 1.5 + 0.4;
        op.facingLeft = false;
      } else if (op.x > width - 30) {
        op.x = width - 30;
        op.vx = -Math.abs(op.vx) * 0.75 - 0.4;
        op.targetVx = -(Math.random() * 1.5 + 0.4);
        op.facingLeft = true;
      }

      // Dibujar rayo magnético hacia tarjeta
      drawMartianMagneticRay(ctx, op, timeTick);

      // Dibujar astronauta micro
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
