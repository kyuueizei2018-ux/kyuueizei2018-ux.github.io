import { useEffect, useRef } from "react";
import "./BinaryOrbits.css";

const TAU = Math.PI * 2;

const TINTS = [
  [255, 226, 188],
  [255, 184, 132],
  [255, 128, 112],
  [190, 214, 255],
];

const seededRandom = (seed) => {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const makeGlowSprite = (tint) => {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const center = size / 2;
  const glow = ctx.createRadialGradient(center, center, 0, center, center, center);
  glow.addColorStop(0, "rgba(255, 250, 240, 0.95)");
  glow.addColorStop(0.09, `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, 0.95)`);
  glow.addColorStop(0.34, `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, 0.35)`);
  glow.addColorStop(1, `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, 0)`);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);
  return canvas;
};

const makeFlareSprite = () => {
  const width = 256;
  const height = 16;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const flare = ctx.createLinearGradient(0, 0, width, 0);
  flare.addColorStop(0, "rgba(255, 235, 210, 0)");
  flare.addColorStop(0.5, "rgba(255, 241, 222, 1)");
  flare.addColorStop(1, "rgba(255, 235, 210, 0)");
  ctx.fillStyle = flare;
  ctx.fillRect(0, 0, width, height);
  return canvas;
};

const makeCoreSprite = () => {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const center = size / 2;
  const core = ctx.createRadialGradient(center, center, 0, center, center, center);
  core.addColorStop(0, "rgba(255, 244, 222, 0.52)");
  core.addColorStop(0.26, "rgba(234, 217, 180, 0.26)");
  core.addColorStop(0.7, "rgba(185, 104, 61, 0.09)");
  core.addColorStop(1, "rgba(185, 104, 61, 0)");
  ctx.fillStyle = core;
  ctx.fillRect(0, 0, size, size);
  return canvas;
};

