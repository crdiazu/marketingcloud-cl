// MarketingCloud Studio - Interactive Engine 3.0
// 1. Live Santiago Timecode & Chilean Economic Indicators (USD / UF)
// 2. Micro 80's Astronauts (H.E.R.O. Activision Style):
//    - SIEMPRE SE ACERCAN AL MOUSE (Enjambre y escolta 2D continuo)
//    - CHOQUE ELÁSTICO CON LETRAS Y TARJETAS con chispas de colores
//    - PISTOLA MARCIANA MAGNÉTICA: anclaje y tracción hacia tarjetas y títulos
// 3. 6 Entornos Planetarios con Física y Detalles Visuales Especializados:
//    - [E] Space: Negro Profundo, Zero-G, planetas lejanos, cometas y estrellas parallax
//    - [T] Tierra: Verde Jade, 1.0g, montañas Los Andes, árboles, viento y hojas/clima
//    - [D/M] Deimos: Rojo Carmesí, 0.38g, piedras, rocas flotantes, tormenta y polvo ferroso
//    - [A] Agua: Azul Abisal, resistencia hidrodinámica, plantas, peces extraños y burbujas
//    - [P] Plasma: Verde Neón, efecto lisérgico/psicodélico, ondas cromáticas y arcos eléctricos
//    - [C] Cuántico: Púrpura Iridiscente, partículas prismáticas y astronautas desorientados

