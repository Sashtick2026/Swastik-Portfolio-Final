import { useEffect, useRef } from "react";

export default function ContactBackground() {
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

      time += 0.005;

      // Draw 3 layers of glowing waves
      const waves = [
        {
          amplitude: 45,
          frequency: 0.003,
          speed: 0.015,
          color: "rgba(123, 46, 255, 0.06)",
          yOffset: height * 0.55,
        },
        {
          amplitude: 30,
          frequency: 0.005,
          speed: -0.01,
          color: "rgba(168, 85, 247, 0.04)",
          yOffset: height * 0.62,
        },
        {
          amplitude: 55,
          frequency: 0.002,
          speed: 0.008,
          color: "rgba(123, 46, 255, 0.03)",
          yOffset: height * 0.48,
        },
      ];

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 10) {
          // Combination of primary and secondary sine waves for complex organic motion
          const y =
            wave.yOffset +
            Math.sin(x * wave.frequency + time * wave.speed * 10) * wave.amplitude +
            Math.cos(x * 0.001 - time * 0.2) * 12;

          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, wave.yOffset - 100, 0, height);
        grad.addColorStop(0, wave.color);
        grad.addColorStop(1, "rgba(5, 5, 5, 0.5)");

        ctx.fillStyle = grad;
        ctx.fill();
      });

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
      id="contact-bg-canvas"
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
