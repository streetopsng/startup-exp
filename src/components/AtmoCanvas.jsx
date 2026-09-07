import React, { useEffect, useRef } from 'react';

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpColor(c1, c2, t) {
  return [
    lerp(c1[0], c2[0], t),
    lerp(c1[1], c2[1], t),
    lerp(c1[2], c2[2], t)
  ];
}

export default function AtmoCanvas({
  atmo,
  orderTarget = 0.05,
  cardType = 'homepage',
  overlay = 'none',
  focusFlag = false,
  reactionType = null,
  portalTrigger = 0
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    current: atmo,
    colorFrom: atmo.particle,
    colorTo: atmo.particle,
    colorStart: performance.now(),
    currentColor: [...atmo.particle],
    order: orderTarget,
    orderTarget: orderTarget,
    cardType,
    overlay,
    focusFlag,
    reactionType,
    reactionStart: 0,
    portalStart: -9999
  });

  // Update target atmosphere when atmo changes
  useEffect(() => {
    const s = stateRef.current;
    s.colorFrom = s.currentColor ? [...s.currentColor] : [...atmo.particle];
    s.colorTo = atmo.particle;
    s.colorStart = performance.now();
    s.current = atmo;
  }, [atmo]);

  // Update order target
  useEffect(() => {
    stateRef.current.orderTarget = orderTarget;
  }, [orderTarget]);

  // Update card type, overlay, focus
  useEffect(() => {
    stateRef.current.cardType = cardType;
    stateRef.current.overlay = overlay;
    stateRef.current.focusFlag = focusFlag;
  }, [cardType, overlay, focusFlag]);

  // Trigger reaction when reactionType changes
  useEffect(() => {
    stateRef.current.reactionType = reactionType;
    if (reactionType) {
      stateRef.current.reactionStart = performance.now();
    }
  }, [reactionType]);

  // Trigger portal burst
  useEffect(() => {
    if (portalTrigger > 0) {
      stateRef.current.portalStart = performance.now();
    }
  }, [portalTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    let DPR = Math.min(window.devicePixelRatio || 1, 2);

    function handleResize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    const N = W < 560 ? 40 : 60;
    const particles = [];
    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        anchorX: Math.random() * W,
        anchorY: Math.random() * H,
        seed: Math.random() * 10,
        orbitR: 60 + Math.random() * Math.min(W, H) * 0.35,
        clusterX: (Math.random() - 0.5) * 120,
        clusterY: (Math.random() - 0.5) * 120,
        size: 1.3 + Math.random() * 1.8
      });
    }

    const cols = Math.ceil(Math.sqrt(N * (W / H)));
    const pointer = { x: W / 2, y: H / 2, active: false };

    function onMouseMove(e) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    }
    function onTouchMove(e) {
      if (e.touches[0]) {
        pointer.x = e.touches[0].clientX;
        pointer.y = e.touches[0].clientY;
        pointer.active = true;
      }
    }
    function onMouseLeave() {
      pointer.active = false;
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);

    function computeTarget(p, currentAtmo, order, t, i, ampMult) {
      const amp = ((1 - order) * 54 + 8) * (ampMult || 1);
      const wanderX = p.anchorX + Math.sin(t * 0.18 + p.seed * 6) * amp;
      const wanderY = p.anchorY + Math.cos(t * 0.15 + p.seed * 5) * amp;

      switch (currentAtmo.motion) {
        case 'wander':
          return [wanderX, wanderY];
        case 'fog':
          return [
            p.anchorX + Math.sin(t * 0.05 + p.seed * 6) * W * 0.05,
            p.anchorY + Math.sin(t * 0.08 + p.seed * 4) * 18
          ];
        case 'sink':
          return [
            p.anchorX + Math.sin(t * 0.25 + p.seed * 6) * 10 * (1 - order),
            ((p.anchorY + t * 18 + p.seed * 600) % (H + 80)) - 40
          ];
        case 'streak':
          return [
            ((p.anchorX + t * 200 + p.seed * 700) % (W + 160)) - 80,
            p.anchorY + Math.sin(t * 3 + p.seed * 5) * 5
          ];
        case 'flow':
          return [
            ((p.anchorX + t * 60) % (W + 140)) - 70,
            ((p.anchorY + t * 36) % (H + 140)) - 70
          ];
        case 'orbit': {
          const ang = t * (0.22 + p.seed * 0.12) + p.seed * 6.283;
          return [
            W / 2 + Math.cos(ang) * p.orbitR,
            H / 2 + Math.sin(ang) * p.orbitR * 0.62
          ];
        }
        case 'grid': {
          const row = Math.floor(i / cols);
          const col = i % cols;
          const gx = (col + 0.5) * (W / cols);
          const gy = (row + 0.5) * (H / Math.ceil(N / cols));
          return [lerp(wanderX, gx, order), lerp(wanderY, gy, order)];
        }
        case 'reform': {
          const cx = W / 2 + p.clusterX;
          const cy = H / 2 + p.clusterY;
          const k = Math.min(1, order * 0.85 + 0.12);
          return [lerp(wanderX, cx, k), lerp(wanderY, cy, k)];
        }
        default:
          return [wanderX, wanderY];
      }
    }

    function drawOverlay(ov, t, r, g, b) {
      const accent = `rgba(${r | 0},${g | 0},${b | 0},`;
      const zoneTop = H * 0.60;
      const zoneH = H * 0.34;

      if (ov === 'paths') {
        const pathCount = 4;
        for (let k = 0; k < pathCount; k++) {
          const isHero = k === pathCount - 1;
          const yBase = zoneTop + zoneH * (0.08 + k * 0.24);
          ctx.beginPath();
          ctx.moveTo(-20, yBase + Math.sin(t * 0.3 + k) * 10);
          ctx.bezierCurveTo(
            W * 0.33, yBase + Math.sin(t * 0.4 + k * 2) * 26,
            W * 0.66, yBase + Math.cos(t * 0.35 + k * 1.5) * 26,
            W + 20, yBase + Math.cos(t * 0.3 + k) * 10
          );
          ctx.strokeStyle = isHero ? accent + '0.55)' : accent + '0.10)';
          ctx.lineWidth = isHero ? 2.4 : 1;
          ctx.stroke();
        }
      } else if (ov === 'signal') {
        const ax = W * 0.16;
        const ay = zoneTop + zoneH * 0.75;
        const bx = W * 0.84;
        const by = zoneTop + zoneH * 0.2;
        ctx.strokeStyle = accent + '0.18)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.quadraticCurveTo((ax + bx) / 2, zoneTop - 10, bx, by);
        ctx.stroke();

        const cycle = (t * 0.35) % 1;
        const midY = zoneTop - 10;
        const mx = lerp(ax, bx, cycle);
        const my = (1 - cycle) * (1 - cycle) * ay + 2 * (1 - cycle) * cycle * midY + cycle * cycle * by;
        ctx.beginPath();
        ctx.fillStyle = accent + '0.95)';
        ctx.arc(mx, my, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = accent + '0.4)';
        ctx.arc(ax, ay, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = accent + '0.4)';
        ctx.arc(bx, by, 7, 0, Math.PI * 2);
        ctx.fill();
      } else if (ov === 'loop') {
        const loops = [
          [W * 0.26, zoneTop + zoneH * 0.35, 46],
          [W * 0.74, zoneTop + zoneH * 0.65, 38]
        ];
        loops.forEach(([cx, cy, rad], k) => {
          ctx.strokeStyle = accent + '0.16)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cx, cy, rad, 0, Math.PI * 2);
          ctx.stroke();

          const ang = t * (0.6 + k * 0.2);
          const px = cx + Math.cos(ang) * rad;
          const py = cy + Math.sin(ang) * rad;
          ctx.beginPath();
          ctx.fillStyle = accent + '0.9)';
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }

    let animId;
    function animate() {
      const now = performance.now();
      const t = now / 1000;
      const s = stateRef.current;

      s.order = lerp(s.order, s.orderTarget, 0.02);
      const mix = Math.min(1, (now - s.colorStart) / 1200);
      s.currentColor = lerpColor(s.colorFrom, s.colorTo, mix);
      const [r, g, b] = s.currentColor;
      const curAtmo = s.current;
      let order = s.order;
      const influenceR = 160;
      const cType = s.cardType;

      let ampMult = 1, easeMult = 1, orderMod = 0, alphaMult = 1;
      const reactionElapsed = now - s.reactionStart;
      const reactionWindow = 1700;
      if (s.reactionType && reactionElapsed < reactionWindow) {
        const decay = 1 - (reactionElapsed / reactionWindow);
        switch (s.reactionType) {
          case 'freeze':
            easeMult = lerp(1, 0.06, decay);
            break;
          case 'break':
            orderMod = -0.4 * decay;
            ampMult = lerp(1, 1.6, decay);
            break;
          case 'noise':
            ampMult = lerp(1, 2.3, decay);
            break;
          case 'stabilize':
            orderMod = 0.35 * decay;
            break;
          case 'dim':
            alphaMult = lerp(1, 0.55, decay);
            break;
          default:
            break;
        }
      }
      order = Math.max(0, Math.min(1, order + orderMod));

      const portalElapsed = now - s.portalStart;
      const portalWindow = 480;
      const portalPull = portalElapsed < portalWindow ? (1 - portalElapsed / portalWindow) * 0.5 : 0;

      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        let [tx, ty] = computeTarget(p, curAtmo, order, t, i, ampMult);

        if (cType === 'definition' || s.focusFlag) {
          tx = lerp(tx, W * 0.5, 0.3);
          ty = lerp(ty, H * 0.38, 0.3);
        }

        if (portalPull > 0) {
          tx = lerp(tx, W / 2, portalPull);
          ty = lerp(ty, H / 2, portalPull);
        }

        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < influenceR && dist > 0.001) {
            const f = 1 - dist / influenceR;
            if (curAtmo.polarity === 'repel') {
              tx -= dx * f * 0.6;
              ty -= dy * f * 0.6;
            } else if (curAtmo.polarity === 'attract') {
              tx += dx * f * 0.5;
              ty += dy * f * 0.5;
            } else if (curAtmo.polarity === 'attractSoft') {
              tx += dx * f * 0.22;
              ty += dy * f * 0.22;
            } else if (curAtmo.polarity === 'swirl') {
              const perpX = -dy;
              const perpY = dx;
              const norm = Math.hypot(perpX, perpY) || 1;
              tx += (perpX / norm) * f * 36;
              ty += (perpY / norm) * f * 36;
            }
          }
        }

        const ease = 0.045 * easeMult;
        p.x += (tx - p.x) * ease;
        p.y += (ty - p.y) * ease;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${(0.48 * alphaMult).toFixed(3)})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (cType === 'situation') {
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const q = particles[(i + 7) % particles.length];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 190) {
            const flicker = (Math.sin(t * 1.3 + p.seed * 4) + 1) / 2;
            if (flicker > 0.72) {
              ctx.strokeStyle = `rgba(${r | 0},${g | 0},${b | 0},${(flicker - 0.72) * 0.5})`;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.stroke();
            }
          }
        }
      }

      if (order > 0.45 && s.reactionType !== 'break') {
        const thresh = 115;
        const lineAlpha = (order - 0.45) / 0.55;
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const d = Math.hypot(dx, dy);
            if (d < thresh) {
              ctx.strokeStyle = `rgba(${r | 0},${g | 0},${b | 0},${(1 - d / thresh) * lineAlpha * 0.16})`;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      if (cType === 'practice' && s.overlay && s.overlay !== 'none') {
        drawOverlay(s.overlay, t, r, g, b);
      }

      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none w-screen h-screen"
    />
  );
}
