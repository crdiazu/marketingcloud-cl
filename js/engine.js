// MarketingCloud Studio - Engine 4.0 (Dual Faction Edition - Streamlined & Responsive)
// 1. Live Santiago Timecode & Chilean Indicators (USD / UF)
// 2. 2 Bandos de Micro-Astronautas 80s (10 Centinelas vs 10 Corsarios):
//    - BANDO 1 (Centinelas): Siguen suavemente al mouse con inercia relajada (sin magnetismo pegajoso)
//    - BANDO 2 (Corsarios): Evitan y esquivan activamente al mouse; huyen, hacen kiting o fintas
//    - 20 Operativos únicos con armas (láseres, railguns, pulsos, orbes) y habilidades (escudo, turbo, humo, glitch)
//    - Combates aéreos y disparos a tarjetas sólidas con marcas láser y chispas
// 3. 6 Entornos Planetarios: Colores, física de gravedad y partículas limpias sin sobrecarga visual
//    - [E] Space | [T] Tierra | [D] Deimos | [A] Agua | [P] Plasma | [C] Cuántico

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
      .catch(function() {
        if (elDolar) elDolar.textContent = valorDolarCache;
        if (elUf) elUf.textContent = valorUfCache;
      });
  }

  fetchChileIndicators();
  setInterval(fetchChileIndicators, 300000);

  // ==========================================================================
  // 3. CANVAS RESPONSIVO & CURSOR RETICULAR
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
  // 4. PLANETAS Y MEDIOS FÍSICOS (6 ENTORNOS)
  // ==========================================================================
  var PLANETS = [
    { 
      id: 'espacio', key: 'e', name: 'Space', color: 'Negro Profundo', icon: '🌌', 
      gravityY: 0.0, friction: 0.988, 
      desc: 'Zero-G cósmico, flotación libre inercial' 
    },
    { 
      id: 'tierra', key: 't', name: 'Tierra', color: 'Verde Jade', icon: '🌍', 
      gravityY: 0.07, friction: 0.98, 
      desc: 'Gravedad estándar 1.0g y propulsión firme' 
    },
    { 
      id: 'deimos', altId: 'marte', key: 'd', altKey: 'm', name: 'Deimos', color: 'Rojo Carmesí', icon: '🪐', 
      gravityY: 0.035, friction: 0.985, 
      desc: 'Gravedad reducida 0.38g y polvo ferroso' 
    },
    { 
      id: 'agua', key: 'a', name: 'Agua', color: 'Azul Abisal', icon: '💧', 
      gravityY: 0.02, friction: 0.92, fluidWave: true, 
      desc: 'Resistencia hidrodinámica y oleaje senoidal' 
    },
    { 
      id: 'plasma', key: 'p', name: 'Plasma', color: 'Verde Neón', icon: '⚡', 
      gravityY: 0.015, friction: 0.90, plasma: true, 
      desc: 'Densidad electromagnética y arcos voltaicos' 
    },
    { 
      id: 'cuantico', key: 'c', name: 'Cuántico', color: 'Púrpura Iridiscente', icon: '✦', 
      quantum: true, friction: 0.97, 
      desc: 'Gravedad oscilante y astronautas desorientados' 
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
    }, 2500);
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

  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.gravity-btn');
    if (btn) {
      setPlanet(btn.getAttribute('data-mode'));
      return;
    }

    var mobBtn = e.target.closest('#mobile-planet-btn');
    if (mobBtn) {
      setPlanet(currentPlanetIndex + 1);
    }
  });

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
  // 5. ESTRELLAS DE FONDO LIMPIAS CON PARALLAX
  // ==========================================================================
  var STAR_COUNT = isMobile ? 40 : 90;
  var stars = [];
  for (var i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * width,
      baseY: Math.random() * height,
      radius: Math.random() * 1.2 + 0.4,
      alpha: Math.random() * 0.6 + 0.2,
      layer: (i % 3) + 1
    });
  }

  // ==========================================================================
  // 6. CACHÉ DE OBSTÁCULOS & MARCAS LÁSER LIMPIAS
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
          bottom: rect.bottom
        });
      }
    }
  }

  refreshContentBoxes();
  window.addEventListener('resize', refreshContentBoxes);

  var laserMarks = [];
  var MAX_LASER_MARKS = isMobile ? 8 : 18;

  function addLaserMark(x, y, color) {
    if (laserMarks.length >= MAX_LASER_MARKS) {
      laserMarks.shift();
    }
    laserMarks.push({
      x: x,
      y: y,
      radius: Math.random() * 2.5 + 2.5,
      life: 1.0,
      decay: 0.005,
      color: color || '#FFEA00'
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
      ctx.arc(mark.x, mark.y, mark.radius * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = mark.color;
      ctx.globalAlpha = mark.life * 0.4;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(mark.x, mark.y, mark.radius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = '#0C0E14';
      ctx.globalAlpha = mark.life * 0.8;
      ctx.fill();
      ctx.restore();
    }
  }

  // ==========================================================================
  // 7. SISTEMA DE PROYECTILES, CHISPAS Y NUBES
  // ==========================================================================
  var projectiles = [];
  var sparks = [];
  var smokePuffs = [];

  function spawnSparks(x, y, count, color) {
    var num = count || 3;
    for (var s = 0; s < num; s++) {
      if (sparks.length >= 40) sparks.shift();
      sparks.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 0.7,
        color: color || '#FFEA00'
      });
    }
  }

  function spawnSmoke(x, y, color) {
    if (smokePuffs.length >= 15) smokePuffs.shift();
    smokePuffs.push({
      x: x,
      y: y,
      radius: 4,
      life: 0.9,
      decay: 0.03,
      color: color || 'rgba(100, 116, 139, 0.4)'
    });
  }

  // ==========================================================================
  // 8. LOS 20 OPERATIVOS ÚNICOS: 2 BANDOS (10 CENTINELAS VS 10 CORSARIOS)
  // ==========================================================================
  // En móvil: 5 de cada bando (10 total) para que la pantalla no se rompa ni sature
  var TOTAL_OPS = isMobile ? 10 : 20;

  var OPERATIVE_DEFS = [
    // --- BANDO 1: CENTINELAS (PERSIGUEN SUAVEMENTE SIN MAGNETISMO BRUSCO) ---
    { id: 0, faction: 'sentinel', name: 'Alpha', role: 'orbit', suit: '#FFFFFF', visor: '#38BDF8', pack: '#0284C7', weaponColor: '#38BDF8', weapon: 'twin-laser', ability: 'shield', orbitR: 85, speed: 2.0, accel: 0.03 },
    { id: 1, faction: 'sentinel', name: 'Cyan', role: 'flyby', suit: '#F1F5F9', visor: '#06B6D4', pack: '#0891B2', weaponColor: '#06B6D4', weapon: 'gatling', ability: 'turbo', orbitR: 115, speed: 2.8, accel: 0.038 },
    { id: 2, faction: 'sentinel', name: 'Escudo', role: 'bodyguard', suit: '#E2E8F0', visor: '#F59E0B', pack: '#D97706', weaponColor: '#F59E0B', weapon: 'plasma-orb', ability: 'shield', orbitR: 55, speed: 1.6, accel: 0.024 },
    { id: 3, faction: 'sentinel', name: 'Armónico', role: 'lissajous', suit: '#F8FAFC', visor: '#A855F7', pack: '#7E22CE', weaponColor: '#C084FC', weapon: 'pulse-beam', ability: 'none', orbitR: 100, speed: 2.2, accel: 0.028 },
    { id: 4, faction: 'sentinel', name: 'Escolta', role: 'orbit', suit: '#FFFFFF', visor: '#10B981', pack: '#059669', weaponColor: '#10B981', weapon: 'cryo-lance', ability: 'none', orbitR: 70, speed: 1.9, accel: 0.026 },
    { id: 5, faction: 'sentinel', name: 'Sniper', role: 'sniper-perch', suit: '#E0E7FF', visor: '#6366F1', pack: '#4338CA', weaponColor: '#818CF8', weapon: 'ion-rifle', ability: 'none', orbitR: 210, speed: 1.5, accel: 0.02 },
    { id: 6, faction: 'sentinel', name: 'Flanco Izq', role: 'flank-left', suit: '#F8FAFC', visor: '#38BDF8', pack: '#0369A1', weaponColor: '#38BDF8', weapon: 'homing-micro', ability: 'none', orbitR: 125, speed: 2.2, accel: 0.032 },
    { id: 7, faction: 'sentinel', name: 'Flanco Der', role: 'flank-right', suit: '#F8FAFC', visor: '#38BDF8', pack: '#0369A1', weaponColor: '#38BDF8', weapon: 'arc-lightning', ability: 'none', orbitR: 125, speed: 2.2, accel: 0.032 },
    { id: 8, faction: 'sentinel', name: 'Impulso', role: 'burst-dash', suit: '#F1F5F9', visor: '#FBBF24', pack: '#B45309', weaponColor: '#FBBF24', weapon: 'burst-cannon', ability: 'turbo', orbitR: 95, speed: 2.6, accel: 0.035 },
    { id: 9, faction: 'sentinel', name: 'Curioso', role: 'helix', suit: '#FFFFFF', visor: '#2DD4BF', pack: '#0F766E', weaponColor: '#2DD4BF', weapon: 'twin-laser', ability: 'none', orbitR: 80, speed: 1.8, accel: 0.025 },

    // --- BANDO 2: CORSARIOS (EVITAN Y ESQUIVAN ACTIVAMENTE AL MOUSE) ---
    { id: 10, faction: 'corsair', name: 'Carmesí', role: 'flee-pure', suit: '#1E293B', visor: '#EF4444', pack: '#991B1B', weaponColor: '#EF4444', weapon: 'crimson-railgun', ability: 'smoke', evasionDist: 200, speed: 2.6, accel: 0.038 },
    { id: 11, faction: 'corsair', name: 'Kiter', role: 'kiting', suit: '#0F172A', visor: '#F97316', pack: '#C2410C', weaponColor: '#F97316', weapon: 'void-needle', ability: 'none', evasionDist: 250, speed: 2.3, accel: 0.034 },
    { id: 12, faction: 'corsair', name: 'Zig-Zag', role: 'zigzag-dodge', suit: '#334155', visor: '#F43F5E', pack: '#BE123C', weaponColor: '#FB7185', weapon: 'scatter-shot', ability: 'none', evasionDist: 170, speed: 2.9, accel: 0.042 },
    { id: 13, faction: 'corsair', name: 'Lurker', role: 'card-ambush', suit: '#18181B', visor: '#E11D48', pack: '#881337', weaponColor: '#E11D48', weapon: 'scatter-shot', ability: 'none', evasionDist: 180, speed: 2.0, accel: 0.03 },
    { id: 14, faction: 'corsair', name: 'Perímetro', role: 'perimeter-patrol', suit: '#27272A', visor: '#FB923C', pack: '#9A3412', weaponColor: '#FB923C', weapon: 'crimson-railgun', ability: 'none', evasionDist: 210, speed: 2.2, accel: 0.028 },
    { id: 15, faction: 'corsair', name: 'Acorazado', role: 'heavy-standoff', suit: '#09090B', visor: '#DC2626', pack: '#7F1D1D', weaponColor: '#F87171', weapon: 'antimatter-mortar', ability: 'shield', evasionDist: 150, speed: 1.4, accel: 0.02 },
    { id: 16, faction: 'corsair', name: 'Finta', role: 'feint-reverse', suit: '#1E1B4B', visor: '#A855F7', pack: '#581C87', weaponColor: '#C084FC', weapon: 'void-needle', ability: 'turbo', evasionDist: 140, speed: 3.0, accel: 0.046 },
    { id: 17, faction: 'corsair', name: 'Vagabundo', role: 'zero-g-drifter', suit: '#262626', visor: '#FBBF24', pack: '#78350F', weaponColor: '#FBBF24', weapon: 'scatter-shot', ability: 'none', evasionDist: 190, speed: 1.8, accel: 0.022 },
    { id: 18, faction: 'corsair', name: 'Guerrillero', role: 'wide-arc', suit: '#1C1917', visor: '#EF4444', pack: '#7F1D1D', weaponColor: '#EF4444', weapon: 'crimson-railgun', ability: 'smoke', evasionDist: 200, speed: 2.4, accel: 0.032 },
    { id: 19, faction: 'corsair', name: 'Glitch Warp', role: 'warp-jumper', suit: '#111827', visor: '#EC4899', pack: '#831843', weaponColor: '#F472B6', weapon: 'void-needle', ability: 'warp', evasionDist: 130, speed: 2.4, accel: 0.034 }
  ];

  var operatives = [];

  for (var i = 0; i < TOTAL_OPS; i++) {
    var defIndex = i;
    if (isMobile) {
      defIndex = (i < 5) ? i : (10 + (i - 5));
    }
    var def = OPERATIVE_DEFS[defIndex] || OPERATIVE_DEFS[0];

    operatives.push({
      id: i,
      faction: def.faction,
      name: def.name,
      role: def.role,
      suit: def.suit,
      visor: def.visor,
      pack: def.pack,
      weaponColor: def.weaponColor,
      weapon: def.weapon,
      ability: def.ability,

      orbitR: def.orbitR || 85,
      evasionDist: def.evasionDist || 190,
      baseSpeed: def.speed || 2.0,
      accel: def.accel || 0.028,

      x: (def.faction === 'sentinel') ? (width * 0.28 + Math.random() * (width * 0.2)) : (width * 0.58 + Math.random() * (width * 0.25)),
      y: Math.random() * (height * 0.55) + 80,

      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      targetVx: 0,
      targetVy: 0,

      facingLeft: (def.faction === 'corsair'),
      tilt: 0,
      quantumAngle: Math.random() * Math.PI * 2,

      rotorAngle: Math.random() * 10,
      rotorSpeed: 0.55,

      actionCooldown: Math.random() * 80 + 30,
      abilityTimer: 0,
      shieldActive: false,
      warpGlitch: 0,

      feintState: 0,
      zigzagSign: 1,

      waveOffset: Math.random() * Math.PI * 2,
      patrolTargetX: Math.random() * width,
      patrolTargetY: Math.random() * height
    });
  }

  function drawPixelRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function drawMicroAstronaut(ctx, op) {
    ctx.save();
    ctx.translate(Math.round(op.x), Math.round(op.y));

    if (currentPlanet.id === 'cuantico') {
      ctx.rotate(op.quantumAngle);
    } else {
      ctx.rotate(op.tilt);
    }

    ctx.scale(op.facingLeft ? -1 : 1, 1);

    var p = 1.1;

    // Superposición cuántica limpia
    if (currentPlanet.id === 'cuantico') {
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.translate(2, -2);
      drawPixelRect(ctx, -2 * p, -5 * p, 4 * p, 3 * p, '#38BDF8');
      ctx.restore();
    }

    // Efecto Warp Glitch
    if (op.warpGlitch > 0) {
      ctx.globalAlpha = 0.5;
      ctx.translate((Math.random() - 0.5) * 4, 0);
    }

    // 1. Arma
    var gunX = 3 * p;
    var gunY = -1.5 * p;
    if (op.faction === 'sentinel') {
      drawPixelRect(ctx, gunX, gunY - p, 3.8 * p, 2.0 * p, op.pack);
      drawPixelRect(ctx, gunX + 2 * p, gunY - 1.5 * p, 1.2 * p, 3.0 * p, op.weaponColor);
    } else {
      drawPixelRect(ctx, gunX, gunY - p, 4.6 * p, 1.8 * p, '#18181B');
      drawPixelRect(ctx, gunX + 2.5 * p, gunY - 1.2 * p, 1.2 * p, 2.8 * p, op.weaponColor);
    }

    // 2. Mástil y Hélice
    var mastX = -0.5 * p;
    var mastY = -7.5 * p;
    drawPixelRect(ctx, mastX, mastY, 1.2 * p, 2.2 * p, '#94A3B8');

    var rFrame = Math.floor(op.rotorAngle) % 3;
    var bladeColor = (op.faction === 'sentinel') ? '#38BDF8' : '#EF4444';
    if (rFrame === 0) {
      drawPixelRect(ctx, -3 * p, mastY - p, 6 * p, 1.0 * p, bladeColor);
    } else if (rFrame === 1) {
      drawPixelRect(ctx, -2 * p, mastY - 1.5 * p, 4 * p, 1.0 * p, bladeColor);
    } else {
      drawPixelRect(ctx, -0.5 * p, mastY - 2.5 * p, 1.2 * p, 4.0 * p, bladeColor);
    }

    // 3. Mochila
    drawPixelRect(ctx, -3.8 * p, -3.8 * p, 2.2 * p, 4.5 * p, op.pack);

    // 4. Casco y Visor
    drawPixelRect(ctx, -2 * p, -5 * p, 4.2 * p, 3.2 * p, op.suit);
    drawPixelRect(ctx, 0.6 * p, -4 * p, 1.6 * p, 1.6 * p, op.visor);

    // 5. Cuerpo y Botas
    drawPixelRect(ctx, -2 * p, -1.8 * p, 4.2 * p, 3.8 * p, op.suit);
    drawPixelRect(ctx, -2 * p, 2 * p, 1.5 * p, 2.0 * p, op.suit);
    drawPixelRect(ctx, 0.8 * p, 2 * p, 1.5 * p, 2.0 * p, op.suit);
    drawPixelRect(ctx, -2.4 * p, 4 * p, 1.9 * p, 1.2 * p, '#0F172A');
    drawPixelRect(ctx, 0.8 * p, 4 * p, 1.9 * p, 1.2 * p, '#0F172A');

    // Escudo activo
    if (op.shieldActive) {
      ctx.save();
      ctx.strokeStyle = (op.faction === 'sentinel') ? '#38BDF8' : '#F43F5E';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, 0, 13 * p, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  // ==========================================================================
  // 9. DISPAROS Y HABILIDADES
  // ==========================================================================
  function fireOperativeWeapon(op, targetX, targetY) {
    var dirX = targetX - op.x;
    var dirY = targetY - op.y;
    var dist = Math.hypot(dirX, dirY) || 1;
    var nx = dirX / dist;
    var ny = dirY / dist;

    var startX = op.x + (op.facingLeft ? -8 : 8);
    var startY = op.y - 1;

    switch(op.weapon) {
      case 'twin-laser':
        projectiles.push({ x: startX, y: startY - 2, vx: nx * 6.5, vy: ny * 6.5, life: 35, color: op.weaponColor, radius: 2.0, faction: op.faction });
        projectiles.push({ x: startX, y: startY + 2, vx: nx * 6.5, vy: ny * 6.5, life: 35, color: op.weaponColor, radius: 2.0, faction: op.faction });
        break;
      case 'gatling':
        projectiles.push({ x: startX, y: startY, vx: nx * 8.0, vy: ny * 8.0, life: 30, color: op.weaponColor, radius: 1.8, faction: op.faction });
        break;
      case 'plasma-orb':
        projectiles.push({ x: startX, y: startY, vx: nx * 4.0, vy: ny * 4.0, life: 50, color: op.weaponColor, radius: 4.5, faction: op.faction });
        break;
      case 'crimson-railgun':
        projectiles.push({ x: startX, y: startY, vx: nx * 12.0, vy: ny * 12.0, life: 25, color: '#EF4444', radius: 2.5, length: 22, faction: op.faction });
        op.vx -= nx * 1.2;
        op.vy -= ny * 1.2;
        break;
      case 'void-needle':
        projectiles.push({ x: startX, y: startY, vx: nx * 9.5, vy: ny * 9.5, life: 30, color: '#EC4899', radius: 1.6, length: 16, faction: op.faction });
        break;
      default:
        projectiles.push({ x: startX, y: startY, vx: nx * 6.0, vy: ny * 6.0, life: 35, color: op.weaponColor, radius: 2.0, faction: op.faction });
        break;
    }
  }

  function triggerSpecialAbility(op, curMouseX, curMouseY) {
    if (op.ability === 'shield') {
      op.shieldActive = true;
      op.abilityTimer = 45;
    } else if (op.ability === 'smoke') {
      spawnSmoke(op.x, op.y, (op.faction === 'sentinel') ? 'rgba(56, 189, 248, 0.4)' : 'rgba(239, 68, 68, 0.4)');
      op.vx += (Math.random() - 0.5) * 4;
      op.vy += (Math.random() - 0.5) * 4;
    } else if (op.ability === 'turbo') {
      var escX = op.x - curMouseX;
      var escY = op.y - curMouseY;
      var eD = Math.hypot(escX, escY) || 1;
      op.vx += (escX / eD) * 4.5;
      op.vy += (escY / eD) * 4.5;
      spawnSparks(op.x, op.y, 5, op.weaponColor);
    } else if (op.ability === 'warp') {
      op.warpGlitch = 12;
      var ang = Math.random() * Math.PI * 2;
      op.x = Math.max(30, Math.min(width - 30, op.x + Math.cos(ang) * 140));
      op.y = Math.max(50, Math.min(height - 80, op.y + Math.sin(ang) * 110));
      spawnSparks(op.x, op.y, 6, '#EC4899');
    }
  }

  // ==========================================================================
  // 10. LOOP PRINCIPAL DE FÍSICA Y RENDER A 60 FPS (LIVIANO & FLUIDO)
  // ==========================================================================
  var timeTick = 0;
  var currentScrollY = 0;

  window.addEventListener('scroll', function() {
    currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
  }, { passive: true });

  function loop() {
    timeTick += 0.03;

    if (boxUpdateCooldown > 0) {
      boxUpdateCooldown--;
    } else {
      refreshContentBoxes();
      boxUpdateCooldown = 45;
    }

    if (!isMobile) {
      mouseX += (targetMouseX - mouseX) * 0.25;
      mouseY += (targetMouseY - mouseY) * 0.25;
      ringX += (targetMouseX - ringX) * 0.12;
      ringY += (targetMouseY - ringY) * 0.12;

      if (ring && isVisible) {
        ring.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px) translate(-50%, -50%)';
      }
    }

    ctx.clearRect(0, 0, width, height);

    // Estrellas limpias con parallax
    for (var s = 0; s < STAR_COUNT; s++) {
      var st = stars[s];
      var py = (st.baseY - (currentScrollY * (0.02 * st.layer))) % height;
      if (py < 0) py += height;

      ctx.beginPath();
      ctx.arc(st.x, py, st.radius, 0, Math.PI * 2);
      var starColor = (currentPlanet.id === 'tierra') ? 'rgba(52, 211, 153, ' :
                      (currentPlanet.id === 'deimos' || currentPlanet.id === 'marte') ? 'rgba(248, 113, 113, ' :
                      (currentPlanet.id === 'agua') ? 'rgba(125, 211, 252, ' :
                      (currentPlanet.id === 'plasma') ? 'rgba(134, 239, 172, ' :
                      (currentPlanet.id === 'cuantico') ? 'rgba(233, 213, 255, ' :
                      'rgba(255, 255, 255, ';
      ctx.fillStyle = starColor + st.alpha + ')';
      ctx.fill();
    }

    renderLaserMarks(ctx);

    // Chispas
    for (var spIdx = sparks.length - 1; spIdx >= 0; spIdx--) {
      var spk = sparks[spIdx];
      spk.x += spk.vx;
      spk.y += spk.vy;
      spk.life -= 0.04;
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

    // Nubes de humo
    for (var sm = smokePuffs.length - 1; sm >= 0; sm--) {
      var smk = smokePuffs[sm];
      smk.radius += 0.2;
      smk.life -= smk.decay;
      if (smk.life <= 0) {
        smokePuffs.splice(sm, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(smk.x, smk.y, smk.radius, 0, Math.PI * 2);
      ctx.fillStyle = smk.color;
      ctx.globalAlpha = smk.life * 0.4;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    // Proyectiles
    for (var prIdx = projectiles.length - 1; prIdx >= 0; prIdx--) {
      var pr = projectiles[prIdx];
      pr.life--;
      pr.x += pr.vx;
      pr.y += pr.vy;

      if (pr.life <= 0 || pr.x < -20 || pr.x > width + 20 || pr.y < -20 || pr.y > height + 20) {
        projectiles.splice(prIdx, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      if (pr.length) {
        var pAngle = Math.atan2(pr.vy, pr.vx);
        ctx.translate(pr.x, pr.y);
        ctx.rotate(pAngle);
        ctx.fillStyle = pr.color;
        ctx.fillRect(-pr.length, -pr.radius, pr.length, pr.radius * 2);
      } else {
        ctx.arc(pr.x, pr.y, pr.radius, 0, Math.PI * 2);
        ctx.fillStyle = pr.color;
        ctx.fill();
      }
      ctx.restore();

      // Impacto en tarjeta
      var hitBox = false;
      for (var cbI = 0; cbI < contentBoxes.length; cbI++) {
        var cBox = contentBoxes[cbI];
        if (pr.x >= cBox.left && pr.x <= cBox.right && pr.y >= cBox.top && pr.y <= cBox.bottom) {
          hitBox = true;
          addLaserMark(pr.x, pr.y, pr.color);
          spawnSparks(pr.x, pr.y, 4, pr.color);
          break;
        }
      }
      if (hitBox) {
        projectiles.splice(prIdx, 1);
      }
    }

    var friction = currentPlanet.friction || 0.985;
    var curMouseX = isMobile ? targetMouseX : mouseX;
    var curMouseY = isMobile ? targetMouseY : mouseY;

    // ACTUALIZACIÓN DE ASTRONAUTAS (Física relajada, sin magnetismo agresivo)
    for (var opIdx = 0; opIdx < operatives.length; opIdx++) {
      var op = operatives[opIdx];

      var mdx = curMouseX - op.x;
      var mdy = curMouseY - op.y;
      var mDist = Math.hypot(mdx, mdy);

      if (op.abilityTimer > 0) {
        op.abilityTimer--;
        if (op.abilityTimer <= 0) op.shieldActive = false;
      }
      if (op.warpGlitch > 0) op.warpGlitch--;

      if (currentPlanet.id === 'cuantico') {
        op.quantumAngle += 0.05;
      }

      // --- COMPORTAMIENTO POR BANDO ---
      if (op.faction === 'sentinel') {
        // BANDO 1: PERSIGUEN SUAVEMENTE (INERCIA RELAJADA)
        var looseAccel = op.accel; // 0.02 - 0.038
        var oAngle = timeTick * 0.7 + (op.id * 1.3) + op.waveOffset;
        var targetX = curMouseX + Math.cos(oAngle) * op.orbitR;
        var targetY = curMouseY + Math.sin(oAngle) * op.orbitR;

        var tox = targetX - op.x;
        var toy = targetY - op.y;
        var tod = Math.hypot(tox, toy) || 1;

        op.targetVx = (tox / tod) * op.baseSpeed;
        op.targetVy = (toy / tod) * op.baseSpeed;

        if (Math.abs(mdx) > 3) {
          op.facingLeft = (mdx < 0);
        }

        op.vx += (op.targetVx - op.vx) * looseAccel;
        op.vy += (op.targetVy - op.vy) * looseAccel;

        // Amortiguación suave para no tapar el clic
        if (mDist < 24 && mDist > 0.1) {
          op.vx -= (mdx / mDist) * 0.35;
          op.vy -= (mdy / mDist) * 0.35;
        }

      } else {
        // BANDO 2: CORSARIOS (EVITAN Y ESQUIVAN ACTIVAMENTE AL MOUSE)
        var fleeAccel = op.accel * 1.15;

        if (mDist < op.evasionDist) {
          var fleeX = -(mdx / (mDist || 1));
          var fleeY = -(mdy / (mDist || 1));

          if (op.role === 'zigzag-dodge') {
            if (Math.random() < 0.04) op.zigzagSign *= -1;
            op.targetVx = (fleeX * 0.5 - fleeY * op.zigzagSign * 0.8) * (op.baseSpeed * 1.2);
            op.targetVy = (fleeY * 0.5 + fleeX * op.zigzagSign * 0.8) * (op.baseSpeed * 1.2);
          } else if (op.role === 'kiting') {
            op.targetVx = fleeX * op.baseSpeed;
            op.targetVy = fleeY * op.baseSpeed;
            op.facingLeft = (mdx < 0);
          } else {
            op.targetVx = fleeX * (op.baseSpeed * 1.25);
            op.targetVy = fleeY * (op.baseSpeed * 1.25);
            op.facingLeft = (op.targetVx < 0);
          }

          if (mDist < 70 && Math.random() < 0.035) {
            triggerSpecialAbility(op, curMouseX, curMouseY);
          }

        } else {
          // Patrulla tranquila cuando el mouse está lejos
          var toPX = op.patrolTargetX - op.x;
          var toPY = op.patrolTargetY - op.y;
          var pD = Math.hypot(toPX, toPY);

          if (pD < 35 || Math.random() < 0.01) {
            op.patrolTargetX = Math.random() * (width - 60) + 30;
            op.patrolTargetY = Math.random() * (height * 0.65) + 60;
          }

          op.targetVx = (toPX / (pD || 1)) * (op.baseSpeed * 0.6);
          op.targetVy = (toPY / (pD || 1)) * (op.baseSpeed * 0.6);
          op.facingLeft = (op.targetVx < 0);
        }

        op.vx += (op.targetVx - op.vx) * fleeAccel;
        op.vy += (op.targetVy - op.vy) * fleeAccel;
      }

      if (currentPlanet.gravityY) {
        op.vy += currentPlanet.gravityY;
      }

      op.rotorAngle += 0.55;
      var targetTilt = Math.max(-0.35, Math.min(0.35, op.vx * 0.16));
      op.tilt += (targetTilt - op.tilt) * 0.14;

      // Esquive suave entre astronautas
      for (var otherIdx = opIdx + 1; otherIdx < operatives.length; otherIdx++) {
        var other = operatives[otherIdx];
        var dx = other.x - op.x;
        var dy = other.y - op.y;
        var distO = Math.hypot(dx, dy);

        if (distO < 20 && distO > 0.5) {
          var rep = (20 - distO) * 0.1;
          op.vx -= (dx / distO) * rep;
          op.vy -= (dy / distO) * rep;
          other.vx += (dx / distO) * rep;
          other.vy += (dy / distO) * rep;
        }

        // Duelo aéreo entre bandos rivales
        if (op.faction !== other.faction && distO < 160 && distO > 50 && Math.random() < 0.01) {
          fireOperativeWeapon(op, other.x, other.y);
        }
      }

      // Disparos ocasionales a tarjetas
      op.actionCooldown--;
      if (contentBoxes.length > 0 && op.actionCooldown <= 0) {
        var cBox = contentBoxes[Math.floor(Math.random() * contentBoxes.length)];
        var hitX = (cBox.left + cBox.right) / 2;
        var hitY = (cBox.top + cBox.bottom) / 2;
        var distBox = Math.hypot(hitX - op.x, hitY - op.y);
        if (distBox < (isMobile ? 130 : 200)) {
          fireOperativeWeapon(op, hitX, hitY);
          op.actionCooldown = Math.random() * 80 + 40;
        }
      }

      // Rebote elástico contra tarjetas
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
            op.vy = -Math.abs(op.vy) * 0.8 - 0.4;
          } else if (minOv === ovB) {
            op.y = cb.bottom + pad;
            op.vy = Math.abs(op.vy) * 0.8 + 0.4;
          } else if (minOv === ovL) {
            op.x = cb.left - pad;
            op.vx = -Math.abs(op.vx) * 0.8 - 0.4;
          } else {
            op.x = cb.right + pad;
            op.vx = Math.abs(op.vx) * 0.8 + 0.4;
          }
          spawnSparks(op.x, op.y, 3, op.weaponColor);
          break;
        }
      }

      // Integración física
      op.vx *= friction;
      op.vy *= friction;
      op.x += op.vx;
      op.y += op.vy;

      // Límites de pantalla suaves
      if (op.y < 35) { op.y = 35; op.vy = Math.abs(op.vy) * 0.6; }
      var floorLim = height - (isMobile ? 65 : 45);
      if (op.y > floorLim) { op.y = floorLim; op.vy = -Math.abs(op.vy) * 0.6; }
      if (op.x < 15) { op.x = 15; op.vx = Math.abs(op.vx) * 0.6; }
      else if (op.x > width - 15) { op.x = width - 15; op.vx = -Math.abs(op.vx) * 0.6; }

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
        var rotateX = ((y - centerY) / centerY) * -5;
        var rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) scale3d(1.02, 1.02, 1.02)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  // ==========================================================================
  // 12. CABECERA STICKY
  // ==========================================================================
  var mainNav = document.querySelector('nav.main-nav');
  if (mainNav) {
    var scrollThreshold = 35;
    function handleNavScroll() {
      var currentY = window.pageYOffset || document.documentElement.scrollTop;
      if (currentY > scrollThreshold) {
        mainNav.classList.add('is-scrolled');
      } else {
        mainNav.classList.remove('is-scrolled');
      }
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();
  }

})();
