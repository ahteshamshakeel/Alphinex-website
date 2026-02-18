'use client';

import { useState } from 'react';
import ContactModal from './ContactModal';

const services = [
  {
    title: 'AI Web Development',
    description: 'AI-powered web applications with intelligent features using React, Next.js, and machine learning.',
    features: ['AI-Driven Design', 'Smart SEO Optimization', 'Auto Performance Tuning', 'Intelligent API Integration'],
  },
  {
    title: 'AI Mobile Development',
    description: 'Intelligent mobile apps with AI capabilities for iOS and Android platforms.',
    features: ['AI-Powered Features', 'Smart Notifications', 'Predictive Analytics', 'ML Model Integration'],
  },
  {
    title: 'AI Cloud Solutions',
    description: 'Intelligent cloud infrastructure with AI-driven scaling and optimization.',
    features: ['AI Auto-Scaling', 'Smart DevOps', 'Predictive Monitoring', 'ML Pipeline Deployment'],
  },
  {
    title: 'AI Video Editing',
    description: 'AI-powered video editing with automated enhancements for all content types.',
    features: ['AI Auto-Editing', 'Smart Transitions', 'AI Color Grading', 'Auto Captions', 'Content Optimization', 'AI Scene Detection'],
  },
  {
    title: 'AI Automation',
    description: 'Intelligent workflow automation powered by AI to revolutionize your business processes.',
    features: ['AI-Driven Workflows', 'Smart Integrations', 'Predictive Automation', 'ML-Based Optimization', 'Intelligent Routing', 'Auto-Learning Systems'],
  },
  {
    title: 'AI UI/UX Design',
    description: 'AI-enhanced design that predicts user behavior and optimizes experiences.',
    features: ['AI User Research', 'Smart Wireframing', 'Predictive Prototyping', 'Adaptive Design Systems'],
  },
  {
    title: 'AI Consulting',
    description: 'AI strategy consulting and intelligent architecture planning for your projects.',
    features: ['AI Tech Stack Selection', 'ML Architecture Design', 'AI Code Review', 'Intelligent Best Practices'],
  },
  {
    title: 'AI-Powered Support',
    description: 'Intelligent maintenance with AI-driven monitoring and predictive issue resolution.',
    features: ['AI Bug Detection', 'Smart Updates', 'Predictive Monitoring', 'AI-Powered 24/7 Support'],
  },
];

export default function ServicesSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const handleServiceClick = (serviceName: string) => {
    setSelectedService(serviceName);
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="relative py-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4 text-white">AI-Powered Solutions</h2>
          <p className="text-xl text-center text-gray-400 mb-12 max-w-3xl mx-auto">
            Intelligent technology solutions powered by AI to transform your business operations.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/50 transition-all duration-300 flex flex-col">
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 mb-6">{service.description}</p>
                <ul className="space-y-2 mb-6 flex-grow">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <span className="text-blue-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleServiceClick(service.title)}
                  className="w-full px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-white font-bold rounded-xl transition-all duration-300 hover:scale-110 border border-blue-500/30"
                >
                  I Want This
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        serviceName={selectedService}
      />
    </>
  );
}
