// MarketingCloud Studio - Engine 6.5 (Xain'd Sleena 1986 Edition: Corsairs Defend Mouse vs Astronauts Attack Mouse)
// 1. Live Santiago Timecode & Chilean Indicators (USD / UF)
// 2. 6 Planetas de Xain'd Sleena (1986) con Fondos Panorámicos Completos en Movimiento:
//    - [1/E] Xain-Orbit | [2/L] Lagulaked | [3/C] Cleemooth | [4/A] Cleedos | [5/K] Kworal | [6/G] Guierdwold
// 3. Batalla Táctica Inteligente alrededor del Cursor:
//    - CORSARIOS (10): Defienden al Mouse (escoltan, interceptan balas dirigidas al cursor y atacan a los agresores)
//    - ASTRONAUTAS (10): Quieren destruir al Mouse (flanquean, disparan al cursor y combaten a los Corsarios)
//    - 12 Armas creativas con física real (Espadas Láser, Misiles, Rayos Continuos, Railguns, Tesla, Cryo, Búmeran, Vortex)
//    - Mueren con explosión arcade 80s, sueltan energía, se curan entre compañeros (+HP) y reaparecen (Respawn)

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
    el.textContent = now.toLocaleTimeString('es-CL', {
      timeZone: 'America/Santiago',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
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
        if (!res.ok) throw new Error('Network error');
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
  var mouseHitFlash = 0; // Destello cuando los astronautas logran impactar al mouse
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
  // 4. LOS 6 PLANETAS DE XAIN'D SLEENA (1986)
  // ==========================================================================
  var PLANETS = [
    { id: 'espacio', key: 'e', numKey: '1', name: 'Xain-Orbit', color: 'Negro Profundo', icon: '🌌', gravityY: 0.0, friction: 0.988, desc: 'Ruta Estelar Zero-G: Saturno, estación orbital, asteroides y cometas' },
    { id: 'tierra', key: 't', altKey: 'l', numKey: '2', name: 'Lagulaked', color: 'Selva Jade', icon: '🌍', gravityY: 0.065, friction: 0.98, desc: 'Planeta Selva 1.0g: Cordilleras, árboles alienígenas, lianas y viento' },
    { id: 'deimos', altId: 'marte', key: 'd', altKey: 'c', numKey: '3', name: 'Cleemooth', color: 'Cañón Carmesí', icon: '🪐', gravityY: 0.032, friction: 0.985, desc: 'Desierto Rocoso 0.38g: Soles binarios, mesetas, rocas flotantes y tormenta' },
    { id: 'agua', key: 'a', numKey: '4', name: 'Cleedos', color: 'Océano Abisal', icon: '💧', gravityY: 0.018, friction: 0.925, fluidWave: true, desc: 'Mundo Submarino: Olas, arrecifes, algas gigantes y fauna bioluminiscente' },
    { id: 'plasma', key: 'p', altKey: 'k', numKey: '5', name: 'Kworal', color: 'Reactor Neón', icon: '⚡', gravityY: 0.012, friction: 0.91, plasma: true, desc: 'Núcleo Volcánico: Ríos de magma neón, ondas psicodélicas y rayos' },
    { id: 'cuantico', key: 'g', altKey: 'q', numKey: '6', name: 'Guierdwold', color: 'Cristal Púrpura', icon: '✦', quantum: true, friction: 0.97, desc: 'Fortaleza de Cristal: Espiras prismáticas, aurora cuántica y anomalía' }
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
        if (p.id === indexOrId || p.key === indexOrId || p.numKey === indexOrId || (p.altId && p.altId === indexOrId) || (p.altKey && p.altKey === indexOrId)) {
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
      if (k === p.key || k === p.numKey || (p.altKey && k === p.altKey)) {
        setPlanet(p.id);
        break;
      }
    }
  });

  // ==========================================================================
  // 5. FONDOS PANORÁMICOS EN MOVIMIENTO PARA CADA PLANETA DE XAIN'D SLEENA
  // ==========================================================================
  var currentScrollY = 0;
  var lastScrollY = 0;
  var scrollVelocity = 0;
  var bgScrollX = 0;

  window.addEventListener('scroll', function() {
    currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
    scrollVelocity = Math.abs(currentScrollY - lastScrollY);
    lastScrollY = currentScrollY;
  }, { passive: true });

  var STAR_COUNT = isMobile ? 55 : 115;
  var stars = [];
  for (var i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * width,
      baseY: Math.random() * height,
      radius: Math.random() < 0.2 ? (Math.random() * 1.5 + 1.1) : (Math.random() * 0.9 + 0.4),
      alpha: Math.random() * 0.65 + 0.2,
      layer: (i % 3) + 1
    });
  }

  var spaceComets = [];
  var cometCooldown = 90;

  var spaceAsteroids = [];
  var AST_COUNT = isMobile ? 5 : 9;
  for (var aIdx = 0; aIdx < AST_COUNT; aIdx++) {
    spaceAsteroids.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 10 + 6,
      vx: -(Math.random() * 0.6 + 0.25),
      vy: (Math.random() - 0.5) * 0.2,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02
    });
  }

  var jungleSpores = [];
  var SPORE_COUNT = isMobile ? 12 : 24;
  for (var sp = 0; sp < SPORE_COUNT; sp++) {
    jungleSpores.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.random() * 2.0 + 1.0,
      size: Math.random() * 3 + 1.8,
      angle: Math.random() * Math.PI * 2
    });
  }

  var cleemoothRocks = [];
  var ROCK_COUNT = isMobile ? 5 : 9;
  for (var rk = 0; rk < ROCK_COUNT; rk++) {
    cleemoothRocks.push({
      x: Math.random() * width,
      baseY: height * 0.45 + Math.random() * (height * 0.42),
      size: Math.random() * 9 + 6,
      vx: -(Math.random() * 0.45 + 0.15),
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.018
    });
  }

  var cleemoothWinds = [];
  var WIND_COUNT = isMobile ? 14 : 26;
  for (var cw = 0; cw < WIND_COUNT; cw++) {
    cleemoothWinds.push({
      x: Math.random() * width,
      y: Math.random() * height,
      len: Math.random() * 55 + 25,
      speed: Math.random() * 4.5 + 3.0,
      alpha: Math.random() * 0.32 + 0.12
    });
  }

  var cleedosFish = [];
  var FISH_COUNT = isMobile ? 4 : 7;
  for (var fi = 0; fi < FISH_COUNT; fi++) {
    cleedosFish.push({
      x: Math.random() * width,
      y: height * 0.25 + Math.random() * (height * 0.58),
      speed: Math.random() * 1.1 + 0.6,
      facingLeft: Math.random() < 0.5,
      size: Math.random() * 9 + 14,
      offset: Math.random() * Math.PI * 2
    });
  }

  var cleedosBubbles = [];
  var BUB_COUNT = isMobile ? 14 : 26;
  for (var bb = 0; bb < BUB_COUNT; bb++) {
    cleedosBubbles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 3 + 1.5,
      speed: Math.random() * 1.1 + 0.5,
      offset: Math.random() * Math.PI * 2
    });
  }

  var guierdwoldPrisms = [];
  var PRISM_COUNT = isMobile ? 8 : 15;
  for (var gp = 0; gp < PRISM_COUNT; gp++) {
    guierdwoldPrisms.push({
      x: Math.random() * width,
      y: Math.random() * height * 0.75,
      size: Math.random() * 8 + 5,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      vx: -(Math.random() * 0.4 + 0.15),
      hue: Math.random() * 360
    });
  }

  function drawScrollingHorizon(ctx, baseY, scrollOffset, amp1, freq1, amp2, freq2, fillStyle, strokeStyle) {
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.moveTo(0, height);
    var step = isMobile ? 28 : 18;
    for (var x = 0; x <= width + step; x += step) {
      var wx = x + scrollOffset;
      var y = baseY - Math.sin(wx * freq1) * amp1 - Math.cos(wx * freq2) * amp2;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.restore();
  }

  function renderXainOrbit(ctx, timeTick) {
    ctx.save();
    var nebX = (width * 0.5 - (bgScrollX * 0.15) % width + width) % width;
    var nebY = height * 0.38;
    var nebGrad = ctx.createRadialGradient(nebX, nebY, 10, nebX, nebY, width * 0.42);
    nebGrad.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
    nebGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.05)');
    nebGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = nebGrad;
    ctx.fillRect(0, 0, width, height);

    var satX = (width * 0.82 - (bgScrollX * 0.12) % (width + 240) + (width + 240)) % (width + 240) - 120;
    var satY = (150 - (currentScrollY * 0.06)) % (height + 200);
    if (satY < -80) satY += height + 280;

    var satGlow = ctx.createRadialGradient(satX, satY, 12, satX, satY, 70);
    satGlow.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
    satGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = satGlow;
    ctx.beginPath();
    ctx.arc(satX, satY, 70, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.arc(satX, satY, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(satX, satY);
    ctx.rotate(0.36);
    ctx.beginPath();
    ctx.ellipse(0, 0, 66, 15, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.65)';
    ctx.lineWidth = 3.2;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, 0, 52, 11, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.restore();

    var stX = (width * 0.22 - (bgScrollX * 0.22) % (width + 200) + (width + 200)) % (width + 200) - 100;
    var stY = height * 0.68;
    ctx.save();
    ctx.translate(stX, stY);
    ctx.rotate(timeTick * 0.15);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.moveTo(-22, 0); ctx.lineTo(22, 0);
    ctx.moveTo(0, -22); ctx.lineTo(0, 22);
    ctx.stroke();
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    for (var a = 0; a < spaceAsteroids.length; a++) {
      var ast = spaceAsteroids[a];
      ast.x += ast.vx;
      ast.y += ast.vy;
      ast.rot += ast.rotSpeed;
      if (ast.x < -30) ast.x = width + 30;
      if (ast.y < -30) ast.y = height + 30;
      if (ast.y > height + 30) ast.y = -30;

      ctx.save();
      ctx.translate(ast.x, ast.y);
      ctx.rotate(ast.rot);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
      ctx.fillStyle = 'rgba(30, 41, 59, 0.65)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-ast.size, -ast.size * 0.4);
      ctx.lineTo(0, -ast.size);
      ctx.lineTo(ast.size * 0.9, -ast.size * 0.3);
      ctx.lineTo(ast.size * 0.6, ast.size * 0.8);
      ctx.lineTo(-ast.size * 0.7, ast.size * 0.7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    cometCooldown--;
    if ((cometCooldown <= 0 || scrollVelocity > 10) && spaceComets.length < 2) {
      spaceComets.push({
        x: Math.random() * width + 200,
        y: Math.random() * (height * 0.45),
        vx: -(Math.random() * 4 + 6.5),
        vy: Math.random() * 2.2 + 2.5,
        len: Math.random() * 55 + 65,
        life: 1.0
      });
      cometCooldown = Math.random() * 180 + 110;
    }

    for (var c = spaceComets.length - 1; c >= 0; c--) {
      var cm = spaceComets[c];
      cm.x += cm.vx;
      cm.y += cm.vy;
      cm.life -= 0.015;
      if (cm.life <= 0 || cm.x < -100 || cm.y > height + 100) {
        spaceComets.splice(c, 1);
        continue;
      }
      var mag = Math.hypot(cm.vx, cm.vy) || 1;
      var tx = cm.x - (cm.vx / mag) * cm.len;
      var ty = cm.y - (cm.vy / mag) * cm.len;
      var cGrad = ctx.createLinearGradient(cm.x, cm.y, tx, ty);
      cGrad.addColorStop(0, 'rgba(255, 255, 255, ' + cm.life + ')');
      cGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.strokeStyle = cGrad;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(cm.x, cm.y);
      ctx.lineTo(tx, ty);
      ctx.stroke();
    }
    ctx.restore();
  }

  function renderLagulaked(ctx, timeTick) {
    ctx.save();
    var m1X = width * 0.78;
    var m1Y = height * 0.22;
    ctx.fillStyle = 'rgba(16, 185, 129, 0.22)';
    ctx.beginPath();
    ctx.arc(m1X, m1Y, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.55)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    var vineCount = isMobile ? 5 : 9;
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.28)';
    ctx.lineWidth = 2;
    for (var v = 0; v < vineCount; v++) {
      var vx = ((v * (width / vineCount) - bgScrollX * 0.4) % (width + 100) + (width + 100)) % (width + 100) - 50;
      var vLen = 70 + (v % 3) * 35;
      var vSway = Math.sin(timeTick * 1.6 + v) * 18;
      ctx.beginPath();
      ctx.moveTo(vx, 0);
      ctx.quadraticCurveTo(vx + vSway * 0.5, vLen * 0.5, vx + vSway, vLen);
      ctx.stroke();
    }

    drawScrollingHorizon(ctx, height - 135, bgScrollX * 0.35, 38, 0.004, 22, 0.009, 'rgba(6, 78, 59, 0.35)', 'rgba(16, 185, 129, 0.35)');
    drawScrollingHorizon(ctx, height - 75, bgScrollX * 0.75, 22, 0.007, 14, 0.015, 'rgba(4, 47, 46, 0.55)', 'rgba(52, 211, 153, 0.45)');

    var treeCount = isMobile ? 8 : 16;
    for (var t = 0; t < treeCount; t++) {
      var tx = ((t * (width / treeCount) - bgScrollX * 1.1) % (width + 80) + (width + 80)) % (width + 80) - 40;
      var ty = height - 15;
      var th = 42 + (t % 4) * 14;
      var sway = Math.sin(timeTick * 2.0 + t) * 5;

      ctx.fillStyle = 'rgba(6, 95, 70, 0.65)';
      ctx.beginPath();
      ctx.moveTo(tx - 8, ty);
      ctx.lineTo(tx + sway, ty - th);
      ctx.lineTo(tx + 8, ty);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(52, 211, 153, 0.45)';
      ctx.beginPath();
      ctx.arc(tx + sway, ty - th, 6 + (t % 3) * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    for (var s = 0; s < jungleSpores.length; s++) {
      var sp = jungleSpores[s];
      sp.x += sp.vx;
      sp.y += Math.sin(timeTick * 2.4 + s) * 0.7;
      if (sp.x > width + 20) { sp.x = -20; sp.y = Math.random() * height; }

      ctx.fillStyle = 'rgba(110, 231, 183, 0.65)';
      ctx.beginPath();
      ctx.ellipse(sp.x, sp.y, sp.size * 1.4, sp.size * 0.7, sp.angle, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function renderCleemooth(ctx, timeTick) {
    ctx.save();
    var sunX = width * 0.72;
    var sunY = height * 0.28;
    var sunGrad = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, 58);
    sunGrad.addColorStop(0, 'rgba(248, 113, 113, 0.45)');
    sunGrad.addColorStop(0.5, 'rgba(220, 38, 38, 0.18)');
    sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 58, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(254, 202, 202, 0.38)';
    ctx.beginPath();
    ctx.arc(sunX - 55, sunY + 18, 14, 0, Math.PI * 2);
    ctx.fill();

    drawScrollingHorizon(ctx, height - 140, bgScrollX * 0.4, 42, 0.0035, 18, 0.012, 'rgba(127, 29, 29, 0.35)', 'rgba(239, 68, 68, 0.4)');
    drawScrollingHorizon(ctx, height - 75, bgScrollX * 0.85, 25, 0.006, 15, 0.018, 'rgba(69, 10, 10, 0.6)', 'rgba(248, 113, 113, 0.5)');

    for (var r = 0; r < cleemoothRocks.length; r++) {
      var rk = cleemoothRocks[r];
      rk.x += rk.vx;
      rk.rot += rk.rotSpeed;
      if (rk.x < -30) rk.x = width + 30;
      var ry = rk.baseY + Math.sin(timeTick * 1.5 + r) * 9;

      ctx.save();
      ctx.translate(rk.x, ry);
      ctx.rotate(rk.rot);
      ctx.fillStyle = 'rgba(185, 28, 28, 0.52)';
      ctx.strokeStyle = 'rgba(252, 165, 165, 0.65)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-rk.size, -rk.size * 0.5);
      ctx.lineTo(rk.size * 0.7, -rk.size * 0.8);
      ctx.lineTo(rk.size, rk.size * 0.4);
      ctx.lineTo(-rk.size * 0.6, rk.size * 0.9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    for (var w = 0; w < cleemoothWinds.length; w++) {
      var wd = cleemoothWinds[w];
      wd.x -= wd.speed;
      if (wd.x < -70) { wd.x = width + 70; wd.y = Math.random() * height; }
      ctx.strokeStyle = 'rgba(248, 113, 113, ' + wd.alpha + ')';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(wd.x, wd.y);
      ctx.lineTo(wd.x + wd.len, wd.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function renderCleedos(ctx, timeTick) {
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var wx = 0; wx <= width; wx += 24) {
      var wy = 42 + Math.sin((wx + bgScrollX * 1.2) * 0.02 + timeTick * 2) * 8;
      if (wx === 0) ctx.moveTo(wx, wy);
      else ctx.lineTo(wx, wy);
    }
    ctx.stroke();

    for (var gr = 0; gr < 4; gr++) {
      var rx = ((gr * (width * 0.28) - bgScrollX * 0.25) % (width + 200) + (width + 200)) % (width + 200) - 100;
      var rayG = ctx.createLinearGradient(rx, 0, rx + 90, height);
      rayG.addColorStop(0, 'rgba(56, 189, 248, 0.11)');
      rayG.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = rayG;
      ctx.beginPath();
      ctx.moveTo(rx, 0);
      ctx.lineTo(rx + 65, 0);
      ctx.lineTo(rx + 170, height);
      ctx.lineTo(rx - 30, height);
      ctx.closePath();
      ctx.fill();
    }

    drawScrollingHorizon(ctx, height - 95, bgScrollX * 0.5, 26, 0.005, 14, 0.014, 'rgba(12, 74, 110, 0.42)', 'rgba(56, 189, 248, 0.35)');

    var kelpCount = isMobile ? 6 : 12;
    for (var k = 0; k < kelpCount; k++) {
      var kx = ((k * (width / kelpCount) - bgScrollX * 0.8) % (width + 80) + (width + 80)) % (width + 80) - 40;
      var kh = 95 + (k % 3) * 35;
      var tipX = kx + Math.sin(timeTick * 2 + k) * 24;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 3.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(kx, height);
      ctx.quadraticCurveTo(kx, height - kh * 0.5, tipX, height - kh);
      ctx.stroke();

      ctx.fillStyle = '#7DD3FC';
      ctx.beginPath();
      ctx.arc(tipX, height - kh, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }

    for (var f = 0; f < cleedosFish.length; f++) {
      var fs = cleedosFish[f];
      fs.x += (fs.facingLeft ? -1 : 1) * fs.speed;
      fs.y += Math.sin(timeTick * 2.2 + fs.offset) * 0.45;
      if (fs.facingLeft && fs.x < -50) fs.x = width + 50;
      if (!fs.facingLeft && fs.x > width + 50) fs.x = -50;

      ctx.save();
      ctx.translate(fs.x, fs.y);
      ctx.scale(fs.facingLeft ? -1 : 1, 1);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.72)';
      ctx.beginPath();
      ctx.ellipse(0, 0, fs.size, fs.size * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();

      var tailW = Math.sin(timeTick * 6 + fs.offset) * 4;
      ctx.beginPath();
      ctx.moveTo(-fs.size, 0);
      ctx.lineTo(-fs.size - 9, -6 + tailW);
      ctx.lineTo(-fs.size - 9, 6 + tailW);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#FFEA00';
      ctx.beginPath();
      ctx.arc(fs.size + 4, -6, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    for (var b = 0; b < cleedosBubbles.length; b++) {
      var bb = cleedosBubbles[b];
      bb.y -= bb.speed;
      bb.x += Math.sin(timeTick * 2.5 + bb.offset) * 0.4;
      if (bb.y < -20) { bb.y = height + 20; bb.x = Math.random() * width; }
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(bb.x, bb.y, bb.r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function renderKworal(ctx, timeTick) {
    ctx.save();
    var cx = width * 0.5;
    var cy = height * 0.45;
    for (var r = 1; r <= 3; r++) {
      var rad = ((timeTick * 28 + r * 110) % (Math.max(width, height) * 0.7));
      var hue = (timeTick * 50 + r * 60) % 360;
      var alpha = Math.max(0, 0.20 - (rad / (Math.max(width, height) * 0.7)) * 0.20);
      ctx.strokeStyle = 'hsla(' + hue + ', 95%, 60%, ' + alpha + ')';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (var ang = 0; ang <= Math.PI * 2; ang += 0.25) {
        var w = Math.sin(ang * 6 + timeTick * 3) * 10;
        var px = cx + Math.cos(ang) * (rad + w);
        var py = cy + Math.sin(ang) * (rad + w);
        if (ang === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }

    drawScrollingHorizon(ctx, height - 110, bgScrollX * 0.65, 32, 0.005, 20, 0.012, 'rgba(5, 46, 22, 0.5)', 'rgba(34, 197, 94, 0.65)');
    drawScrollingHorizon(ctx, height - 55, bgScrollX * 1.2, 16, 0.009, 10, 0.02, 'rgba(20, 83, 45, 0.65)', 'rgba(134, 239, 172, 0.75)');

    var colCount = isMobile ? 3 : 5;
    for (var c = 0; c < colCount; c++) {
      var colX = ((c * (width / colCount) - bgScrollX * 0.45) % (width + 120) + (width + 120)) % (width + 120) - 60;
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.22)';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(colX, 0);
      ctx.lineTo(colX + Math.sin(timeTick * 2 + c) * 15, height);
      ctx.stroke();
    }
    ctx.restore();
  }

  function renderGuierdwold(ctx, timeTick) {
    ctx.save();
    ctx.beginPath();
    for (var ax = 0; ax <= width; ax += 30) {
      var ay = 65 + Math.sin((ax + bgScrollX) * 0.01 + timeTick * 1.5) * 22;
      if (ax === 0) ctx.moveTo(ax, ay);
      else ctx.lineTo(ax, ay);
    }
    ctx.strokeStyle = 'rgba(192, 132, 252, 0.35)';
    ctx.lineWidth = 14;
    ctx.stroke();

    ctx.fillStyle = 'rgba(59, 7, 100, 0.45)';
    ctx.strokeStyle = 'rgba(216, 180, 254, 0.55)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0, height);
    var spireStep = isMobile ? 45 : 35;
    for (var sx = 0; sx <= width + spireStep; sx += spireStep) {
      var swx = sx + bgScrollX * 0.6;
      var peak = ((Math.floor(swx / spireStep) % 2 === 0) ? 130 : 65) + Math.sin(swx * 0.01) * 25;
      ctx.lineTo(sx, height - peak);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    for (var p = 0; p < guierdwoldPrisms.length; p++) {
      var pr = guierdwoldPrisms[p];
      pr.x += pr.vx;
      pr.rot += pr.rotSpeed;
      if (pr.x < -30) pr.x = width + 30;

      ctx.save();
      ctx.translate(pr.x, pr.y + Math.sin(timeTick * 2 + p) * 6);
      ctx.rotate(pr.rot);
      var qHue = (pr.hue + timeTick * 45) % 360;
      ctx.fillStyle = 'hsla(' + qHue + ', 90%, 68%, 0.6)';
      ctx.strokeStyle = 'hsla(' + ((qHue + 120) % 360) + ', 95%, 85%, 0.85)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, -pr.size * 1.5);
      ctx.lineTo(pr.size, 0);
      ctx.lineTo(0, pr.size * 1.5);
      ctx.lineTo(-pr.size, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  // ==========================================================================
  // 6. CACHÉ DE TARJETAS (COBERTURA REAL & OBSTÁCULOS) & MARCAS LÁSER
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
          cx: (rect.left + rect.right) / 2,
          cy: (rect.top + rect.bottom) / 2
        });
      }
    }
  }

  refreshContentBoxes();
  window.addEventListener('resize', refreshContentBoxes);

  var laserMarks = [];
  var MAX_LASER_MARKS = isMobile ? 8 : 18;

  function addLaserMark(x, y, color) {
    if (laserMarks.length >= MAX_LASER_MARKS) laserMarks.shift();
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
  // 7. SISTEMA DE ARMAS CREATIVAS, PROYECTILES, RAYOS Y FÍSICA DE IMPACTO
  // ==========================================================================
  var projectiles = [];
  var activeBeams = [];
  var sparks = [];
  var smokePuffs = [];
  var shockwaves = [];
  var lootOrbs = [];
  var healBeams = [];

  function spawnSparks(x, y, count, color) {
    var num = count || 3;
    for (var s = 0; s < num; s++) {
      if (sparks.length >= 60) sparks.shift();
      sparks.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 5.5,
        vy: (Math.random() - 0.5) * 5.5,
        life: 0.85,
        color: color || '#FFEA00'
      });
    }
  }

  function spawnSmoke(x, y, color) {
    if (smokePuffs.length >= 22) smokePuffs.shift();
    smokePuffs.push({
      x: x,
      y: y,
      radius: 4,
      life: 0.9,
      decay: 0.03,
      color: color || 'rgba(100, 116, 139, 0.45)'
    });
  }

  function spawnRingWave(x, y, color, maxR) {
    if (shockwaves.length >= 12) shockwaves.shift();
    shockwaves.push({
      x: x,
      y: y,
      radius: 3,
      maxRadius: maxR || 30,
      life: 1.0,
      color: color || '#38BDF8'
    });
  }

  function setEmote(op, text, color, duration) {
    op.emoteText = text;
    op.emoteColor = color || '#FFFFFF';
    op.emoteTimer = duration || 42;
  }

  // ==========================================================================
  // 8. LOS 20 OPERATIVOS: CORSARIOS (DEFIENDEN MOUSE) VS ASTRONAUTAS (DESTRUYEN MOUSE)
  // ==========================================================================
  var TOTAL_OPS = isMobile ? 10 : 20;

  var OPERATIVE_DEFS = [
    // --- BANDO 'astronaut': LOS ASTRONAUTAS QUE QUIEREN DESTRUIR EL MOUSE (10 ARMAS DISTINTAS) ---
    { id: 0, faction: 'astronaut', name: 'Astro-Saber', role: 'saber-knight', suit: '#FFFFFF', visor: '#38BDF8', pack: '#0284C7', weaponColor: '#38BDF8', weapon: 'laser-sword', ability: 'shield', attackR: 130, speed: 2.5, accel: 0.038, hp: 4 },
    { id: 1, faction: 'astronaut', name: 'Astro-Missile', role: 'artillery', suit: '#F1F5F9', visor: '#F59E0B', pack: '#D97706', weaponColor: '#F59E0B', weapon: 'homing-missile', ability: 'turbo', attackR: 210, speed: 2.1, accel: 0.032, hp: 3 },
    { id: 2, faction: 'astronaut', name: 'Astro-Laser', role: 'beamer', suit: '#E2E8F0', visor: '#06B6D4', pack: '#0891B2', weaponColor: '#06B6D4', weapon: 'continuous-beam', ability: 'shield', attackR: 185, speed: 1.9, accel: 0.028, hp: 4 },
    { id: 3, faction: 'astronaut', name: 'Astro-Med1', role: 'medic', suit: '#ECFDF5', visor: '#10B981', pack: '#059669', weaponColor: '#10B981', weapon: 'sonic-cannon', ability: 'shield', attackR: 170, speed: 2.3, accel: 0.034, hp: 3 },
    { id: 4, faction: 'astronaut', name: 'Astro-Tesla', role: 'shock-trooper', suit: '#FFFFFF', visor: '#818CF8', pack: '#4338CA', weaponColor: '#818CF8', weapon: 'tesla-lightning', ability: 'turbo', attackR: 165, speed: 2.2, accel: 0.032, hp: 3 },
    { id: 5, faction: 'astronaut', name: 'Astro-Cryo', role: 'cryo', suit: '#E0F2FE', visor: '#38BDF8', pack: '#0369A1', weaponColor: '#7DD3FC', weapon: 'cryo-ray', ability: 'smoke', attackR: 200, speed: 1.9, accel: 0.028, hp: 3 },
    { id: 6, faction: 'astronaut', name: 'Astro-Boomer', role: 'skirmisher', suit: '#F8FAFC', visor: '#FBBF24', pack: '#B45309', weaponColor: '#FBBF24', weapon: 'boomerang', ability: 'turbo', attackR: 175, speed: 2.4, accel: 0.035, hp: 3 },
    { id: 7, faction: 'astronaut', name: 'Astro-Paladin', role: 'saber-knight', suit: '#FEF3C7', visor: '#F59E0B', pack: '#B45309', weaponColor: '#FFEA00', weapon: 'laser-sword', ability: 'shield', attackR: 120, speed: 2.6, accel: 0.04, hp: 4 },
    { id: 8, faction: 'astronaut', name: 'Astro-Vortex', role: 'heavy', suit: '#F3E8FF', visor: '#A855F7', pack: '#7E22CE', weaponColor: '#C084FC', weapon: 'gravity-vortex', ability: 'warp', attackR: 195, speed: 2.0, accel: 0.03, hp: 3 },
    { id: 9, faction: 'astronaut', name: 'Astro-Med2', role: 'medic', suit: '#FFFFFF', visor: '#2DD4BF', pack: '#0F766E', weaponColor: '#2DD4BF', weapon: 'scatter-blaster', ability: 'smoke', attackR: 180, speed: 2.2, accel: 0.032, hp: 3 },

    // --- BANDO 'corsair': LOS CORSARIOS QUE DEFIENDEN Y PROTEGEN EL MOUSE (10 ARMAS DISTINTAS) ---
    { id: 10, faction: 'corsair', name: 'Corsair-Saber', role: 'saber-knight', suit: '#1E293B', visor: '#EF4444', pack: '#991B1B', weaponColor: '#EF4444', weapon: 'laser-sword', ability: 'turbo', guardR: 65, speed: 2.7, accel: 0.042, hp: 4 },
    { id: 11, faction: 'corsair', name: 'Corsair-Rail', role: 'sniper', suit: '#0F172A', visor: '#F43F5E', pack: '#BE123C', weaponColor: '#F43F5E', weapon: 'railgun', ability: 'smoke', guardR: 105, speed: 2.3, accel: 0.035, hp: 3 },
    { id: 12, faction: 'corsair', name: 'Corsair-Pyro', role: 'pyro', suit: '#334155', visor: '#F97316', pack: '#C2410C', weaponColor: '#F97316', weapon: 'flamethrower', ability: 'turbo', guardR: 75, speed: 2.6, accel: 0.038, hp: 3 },
    { id: 13, faction: 'corsair', name: 'Corsair-Doc1', role: 'medic', suit: '#18181B', visor: '#22C55E', pack: '#15803D', weaponColor: '#4ADE80', weapon: 'sonic-cannon', ability: 'smoke', guardR: 85, speed: 2.3, accel: 0.035, hp: 3 },
    { id: 14, faction: 'corsair', name: 'Corsair-Rocket', role: 'artillery', suit: '#27272A', visor: '#FB923C', pack: '#9A3412', weaponColor: '#FB923C', weapon: 'homing-missile', ability: 'shield', guardR: 95, speed: 2.3, accel: 0.034, hp: 3 },
    { id: 15, faction: 'corsair', name: 'Corsair-Titan', role: 'guardian', suit: '#09090B', visor: '#DC2626', pack: '#7F1D1D', weaponColor: '#F87171', weapon: 'plasma-mortar', ability: 'shield', guardR: 52, speed: 1.9, accel: 0.03, hp: 4 },
    { id: 16, faction: 'corsair', name: 'Corsair-Blade', role: 'saber-knight', suit: '#1E1B4B', visor: '#A855F7', pack: '#581C87', weaponColor: '#C084FC', weapon: 'laser-sword', ability: 'warp', guardR: 70, speed: 2.8, accel: 0.044, hp: 4 },
    { id: 17, faction: 'corsair', name: 'Corsair-Tesla', role: 'shock-trooper', suit: '#262626', visor: '#FBBF24', pack: '#78350F', weaponColor: '#FBBF24', weapon: 'tesla-lightning', ability: 'smoke', guardR: 88, speed: 2.3, accel: 0.034, hp: 3 },
    { id: 18, faction: 'corsair', name: 'Corsair-Vortex', role: 'heavy', suit: '#1C1917', visor: '#EC4899', pack: '#831843', weaponColor: '#F472B6', weapon: 'gravity-vortex', ability: 'smoke', guardR: 100, speed: 2.3, accel: 0.034, hp: 3 },
    { id: 19, faction: 'corsair', name: 'Corsair-Beam', role: 'beamer', suit: '#111827', visor: '#EF4444', pack: '#991B1B', weaponColor: '#EF4444', weapon: 'continuous-beam', ability: 'warp', guardR: 80, speed: 2.4, accel: 0.036, hp: 3 }
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

      maxHp: def.hp || 3,
      hp: def.hp || 3,
      alive: true,
      respawnTimer: 0,
      spawnInvuln: 30,

      hitFlash: 0,
      hitSpin: 0,
      hitSpinAngle: 0,
      shockTimer: 0,
      freezeTimer: 0,
      saberSlashTimer: 0,

      dodgeCooldown: 0,
      healCooldown: 0,

      emoteText: '',
      emoteColor: '#FFFFFF',
      emoteTimer: 0,

      guardR: def.guardR || 80,   // Radio de escolta de los Corsarios alrededor del mouse
      attackR: def.attackR || 170, // Distancia desde donde los Astronautas atacan al mouse
      baseSpeed: def.speed || 2.2,
      accel: def.accel || 0.034,

      // Los Corsarios inician cerca del mouse protegiéndolo; los Astronautas en la periferia acechando
      x: (def.faction === 'corsair') ? (mouseX + (Math.random() - 0.5) * 160) : (Math.random() < 0.5 ? Math.random() * 180 + 30 : width - (Math.random() * 180 + 30)),
      y: Math.random() * (height * 0.65) + 75,

      vx: (Math.random() - 0.5) * 1.4,
      vy: (Math.random() - 0.5) * 1.4,
      targetVx: 0,
      targetVy: 0,

      facingLeft: (def.faction === 'astronaut'),
      tilt: 0,
      quantumAngle: Math.random() * Math.PI * 2,
      rotorAngle: Math.random() * 10,

      actionCooldown: Math.random() * 45 + 15,
      abilityTimer: 0,
      abilityCooldown: 0,
      shieldActive: false,
      warpGlitch: 0,
      powerBoostTimer: 0,

      waveOffset: Math.random() * Math.PI * 2
    });
  }

  function respawnOperative(op, curMouseX, curMouseY) {
    op.alive = true;
    op.hp = op.maxHp;
    op.spawnInvuln = 55;
    op.hitFlash = 0;
    op.hitSpin = 0;
    op.hitSpinAngle = 0;
    op.shockTimer = 0;
    op.freezeTimer = 0;
    op.shieldActive = false;
    op.abilityTimer = 0;
    op.powerBoostTimer = 0;

    if (op.faction === 'corsair') {
      // El Corsario reaparece cerca del mouse para defenderlo
      var rAng = Math.random() * Math.PI * 2;
      op.x = Math.max(30, Math.min(width - 30, curMouseX + Math.cos(rAng) * 90));
      op.y = Math.max(50, Math.min(height - 70, curMouseY + Math.sin(rAng) * 90));
      op.vx = 0;
      op.vy = 0;
      spawnRingWave(op.x, op.y, '#EF4444', 26);
      setEmote(op, 'GUARD!', op.weaponColor, 35);
    } else {
      // El Astronauta atacante reaparece desde los bordes exteriores para volver a atacar al mouse
      op.x = (Math.random() < 0.5) ? (25 + Math.random() * 50) : (width - (25 + Math.random() * 50));
      op.y = 65 + Math.random() * (height * 0.65);
      op.vx = (op.x < width / 2) ? 2.5 : -2.5;
      op.vy = (Math.random() - 0.5) * 1.5;
      spawnRingWave(op.x, op.y, '#38BDF8', 26);
      setEmote(op, 'ATTACK!', op.weaponColor, 35);
    }
    spawnSparks(op.x, op.y, 7, op.weaponColor);
  }

  function applyWeaponHitPhysics(targetOp, attackerId, impulseX, impulseY, spinForce, effectType, color) {
    if (!targetOp.alive || targetOp.spawnInvuln > 0) return;

    if (targetOp.shieldActive) {
      targetOp.vx += impulseX * 0.35;
      targetOp.vy += impulseY * 0.35;
      spawnSparks(targetOp.x, targetOp.y, 5, '#38BDF8');
      return;
    }

    targetOp.vx += impulseX;
    targetOp.vy += impulseY;
    targetOp.hitSpin = (impulseX >= 0 ? 1 : -1) * (spinForce || 0.35);
    targetOp.hitFlash = 10;
    targetOp.hp--;

    if (effectType === 'shock') {
      targetOp.shockTimer = 38;
      setEmote(targetOp, 'ZAP!', '#FFEA00', 30);
    } else if (effectType === 'freeze') {
      targetOp.freezeTimer = 55;
      setEmote(targetOp, 'ICE!', '#38BDF8', 30);
    } else if (effectType === 'saber') {
      setEmote(targetOp, 'SLASH!', color, 28);
    } else if (effectType === 'blast') {
      setEmote(targetOp, 'BOOM!', '#F97316', 28);
    }

    spawnSparks(targetOp.x, targetOp.y, 8, color || '#FFEA00');

    if (targetOp.hp > 0) {
      if (targetOp.hp === 1) {
        setEmote(targetOp, 'SOS!', '#EF4444', 42);
      }
      triggerSurvivalAbility(targetOp, targetOp.x - impulseX * 4, targetOp.y - impulseY * 4);
    } else {
      targetOp.alive = false;
      targetOp.respawnTimer = isMobile ? 105 : 130;
      spawnRingWave(targetOp.x, targetOp.y, targetOp.weaponColor, 36);
      spawnSparks(targetOp.x, targetOp.y, 16, '#FFEA00');
      spawnSparks(targetOp.x, targetOp.y, 10, targetOp.weaponColor);
      spawnSmoke(targetOp.x, targetOp.y, 'rgba(248, 113, 113, 0.65)');
      addLaserMark(targetOp.x, targetOp.y, targetOp.weaponColor);

      if (lootOrbs.length < 6) {
        lootOrbs.push({ x: targetOp.x, y: targetOp.y, life: 320 });
      }

      for (var sIdx = 0; sIdx < operatives.length; sIdx++) {
        if (operatives[sIdx].id === attackerId && operatives[sIdx].alive) {
          setEmote(operatives[sIdx], 'KO!', '#FFEA00', 38);
          break;
        }
      }
    }
  }

  function drawPixelRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function drawMicroAstronaut(ctx, op) {
    if (!op.alive) return;

    ctx.save();
    var shakeX = (op.shockTimer > 0) ? (Math.random() - 0.5) * 6 : 0;
    var shakeY = (op.shockTimer > 0) ? (Math.random() - 0.5) * 6 : 0;
    ctx.translate(Math.round(op.x + shakeX), Math.round(op.y + shakeY));

    if (op.spawnInvuln > 0 && Math.floor(op.spawnInvuln / 3) % 2 === 0) {
      ctx.globalAlpha = 0.45;
    }

    if (currentPlanet.id === 'cuantico') {
      ctx.rotate(op.quantumAngle + op.hitSpinAngle);
    } else {
      ctx.rotate(op.tilt + op.hitSpinAngle);
    }

    ctx.scale(op.facingLeft ? -1 : 1, 1);

    var p = 1.12;

    if (currentPlanet.id === 'cuantico') {
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.translate(2, -2);
      drawPixelRect(ctx, -2 * p, -5 * p, 4 * p, 3 * p, '#38BDF8');
      ctx.restore();
    }

    var suitColor = (op.hitFlash > 0) ? '#EF4444' : ((op.freezeTimer > 0) ? '#7DD3FC' : op.suit);
    var visorColor = (op.hitFlash > 0) ? '#FFFFFF' : ((op.shockTimer > 0) ? '#FFEA00' : op.visor);

    var gunX = 3 * p;
    var gunY = -1.5 * p;

    if (op.weapon === 'laser-sword') {
      drawPixelRect(ctx, gunX, gunY - 0.5 * p, 2.5 * p, 1.5 * p, '#94A3B8');
      ctx.save();
      var bladeAngle = (op.saberSlashTimer > 0) ? (Math.sin(op.saberSlashTimer * 0.45) * 1.4) : -0.35;
      ctx.translate(gunX + 2 * p, gunY);
      ctx.rotate(bladeAngle);
      ctx.strokeStyle = op.weaponColor;
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(14 * p, -5 * p);
      ctx.stroke();

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(13 * p, -4.5 * p);
      ctx.stroke();

      if (op.saberSlashTimer > 0) {
        ctx.beginPath();
        ctx.arc(0, 0, 14 * p, -1.2, 0.9);
        ctx.strokeStyle = op.weaponColor;
        ctx.globalAlpha = 0.55;
        ctx.lineWidth = 4;
        ctx.stroke();
      }
      ctx.restore();
    } else {
      if (op.faction === 'astronaut') {
        drawPixelRect(ctx, gunX, gunY - p, 4.0 * p, 2.0 * p, op.pack);
        drawPixelRect(ctx, gunX + 2.2 * p, gunY - 1.5 * p, 1.4 * p, 3.0 * p, op.weaponColor);
      } else {
        drawPixelRect(ctx, gunX, gunY - p, 4.8 * p, 1.8 * p, '#18181B');
        drawPixelRect(ctx, gunX + 2.6 * p, gunY - 1.3 * p, 1.4 * p, 2.8 * p, op.weaponColor);
      }
    }

    var mastX = -0.5 * p;
    var mastY = -7.5 * p;
    drawPixelRect(ctx, mastX, mastY, 1.2 * p, 2.2 * p, '#94A3B8');

    var rFrame = Math.floor(op.rotorAngle) % 3;
    var bladeColor = (op.powerBoostTimer > 0) ? '#FFEA00' : ((op.faction === 'astronaut') ? '#38BDF8' : '#EF4444');
    if (rFrame === 0) {
      drawPixelRect(ctx, -3 * p, mastY - p, 6 * p, 1.0 * p, bladeColor);
    } else if (rFrame === 1) {
      drawPixelRect(ctx, -2 * p, mastY - 1.5 * p, 4 * p, 1.0 * p, bladeColor);
    } else {
      drawPixelRect(ctx, -0.5 * p, mastY - 2.5 * p, 1.2 * p, 4.0 * p, bladeColor);
    }

    drawPixelRect(ctx, -3.8 * p, -3.8 * p, 2.2 * p, 4.5 * p, op.pack);
    if (op.role === 'medic') {
      drawPixelRect(ctx, -3.4 * p, -2.2 * p, 1.4 * p, 1.4 * p, '#10B981');
    }

    drawPixelRect(ctx, -2 * p, -5 * p, 4.2 * p, 3.2 * p, suitColor);
    drawPixelRect(ctx, 0.6 * p, -4 * p, 1.6 * p, 1.6 * p, visorColor);

    drawPixelRect(ctx, -2 * p, -1.8 * p, 4.2 * p, 3.8 * p, suitColor);
    drawPixelRect(ctx, -2 * p, 2 * p, 1.5 * p, 2.0 * p, suitColor);
    drawPixelRect(ctx, 0.8 * p, 2 * p, 1.5 * p, 2.0 * p, suitColor);
    drawPixelRect(ctx, -2.4 * p, 4 * p, 1.9 * p, 1.2 * p, '#0F172A');
    drawPixelRect(ctx, 0.8 * p, 4 * p, 1.9 * p, 1.2 * p, '#0F172A');

    if (op.shieldActive) {
      ctx.save();
      ctx.strokeStyle = (op.faction === 'astronaut') ? '#38BDF8' : '#F43F5E';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(0, 0, 13 * p, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();

    if (op.hp < op.maxHp) {
      ctx.save();
      var barW = 14;
      var barH = 2.5;
      var bx = Math.round(op.x - barW / 2);
      var by = Math.round(op.y - 14);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(bx, by, barW, barH);
      ctx.fillStyle = (op.hp === 1) ? '#EF4444' : '#FBBF24';
      ctx.fillRect(bx, by, Math.round(barW * (op.hp / op.maxHp)), barH);
      ctx.restore();
    }

    if (op.emoteTimer > 0 && op.emoteText) {
      ctx.save();
      ctx.font = '700 9px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = op.emoteColor;
      ctx.fillText(op.emoteText, Math.round(op.x), Math.round(op.y - 18));
      ctx.restore();
    }
  }

  // ==========================================================================
  // 9. DISPARO DE LAS 12 ARMAS CREATIVAS CON FÍSICA DIFERENCIADA
  // ==========================================================================
  function fireOperativeWeapon(op, targetOpOrX, targetY) {
    if (!op.alive) return;

    var isOpTarget = (typeof targetOpOrX === 'object' && targetOpOrX !== null);
    var tX = isOpTarget ? targetOpOrX.x : targetOpOrX;
    var tY = isOpTarget ? targetOpOrX.y : targetY;

    var dirX = tX - op.x;
    var dirY = tY - op.y;
    var dist = Math.hypot(dirX, dirY) || 1;
    var nx = dirX / dist;
    var ny = dirY / dist;

    op.facingLeft = (nx < 0);

    var startX = op.x + (op.facingLeft ? -9 : 9);
    var startY = op.y - 1;

    switch(op.weapon) {
      case 'laser-sword':
        op.vx += nx * 4.5;
        op.vy += ny * 4.5;
        op.saberSlashTimer = 18;
        if (isOpTarget && dist < 52) {
          if (targetOpOrX.weapon === 'laser-sword' && targetOpOrX.saberSlashTimer > 0) {
            op.vx = -nx * 5.5;
            op.vy = -ny * 5.5;
            targetOpOrX.vx = nx * 5.5;
            targetOpOrX.vy = ny * 5.5;
            spawnSparks((op.x + tX) / 2, (op.y + tY) / 2, 14, '#FFEA00');
            spawnRingWave((op.x + tX) / 2, (op.y + tY) / 2, '#FFEA00', 25);
            setEmote(op, 'CLANG!', '#FFEA00', 30);
            setEmote(targetOpOrX, 'PARRY!', '#FFEA00', 30);
          } else {
            applyWeaponHitPhysics(targetOpOrX, op.id, nx * 8.2, ny * 8.2 - 1.5, 0.55, 'saber', op.weaponColor);
          }
        }
        break;

      case 'homing-missile':
        projectiles.push({
          x: startX, y: startY, vx: nx * 3.8, vy: ny * 3.8 - 1.2,
          type: 'missile', targetOp: isOpTarget ? targetOpOrX : null,
          targetMouse: !isOpTarget,
          life: 75, color: op.weaponColor, radius: 3.0, length: 10,
          knockback: 7.8, spinForce: 0.5, faction: op.faction, ownerId: op.id
        });
        break;

      case 'continuous-beam':
        activeBeams.push({
          x1: startX, y1: startY, x2: tX, y2: tY,
          color: op.weaponColor, type: 'laser', life: 12
        });
        if (isOpTarget && dist < 230) {
          applyWeaponHitPhysics(targetOpOrX, op.id, nx * 5.2, ny * 5.2, 0.25, 'beam', op.weaponColor);
        } else {
          addLaserMark(tX, tY, op.weaponColor);
          spawnSparks(tX, tY, 5, op.weaponColor);
        }
        break;

      case 'tesla-lightning':
        activeBeams.push({
          x1: startX, y1: startY, x2: tX, y2: tY,
          color: '#818CF8', type: 'lightning', life: 14
        });
        if (isOpTarget && dist < 210) {
          applyWeaponHitPhysics(targetOpOrX, op.id, nx * 4.5, ny * 4.5, 0.4, 'shock', '#FFEA00');
        } else {
          spawnSparks(tX, tY, 5, '#FFEA00');
        }
        break;

      case 'railgun':
        op.vx -= nx * 2.2;
        op.vy -= ny * 2.2;
        projectiles.push({
          x: startX, y: startY, vx: nx * 13.0, vy: ny * 13.0,
          type: 'railgun', life: 32, color: '#F43F5E', radius: 2.6, length: 24,
          knockback: 9.2, spinForce: 0.65, faction: op.faction, ownerId: op.id
        });
        break;

      case 'gravity-vortex':
        projectiles.push({
          x: startX, y: startY, vx: nx * 4.0, vy: ny * 4.0,
          type: 'vortex', life: 68, color: '#C084FC', radius: 5.5,
          knockback: 6.5, spinForce: 0.6, faction: op.faction, ownerId: op.id
        });
        break;

      case 'cryo-ray':
        projectiles.push({
          x: startX, y: startY, vx: nx * 7.5, vy: ny * 7.5,
          type: 'cryo', life: 42, color: '#38BDF8', radius: 2.8, length: 14,
          knockback: 4.5, spinForce: 0.2, faction: op.faction, ownerId: op.id
        });
        break;

      case 'boomerang':
        projectiles.push({
          x: startX, y: startY, vx: nx * 7.2, vy: ny * 7.2,
          type: 'boomerang', ownerOp: op, rot: 0,
          life: 75, color: '#FBBF24', radius: 4.5,
          knockback: 6.8, spinForce: 0.5, faction: op.faction, ownerId: op.id
        });
        break;

      case 'flamethrower':
        for (var fl = 0; fl < 3; fl++) {
          projectiles.push({
            x: startX, y: startY,
            vx: nx * (5.0 + fl) + (Math.random() - 0.5) * 1.5,
            vy: ny * (5.0 + fl) + (Math.random() - 0.5) * 1.5,
            type: 'flame', life: 26, color: (fl % 2 === 0) ? '#F97316' : '#EF4444', radius: 3.5,
            knockback: 4.2, spinForce: 0.25, faction: op.faction, ownerId: op.id
          });
        }
        break;

      case 'sonic-cannon':
        projectiles.push({
          x: startX, y: startY, vx: nx * 6.5, vy: ny * 6.5,
          type: 'sonic', life: 40, color: op.weaponColor, radius: 5.0,
          knockback: 8.0, spinForce: 0.35, faction: op.faction, ownerId: op.id
        });
        break;

      case 'plasma-mortar':
        projectiles.push({
          x: startX, y: startY, vx: nx * 4.5, vy: ny * 4.5 - 2.2,
          type: 'mortar', gravity: 0.09, life: 65, color: '#F87171', radius: 5.0,
          knockback: 8.5, spinForce: 0.55, faction: op.faction, ownerId: op.id
        });
        break;

      default:
        for (var s = -1; s <= 1; s++) {
          var ang = Math.atan2(ny, nx) + s * 0.16;
          projectiles.push({
            x: startX, y: startY, vx: Math.cos(ang) * 6.5, vy: Math.sin(ang) * 6.5,
            type: 'pellet', life: 35, color: op.weaponColor, radius: 2.0,
            knockback: 5.5, spinForce: 0.3, faction: op.faction, ownerId: op.id
          });
        }
        break;
    }
  }

  function triggerSurvivalAbility(op, threatX, threatY) {
    if (op.abilityCooldown > 0 || !op.alive) return;
    op.abilityCooldown = 90;

    var awayX = op.x - threatX;
    var awayY = op.y - threatY;
    var awayDist = Math.hypot(awayX, awayY) || 1;

    if (op.ability === 'shield') {
      op.shieldActive = true;
      op.abilityTimer = 60;
      setEmote(op, 'SHIELD', '#38BDF8', 30);
    } else if (op.ability === 'smoke') {
      spawnSmoke(op.x, op.y, (op.faction === 'astronaut') ? 'rgba(56, 189, 248, 0.45)' : 'rgba(239, 68, 68, 0.45)');
      op.vx += (awayX / awayDist) * 4.4;
      op.vy += (awayY / awayDist) * 4.4;
      setEmote(op, 'SMOKE', '#94A3B8', 30);
    } else if (op.ability === 'turbo') {
      op.vx += (awayX / awayDist) * 5.0;
      op.vy += (awayY / awayDist) * 5.0;
      spawnSparks(op.x, op.y, 5, op.weaponColor);
      setEmote(op, 'BOOST!', '#FFEA00', 30);
    } else if (op.ability === 'warp') {
      op.warpGlitch = 14;
      spawnSparks(op.x, op.y, 5, '#EC4899');
      var ang = Math.random() * Math.PI * 2;
      op.x = Math.max(30, Math.min(width - 30, op.x + Math.cos(ang) * 130));
      op.y = Math.max(50, Math.min(height - 80, op.y + Math.sin(ang) * 100));
      spawnRingWave(op.x, op.y, '#EC4899', 20);
      setEmote(op, 'WARP!', '#EC4899', 30);
    }
  }

  // ==========================================================================
  // 10. LOOP PRINCIPAL: CORSARIOS DEFIENDEN MOUSE VS ASTRONAUTAS ATACAN MOUSE
  // ==========================================================================
  var timeTick = 0;

  function loop() {
    timeTick += 0.03;
    bgScrollX += 0.65 + (scrollVelocity * 0.25);
    scrollVelocity *= 0.9;

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

    // 1. Estrellas con movimiento continuo
    for (var s = 0; s < STAR_COUNT; s++) {
      var st = stars[s];
      var sx = ((st.x - bgScrollX * (0.08 * st.layer)) % width + width) % width;
      var sy = ((st.baseY - currentScrollY * (0.03 * st.layer)) % height + height) % height;

      ctx.beginPath();
      ctx.arc(sx, sy, st.radius, 0, Math.PI * 2);
      var starColor = (currentPlanet.id === 'tierra') ? 'rgba(52, 211, 153, ' :
                      (currentPlanet.id === 'deimos' || currentPlanet.id === 'marte') ? 'rgba(248, 113, 113, ' :
                      (currentPlanet.id === 'agua') ? 'rgba(125, 211, 252, ' :
                      (currentPlanet.id === 'plasma') ? 'rgba(134, 239, 172, ' :
                      (currentPlanet.id === 'cuantico') ? 'rgba(233, 213, 255, ' :
                      'rgba(255, 255, 255, ';
      ctx.fillStyle = starColor + st.alpha + ')';
      ctx.fill();
    }

    // 2. FONDO PANORÁMICO COMPLETO EN MOVIMIENTO DEL PLANETA ACTIVO
    if (currentPlanet.id === 'espacio') renderXainOrbit(ctx, timeTick);
    else if (currentPlanet.id === 'tierra') renderLagulaked(ctx, timeTick);
    else if (currentPlanet.id === 'deimos' || currentPlanet.id === 'marte') renderCleemooth(ctx, timeTick);
    else if (currentPlanet.id === 'agua') renderCleedos(ctx, timeTick);
    else if (currentPlanet.id === 'plasma') renderKworal(ctx, timeTick);
    else if (currentPlanet.id === 'cuantico') renderGuierdwold(ctx, timeTick);

    renderLaserMarks(ctx);

    var curMouseX = isMobile ? targetMouseX : mouseX;
    var curMouseY = isMobile ? targetMouseY : mouseY;

    // Halo de escudo del Mouse cuando recibe ataques de los Astronautas
    if (mouseHitFlash > 0) {
      mouseHitFlash--;
      ctx.save();
      ctx.strokeStyle = 'rgba(244, 63, 94, ' + (mouseHitFlash / 12) + ')';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(curMouseX, curMouseY, 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Cápsulas de energía
    for (var lIdx = lootOrbs.length - 1; lIdx >= 0; lIdx--) {
      var orb = lootOrbs[lIdx];
      orb.life--;
      if (orb.life <= 0) {
        lootOrbs.splice(lIdx, 1);
        continue;
      }
      var pulseR = 3.5 + Math.sin(timeTick * 8 + lIdx) * 1.2;
      ctx.save();
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = '#10B981';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      for (var opL = 0; opL < operatives.length; opL++) {
        var collector = operatives[opL];
        if (collector.alive && Math.hypot(collector.x - orb.x, collector.y - orb.y) < 16) {
          collector.hp = Math.min(collector.maxHp, collector.hp + 1);
          collector.powerBoostTimer = 180;
          setEmote(collector, 'POWER!', '#10B981', 40);
          spawnRingWave(collector.x, collector.y, '#10B981', 18);
          lootOrbs.splice(lIdx, 1);
          break;
        }
      }
    }

    // Rayos láser continuos y relámpagos Tesla
    for (var bIdx = activeBeams.length - 1; bIdx >= 0; bIdx--) {
      var bm = activeBeams[bIdx];
      bm.life--;
      if (bm.life <= 0) {
        activeBeams.splice(bIdx, 1);
        continue;
      }
      ctx.save();
      ctx.strokeStyle = bm.color;
      ctx.lineWidth = (bm.type === 'laser') ? 2.8 : 2.0;
      ctx.beginPath();
      ctx.moveTo(bm.x1, bm.y1);
      if (bm.type === 'lightning') {
        var mid1X = bm.x1 + (bm.x2 - bm.x1) * 0.33 + (Math.random() - 0.5) * 18;
        var mid1Y = bm.y1 + (bm.y2 - bm.y1) * 0.33 + (Math.random() - 0.5) * 18;
        var mid2X = bm.x1 + (bm.x2 - bm.x1) * 0.66 + (Math.random() - 0.5) * 18;
        var mid2Y = bm.y1 + (bm.y2 - bm.y1) * 0.66 + (Math.random() - 0.5) * 18;
        ctx.lineTo(mid1X, mid1Y);
        ctx.lineTo(mid2X, mid2Y);
      }
      ctx.lineTo(bm.x2, bm.y2);
      ctx.stroke();
      ctx.restore();
    }

    // Rayos médicos
    for (var hbIdx = healBeams.length - 1; hbIdx >= 0; hbIdx--) {
      var hb = healBeams[hbIdx];
      hb.life--;
      if (hb.life <= 0) {
        healBeams.splice(hbIdx, 1);
        continue;
      }
      ctx.save();
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 1.6;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(hb.x1, hb.y1);
      ctx.lineTo(hb.x2, hb.y2);
      ctx.stroke();
      ctx.restore();
    }

    // Ondas de choque
    for (var swIdx = shockwaves.length - 1; swIdx >= 0; swIdx--) {
      var sw = shockwaves[swIdx];
      sw.radius += 2.0;
      sw.life -= 0.05;
      if (sw.life <= 0 || sw.radius >= sw.maxRadius) {
        shockwaves.splice(swIdx, 1);
        continue;
      }
      ctx.save();
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = sw.life * 0.7;
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.restore();
    }

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
      ctx.arc(spk.x, spk.y, spk.life * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = spk.color;
      ctx.globalAlpha = spk.life;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    // Humo
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

    // ========================================================================
    // PROYECTILES Y FÍSICA DE IMPACTO
    // ========================================================================
    for (var prIdx = projectiles.length - 1; prIdx >= 0; prIdx--) {
      var pr = projectiles[prIdx];
      pr.life--;

      if (pr.gravity) pr.vy += pr.gravity;

      if (pr.type === 'missile') {
        var goalX = (pr.targetOp && pr.targetOp.alive) ? pr.targetOp.x : (pr.targetMouse ? curMouseX : pr.x + pr.vx);
        var goalY = (pr.targetOp && pr.targetOp.alive) ? pr.targetOp.y : (pr.targetMouse ? curMouseY : pr.y + pr.vy);
        var mdxM = goalX - pr.x;
        var mdyM = goalY - pr.y;
        var mdM = Math.hypot(mdxM, mdyM) || 1;
        pr.vx += (mdxM / mdM) * 0.42;
        pr.vy += (mdyM / mdM) * 0.42;
        if (Math.random() < 0.35) spawnSmoke(pr.x, pr.y, 'rgba(226, 232, 240, 0.35)');
      } else if (pr.type === 'boomerang' && pr.ownerOp && pr.life < 42) {
        var bdx = pr.ownerOp.x - pr.x;
        var bdy = pr.ownerOp.y - pr.y;
        var bd = Math.hypot(bdx, bdy) || 1;
        pr.vx += (bdx / bd) * 0.55;
        pr.vy += (bdy / bd) * 0.55;
        if (bd < 15) {
          projectiles.splice(prIdx, 1);
          continue;
        }
      } else if (pr.type === 'vortex') {
        for (var vo = 0; vo < operatives.length; vo++) {
          var vOp = operatives[vo];
          if (vOp.alive && vOp.faction !== pr.faction) {
            var vdx = pr.x - vOp.x;
            var vdy = pr.y - vOp.y;
            var vd = Math.hypot(vdx, vdy);
            if (vd < 95 && vd > 5) {
              vOp.vx += (vdx / vd) * 0.45;
              vOp.vy += (vdy / vd) * 0.45;
              vOp.hitSpin = 0.25;
            }
          }
        }
      }

      pr.x += pr.vx;
      pr.y += pr.vy;

      if (pr.life <= 0 || pr.x < -30 || pr.x > width + 30 || pr.y < -30 || pr.y > height + 30) {
        projectiles.splice(prIdx, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      if (pr.type === 'boomerang') {
        pr.rot = (pr.rot || 0) + 0.35;
        ctx.translate(pr.x, pr.y);
        ctx.rotate(pr.rot);
        ctx.strokeStyle = pr.color;
        ctx.lineWidth = 2.5;
        ctx.arc(0, 0, pr.radius, 0, Math.PI * 1.3);
        ctx.stroke();
      } else if (pr.type === 'sonic') {
        ctx.strokeStyle = pr.color;
        ctx.lineWidth = 2.0;
        ctx.arc(pr.x, pr.y, pr.radius + (40 - pr.life) * 0.25, 0, Math.PI * 2);
        ctx.stroke();
      } else if (pr.type === 'vortex') {
        ctx.fillStyle = '#1E1B4B';
        ctx.strokeStyle = pr.color;
        ctx.lineWidth = 2.0;
        ctx.arc(pr.x, pr.y, pr.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (pr.length) {
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
        continue;
      }

      // Si un proyectil de los Astronautas llega al Mouse sin ser interceptado por los Corsarios
      if (pr.faction === 'astronaut' && Math.hypot(pr.x - curMouseX, pr.y - curMouseY) < 18) {
        mouseHitFlash = 10;
        spawnSparks(curMouseX, curMouseY, 6, pr.color);
        projectiles.splice(prIdx, 1);
        continue;
      }

      // Impacto contra operativo rival
      var hitOp = false;
      for (var opK = 0; opK < operatives.length; opK++) {
        var targetOp = operatives[opK];
        if (!targetOp.alive || targetOp.faction === pr.faction || targetOp.spawnInvuln > 0) continue;

        if (Math.hypot(targetOp.x - pr.x, targetOp.y - pr.y) < 14) {
          hitOp = true;

          // Rebote con espada láser
          if (targetOp.weapon === 'laser-sword' && Math.random() < 0.38) {
            pr.vx = -pr.vx * 1.1;
            pr.vy = -pr.vy * 1.1;
            pr.faction = targetOp.faction;
            targetOp.saberSlashTimer = 14;
            setEmote(targetOp, 'DEFLECT!', targetOp.weaponColor, 26);
            spawnSparks(pr.x, pr.y, 6, targetOp.weaponColor);
            hitOp = false;
            break;
          }

          var pMag = Math.hypot(pr.vx, pr.vy) || 1;
          var impForce = pr.knockback || 5.5;
          var impX = (pr.vx / pMag) * impForce;
          var impY = (pr.vy / pMag) * impForce;

          var eff = (pr.type === 'cryo') ? 'freeze' :
                    (pr.type === 'missile' || pr.type === 'mortar') ? 'blast' : 'normal';

          applyWeaponHitPhysics(targetOp, pr.ownerId, impX, impY, pr.spinForce || 0.4, eff, pr.color);

          if (pr.type === 'missile' || pr.type === 'mortar') {
            spawnRingWave(pr.x, pr.y, '#F97316', 38);
            for (var bOp = 0; bOp < operatives.length; bOp++) {
              var near = operatives[bOp];
              if (near.alive && near.id !== targetOp.id) {
                var bDist = Math.hypot(near.x - pr.x, near.y - pr.y);
                if (bDist < 65 && bDist > 1) {
                  near.vx += ((near.x - pr.x) / bDist) * 5.0;
                  near.vy += ((near.y - pr.y) / bDist) * 5.0;
                  near.hitSpin = 0.4;
                }
              }
            }
          }
          break;
        }
      }

      if (hitOp) {
        projectiles.splice(prIdx, 1);
      }
    }

    var friction = currentPlanet.friction || 0.985;

    // ========================================================================
    // CEREBRO TÁCTICO: CORSARIOS DEFIENDEN MOUSE VS ASTRONAUTAS ATACAN MOUSE
    // ========================================================================
    for (var opIdx = 0; opIdx < operatives.length; opIdx++) {
      var op = operatives[opIdx];

      if (!op.alive) {
        op.respawnTimer--;
        if (op.respawnTimer <= 0) {
          respawnOperative(op, curMouseX, curMouseY);
        }
        continue;
      }

      if (op.spawnInvuln > 0) op.spawnInvuln--;
      if (op.hitFlash > 0) op.hitFlash--;
      if (op.shockTimer > 0) op.shockTimer--;
      if (op.freezeTimer > 0) op.freezeTimer--;
      if (op.saberSlashTimer > 0) op.saberSlashTimer--;
      if (op.dodgeCooldown > 0) op.dodgeCooldown--;
      if (op.healCooldown > 0) op.healCooldown--;
      if (op.abilityCooldown > 0) op.abilityCooldown--;
      if (op.powerBoostTimer > 0) op.powerBoostTimer--;
      if (op.emoteTimer > 0) op.emoteTimer--;
      if (op.abilityTimer > 0) {
        op.abilityTimer--;
        if (op.abilityTimer <= 0) op.shieldActive = false;
      }
      if (op.warpGlitch > 0) op.warpGlitch--;

      if (Math.abs(op.hitSpin) > 0.005) {
        op.hitSpinAngle += op.hitSpin;
        op.hitSpin *= 0.90;
      } else {
        op.hitSpin = 0;
        op.hitSpinAngle *= 0.85;
      }

      if (op.hp === 1 && Math.random() < 0.08) {
        spawnSmoke(op.x, op.y, 'rgba(148, 163, 184, 0.35)');
      }

      if (currentPlanet.id === 'cuantico') {
        op.quantumAngle += 0.05;
      }

      // 1. ESQUIVE DE BALAS O INTERCEPCIÓN PROTECTORA DEL MOUSE
      if (op.dodgeCooldown <= 0 && op.shockTimer <= 0) {
        for (var pCheck = 0; pCheck < projectiles.length; pCheck++) {
          var proj = projectiles[pCheck];
          if (proj.faction === op.faction) continue;

          // Si es un CORSARIO con espada o escudo y ve una bala yendo hacia el Mouse, ¡se cruza para interceptarla!
          if (op.faction === 'corsair' && (op.weapon === 'laser-sword' || op.ability === 'shield') && Math.hypot(proj.x - curMouseX, proj.y - curMouseY) < 95) {
            var toProjX = proj.x - op.x;
            var toProjY = proj.y - op.y;
            var toProjD = Math.hypot(toProjX, toProjY) || 1;
            if (toProjD < 85) {
              op.vx += (toProjX / toProjD) * 3.8;
              op.vy += (toProjY / toProjD) * 3.8;
              if (op.ability === 'shield') { op.shieldActive = true; op.abilityTimer = 45; }
              setEmote(op, 'PROTECT!', '#EF4444', 25);
              op.dodgeCooldown = 25;
              break;
            }
          }

          var dxP = op.x - proj.x;
          var dyP = op.y - proj.y;
          var distP = Math.hypot(dxP, dyP);

          if (distP < 80 && (dxP * proj.vx + dyP * proj.vy) > 0) {
            var pSpeed = Math.hypot(proj.vx, proj.vy) || 1;
            var perpX = -proj.vy / pSpeed;
            var perpY = proj.vx / pSpeed;
            var side = ((dxP * perpX + dyP * perpY) >= 0) ? 1 : -1;

            op.vx += perpX * side * 3.8;
            op.vy += perpY * side * 3.8;
            op.dodgeCooldown = 26;
            setEmote(op, '!', '#FFEA00', 20);

            if (distP < 45 || op.hp === 1) {
              triggerSurvivalAbility(op, proj.x, proj.y);
            }
            break;
          }
        }
      }

      // 2. ESCANEO TÁCTICO: BUSCAR AMENAZAS AL MOUSE Y ALIADOS HERIDOS
      var nearestEnemy = null;
      var nearestEnemyDist = 999999;
      var closestThreatToMouse = null; // El Astronauta que está más cerca de atacar al mouse
      var closestThreatMouseDist = 999999;
      var nearestWoundedAlly = null;
      var nearestWoundedDist = 999999;

      for (var scanIdx = 0; scanIdx < operatives.length; scanIdx++) {
        if (scanIdx === opIdx) continue;
        var otherOp = operatives[scanIdx];
        if (!otherOp.alive) continue;

        var dScan = Math.hypot(otherOp.x - op.x, otherOp.y - op.y);
        if (otherOp.faction !== op.faction) {
          if (dScan < nearestEnemyDist) {
            nearestEnemyDist = dScan;
            nearestEnemy = otherOp;
          }
          if (otherOp.faction === 'astronaut') {
            var dToMouse = Math.hypot(otherOp.x - curMouseX, otherOp.y - curMouseY);
            if (dToMouse < closestThreatMouseDist) {
              closestThreatMouseDist = dToMouse;
              closestThreatToMouse = otherOp;
            }
          }
        } else {
          if (otherOp.hp < otherOp.maxHp && dScan < nearestWoundedDist) {
            nearestWoundedDist = dScan;
            nearestWoundedAlly = otherOp;
          }
        }
      }

      var nearestLoot = null;
      var nearestLootDist = 999999;
      for (var lt = 0; lt < lootOrbs.length; lt++) {
        var dLoot = Math.hypot(lootOrbs[lt].x - op.x, lootOrbs[lt].y - op.y);
        if (dLoot < nearestLootDist) {
          nearestLootDist = dLoot;
          nearestLoot = lootOrbs[lt];
        }
      }

      var mdx = curMouseX - op.x;
      var mdy = curMouseY - op.y;
      var mDist = Math.hypot(mdx, mdy);

      var activeSpeed = (op.freezeTimer > 0) ? (op.baseSpeed * 0.45) : op.baseSpeed;
      var hasTacticalOverride = false;

      // PRIORIDAD A: Recoger cápsula si está herido
      if (op.hp < op.maxHp && nearestLoot && nearestLootDist < 220) {
        op.targetVx = ((nearestLoot.x - op.x) / (nearestLootDist || 1)) * (activeSpeed * 1.35);
        op.targetVy = ((nearestLoot.y - op.y) / (nearestLootDist || 1)) * (activeSpeed * 1.35);
        hasTacticalOverride = true;
      }
      // PRIORIDAD B: Trinchera tras tarjeta si tiene 1 HP
      else if (op.hp === 1 && nearestEnemy && nearestEnemyDist < 190 && contentBoxes.length > 0) {
        var bestBox = contentBoxes[0];
        var bestD = 999999;
        for (var bI = 0; bI < contentBoxes.length; bI++) {
          var dB = Math.hypot(contentBoxes[bI].cx - op.x, contentBoxes[bI].cy - op.y);
          if (dB < bestD) { bestD = dB; bestBox = contentBoxes[bI]; }
        }
        var awayEnX = bestBox.cx - nearestEnemy.x;
        var awayEnY = bestBox.cy - nearestEnemy.y;
        var awayEnD = Math.hypot(awayEnX, awayEnY) || 1;
        var coverX = bestBox.cx + (awayEnX / awayEnD) * 50;
        var coverY = bestBox.cy + (awayEnY / awayEnD) * 40;
        var toCovD = Math.hypot(coverX - op.x, coverY - op.y) || 1;
        op.targetVx = ((coverX - op.x) / toCovD) * (activeSpeed * 1.3);
        op.targetVy = ((coverY - op.y) / toCovD) * (activeSpeed * 1.3);
        hasTacticalOverride = true;
      }
      // PRIORIDAD C: Médico cura a su compañero herido
      else if (op.role === 'medic' && nearestWoundedAlly && nearestWoundedDist < 250) {
        if (nearestWoundedDist > 42) {
          op.targetVx = ((nearestWoundedAlly.x - op.x) / nearestWoundedDist) * (activeSpeed * 1.25);
          op.targetVy = ((nearestWoundedAlly.y - op.y) / nearestWoundedDist) * (activeSpeed * 1.25);
          hasTacticalOverride = true;
        } else if (op.healCooldown <= 0) {
          nearestWoundedAlly.hp = Math.min(nearestWoundedAlly.maxHp, nearestWoundedAlly.hp + 1);
          op.healCooldown = 110;
          healBeams.push({ x1: op.x, y1: op.y, x2: nearestWoundedAlly.x, y2: nearestWoundedAlly.y, life: 18 });
          setEmote(nearestWoundedAlly, '+HP', '#10B981', 38);
          setEmote(op, 'HEAL', '#10B981', 30);
          spawnSparks(nearestWoundedAlly.x, nearestWoundedAlly.y, 5, '#10B981');
        }
      }

      // 3. COMPORTAMIENTO PRINCIPAL SEGÚN SU MISIÓN FRENTE AL MOUSE
      if (!hasTacticalOverride) {
        if (op.faction === 'corsair') {
          // ==================================================================
          // LOS CORSARIOS: DEFIENDEN EL MOUSE
          // Se colocan como un anillo protector alrededor del cursor e interceptan al Astronauta más cercano al mouse
          // ==================================================================
          if (closestThreatToMouse && closestThreatMouseDist < 230) {
            // Se posiciona exactamente ENTRE el mouse y el Astronauta atacante para escudar el cursor
            var interceptRatio = (op.weapon === 'laser-sword') ? 0.85 : 0.45;
            var defX = curMouseX + (closestThreatToMouse.x - curMouseX) * interceptRatio;
            var defY = curMouseY + (closestThreatToMouse.y - curMouseY) * interceptRatio;
            var defDist = Math.hypot(defX - op.x, defY - op.y) || 1;
            op.targetVx = ((defX - op.x) / defDist) * (activeSpeed * 1.25);
            op.targetVy = ((defY - op.y) / defDist) * (activeSpeed * 1.25);
            op.facingLeft = (closestThreatToMouse.x < op.x);
          } else {
            // Formación de escolta orbital alrededor del mouse mirando hacia afuera
            var gAngle = timeTick * 0.75 + (op.id * 0.9) + op.waveOffset;
            var guardX = curMouseX + Math.cos(gAngle) * op.guardR;
            var guardY = curMouseY + Math.sin(gAngle) * op.guardR;
            var gdx = guardX - op.x;
            var gdy = guardY - op.y;
            var gd = Math.hypot(gdx, gdy) || 1;
            op.targetVx = (gdx / gd) * activeSpeed;
            op.targetVy = (gdy / gd) * activeSpeed;
            op.facingLeft = (Math.cos(gAngle) < 0);
          }

          // No tapar el centro exacto del clic del mouse
          if (mDist < 26 && mDist > 0.1) {
            op.vx -= (mdx / mDist) * 0.4;
            op.vy -= (mdy / mDist) * 0.4;
          }

        } else {
          // ==================================================================
          // LOS ASTRONAUTAS: QUIEREN DESTRUIR EL MOUSE
          // Flanquean, hacen incursiones hacia el mouse para dispararle y esquivan si el mouse los embiste
          // ==================================================================
          if (op.weapon === 'laser-sword') {
            // Los espadachines cargan hacia el mouse o hacia el Corsario que se les cruce
            var chargeTargetX = (nearestEnemy && nearestEnemyDist < 110) ? nearestEnemy.x : curMouseX;
            var chargeTargetY = (nearestEnemy && nearestEnemyDist < 110) ? nearestEnemy.y : curMouseY;
            var cDist = Math.hypot(chargeTargetX - op.x, chargeTargetY - op.y) || 1;
            op.targetVx = ((chargeTargetX - op.x) / cDist) * (activeSpeed * 1.3);
            op.targetVy = ((chargeTargetY - op.y) / cDist) * (activeSpeed * 1.3);
          } else {
            // Rodean al mouse a distancia de tiro (attackR) buscando ángulo para dispararle al cursor
            var atkAngle = timeTick * 0.55 + (op.id * 1.1) + op.waveOffset;
            var desiredX = curMouseX + Math.cos(atkAngle) * op.attackR;
            var desiredY = curMouseY + Math.sin(atkAngle) * op.attackR;
            var adx = desiredX - op.x;
            var ady = desiredY - op.y;
            var ad = Math.hypot(adx, ady) || 1;
            op.targetVx = (adx / ad) * activeSpeed;
            op.targetVy = (ady / ad) * activeSpeed;
          }
          op.facingLeft = (mdx < 0);
        }
      }

      if (op.shockTimer <= 0) {
        op.vx += (op.targetVx - op.vx) * op.accel;
        op.vy += (op.targetVy - op.vy) * op.accel;
      }

      if (currentPlanet.gravityY) {
        op.vy += currentPlanet.gravityY;
      }

      op.rotorAngle += 0.55;
      var targetTilt = Math.max(-0.35, Math.min(0.35, op.vx * 0.16));
      op.tilt += (targetTilt - op.tilt) * 0.14;

      // 4. DISPARO Y COMBATE:
      // - Los Corsarios disparan contra el Astronauta que amenace al mouse
      // - Los Astronautas disparan contra el Mouse o contra el Corsario que lo defiende
      op.actionCooldown--;
      if (op.actionCooldown <= 0 && op.shockTimer <= 0) {
        var attackRange = (op.weapon === 'laser-sword') ? 52 : 245;

        if (op.faction === 'corsair') {
          var targetEnemy = (closestThreatToMouse && Math.hypot(closestThreatToMouse.x - op.x, closestThreatToMouse.y - op.y) < attackRange) ? closestThreatToMouse : nearestEnemy;
          if (targetEnemy && Math.hypot(targetEnemy.x - op.x, targetEnemy.y - op.y) < attackRange) {
            fireOperativeWeapon(op, targetEnemy);
            op.actionCooldown = (op.weapon === 'laser-sword') ? 22 : ((op.powerBoostTimer > 0) ? 24 : (Math.random() * 44 + 24));
          }
        } else {
          // Astronauta: si hay un Corsario bloqueándole el paso cerca, le dispara al Corsario; si tiene tiro al Mouse, ¡dispara a destruir el Mouse!
          if (nearestEnemy && nearestEnemyDist < (op.weapon === 'laser-sword' ? 52 : 145)) {
            fireOperativeWeapon(op, nearestEnemy);
            op.actionCooldown = (op.weapon === 'laser-sword') ? 22 : (Math.random() * 45 + 25);
          } else if (mDist < attackRange + 40) {
            fireOperativeWeapon(op, curMouseX, curMouseY);
            op.actionCooldown = Math.random() * 52 + 28;
          }
        }
      }

      // Separación física
      for (var otherIdx = opIdx + 1; otherIdx < operatives.length; otherIdx++) {
        var other = operatives[otherIdx];
        if (!other.alive) continue;

        var dx = other.x - op.x;
        var dy = other.y - op.y;
        var distO = Math.hypot(dx, dy);

        if (distO < 20 && distO > 0.5) {
          var rep = (20 - distO) * 0.12;
          op.vx -= (dx / distO) * rep;
          op.vy -= (dy / distO) * rep;
          other.vx += (dx / distO) * rep;
          other.vy += (dy / distO) * rep;
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

          if (minOv === ovT) { op.y = cb.top - pad; op.vy = -Math.abs(op.vy) * 0.8 - 0.4; }
          else if (minOv === ovB) { op.y = cb.bottom + pad; op.vy = Math.abs(op.vy) * 0.8 + 0.4; }
          else if (minOv === ovL) { op.x = cb.left - pad; op.vx = -Math.abs(op.vx) * 0.8 - 0.4; }
          else { op.x = cb.right + pad; op.vx = Math.abs(op.vx) * 0.8 + 0.4; }
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
