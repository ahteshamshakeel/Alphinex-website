'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledEmail?: string;
  serviceName?: string;
}

export default function ContactModal({ isOpen, onClose, prefilledEmail = '', serviceName = '' }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(prefilledEmail);
  const router = useRouter();

  useEffect(() => {
    setEmail(prefilledEmail);
  }, [prefilledEmail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (email) params.append('email', email);
    if (serviceName) params.append('subject', `Interested in ${serviceName}`);
    
    router.push(`/contact?${params.toString()}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">Let's Get Started</h2>
        <p className="text-gray-400 mb-6">Tell us a bit about yourself</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="modal-name" className="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              id="modal-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
              placeholder="Your name"
            />
            <div className="validation-message">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Please enter your name</span>
            </div>
          </div>

          <div>
            <label htmlFor="modal-email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="modal-email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
              placeholder="your@email.com"
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
            className="w-full px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-white font-bold rounded-xl transition-all duration-300 hover:scale-110 border border-blue-500/30"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
