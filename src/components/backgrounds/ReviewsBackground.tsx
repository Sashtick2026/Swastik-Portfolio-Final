import { useEffect, useRef } from "react";

export default function ReviewsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationId: number;
    let time = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      time += 0.008;

      // Center of the sphere
      const cx = width / 2;
      const cy = height / 2;
      // Adjust sphere base radius based on viewport
      const baseRadius = Math.min(width, height) * 0.28;

      ctx.save();
      ctx.globalCompositeOperation = "screen";

      // Draw three overlapping morphing fields for beautiful multi-chromatic glow depth
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        const layerTime = time + layer * 1.5;
        const numPoints = 120;

        for (let i = 0; i <= numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2;
          
          // Combine multiple harmonic frequencies for a fluid, natural morphing effect
          const offset = 
            Math.sin(angle * 4 + layerTime * 1.5) * 15 +
            Math.cos(angle * 7 - layerTime * 0.8) * 10 +
            Math.sin(angle * 2 + layerTime * 2.2) * 20;

          const r = baseRadius + offset - (layer * 20);
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.closePath();

        // High-end glowing gradient for each overlapping sphere layer
        const sphereGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 1.3);
        if (layer === 0) {
          sphereGlow.addColorStop(0, "rgba(123, 46, 255, 0.25)");
          sphereGlow.addColorStop(0.5, "rgba(168, 85, 247, 0.12)");
          sphereGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
        } else if (layer === 1) {
          sphereGlow.addColorStop(0, "rgba(168, 85, 247, 0.20)");
          sphereGlow.addColorStop(0.6, "rgba(123, 46, 255, 0.08)");
          sphereGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
        } else {
          sphereGlow.addColorStop(0, "rgba(139, 92, 246, 0.15)");
          sphereGlow.addColorStop(0.7, "rgba(123, 46, 255, 0.05)");
          sphereGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
        }

        ctx.fillStyle = sphereGlow;
        ctx.fill();
      }

      ctx.restore();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      id="reviews-bg-canvas"
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
