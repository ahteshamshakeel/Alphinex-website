'use client';

import { useState, useEffect } from 'react';

interface Testimonial {
  id: string;
  clientName: string;
  company?: string;
  message: string;
  rating: number;
  photoUrl?: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10s
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Show 3 cards at a time on desktop, 1 on mobile
  const getVisibleTestimonials = () => {
    if (testimonials.length <= 3) return testimonials;
    
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push(testimonials[index]);
    }
    return visible;
  };

  if (testimonials.length === 0) {
    return <p className="text-center text-gray-500">No testimonials added yet.</p>;
  }

  return (
    <div className="relative px-8 md:px-16">
      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {/* Mobile: Show only current testimonial */}
        <div className="md:hidden">
          <TestimonialCard testimonial={testimonials[currentIndex]} />
        </div>

        {/* Desktop: Show 3 testimonials */}
        <div className="hidden md:contents">
          {getVisibleTestimonials().map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {testimonials.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 z-10 hover:scale-110"
            aria-label="Previous testimonial"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 z-10 hover:scale-110"
            aria-label="Next testimonial"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-8'
                  : 'bg-gray-600 hover:bg-gray-500 w-3'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Auto-play indicator */}
      {testimonials.length > 1 && isAutoPlaying && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-400 text-xs">Auto-playing</span>
        </div>
      )}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="group p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
      <div className="flex items-center mb-4">
        {testimonial.photoUrl ? (
          <img
            src={testimonial.photoUrl}
            alt={testimonial.clientName}
            className="w-16 h-16 rounded-full mr-4 ring-2 ring-purple-500/30"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 mr-4 flex items-center justify-center text-white text-xl font-bold">
            {testimonial.clientName.charAt(0)}
          </div>
        )}
        <div>
          <h3 className="font-bold text-white">{testimonial.clientName}</h3>
          {testimonial.company && <p className="text-sm text-gray-400">{testimonial.company}</p>}
        </div>
      </div>
      <div className="flex mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <span key={i} className="text-yellow-400">
            ★
          </span>
        ))}
      </div>
      <p className="text-gray-300">{testimonial.message}</p>
    </div>
  );
}
