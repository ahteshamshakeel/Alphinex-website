'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import ContactModal from './ContactModal';

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [email, setEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden pb-8 pt-20">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full filter blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          
          {/* Left Content - Takes 3 columns */}
          <div className="lg:col-span-3 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-blue-300 text-sm font-medium">Lightning-Fast Delivery • 24/7 Development</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-white">Scale Your Business</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Like Never Before
              </span>
            </h1>
            
            <p className="text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed">
              Get your <span className="text-blue-400 font-bold">professional website in just 24 hours</span> with AI-powered development that never sleeps. Cut costs, boost efficiency, and delegate the technical work to experts who deliver results at lightning speed.
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-2xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-6 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 backdrop-blur-sm"
                  />
                  <div className="validation-message">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Please enter a valid email address</span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-white font-bold rounded-xl transition-all duration-300 hover:scale-110 border border-blue-500/30"
                >
                  Let's Make
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">24hrs</div>
                <div className="text-xs md:text-sm text-gray-400">Website Delivery</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">98%</div>
                <div className="text-xs md:text-sm text-gray-400">Client Satisfaction</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-xs md:text-sm text-gray-400">Support Available</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image - Takes 2 columns */}
          <div className="lg:col-span-2 relative hidden lg:block h-[500px]">
            <div className="relative w-full h-full flex items-center justify-center">
              
              {/* Hero Image Container */}
              <div className="relative w-full max-w-[700px] h-full">
                {/* Background Glow Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg blur-3xl"></div>
                <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                
                {/* Main Image */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="relative w-full h-full animate-float">
                    <Image 
                      src="/hero-image.png" 
                      alt="AI Technology" 
                      fill
                      className="object-contain"
                      priority
                      quality={100}
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 700px"
                    />
                  </div>
                </div>

                {/* Floating Sparkles Around Image */}
                {[...Array(20)].map((_, i) => {
                  const angle = (i * 18) * (Math.PI / 180);
                  const radius = 280 + (i % 3) * 30;
                  const x = 350 + Math.cos(angle) * radius;
                  const y = 300 + Math.sin(angle) * radius;
                  const delay = i * 0.15;
                  
                  return (
                    <div
                      key={i}
                      className="absolute w-1.5 h-1.5"
                      style={{
                        left: `${x}px`,
                        top: `${y}px`,
                        animation: `sparkle 3s ease-in-out infinite`,
                        animationDelay: `${delay}s`,
                      }}
                    >
                      <div className="w-full h-full bg-cyan-400 rounded-full shadow-lg shadow-cyan-500/50"></div>
                    </div>
                  );
                })}

                {/* Orbiting Elements */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                  <div className="absolute top-0 left-1/2 w-3 h-3 bg-cyan-400 rounded-full -translate-x-1/2 shadow-lg shadow-cyan-500/50"></div>
                </div>
                <div className="absolute inset-12 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                  <div className="absolute top-1/2 right-0 w-3 h-3 bg-purple-400 rounded-full translate-x-1/2 -translate-y-1/2 shadow-lg shadow-purple-500/50"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        prefilledEmail={email}
      />
    </section>
  );
}
