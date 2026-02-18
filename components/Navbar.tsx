'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ContactModal from './ContactModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'pt-0' : 'pt-6'}`}>
      {/* Pill-shaped navbar container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-md rounded-full shadow-2xl border border-gray-700/50 overflow-hidden group">
          {/* Glow effect on hover */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          
          <div className="relative z-10 flex justify-between items-center h-16 px-6">
            {/* Logo on the left */}
            <Link href="/" className="flex items-center group/logo">
              <div className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center transition-transform duration-300 group-hover/logo:scale-110 overflow-hidden">
                <img src="/navbarlogo.png" alt="Alphinex Solutions" className="w-full h-full object-cover" />
              </div>
            </Link>
            
            {/* Desktop Navigation - Center */}
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/" className={`relative px-6 py-2 text-gray-300 hover:text-white transition-all duration-300 font-semibold text-base hover:bg-white/5 rounded-full ${pathname === '/' ? 'text-white' : ''}`}>
                Home
                {pathname === '/' && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"></div>
                )}
              </Link>
              <Link href="/about" className={`relative px-6 py-2 text-gray-300 hover:text-white transition-all duration-300 font-semibold text-base hover:bg-white/5 rounded-full ${pathname === '/about' ? 'text-white' : ''}`}>
                About
                {pathname === '/about' && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"></div>
                )}
              </Link>
              <Link href="/projects" className={`relative px-6 py-2 text-gray-300 hover:text-white transition-all duration-300 font-semibold text-base hover:bg-white/5 rounded-full ${pathname === '/projects' || pathname?.startsWith('/projects/') ? 'text-white' : ''}`}>
                Projects
                {(pathname === '/projects' || pathname?.startsWith('/projects/')) && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"></div>
                )}
              </Link>
              <Link href="/careers" className={`relative px-6 py-2 text-gray-300 hover:text-white transition-all duration-300 font-semibold text-base hover:bg-white/5 rounded-full ${pathname === '/careers' ? 'text-white' : ''}`}>
                Careers
                {pathname === '/careers' && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"></div>
                )}
              </Link>
              <Link href="/team" className={`relative px-6 py-2 text-gray-300 hover:text-white transition-all duration-300 font-semibold text-base hover:bg-white/5 rounded-full ${pathname === '/team' ? 'text-white' : ''}`}>
                Team
                {pathname === '/team' && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"></div>
                )}
              </Link>
              <Link href="/blogs" className={`relative px-6 py-2 text-gray-300 hover:text-white transition-all duration-300 font-semibold text-base hover:bg-white/5 rounded-full ${pathname === '/blogs' || pathname?.startsWith('/blogs/') ? 'text-white' : ''}`}>
                Blog
                {(pathname === '/blogs' || pathname?.startsWith('/blogs/')) && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"></div>
                )}
              </Link>
              <Link href="/contact" className={`relative px-6 py-2 text-gray-300 hover:text-white transition-all duration-300 font-semibold text-base hover:bg-white/5 rounded-full ${pathname === '/contact' ? 'text-white' : ''}`}>
                Contact
                {pathname === '/contact' && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"></div>
                )}
              </Link>
            </div>

            {/* CTA Button and WhatsApp on the right */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://wa.me/923253028856"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
                title="Chat on WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2 bg-white text-gray-900 rounded-full transition-all duration-300 hover:scale-105 font-bold text-base shadow-lg hover:shadow-xl"
              >
                <span>Let's Build</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white hover:text-blue-400 transition-colors duration-300 p-2 hover:bg-white/5 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 mx-4 animate-in slide-in-from-top duration-300">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-700/50 px-4 py-6 space-y-2">
            <Link href="/" className={`relative block px-6 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-full font-semibold text-base transition-all duration-300 ${pathname === '/' ? 'text-white bg-white/5' : ''}`}>
              Home
              {pathname === '/' && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"></div>
              )}
            </Link>
            <Link href="/about" className={`relative block px-6 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-full font-semibold text-base transition-all duration-300 ${pathname === '/about' ? 'text-white bg-white/5' : ''}`}>
              About
              {pathname === '/about' && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"></div>
              )}
            </Link>
            <Link href="/projects" className={`relative block px-6 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-full font-semibold text-base transition-all duration-300 ${pathname === '/projects' || pathname?.startsWith('/projects/') ? 'text-white bg-white/5' : ''}`}>
              Projects
              {(pathname === '/projects' || pathname?.startsWith('/projects/')) && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"></div>
              )}
            </Link>
            <Link href="/careers" className={`relative block px-6 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-full font-semibold text-base transition-all duration-300 ${pathname === '/careers' ? 'text-white bg-white/5' : ''}`}>
              Careers
              {pathname === '/careers' && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"></div>
              )}
            </Link>
            <Link href="/team" className={`relative block px-6 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-full font-semibold text-base transition-all duration-300 ${pathname === '/team' ? 'text-white bg-white/5' : ''}`}>
              Team
              {pathname === '/team' && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"></div>
              )}
            </Link>
            <Link href="/blogs" className={`relative block px-6 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-full font-semibold text-base transition-all duration-300 ${pathname === '/blogs' || pathname?.startsWith('/blogs/') ? 'text-white bg-white/5' : ''}`}>
              Blog
              {(pathname === '/blogs' || pathname?.startsWith('/blogs/')) && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"></div>
              )}
            </Link>
            <Link href="/contact" className={`relative block px-6 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-full font-semibold text-base transition-all duration-300 ${pathname === '/contact' ? 'text-white bg-white/5' : ''}`}>
              Contact
              {pathname === '/contact' && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"></div>
              )}
            </Link>
            <button 
              onClick={() => {
                setIsOpen(false);
                setIsModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 mt-4 px-6 py-3 bg-white text-gray-900 rounded-full transition-all duration-300 hover:scale-105 font-bold text-base shadow-lg"
            >
              <span>Let's Build</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <a
              href="https://wa.me/923253028856"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all duration-300 hover:scale-105 font-bold text-base shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
    </nav>
  );
}
