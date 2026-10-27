"use client";

import { useEffect, useRef } from "react";

// Colours as "r, g, b" so alpha can change per line
const LINE = "112, 128, 255";
const DOT = "176, 232, 255";

const TILT = 0.4; // how far the sphere leans toward you
const sT = Math.sin(TILT);
const cT = Math.cos(TILT);

// Geometry on a unit sphere, built once. Each frame only rotates and draws it.
const POLYLINES = (() => {
  const out = [];
  // latitude rings
  for (let lat = -75; lat <= 75; lat += 15) {
    const phi = (lat * Math.PI) / 180;
    const pts = [];
    for (let lon = 0; lon <= 360; lon += 6) {
      const lam = (lon * Math.PI) / 180;
      pts.push([Math.cos(phi) * Math.cos(lam), Math.sin(phi), Math.cos(phi) * Math.sin(lam)]);
    }
    out.push(pts);
  }
  // longitude lines
  for (let lon = 0; lon < 360; lon += 22.5) {
    const lam = (lon * Math.PI) / 180;
    const pts = [];
    for (let lat = -90; lat <= 90; lat += 6) {
      const phi = (lat * Math.PI) / 180;
      pts.push([Math.cos(phi) * Math.cos(lam), Math.sin(phi), Math.cos(phi) * Math.sin(lam)]);
    }
    out.push(pts);
  }
  return out;
})();

// Evenly spread glowing points (fibonacci sphere)
const DOTS = Array.from({ length: 240 }, (_, i) => {
  const k = (i + 0.5) / 240;
  const phi = Math.acos(1 - 2 * k);
  const lam = Math.PI * (1 + Math.sqrt(5)) * i;
  return [Math.sin(phi) * Math.cos(lam), Math.cos(phi), Math.sin(phi) * Math.sin(lam)];
});

export default function HologramSphere({ className = "" }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let cx = 0;
    let cy = 0;
    let R = 0;
    let theta = 0.6; // current spin angle
    let raf = 0;
    let last = 0;
    let running = false;
    let visible = true;

    // rotate around Y by (c, s), lean by TILT, then apply a little perspective
    function proj(x, y, z, c, s) {
      const xr = x * c + z * s;
      const zr = -x * s + z * c;
      const yr = y * cT - zr * sT;
      const zz = y * sT + zr * cT;
      const k = 1 / (1 - zz * 0.2);
      return [cx + xr * R * k, cy - yr * R * k, zz];
    }

    function draw(time) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      cx = w / 2;
      cy = h * 0.47;
      R = Math.min(w * 0.36, h * 0.34);

      const flick = reduce ? 1 : 0.95 + 0.05 * Math.sin(time / 260);
      const c = Math.cos(theta);
      const s = Math.sin(theta);
      const fy = cy + R * 1.32; // floor under the sphere

      // light cone from the floor up into the sphere
      const beam = ctx.createLinearGradient(0, fy, 0, cy);
      beam.addColorStop(0, `rgba(${LINE}, ${0.16 * flick})`);
      beam.addColorStop(1, `rgba(${LINE}, 0)`);
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(cx - R * 1.0, fy);
      ctx.lineTo(cx - R * 0.6, cy + R * 0.3);
      ctx.lineTo(cx + R * 0.6, cy + R * 0.3);
      ctx.lineTo(cx + R * 1.0, fy);
      ctx.closePath();
      ctx.fill();

      // soft pool of light on the floor
      ctx.save();
      ctx.translate(cx, fy);
      ctx.scale(1, 0.22);
      const pool = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 1.35);
      pool.addColorStop(0, `rgba(${LINE}, 0.38)`);
      pool.addColorStop(1, `rgba(${LINE}, 0)`);
      ctx.fillStyle = pool;
      ctx.beginPath();
      ctx.arc(0, 0, R * 1.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // projector rings
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${LINE}, 0.55)`;
      ctx.beginPath();
      ctx.ellipse(cx, fy, R * 1.0, R * 0.22, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = `rgba(${LINE}, 0.25)`;
      ctx.beginPath();
      ctx.ellipse(cx, fy, R * 1.25, R * 0.28, 0, 0, Math.PI * 2);
      ctx.stroke();

      // sphere body
      const body = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R * 1.05);
      body.addColorStop(0, `rgba(${LINE}, 0.16)`);
      body.addColorStop(1, `rgba(${LINE}, 0.02)`);
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.02, 0, Math.PI * 2);
      ctx.fill();

      // grid lines: brighter on the front, faint on the back
      for (const poly of POLYLINES) {
        let prev = null;
        for (const p of poly) {
          const q = proj(p[0], p[1], p[2], c, s);
          if (prev) {
            const depth = (q[2] + prev[2]) / 2;
            const a = (0.06 + 0.5 * ((depth + 1) / 2)) * flick;
            ctx.strokeStyle = `rgba(${LINE}, ${a.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(prev[0], prev[1]);
            ctx.lineTo(q[0], q[1]);
            ctx.stroke();
          }
          prev = q;
        }
      }

      // glowing points
      ctx.shadowColor = `rgba(${DOT}, 0.9)`;
      ctx.shadowBlur = 6;
      for (const d of DOTS) {
        const q = proj(d[0], d[1], d[2], c, s);
        const t = (q[2] + 1) / 2;
        ctx.fillStyle = `rgba(${DOT}, ${(0.12 + 0.88 * t * t).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(q[0], q[1], 0.6 + 1.6 * t, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // rim
      ctx.strokeStyle = `rgba(${LINE}, 0.4)`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.02, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1;

      // scan band sweeping down through the sphere
      const sy = cy - R + ((time / 2600) % 1) * 2 * R;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.02, 0, Math.PI * 2);
      ctx.clip();
      const band = ctx.createLinearGradient(0, sy - 22, 0, sy + 22);
      band.addColorStop(0, `rgba(${DOT}, 0)`);
      band.addColorStop(0.5, `rgba(${DOT}, 0.2)`);
      band.addColorStop(1, `rgba(${DOT}, 0)`);
      ctx.fillStyle = band;
      ctx.fillRect(cx - R, sy - 22, R * 2, 44);
      ctx.restore();

      // dashed orbit ring tilted around the sphere
      const SEG = 90;
      const off = -theta * 2.2;
      const zeta = 0.45;
      const cz = Math.cos(zeta);
      const sz = Math.sin(zeta);
      for (let i = 0; i < SEG; i++) {
        if (i % 3 === 2) continue;
        const a0 = off + (i / SEG) * Math.PI * 2;
        const a1 = off + ((i + 1) / SEG) * Math.PI * 2;
        const x0 = 1.32 * Math.cos(a0);
        const x1 = 1.32 * Math.cos(a1);
        const p0 = proj(x0 * cz, x0 * sz, 1.32 * Math.sin(a0), 1, 0);
        const p1 = proj(x1 * cz, x1 * sz, 1.32 * Math.sin(a1), 1, 0);
        const a = (0.1 + 0.55 * (((p0[2] + p1[2]) / 2 + 1) / 2)) * flick;
        ctx.strokeStyle = `rgba(${DOT}, ${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(p0[0], p0[1]);
        ctx.lineTo(p1[0], p1[1]);
        ctx.stroke();
      }
    }

    function frame(now) {
      if (!running) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      theta += dt * 0.45;
      draw(now);
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running || reduce) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function resize() {
      const r = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      draw(performance.now());
    }

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // only animate while on screen and the tab is open
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden) start();
      else stop();
    });
    io.observe(wrap);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label="Rotating hologram sphere"
      className={`absolute inset-0 ${className}`}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