(function() {
  'use strict';

  var isMobile = (window.innerWidth <= 768) || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // ==========================================================================
  // 1. TIMECODE EN VIVO - SANTIAGO DE CHILE (UTC-3)
  // ==========================================================================
  function updateSantiagoTimecode() {
    var el = document.getElementById('live-timecode');
    if (!el) return;

    var now = new Date();
    var santiagoString = now.toLocaleTimeString('es-CL', {
      timeZone: 'America/Santiago',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    el.textContent = santiagoString;
  }

  updateSantiagoTimecode();
  setInterval(updateSantiagoTimecode, 1000);

  // ==========================================================================
  // 2. INDICADORES ECONÓMICOS DE CHILE (DÓLAR Y UF EN TIEMPO REAL)
  // ==========================================================================
  var valorDolarCache = '$972,60';
  var valorUfCache = '$41.252,94';

  function fetchChileIndicators() {
    var elDolar = document.getElementById('val-dolar');
    var elUf = document.getElementById('val-uf');

    fetch('https://mindicador.cl/api')
      .then(function(res) {
        if (!res.ok) throw new Error('Network response not ok');
        return res.json();
      })
      .then(function(data) {
        if (data.dolar && data.dolar.valor) {
          valorDolarCache = '$' + data.dolar.valor.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
          if (elDolar) elDolar.textContent = valorDolarCache;
        }
        if (data.uf && data.uf.valor) {
          valorUfCache = '$' + data.uf.valor.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          if (elUf) elUf.textContent = valorUfCache;
        }
      })
      .catch(function(err) {
        if (elDolar) elDolar.textContent = valorDolarCache;
        if (elUf) elUf.textContent = valorUfCache;
      });
  }

  fetchChileIndicators();
  setInterval(fetchChileIndicators, 300000); // Actualiza cada 5 minutos

  // ==========================================================================
  // 3. CANVAS CÓSMICO Y CURSOR RETICULAR
  // ==========================================================================
  var dot = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');
  var canvas = document.getElementById('nebula-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var dpr = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5);
  var width = window.innerWidth;
  var height = window.innerHeight;

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  var mouseX = width / 2;
  var mouseY = height * 0.45;
  var targetMouseX = mouseX;
  var targetMouseY = mouseY;
  var ringX = mouseX;
  var ringY = mouseY;
  var isVisible = false;

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
      if (dot) dot.style.opacity = '0';
      if (ring) ring.style.opacity = '0';
    });
  }

  // Interacción táctil en celular
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

  // ==========================================================================
  // 4. PLANETAS Y MEDIOS FÍSICOS (6 ENTORNOS ESPECIALIZADOS)
  // ==========================================================================
  var PLANETS = [
    { 
      id: 'espacio', key: 'e', name: 'Space', color: 'Negro Profundo', icon: '🌌', 
      gravityY: 0.0, friction: 0.985, 
      desc: 'Zero-G cósmico, planetas, cometas y estrellas en scroll' 
    },
    { 
      id: 'tierra', key: 't', name: 'Tierra', color: 'Verde Jade', icon: '🌍', 
      gravityY: 0.08, friction: 0.98, 
      desc: 'Gravedad estándar 1.0g, montañas, árboles, viento y clima' 
    },
    { 
      id: 'deimos', altId: 'marte', key: 'd', altKey: 'm', name: 'Deimos', color: 'Rojo Carmesí', icon: '🪐', 
      gravityY: 0.04, friction: 0.985, 
      desc: 'Gravedad reducida 0.38g, piedras, rocas y polvo ferroso' 
    },
    { 
      id: 'agua', key: 'a', name: 'Agua', color: 'Azul Abisal', icon: '💧', 
      gravityY: 0.02, friction: 0.91, fluidWave: true, 
      desc: 'Resistencia hidrodinámica, plantas y peces extraños' 
    },
    { 
      id: 'plasma', key: 'p', name: 'Plasma', color: 'Verde Neón', icon: '⚡', 
      gravityY: 0.015, friction: 0.88, plasma: true, psychedelic: true, 
      desc: 'Densidad electromagnética y efecto lisérgico' 
    },
    { 
      id: 'cuantico', key: 'c', name: 'Cuántico', color: 'Púrpura Iridiscente', icon: '✦', 
      surreal: true, quantum: true, friction: 0.96, 
      desc: 'Gravedad cuántica oscilante, partículas prismáticas y astronautas desorientados' 
    }
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
    }, 2800);
  }

  function setPlanet(indexOrId) {
    var foundIndex = 0;
    if (typeof indexOrId === 'number') {
      foundIndex = (indexOrId + PLANETS.length) % PLANETS.length;
    } else {
      for (var i = 0; i < PLANETS.length; i++) {
        var p = PLANETS[i];
        if (p.id === indexOrId || p.key === indexOrId || (p.altId && p.altId === indexOrId) || (p.altKey && p.altKey === indexOrId)) {
          foundIndex = i;
          break;
        }
      }
    }

    currentPlanetIndex = foundIndex;
    currentPlanet = PLANETS[currentPlanetIndex];

    document.body.className = 'mode-' + currentPlanet.id + (currentPlanet.altId ? ' mode-' + currentPlanet.altId : '');

    var btns = document.querySelectorAll('.gravity-btn');
    btns.forEach(function(b) {
      var bMode = b.getAttribute('data-mode');
      if (bMode === currentPlanet.id || (currentPlanet.altId && bMode === currentPlanet.altId)) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    var mobilePlanetBtn = document.getElementById('mobile-planet-btn');
    if (mobilePlanetBtn) {
      mobilePlanetBtn.innerHTML = currentPlanet.icon + ' ' + currentPlanet.name;
    }

    showHudToast('<strong>' + currentPlanet.icon + ' ' + currentPlanet.name + ' (' + currentPlanet.color + ')</strong><br>' + currentPlanet.desc);
  }

  // Delegación de clics en selector de planetas
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.gravity-btn');
    if (btn) {
      var mode = btn.getAttribute('data-mode');
      setPlanet(mode);
      return;
    }

    var mobBtn = e.target.closest('#mobile-planet-btn');
    if (mobBtn) {
      setPlanet(currentPlanetIndex + 1);
    }
  });

  // Atajos de teclado: [E] Space, [T] Tierra, [D]/[M] Deimos, [A] Agua, [P] Plasma, [C] Cuántico
  window.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    var k = e.key.toLowerCase();
    for (var i = 0; i < PLANETS.length; i++) {
      var p = PLANETS[i];
      if (k === p.key || (p.altKey && k === p.altKey)) {
        setPlanet(p.id);
        break;
      }
    }
  });

  // ==========================================================================
  // 5. ESTRELLAS DE FONDO CON PARALLAX
  // ==========================================================================
  var STAR_COUNT = isMobile ? 60 : 130;
  var stars = [];
  for (var i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * width,
      baseY: Math.random() * height,
      y: Math.random() * height,
      radius: Math.random() < 0.2 ? (Math.random() * 1.6 + 1.2) : (Math.random() * 1.0 + 0.4),
      alpha: Math.random() * 0.7 + 0.25,
      twinkleSpeed: Math.random() * 0.03 + 0.015,
      layer: (i % 3) + 1 // 1: lejana, 2: media, 3: cercana con parallax
    });
  }

  // ==========================================================================
  // 6. OPERATIVOS MICRO 80's: VUELO LIBRE 2D CONTINUO HACIA EL MOUSE
  // ==========================================================================
  var OPERATIVE_COUNT = isMobile ? 5 : 12;
  var operatives = [];

  for (var i = 0; i < OPERATIVE_COUNT; i++) {
    operatives.push({
      id: i,
      x: Math.random() * (width - 100) + 50,
      y: Math.random() * (height * 0.65) + 70,

      vx: (Math.random() - 0.5) * 1.8,
      vy: (Math.random() - 0.5) * 1.4,
      targetVx: 0,
      targetVy: 0,

      facingLeft: Math.random() < 0.5,
      tilt: 0,
      quantumAngle: Math.random() * Math.PI * 2,
      quantumSpinSpeed: (Math.random() - 0.5) * 0.12,

      rotorAngle: Math.random() * 10,
      rotorSpeed: 0.55,

      magneticBeamActive: false,
      magneticTargetX: 0,
      magneticTargetY: 0,
      magneticBeamTimer: 0,
      magneticCooldown: Math.random() * 80 + 30,

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

    // En Cuántico: astronautas desorientados girando alegremente en 360°
    if (currentPlanet.id === 'cuantico') {
      ctx.rotate(op.quantumAngle);
    } else {
      ctx.rotate(op.tilt);
    }

    ctx.scale(op.facingLeft ? -1 : 1, 1);

    var p = 1.15; // Escala micro arcade

    // Si está en Cuántico, efecto de fantasma / superposición cuántica
    if (currentPlanet.id === 'cuantico') {
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.translate(2.5, -2);
      drawPixelRect(ctx, -2 * p, -5.5 * p, 4.5 * p, 3.5 * p, '#38BDF8');
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.translate(-2.5, 2);
      drawPixelRect(ctx, -2 * p, -5.5 * p, 4.5 * p, 3.5 * p, '#F43F5E');
      ctx.restore();
    }

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
    var bladeColor = (currentPlanet.id === 'plasma') ? '#86EFAC' : '#FFEA00';
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
    drawPixelRect(ctx, -4.5 * p, -2.5 * p, 1 * p, 2 * p, bladeColor);

    // 4. CASCO CON LENTES AMARILLOS Y BANDA ROJA
    drawPixelRect(ctx, -2 * p, -5.5 * p, 4.5 * p, 3.5 * p, '#FFFFFF');
    drawPixelRect(ctx, -2 * p, -4 * p, 4.5 * p, 1 * p, '#DC2626');
    drawPixelRect(ctx, 0.8 * p, -4.2 * p, 1.8 * p, 1.8 * p, bladeColor);

    // 5. CUERPO BLANCO CON CINTURÓN
    drawPixelRect(ctx, -2 * p, -2 * p, 4.5 * p, 4 * p, '#FFFFFF');
    drawPixelRect(ctx, -2 * p, 0.2 * p, 4.5 * p, 0.9 * p, '#0284C7');

    // 6. PIERNAS Y BOTAS NEGRAS
    drawPixelRect(ctx, -2 * p, 2 * p, 1.6 * p, 2.2 * p, '#FFFFFF');
    drawPixelRect(ctx, 0.9 * p, 2 * p, 1.6 * p, 2.2 * p, '#FFFFFF');
    drawPixelRect(ctx, -2.6 * p, 4.2 * p, 2.2 * p, 1.4 * p, '#0F172A');
    drawPixelRect(ctx, 0.9 * p, 4.2 * p, 2.2 * p, 1.4 * p, '#0F172A');

    ctx.restore();
  }

  // Dibujar rayo magnético con anillos pulsantes hacia tarjetas o letras
  function drawMartianMagneticRay(ctx, op, timeTick) {
    if (!op.magneticBeamActive) return;

    var startX = op.x + (op.facingLeft ? -10 : 10);
    var startY = op.y - 1;
    var targetX = op.magneticTargetX;
    var targetY = op.magneticTargetY;

    var beamColor = (currentPlanet.id === 'deimos' || currentPlanet.id === 'marte') ? '#F87171' :
                    (currentPlanet.id === 'tierra') ? '#34D399' :
                    (currentPlanet.id === 'plasma') ? '#22C55E' :
                    (currentPlanet.id === 'agua') ? '#38BDF8' :
                    (currentPlanet.id === 'cuantico') ? '#C084FC' : '#F59E0B';

    ctx.save();
    ctx.strokeStyle = beamColor;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(targetX, targetY);
    ctx.stroke();

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

    ctx.beginPath();
    ctx.arc(targetX, targetY, 3 + Math.sin(timeTick * 12) * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFEA00';
    ctx.fill();

    ctx.restore();
  }

  // Rayo de interacción entre compañeros de escuadrón
  function drawPeerInteractionRay(ctx, op1, op2, timeTick) {
    ctx.save();
    ctx.strokeStyle = (currentPlanet.id === 'plasma') ? 'rgba(34, 197, 94, 0.7)' : 'rgba(56, 189, 248, 0.7)';
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
  // 7. LETRAS ATMOSFÉRICAS TRASERAS
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
  // 8. CACHÉ INTELIGENTE DE OBSTÁCULOS & MARCAS DE LÁSER
  // ==========================================================================
  var contentBoxes = [];
  var boxUpdateCooldown = 0;

  function refreshContentBoxes() {
    contentBoxes = [];
    var selectors = '.service-card, .tile, .price-card, .project-giant-item, .chroma-title, .brutalist-title, .kinetic-text-wrap, .stat-tile, .card';
    var elements = document.querySelectorAll(selectors);

    for (var i = 0; i < elements.length; i++) {
      var rect = elements[i].getBoundingClientRect();
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

  var laserMarks = [];
  var MAX_LASER_MARKS = isMobile ? 12 : 25;

  function addLaserMark(x, y) {
    if (laserMarks.length >= MAX_LASER_MARKS) {
      laserMarks.shift();
    }
    laserMarks.push({
      x: x,
      y: y,
      radius: Math.random() * 3 + 3.5,
      life: 1.0,
      decay: 0.0035,
      color: (currentPlanet.id === 'deimos' || currentPlanet.id === 'marte') ? '#F87171' :
             (currentPlanet.id === 'plasma') ? '#22C55E' :
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
      ctx.beginPath();
      ctx.arc(mark.x, mark.y, mark.radius * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = mark.color;
      ctx.globalAlpha = mark.life * 0.45;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(mark.x, mark.y, mark.radius * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = '#0F172A';
      ctx.globalAlpha = mark.life * 0.85;
      ctx.fill();

      ctx.restore();
    }
  }

  // ==========================================================================
  // 9. ENTORNOS PLANETARIOS ESPECIALIZADOS (DETALLES Y FÍSICA)
  // ==========================================================================

  // --- A. SPACE: PLANETAS DISTANTES Y COMETAS FUGACES ---
  var spaceComets = [];
  var cometCooldown = 120;

  function renderSpaceDetails(ctx, timeTick) {
    if (currentPlanet.id !== 'espacio') return;

    ctx.save();

    // 1. Planeta anillado distante (Saturno estilizado con scroll parallax)
    var satX = width * 0.84;
    var satY = (160 - (currentScrollY * 0.06)) % (height + 300);
    if (satY < -100) satY += height + 400;

    // Halo suave
    var satGlow = ctx.createRadialGradient(satX, satY, 15, satX, satY, 65);
    satGlow.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
    satGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = satGlow;
    ctx.beginPath();
    ctx.arc(satX, satY, 65, 0, Math.PI * 2);
    ctx.fill();

    // Esfera del planeta
    var satSphere = ctx.createRadialGradient(satX - 10, satY - 10, 4, satX, satY, 32);
    satSphere.addColorStop(0, '#334155');
    satSphere.addColorStop(0.7, '#1E293B');
    satSphere.addColorStop(1, '#0B0F19');
    ctx.fillStyle = satSphere;
    ctx.beginPath();
    ctx.arc(satX, satY, 32, 0, Math.PI * 2);
    ctx.fill();

    // Anillo exterior inclinado
    ctx.save();
    ctx.translate(satX, satY);
    ctx.rotate(0.38);
    ctx.beginPath();
    ctx.ellipse(0, 0, 68, 16, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, 0, 56, 12, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.40)';
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.restore();

    // 2. Luna / planetoide azulado flotante a la izquierda
    var moonX = width * 0.12;
    var moonY = (height * 0.72 - (currentScrollY * 0.04)) % (height + 300);
    if (moonY < -80) moonY += height + 400;

    var moonGlow = ctx.createRadialGradient(moonX, moonY, 8, moonX, moonY, 35);
    moonGlow.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
    moonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 35, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 16, 0.8, 3.2);
    ctx.stroke();

    // 3. Cometas fugaces periódicos
    cometCooldown--;
    if ((cometCooldown <= 0 || scrollVelocity > 8) && spaceComets.length < 2) {
      spaceComets.push({
        x: Math.random() * width + 250,
        y: Math.random() * (height * 0.45) - 50,
        vx: -(Math.random() * 4 + 7.5),
        vy: Math.random() * 2.5 + 3.2,
        length: Math.random() * 60 + 80,
        life: 1.0,
        decay: 0.016
      });
      cometCooldown = Math.random() * 220 + 150;
    }

    for (var cIdx = spaceComets.length - 1; cIdx >= 0; cIdx--) {
      var c = spaceComets[cIdx];
      c.x += c.vx;
      c.y += c.vy;
      c.life -= c.decay;

      if (c.life <= 0 || c.x < -150 || c.y > height + 150) {
        spaceComets.splice(cIdx, 1);
        continue;
      }

      var tailX = c.x - (c.vx / Math.hypot(c.vx, c.vy)) * c.length;
      var tailY = c.y - (c.vy / Math.hypot(c.vx, c.vy)) * c.length;

      var cometGrad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
      cometGrad.addColorStop(0, 'rgba(255, 255, 255, ' + (c.life * 0.9) + ')');
      cometGrad.addColorStop(0.3, 'rgba(253, 224, 71, ' + (c.life * 0.6) + ')');
      cometGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

      ctx.strokeStyle = cometGrad;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      // Cabeza resplandeciente
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(c.x, c.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // --- B. TIERRA: MONTAÑAS, ÁRBOLES Y VIENTO/HOJAS JADE ---
  var earthLeaves = [];
  var LEAF_COUNT = isMobile ? 12 : 24;
  for (var lIdx = 0; lIdx < LEAF_COUNT; lIdx++) {
    earthLeaves.push({
      x: Math.random() * width,
      y: Math.random() * height,
      speedX: Math.random() * 2.2 + 1.2,
      swaySpeed: Math.random() * 0.03 + 0.015,
      size: Math.random() * 3 + 2,
      angle: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.08
    });
  }

  function renderEarthDetails(ctx, timeTick) {
    if (currentPlanet.id !== 'tierra') return;

    ctx.save();

    // 1. Silueta de Montañas / Los Andes en el horizonte
    var baseY = height;
    var mParallax = (currentScrollY * 0.04) % 30;

    // Capa lejana
    ctx.fillStyle = 'rgba(6, 78, 59, 0.28)';
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    ctx.lineTo(0, baseY - 120 + mParallax);
    ctx.lineTo(width * 0.22, baseY - 165 + mParallax);
    ctx.lineTo(width * 0.45, baseY - 110 + mParallax);
    ctx.lineTo(width * 0.68, baseY - 180 + mParallax);
    ctx.lineTo(width * 0.88, baseY - 130 + mParallax);
    ctx.lineTo(width, baseY - 150 + mParallax);
    ctx.lineTo(width, baseY);
    ctx.closePath();
    ctx.fill();

    // Capa cercana de colinas
    ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    ctx.lineTo(0, baseY - 70);
    ctx.lineTo(width * 0.35, baseY - 105);
    ctx.lineTo(width * 0.70, baseY - 65);
    ctx.lineTo(width, baseY - 95);
    ctx.lineTo(width, baseY);
    ctx.closePath();
    ctx.fill();

    // 2. Siluetas de árboles y coníferas en la base
    var treeSpacing = width / (isMobile ? 8 : 16);
    ctx.fillStyle = 'rgba(6, 44, 34, 0.75)';
    for (var t = 0; t <= (isMobile ? 8 : 16); t++) {
      var tx = t * treeSpacing + 15;
      var ty = height - 15;
      var tHeight = 35 + ((t * 7) % 25);
      var sway = Math.sin(timeTick * 1.8 + t) * 3;

      // Tronco y cono
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(tx + sway, ty - tHeight);
      ctx.lineTo(tx + 12, ty);
      ctx.closePath();
      ctx.fill();

      // Segundo nivel follaje
      ctx.beginPath();
      ctx.moveTo(tx - 6, ty - 8);
      ctx.lineTo(tx + sway, ty - tHeight - 6);
      ctx.lineTo(tx + 16, ty - 8);
      ctx.closePath();
      ctx.fill();
    }

    // 3. Viento y hojas verdes flotando por la pantalla
    for (var l = 0; l < earthLeaves.length; l++) {
      var lf = earthLeaves[l];
      lf.x += lf.speedX;
      lf.y += Math.sin(timeTick * 2.5 + l) * 0.8;
      lf.angle += lf.rotSpeed;

      if (lf.x > width + 20) {
        lf.x = -20;
        lf.y = Math.random() * height;
      }

      ctx.save();
      ctx.translate(lf.x, lf.y);
      ctx.rotate(lf.angle);
      ctx.fillStyle = 'rgba(52, 211, 153, 0.65)';
      ctx.beginPath();
      ctx.ellipse(0, 0, lf.size * 1.5, lf.size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }

  // --- C. DEIMOS (ROJO CARMESÍ): ROCAS, PIEDRAS Y POLVO FERROSO ---
  var deimosWinds = [];
  var WIND_COUNT = isMobile ? 18 : 34;
  for (var dw = 0; dw < WIND_COUNT; dw++) {
    deimosWinds.push({
      x: Math.random() * width,
      y: Math.random() * height,
      len: Math.random() * 55 + 25,
      speed: Math.random() * 4.5 + 3.2,
      alpha: Math.random() * 0.35 + 0.15,
      thick: Math.random() * 1.5 + 0.8
    });
  }

  var deimosFloatingRocks = [];
  var ROCK_COUNT = isMobile ? 5 : 9;
  for (var rk = 0; rk < ROCK_COUNT; rk++) {
    deimosFloatingRocks.push({
      id: rk,
      x: (width / (ROCK_COUNT + 1)) * (rk + 1) + (Math.random() - 0.5) * 50,
      baseY: height * 0.60 + Math.random() * (height * 0.28),
      size: Math.random() * 8 + 6,
      rot: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.02
    });
  }

  function renderDeimosDetails(ctx, timeTick) {
    if (currentPlanet.id !== 'deimos' && currentPlanet.id !== 'marte') return;

    ctx.save();

    // 1. Cordillera y cráteres rocosos en el suelo
    ctx.fillStyle = 'rgba(127, 29, 29, 0.30)';
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, height - 90);
    ctx.lineTo(width * 0.25, height - 130);
    ctx.lineTo(width * 0.55, height - 85);
    ctx.lineTo(width * 0.80, height - 140);
    ctx.lineTo(width, height - 95);
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // 2. Piedras y rocas flotando en gravedad reducida (0.38g)
    for (var r = 0; r < deimosFloatingRocks.length; r++) {
      var rock = deimosFloatingRocks[r];
      rock.rot += rock.rotSpeed;
      var ry = rock.baseY + Math.sin(timeTick * 1.5 + rock.id) * 8;

      ctx.save();
      ctx.translate(rock.x, ry);
      ctx.rotate(rock.rot);

      ctx.fillStyle = 'rgba(239, 68, 68, 0.50)';
      ctx.strokeStyle = 'rgba(248, 113, 113, 0.70)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-rock.size, -rock.size * 0.5);
      ctx.lineTo(rock.size * 0.8, -rock.size * 0.8);
      ctx.lineTo(rock.size, rock.size * 0.5);
      ctx.lineTo(0, rock.size * 0.9);
      ctx.lineTo(-rock.size * 0.9, rock.size * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    // 3. Ráfagas de viento y polvo ferroso
    for (var w = 0; w < deimosWinds.length; w++) {
      var wind = deimosWinds[w];
      wind.x -= wind.speed;
      wind.y += Math.sin(timeTick * 3 + w) * 0.35;
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

      if (w % 3 === 0) {
        ctx.fillStyle = 'rgba(248, 113, 113, ' + (wind.alpha * 1.4) + ')';
        ctx.fillRect(wind.x - 4, wind.y - 1, 2.5, 2.5);
      }
    }

    ctx.restore();
  }

  // --- D. AGUA (AZUL ABISAL): PECES EXTRAÑOS BIOLUMINISCENTES, PLANTAS Y BURBUJAS ---
  var waterPlants = [];
  var PLANT_COUNT = isMobile ? 5 : 9;
  for (var pIdx = 0; pIdx < PLANT_COUNT; pIdx++) {
    waterPlants.push({
      id: pIdx,
      baseX: (width / (PLANT_COUNT + 1)) * (pIdx + 1) + (Math.random() - 0.5) * 40,
      height: Math.random() * 160 + 130,
      swayAmount: Math.random() * 35 + 25,
      widthFrond: Math.random() * 4 + 3
    });
  }

  var waterBubbles = [];
  var BUBBLE_COUNT = isMobile ? 14 : 26;
  for (var bIdx = 0; bIdx < BUBBLE_COUNT; bIdx++) {
    waterBubbles.push({
      id: bIdx,
      x: Math.random() * width,
      y: height + Math.random() * 100,
      radius: Math.random() * 3 + 1.5,
      speed: Math.random() * 1.2 + 0.6,
      wobbleSpeed: Math.random() * 0.04 + 0.02,
      wobbleOffset: Math.random() * Math.PI * 2
    });
  }

  // Peces extraños abisales bioluminiscentes
  var abyssalFish = [];
  var FISH_COUNT = isMobile ? 3 : 5;
  for (var f = 0; f < FISH_COUNT; f++) {
    abyssalFish.push({
      id: f,
      x: Math.random() * width,
      y: height * 0.35 + Math.random() * (height * 0.5),
      speed: Math.random() * 1.2 + 0.8,
      facingLeft: Math.random() < 0.5,
      bodyLength: Math.random() * 10 + 18,
      swimOffset: Math.random() * Math.PI * 2
    });
  }

  function renderWaterDetails(ctx, timeTick) {
    if (currentPlanet.id !== 'agua') return;

    ctx.save();

    // 1. Rayos de luz abisales (God Rays)
    for (var r = 0; r < 4; r++) {
      var rx = (width * 0.25) * r + Math.sin(timeTick * 0.8 + r) * 30;
      var rayGrad = ctx.createLinearGradient(rx, 0, rx + 80, height);
      rayGrad.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
      rayGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      ctx.moveTo(rx, 0);
      ctx.lineTo(rx + 60, 0);
      ctx.lineTo(rx + 160, height);
      ctx.lineTo(rx - 40, height);
      ctx.closePath();
      ctx.fill();
    }

    // 2. Algas marinas abisales ondulantes
    for (var p = 0; p < waterPlants.length; p++) {
      var pl = waterPlants[p];
      var baseY = height;
      var tipY = height - pl.height;
      var tipX = pl.baseX + Math.sin(timeTick * 2.2 + pl.id) * pl.swayAmount;
      var cp1X = pl.baseX + Math.sin(timeTick * 1.5 + pl.id) * (pl.swayAmount * 0.4);
      var cp1Y = height - (pl.height * 0.4);

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = pl.widthFrond;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(pl.baseX, baseY);
      ctx.quadraticCurveTo(cp1X, cp1Y, tipX, tipY);
      ctx.stroke();

      // Fronda bioluminiscente superior
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(tipX, tipY, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Peces extraños bioluminiscentes nadando
    for (var fi = 0; fi < abyssalFish.length; fi++) {
      var fish = abyssalFish[fi];

      // Nadar horizontalmente
      fish.x += (fish.facingLeft ? -1 : 1) * fish.speed;
      fish.y += Math.sin(timeTick * 2.2 + fish.swimOffset) * 0.4;

      if (fish.facingLeft && fish.x < -60) {
        fish.x = width + 60;
        fish.y = height * 0.35 + Math.random() * (height * 0.5);
      } else if (!fish.facingLeft && fish.x > width + 60) {
        fish.x = -60;
        fish.y = height * 0.35 + Math.random() * (height * 0.5);
      }

      ctx.save();
      ctx.translate(fish.x, fish.y);
      ctx.scale(fish.facingLeft ? -1 : 1, 1);

      // Cuerpo pez
      ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
      ctx.beginPath();
      ctx.ellipse(0, 0, fish.bodyLength, fish.bodyLength * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cola ondulante
      var tailWiggle = Math.sin(timeTick * 6 + fish.swimOffset) * 5;
      ctx.beginPath();
      ctx.moveTo(-fish.bodyLength, 0);
      ctx.lineTo(-fish.bodyLength - 12, -8 + tailWiggle);
      ctx.lineTo(-fish.bodyLength - 12, 8 + tailWiggle);
      ctx.closePath();
      ctx.fill();

      // Señuelo / Antena bioluminiscente sobre la cabeza (iluminación abisal)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(fish.bodyLength * 0.5, -4);
      ctx.quadraticCurveTo(fish.bodyLength * 0.8, -14, fish.bodyLength + 6, -10);
      ctx.stroke();

      ctx.fillStyle = '#FFEA00';
      ctx.beginPath();
      ctx.arc(fish.bodyLength + 6, -10, 2.5 + Math.sin(timeTick * 8 + fish.id) * 0.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 4. Burbujas ascendentes
    for (var b = 0; b < waterBubbles.length; b++) {
      var bb = waterBubbles[b];
      bb.y -= bb.speed;
      bb.x += Math.sin(timeTick * 3 + bb.wobbleOffset) * 0.5;

      if (bb.y < -20) {
        bb.y = height + Math.random() * 60;
        bb.x = Math.random() * width;
      }

      ctx.strokeStyle = 'rgba(186, 230, 253, 0.65)';
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(bb.x, bb.y, bb.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Brillo interior burbuja
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(bb.x - bb.radius * 0.35, bb.y - bb.radius * 0.35, bb.radius * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // --- E. PLASMA: EFECTO LISÉRGICO / PSICODÉLICO & ARCOS ELÉCTRICOS ---
  function renderPlasmaDetails(ctx, timeTick) {
    if (currentPlanet.id !== 'plasma') return;

    ctx.save();

    // 1. Ondas caleidoscópicas psicodélicas respirantes
    var centerX = width * 0.5;
    var centerY = height * 0.5;

    for (var ring = 1; ring <= 4; ring++) {
      var ringRadius = ((timeTick * 25 + ring * 90) % (Math.max(width, height) * 0.75));
      var hue = (timeTick * 45 + ring * 40) % 360;
      var ringAlpha = Math.max(0, 0.22 - (ringRadius / (Math.max(width, height) * 0.75)) * 0.22);

      ctx.strokeStyle = 'hsla(' + hue + ', 95%, 65%, ' + ringAlpha + ')';
      ctx.lineWidth = 3.5;
      ctx.beginPath();

      // Deformación sinuosa lisérgica
      for (var angle = 0; angle <= Math.PI * 2; angle += 0.2) {
        var warp = Math.sin(angle * 6 + timeTick * 3) * 12;
        var rx = centerX + Math.cos(angle) * (ringRadius + warp);
        var ry = centerY + Math.sin(angle) * (ringRadius + warp);
        if (angle === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // 2. Arcos eléctricos de plasma entre astronautas
    for (var a = 0; a < operatives.length; a++) {
      var op = operatives[a];
      if (Math.random() < 0.08) {
        var targetOp = operatives[(a + 1) % operatives.length];
        var d = Math.hypot(targetOp.x - op.x, targetOp.y - op.y);
        if (d < 180) {
          ctx.strokeStyle = '#22C55E';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(op.x, op.y);
          var midX = (op.x + targetOp.x) / 2 + (Math.random() - 0.5) * 20;
          var midY = (op.y + targetOp.y) / 2 + (Math.random() - 0.5) * 20;
          ctx.lineTo(midX, midY);
          ctx.lineTo(targetOp.x, targetOp.y);
          ctx.stroke();
        }
      }
    }

    ctx.restore();
  }

  // --- F. CUÁNTICO: PARTÍCULAS PRISMÁTICAS Y DESTELLOS ARCOÍRIS ---
  var quantumPrisms = [];
  var PRISM_COUNT = isMobile ? 8 : 16;
  for (var q = 0; q < PRISM_COUNT; q++) {
    quantumPrisms.push({
      id: q,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 7 + 4,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      driftX: (Math.random() - 0.5) * 0.8,
      driftY: (Math.random() - 0.5) * 0.8,
      hueBase: Math.random() * 360
    });
  }

  function renderQuantumDetails(ctx, timeTick) {
    if (currentPlanet.id !== 'cuantico') return;

    ctx.save();

    for (var q = 0; q < quantumPrisms.length; q++) {
      var p = quantumPrisms[q];
      p.x += p.driftX;
      p.y += p.driftY;
      p.rot += p.rotSpeed;

      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);

      // Cristal prismático con gradiente iridiscente
      var qHue = (p.hueBase + timeTick * 50) % 360;
      ctx.fillStyle = 'hsla(' + qHue + ', 90%, 70%, 0.65)';
      ctx.strokeStyle = 'hsla(' + ((qHue + 120) % 360) + ', 95%, 85%, 0.85)';
      ctx.lineWidth = 1.2;

      // Forma de rombo/prisma cuántico
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 1.5);
      ctx.lineTo(p.size, 0);
      ctx.lineTo(0, p.size * 1.5);
      ctx.lineTo(-p.size, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    ctx.restore();
  }

  // ==========================================================================
  // 10. LOOP PRINCIPAL DE ANIMACIÓN A 60 FPS
  // ==========================================================================
  var timeTick = 0;
  var sparks = [];

  function loop() {
    timeTick += 0.03;

    if (boxUpdateCooldown > 0) {
      boxUpdateCooldown--;
    } else {
      refreshContentBoxes();
      boxUpdateCooldown = 35;
    }

    // Suavizado del mouse
    if (!isMobile) {
      mouseX += (targetMouseX - mouseX) * 0.28;
      mouseY += (targetMouseY - mouseY) * 0.28;
      ringX += (targetMouseX - ringX) * 0.14;
      ringY += (targetMouseY - ringY) * 0.14;

      if (ring && isVisible) {
        ring.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px) translate(-50%, -50%)';
      }
    }

    ctx.clearRect(0, 0, width, height);

    // Movimiento de monolitos de fondo
    var isCityActive = (currentScrollY > 180);
    var targetCityOpacity = isCityActive ? 0.20 : 0;
    cityOpacity += (targetCityOpacity - cityOpacity) * 0.08;

    if (cityOpacity > 0.01) {
      cityOffsetX += 1.0 + (scrollVelocity * 0.4);
    }

    // RENDERIZAR DETALLES ESPECÍFICOS DEL PLANETA ACTIVO
    renderSpaceDetails(ctx, timeTick);
    renderEarthDetails(ctx, timeTick);
    renderDeimosDetails(ctx, timeTick);
    renderWaterDetails(ctx, timeTick);
    renderPlasmaDetails(ctx, timeTick);
    renderQuantumDetails(ctx, timeTick);

    renderLaserMarks(ctx);

    // Estrellas de fondo con Parallax
    for (var s = 0; s < STAR_COUNT; s++) {
      var st = stars[s];
      var tw = Math.sin(timeTick * 2 + s) * 0.15;
      
      var parallaxY = (st.baseY - (currentScrollY * (0.03 * st.layer))) % height;
      if (parallaxY < 0) parallaxY += height;

      ctx.beginPath();
      ctx.arc(st.x, parallaxY, st.radius, 0, Math.PI * 2);

      var starColor = (currentPlanet.id === 'tierra') ? 'rgba(52, 211, 153, ' :
                      (currentPlanet.id === 'deimos' || currentPlanet.id === 'marte') ? 'rgba(248, 113, 113, ' :
                      (currentPlanet.id === 'agua') ? 'rgba(125, 211, 252, ' :
                      (currentPlanet.id === 'plasma') ? 'rgba(134, 239, 172, ' :
                      (currentPlanet.id === 'cuantico') ? 'rgba(233, 213, 255, ' :
                      'rgba(255, 255, 255, ';

      ctx.fillStyle = starColor + Math.max(0.06, st.alpha + tw) + ')';
      ctx.fill();
    }

    renderAtmosphericBackgroundLetters(ctx);

    // Chispas de impacto
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

    var friction = currentPlanet.friction || 0.98;

    // FÍSICA Y MOVIMIENTO DE LOS ASTRONAUTAS: SIEMPRE SE ACERCAN AL MOUSE
    var curMouseX = isMobile ? targetMouseX : mouseX;
    var curMouseY = isMobile ? targetMouseY : mouseY;

    for (var opIdx = 0; opIdx < OPERATIVE_COUNT; opIdx++) {
      var op = operatives[opIdx];

      var mdx = curMouseX - op.x;
      var mdy = curMouseY - op.y;
      var mDist = Math.hypot(mdx, mdy);

      // Mirar de frente hacia el cursor
      if (Math.abs(mdx) > 3) {
        op.facingLeft = (mdx < 0);
      }

      // En Cuántico: rotación cuántica continua desorientada
      if (currentPlanet.id === 'cuantico') {
        op.quantumAngle += 0.07;
      }

      // Formación de escolta dinámica alrededor del cursor
      var orbitRadius = 40 + (op.id % 5) * 22;
      var orbitDirection = (op.id % 2 === 0) ? 1 : -1;
      var orbitAngle = (op.id / OPERATIVE_COUNT) * Math.PI * 2 + (timeTick * 0.75 * orbitDirection) + op.waveOffset;

      var escortTargetX = curMouseX + Math.cos(orbitAngle) * orbitRadius;
      var escortTargetY = curMouseY + Math.sin(orbitAngle) * orbitRadius;

      var toTargetX = escortTargetX - op.x;
      var toTargetY = escortTargetY - op.y;
      var distToTarget = Math.hypot(toTargetX, toTargetY);

      if (mDist > orbitRadius + 35) {
        var approachSpeed = isMobile ? 2.8 : 3.6;
        var dirX = mdx / (mDist || 1);
        var dirY = mdy / (mDist || 1);
        op.targetVx = dirX * approachSpeed + Math.sin(timeTick * 2.6 + op.waveOffset) * 0.4;
        op.targetVy = dirY * approachSpeed + Math.cos(timeTick * 2.6 + op.waveOffset) * 0.4;
        op.rotorSpeed = 0.95;
      } else {
        var escortSpeed = isMobile ? 2.0 : 2.5;
        op.targetVx = (toTargetX / (distToTarget || 1)) * escortSpeed;
        op.targetVy = (toTargetY / (distToTarget || 1)) * escortSpeed;
        op.rotorSpeed = 0.65;
      }

      // Gravedad vertical del planeta
      if (currentPlanet.gravityY) {
        op.vy += currentPlanet.gravityY;
      }

      // Propulsión activa hacia el cursor
      op.vx += (op.targetVx - op.vx) * 0.085;
      op.vy += (op.targetVy - op.vy) * 0.085;

      op.rotorAngle += op.rotorSpeed;

      var targetTilt = Math.max(-0.40, Math.min(0.40, op.vx * 0.18));
      op.tilt += (targetTilt - op.tilt) * 0.15;

      op.vy += Math.sin(timeTick * 2.8 + op.waveOffset) * 0.05;

      if (currentPlanet.fluidWave) {
        op.vx += Math.sin(timeTick * 2 + op.waveOffset) * 0.06;
        op.vy += Math.cos(timeTick * 1.6 + op.waveOffset) * 0.04;
      }

      if (mDist < 26 && mDist > 0.1) {
        op.vx -= (mdx / mDist) * 0.55;
        op.vy -= (mdy / mDist) * 0.55;
      }

      // Rebote entre astronautas
      for (var otherIdx = opIdx + 1; otherIdx < OPERATIVE_COUNT; otherIdx++) {
        var other = operatives[otherIdx];
        var dBetweenX = other.x - op.x;
        var dBetweenY = other.y - op.y;
        var distBetween = Math.hypot(dBetweenX, dBetweenY);

        if (distBetween < 22 && distBetween > 1) {
          var repulse = (22 - distBetween) * 0.14;
          op.vx -= (dBetweenX / distBetween) * repulse;
          op.vy -= (dBetweenY / distBetween) * repulse;
          other.vx += (dBetweenX / distBetween) * repulse;
          other.vy += (dBetweenY / distBetween) * repulse;
        }

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

      // Pistola marciana magnética hacia tarjetas
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

          var bdx = hitX - op.x;
          var bdy = hitY - op.y;
          var bDist = Math.max(20, Math.hypot(bdx, bdy));
          op.vx += (bdx / bDist) * 1.1;
          op.vy += (bdy / bDist) * 0.9;

          addLaserMark(hitX, hitY);
        }
      }

      if (op.magneticBeamActive) {
        op.magneticBeamTimer--;
        if (op.magneticBeamTimer <= 0) {
          op.magneticBeamActive = false;
        }
      }

      // Choque elástico con letras y tarjetas
      var pad = 6;
      for (var cbIdx = 0; cbIdx < contentBoxes.length; cbIdx++) {
        var cb = contentBoxes[cbIdx];
        if (op.x > cb.left - pad && op.x < cb.right + pad && op.y > cb.top - pad && op.y < cb.bottom + pad) {
          var ovL = op.x - (cb.left - pad);
          var ovR = (cb.right + pad) - op.x;
          var ovT = op.y - (cb.top - pad);
          var ovB = (cb.bottom + pad) - op.y;
          var minOv = Math.min(ovL, ovR, ovT, ovB);

          if (minOv === ovT) {
            op.y = cb.top - pad;
            op.vy = -Math.abs(op.vy) * 0.85 - 0.6;
          } else if (minOv === ovB) {
            op.y = cb.bottom + pad;
            op.vy = Math.abs(op.vy) * 0.85 + 0.6;
          } else if (minOv === ovL) {
            op.x = cb.left - pad;
            op.vx = -Math.abs(op.vx) * 0.85 - 0.6;
            op.facingLeft = true;
          } else {
            op.x = cb.right + pad;
            op.vx = Math.abs(op.vx) * 0.85 + 0.6;
            op.facingLeft = false;
          }

          if (sparks.length < 25) {
            sparks.push({
              x: op.x,
              y: op.y,
              vx: (Math.random() - 0.5) * 3,
              vy: (Math.random() - 0.5) * 3,
              life: 0.75,
              color: (currentPlanet.id === 'deimos' || currentPlanet.id === 'marte') ? '#F87171' :
                     (currentPlanet.id === 'tierra' || currentPlanet.id === 'plasma') ? '#22C55E' :
                     (currentPlanet.id === 'cuantico') ? '#C084FC' : '#FFEA00'
            });
          }
          break;
        }
      }

      // Integración física
      op.vx *= friction;
      op.vy *= friction;
      op.x += op.vx;
      op.y += op.vy;

      // Límites de pantalla suaves
      if (op.y < 35) {
        op.y = 35;
        op.vy = Math.abs(op.vy) * 0.7;
      }
      var floorLimit = height - (isMobile ? 65 : 45);
      if (op.y > floorLimit) {
        op.y = floorLimit;
        op.vy = -Math.abs(op.vy) * 0.7;
      }
      if (op.x < 15) {
        op.x = 15;
        op.vx = Math.abs(op.vx) * 0.7;
      } else if (op.x > width - 15) {
        op.x = width - 15;
        op.vx = -Math.abs(op.vx) * 0.7;
      }

      drawMartianMagneticRay(ctx, op, timeTick);
      drawMicroAstronaut(ctx, op);
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

  // ==========================================================================
  // 11. INCLINACIÓN 3D INTERACTIVA EN TARJETAS
  // ==========================================================================
  if (!isMobile) {
    var tiltCards = document.querySelectorAll('.service-card, .tile, .project-giant-item');

    tiltCards.forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        var centerX = rect.width / 2;
        var centerY = rect.height / 2;

        var rotateX = ((y - centerY) / centerY) * -6;
        var rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) scale3d(1.025, 1.025, 1.025)';
      });

      card.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  // ==========================================================================
  // 12. CABECERA STICKY AL BAJAR (SE MANTIENE CON TODOS LOS MENÚS)
  // ==========================================================================
  var mainNav = document.querySelector('nav.main-nav');
  if (mainNav) {
    var scrollThreshold = 40;

    function handleNavScroll() {
      var currentY = window.pageYOffset || document.documentElement.scrollTop;
      if (currentY > scrollThreshold) {
        if (!mainNav.classList.contains('is-scrolled')) {
          mainNav.classList.add('is-scrolled');
        }
      } else {
        if (mainNav.classList.contains('is-scrolled')) {
          mainNav.classList.remove('is-scrolled');
        }
      }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();
  }

})();
