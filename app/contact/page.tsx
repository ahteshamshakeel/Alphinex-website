'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AnimatedHeader from '@/components/AnimatedHeader';

function ContactForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const nameParam = searchParams.get('name');
    const subjectParam = searchParams.get('subject');
    
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
    if (nameParam) {
      setFormData(prev => ({ ...prev, name: nameParam }));
    }
    if (subjectParam) {
      setFormData(prev => ({ ...prev, subject: subjectParam }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        setTimeout(() => {
          setStatus('');
        }, 8000); // Hide message after 8 seconds
      } else {
        setStatus('error');
        setTimeout(() => {
          setStatus('');
        }, 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setTimeout(() => {
        setStatus('');
      }, 5000);
    }
  };

  return (
    <main className="bg-gradient-to-b from-[#0a0a0f] via-[#0f1420] to-[#0a0a0f]">
      <Navbar />
      
      <AnimatedHeader 
        title="Get In Touch"
        description="Have a project in mind? Let's discuss how we can help bring your ideas to life."
      />

      <section className="relative py-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-40 right-40 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-40 left-40 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8">
            
            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Contact Card */}
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300">
                <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Email</h4>
                      <p className="text-gray-400 text-sm">alphinexsolutions@gmail.com</p>
                      <p className="text-gray-400 text-sm">suleman@alphinex.com</p>
                      <p className="text-gray-400 text-sm">nouman@alphinex.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Phone</h4>
                      <p className="text-gray-400 text-sm">+92 325 3028856</p>
                      <p className="text-gray-400 text-sm">+92 306 4212632</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Locations</h4>
                      <p className="text-gray-400 text-sm mb-2">
                        <span className="text-white font-medium">USA:</span> 8 The Green, Suite A, Dover, Delaware
                      </p>
                      <p className="text-gray-400 text-sm">
                        <span className="text-white font-medium">Pakistan:</span> Office# 13, 2nd Floor, Ali Arcade, 6th Road, Rawalpindi
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links Card */}
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300">
                <h3 className="text-2xl font-bold text-white mb-6">Follow Us</h3>
                <div className="flex gap-4">
                  <a 
                    href="https://facebook.com/alphinexsolutions/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-600/20 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 group"
                  >
                    <svg className="w-6 h-6 text-blue-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://www.linkedin.com/company/alphinex-solutions/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-600/20 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 group"
                  >
                    <svg className="w-6 h-6 text-blue-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://github.com/alphinex/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-purple-600/20 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 group"
                  >
                    <svg className="w-6 h-6 text-purple-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Response Time Card */}
              <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h4 className="text-white font-semibold">Quick Response</h4>
                </div>
                <p className="text-gray-300 text-sm">We typically respond within 24 hours on business days.</p>
              </div>

              {/* WhatsApp Card */}
              <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300">
                <h3 className="text-2xl font-bold text-white mb-4">Chat on WhatsApp</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Prefer instant messaging? Connect with us directly on WhatsApp for quick responses.
                </p>
                <a 
                  href="https://wa.me/923253028856" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full px-6 py-3 bg-green-600/20 hover:bg-green-600/30 text-white font-bold rounded-xl transition-all duration-300 hover:scale-110 border border-green-500/30 flex items-center justify-center gap-2 group"
                >
                  <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Chat Now
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3 relative">
              <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300">
                <h3 className="text-3xl font-bold text-white mb-6">Send Us a Message</h3>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                      Your Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300"
                        placeholder="John Doe"
                      />
                      <div className="validation-message">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Please enter your name</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300"
                        placeholder="john@example.com"
                      />
                      <div className="validation-message">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Please enter a valid email address</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-300 mb-2">
                    Subject *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300"
                      placeholder="How can we help you?"
                    />
                    <div className="validation-message">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Please enter a subject</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300 resize-none"
                    placeholder="Tell us about your project, requirements, or any questions you have..."
                  />
                  <div className="validation-message">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Please enter your message</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group w-full px-8 py-4 bg-blue-600/20 hover:bg-blue-600/30 text-white font-bold rounded-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 border border-blue-500/30"
                >
                  {status === 'sending' ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

            
              

              {/* Success Message Overlay */}
              {status === 'success' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl z-10 animate-in fade-in duration-300">
                  <div className="max-w-md mx-4 p-8 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-green-500/50 rounded-2xl shadow-2xl shadow-green-500/20">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-green-400 mb-3">Thank You for Reaching Out!</h3>
                      <p className="text-green-300 text-lg leading-relaxed">
                        Thanks for providing your details. Our experts will get back to you within 24 hours. We're excited to discuss your project!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message Overlay */}
              {status === 'error' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl z-10 animate-in fade-in duration-300">
                  <div className="max-w-md mx-4 p-8 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-red-500/50 rounded-2xl shadow-2xl shadow-red-500/20">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-red-400 mb-3">Oops! Something went wrong</h3>
                      <p className="text-red-300 text-lg leading-relaxed">
                        We couldn't send your message. Please try again or contact us directly at alphinexsolutions@gmail.com
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-20 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-20 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div>
                <Link href="/">
                  <img src="/logo.svg" alt="Alphinex Solutions" className="h-10 w-auto mb-4" />
                </Link>
                <p className="text-gray-300 mb-6 text-sm font-medium leading-relaxed">
                  Alphinex Solutions delivers cutting-edge AI-powered software development and intelligent IT consulting services. We specialize in AI web and mobile applications, smart cloud solutions, and AI-driven digital transformation. 
                </p>
                <div className="flex gap-3">
                  <a href="https://facebook.com/alphinexsolutions/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-blue-600/20 hover:bg-blue-600/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/company/alphinex-solutions/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-blue-600/20 hover:bg-blue-600/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="https://github.com/alphinex/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-purple-600/20 hover:bg-purple-600/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a href="https://wa.me/923253028856" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-green-600/20 hover:bg-green-600/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold mb-4 text-white text-base">AI Services</h4>
                <ul className="space-y-2 text-sm text-gray-400 font-medium">
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI Web Development</Link></li>
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI Mobile Development</Link></li>
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI Cloud Solutions</Link></li>
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI Video Editing</Link></li>
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI Automation</Link></li>
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI UI/UX Design</Link></li>
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI Consulting</Link></li>
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI-Powered Support</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4 text-white text-base">Contact Us</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <h5 className="text-white font-bold mb-2">Email</h5>
                    <div className="space-y-1 text-gray-400 font-medium">
                      <p className="hover:text-blue-400 transition-colors">alphinexsolutions@gmail.com</p>
                      <p className="hover:text-blue-400 transition-colors">suleman@alphinex.com</p>
                      <p className="hover:text-blue-400 transition-colors">nouman@alphinex.com</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-white font-bold mb-2">Phone</h5>
                    <div className="space-y-1 text-gray-400 font-medium">
                      <p className="hover:text-blue-400 transition-colors">+92 325 3028856</p>
                      <p className="hover:text-blue-400 transition-colors">+92 306 4212632</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold mb-4 text-white text-base">Our Locations</h4>
                <div className="space-y-4 text-sm text-gray-400 font-medium">
                  <div>
                    <h5 className="text-white font-bold mb-2">United States</h5>
                    <p>8 The Green, Suite A<br/>Dover, Delaware<br/>United States of America</p>
                  </div>
                  <div>
                    <h5 className="text-white font-bold mb-2">Pakistan</h5>
                    <p>Office# 13, 2nd Floor<br/>Ali Arcade, 6th Road<br/>Rawalpindi, Pakistan</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm font-medium">&copy; 2026 Alphinex Solutions. All rights reserved.</p>
              <Link href="/privacy" className="text-gray-400 hover:text-blue-400 text-sm font-semibold transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}


export default function Contact() {
  return (
    <Suspense fallback={
      <main className="bg-gradient-to-b from-[#0a0a0f] via-[#0f1420] to-[#0a0a0f] min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white">Loading...</div>
        </div>
      </main>
    }>
      <ContactForm />
    </Suspense>
  );
}
