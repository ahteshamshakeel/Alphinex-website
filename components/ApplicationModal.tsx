'use client';

import { useState } from 'react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: string;
    title: string;
    department: string;
  };
  onSuccess: () => void;
}

export default function ApplicationModal({ isOpen, onClose, job, onSuccess }: ApplicationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    portfolio: '',
    linkedinUrl: '',
    coverLetter: '',
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload CV file
      const formDataUpload = new FormData();
      if (cvFile) {
        formDataUpload.append('file', cvFile);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });
        const uploadData = await uploadRes.json();

        // Submit application
        const response = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobId: job.id,
            ...formData,
            cvUrl: uploadData.url,
          }),
        });

        if (response.ok) {
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            onSuccess();
            onClose();
            setFormData({
              name: '',
              email: '',
              phone: '',
              portfolio: '',
              linkedinUrl: '',
              coverLetter: '',
            });
            setCvFile(null);
          }, 5000);
        }
      }
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 max-w-2xl w-full shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-bold text-white mb-2">Apply for {job.title}</h2>
        <p className="text-gray-400 mb-6">{job.department}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                placeholder="John Doe"
              />
              <div className="validation-message">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Please enter your full name</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
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

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
              placeholder="+1 234 567 8900"
            />
            <div className="validation-message">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Please enter your phone number</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Portfolio URL
            </label>
            <input
              type="url"
              value={formData.portfolio}
              onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
              placeholder="https://yourportfolio.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              LinkedIn Profile
            </label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Upload CV/Resume *
            </label>
            <input
              type="file"
              required
              accept=".pdf,.doc,.docx"
              onChange={(e) => setCvFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
            />
            <p className="text-gray-500 text-xs mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
            <div className="validation-message">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Please upload your CV/Resume</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Cover Letter
            </label>
            <textarea
              rows={4}
              value={formData.coverLetter}
              onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 resize-none"
              placeholder="Tell us why you're a great fit for this role..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-white font-bold rounded-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-blue-500/30"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>

        {/* Success Message Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl z-10 animate-in fade-in duration-300">
            <div className="max-w-md mx-4 p-8 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-green-500/50 rounded-2xl shadow-2xl shadow-green-500/20">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-400 mb-3">Application Submitted!</h3>
                <p className="text-green-300 text-lg leading-relaxed">
                  Your application has been submitted successfully! You will be contacted soon by Alphinex Solutions recruitment team.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
