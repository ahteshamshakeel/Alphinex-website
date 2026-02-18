'use client';

import { useEffect, useRef } from 'react';

interface AnimatedHeaderProps {
  title: string;
  description: string;
}

export default function AnimatedHeader({ title, description }: AnimatedHeaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || 400;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(96, 165, 250, 0.4)';
        ctx.fill();

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <section className="relative pt-32 pb-8 overflow-hidden min-h-[50vh] flex items-center">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full filter blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-8 text-white">{title}</h1>
        <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto">
          {description}
        </p>
      </div>
    </section>
  );
}