function BinaryOrbits({
  starSize = 1,
  twist = 3,
  core = 1,
  speed = 1,
  twinkle = 0.4,
  className = "",
  style,
}) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const configRef = useRef({ starSize, twist, core, speed, twinkle });
  configRef.current = { starSize, twist, core, speed, twinkle };

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!wrap || !canvas || !ctx) return undefined;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const random = seededRandom(20261102);
    const stars = Array.from({ length: 190 }, () => {
      const tint = TINTS[Math.floor(random() * TINTS.length)];
      return {
        x: random(),
        y: random(),
        radius: 0.35 + random() * 1.35,
        alpha: 0.12 + random() * 0.46,
        phase: random() * TAU,
        cadence: 0.3 + random() * 0.9,
        tint,
        color: `rgb(${tint[0]}, ${tint[1]}, ${tint[2]})`,
      };
    });
    const twinkleStars = stars.slice(0, 34);
    const dust = Array.from({ length: 88 }, (_, index) => ({
      phase: (index / 88) * TAU + random() * 0.1,
      scale: 0.94 + random() * 0.16,
      size: 0.45 + random() * 1.15,
      alpha: 0.12 + random() * 0.3,
      cadence: 0.4 + random() * 0.8,
    }));

    const glowA = makeGlowSprite([255, 205, 154]);
    const glowB = makeGlowSprite([255, 116, 100]);
    const flareSprite = makeFlareSprite();
    const coreSprite = makeCoreSprite();

    let width = 1;
    let height = 1;
    let dpr = 1;
    let frame = 0;
    let time = 0;
    let lastDraw = 0;
    let visible = true;
    let staticLayer;
    let staticCtx;

    const drawStatic = () => {
      if (!staticLayer || !staticCtx) return;
      const { core: centerScale } = configRef.current;
      const min = Math.min(width, height);
      const cx = width * 0.7;
      const cy = height * 0.37;
      const a = min * 0.235;
      const b = a * 0.34;
      const rotation = configRef.current.twist;

      staticCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      staticCtx.clearRect(0, 0, width, height);
      staticCtx.globalCompositeOperation = "lighter";

      const nebula = staticCtx.createRadialGradient(cx, cy, 0, cx, cy, min * 0.92);
      nebula.addColorStop(0, "rgba(199, 74, 82, 0.24)");
      nebula.addColorStop(0.32, "rgba(185, 104, 61, 0.13)");
      nebula.addColorStop(0.66, "rgba(142, 52, 52, 0.07)");
      nebula.addColorStop(1, "rgba(142, 52, 52, 0)");
      staticCtx.fillStyle = nebula;
      staticCtx.fillRect(0, 0, width, height);

      const haze = staticCtx.createRadialGradient(
        cx + min * 0.2,
        cy - min * 0.12,
        0,
        cx + min * 0.2,
        cy - min * 0.12,
        min * 0.46,
      );
      haze.addColorStop(0, "rgba(234, 217, 180, 0.08)");
      haze.addColorStop(1, "rgba(234, 217, 180, 0)");
      staticCtx.fillStyle = haze;
      staticCtx.fillRect(0, 0, width, height);

      for (const star of stars) {
        staticCtx.fillStyle = star.color;
        staticCtx.globalAlpha = star.alpha * 0.7;
        staticCtx.beginPath();
        staticCtx.arc(star.x * width, star.y * height, star.radius, 0, TAU);
        staticCtx.fill();
      }
      staticCtx.globalAlpha = 1;

      for (const [scale, alpha] of [
        [1, 0.32],
        [1.24, 0.17],
        [1.5, 0.1],
      ]) {
        staticCtx.save();
        staticCtx.translate(cx, cy);
        staticCtx.rotate(rotation);
        staticCtx.beginPath();
        staticCtx.ellipse(0, 0, a * scale, b * scale, 0, 0, TAU);
        staticCtx.strokeStyle = `rgba(255, 172, 130, ${alpha * (0.6 + centerScale * 0.4)})`;
        staticCtx.lineWidth = 0.8;
        staticCtx.stroke();
        staticCtx.restore();
      }

      staticCtx.globalCompositeOperation = "source-over";
      staticCtx.setTransform(1, 0, 0, 1, 0, 0);
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);

      let nextDpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const pixels = width * height;
      if (pixels > 2_200_000) {
        nextDpr = Math.min(nextDpr, Math.sqrt(2_200_000 / pixels));
      }
      dpr = Math.max(0.6, nextDpr);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      if (!staticLayer) {
        staticLayer = document.createElement("canvas");
        staticCtx = staticLayer.getContext("2d");
      }
      staticLayer.width = canvas.width;
      staticLayer.height = canvas.height;

      drawStatic();
      if (reduce) {
        draw();
      } else {
        wake();
      }
    };

    const draw = () => {
      const {
        starSize: size,
        twist: tilt,
        core: centerScale,
        speed: pace,
        twinkle: blink,
      } = configRef.current;
      const min = Math.min(width, height);
      const cx = width * 0.7;
      const cy = height * 0.37;
      const a = min * 0.235;
      const b = a * 0.34;
      const rotation = tilt;
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);
      const angle = time * 0.22 * pace;
      const orbitPoint = (theta, scale = 1) => {
        const x = Math.cos(theta) * a * scale;
        const y = Math.sin(theta) * b * scale;
        return { x: cx + x * cos - y * sin, y: cy + x * sin + y * cos };
      };

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(staticLayer, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // A small dynamic layer keeps the starfield alive without repainting all 190 stars.
      for (const star of twinkleStars) {
        const shimmer = 0.55 + 0.45 * Math.sin(time * star.cadence + star.phase) * blink;
        ctx.globalAlpha = Math.min(0.8, star.alpha * (0.2 + shimmer * 0.45));
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.radius, 0, TAU);
        ctx.fill();
      }

      ctx.fillStyle = "rgb(255, 190, 143)";
      for (const mote of dust) {
        const point = orbitPoint(angle + mote.phase, mote.scale);
        const shimmer = 0.5 + 0.5 * Math.sin(time * mote.cadence + mote.phase * 3.1);
        ctx.globalAlpha = mote.alpha * (0.5 + shimmer * 0.7);
        ctx.beginPath();
        ctx.arc(point.x, point.y, mote.size, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const drawTrail = (head, tint) => {
        const steps = 32;
        const span = 0.72;
        ctx.lineWidth = 1.5;
        for (let i = 0; i < steps; i += 1) {
          const theta0 = head - span * (1 - i / steps);
          const theta1 = head - span * (1 - (i + 1) / steps);
          const start = orbitPoint(theta0);
          const end = orbitPoint(theta1);
          const strength = Math.pow(i / steps, 1.8) * 0.85;
          ctx.strokeStyle = `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, ${strength})`;
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
        }
      };

      const drawStar = (point, tint, sprite, intensity) => {
        const radius = 2.2 + size * 2;
        const glowRadius = radius * (18 + size * 5);
        ctx.globalAlpha = intensity;
        ctx.drawImage(sprite, point.x - glowRadius, point.y - glowRadius, glowRadius * 2, glowRadius * 2);
        ctx.globalAlpha = 1;

        ctx.fillStyle = `rgba(255, 252, 246, ${0.96 * intensity})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, TAU);
        ctx.fill();

        const flare = 34 + size * 26;
        ctx.globalAlpha = 0.48 * intensity;
        ctx.drawImage(flareSprite, point.x - flare, point.y - 0.7, flare * 2, 1.4);
        ctx.save();
        ctx.translate(point.x, point.y);
        ctx.rotate(Math.PI / 2);
        ctx.globalAlpha = 0.26 * intensity;
        ctx.drawImage(flareSprite, -flare * 0.7, -0.6, flare * 1.4, 1.2);
        ctx.restore();
        ctx.globalAlpha = 1;
      };

      const headA = angle;
      const headB = angle + Math.PI;
      const starA = orbitPoint(headA);
      const starB = orbitPoint(headB);
      const pulseA = 0.82 + 0.18 * Math.sin(time * 1.1) * blink;
      const pulseB = 0.82 + 0.18 * Math.sin(time * 0.9 + 2.4) * blink;

      drawTrail(headA, [255, 205, 154]);
      drawTrail(headB, [255, 116, 100]);

      drawStar(starA, [255, 205, 154], glowA, pulseA);
      drawStar(starB, [255, 116, 100], glowB, pulseB);

      const coreRadius = (32 + min * 0.06) * centerScale;
      ctx.globalAlpha = centerScale;
      ctx.drawImage(coreSprite, cx - coreRadius, cy - coreRadius, coreRadius * 2, coreRadius * 2);
      ctx.globalAlpha = 1;

      ctx.fillStyle = `rgba(255, 248, 232, ${0.6 * centerScale})`;
      ctx.beginPath();
      ctx.arc(cx, cy, 2 + 1.6 * centerScale, 0, TAU);
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (now) => {
      frame = 0;
      if (!visible || document.hidden) return;
      if (now - lastDraw < 1000 / 30) {
        frame = window.requestAnimationFrame(loop);
        return;
      }
      const delta = lastDraw ? Math.min((now - lastDraw) / 1000, 0.1) : 1 / 30;
      lastDraw = now;
      time += delta;
      draw();
      frame = window.requestAnimationFrame(loop);
    };

    function wake() {
      if (!frame && visible && !document.hidden) {
        lastDraw = 0;
        frame = window.requestAnimationFrame(loop);
      }
    }

    const onVisibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frame);
        frame = 0;
        lastDraw = 0;
      } else {
        wake();
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrap);
    const intersection = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        if (visible) wake();
      },
      { threshold: 0 },
    );
    intersection.observe(wrap);
    document.addEventListener("visibilitychange", onVisibility);
    resize();

    return () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`binary-orbits${className ? ` ${className}` : ""}`} style={style}>
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}

export default BinaryOrbits;
