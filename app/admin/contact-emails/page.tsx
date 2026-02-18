'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

interface ContactEmail {
  id: string;
  email: string;
  isActive: boolean;
  order: number;
}

export default function AdminContactEmails() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [emails, setEmails] = useState<ContactEmail[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchEmails();
    }
  }, [status]);

  const fetchEmails = async () => {
    const response = await fetch('/api/contact-emails');
    const data = await response.json();
    setEmails(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = editingId ? `/api/contact-emails/${editingId}` : '/api/contact-emails';
    const method = editingId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    resetForm();
    fetchEmails();
  };

  const resetForm = () => {
    setFormData({ email: '', isActive: true, order: 0 });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (email: ContactEmail) => {
    setFormData({
      email: email.email,
      isActive: email.isActive,
      order: email.order,
    });
    setEditingId(email.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this contact email?')) {
      await fetch(`/api/contact-emails/${id}`, { method: 'DELETE' });
      fetchEmails();
    }
  };

  const testEmailConfiguration = async () => {
    setTestingEmail(true);
    setTestResult(null);
    
    try {
      const response = await fetch('/api/test-email');
      const data = await response.json();
      
      setTestResult({
        success: data.success || false,
        message: data.message || data.error || 'Unknown error',
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Failed to test email configuration',
      });
    } finally {
      setTestingEmail(false);
    }
  };

  if (status === 'loading') {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Contact Emails</h1>
            <p className="text-gray-400">Manage email addresses that receive contact form submissions</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={testEmailConfiguration}
              disabled={testingEmail}
              className="px-6 py-3 bg-cyan-600/20 hover:bg-cyan-600/30 text-white font-bold rounded-xl transition-all duration-300 hover:scale-110 flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100 border border-cyan-500/30"
            >
              {testingEmail ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Testing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Test Email
                </>
              )}
            </button>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-white font-bold rounded-xl transition-all duration-300 hover:scale-110 flex items-center gap-2 border border-blue-500/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Email
              </button>
            )}
          </div>
        </div>

        {/* Test Result */}
        {testResult && (
          <div className={`mb-8 p-6 rounded-2xl border-2 ${
            testResult.success 
              ? 'bg-green-600/10 border-green-500/50' 
              : 'bg-red-600/10 border-red-500/50'
          }`}>
            <div className="flex items-start gap-3">
              {testResult.success ? (
                <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <div>
                <h3 className={`font-bold text-lg mb-1 ${testResult.success ? 'text-green-400' : 'text-red-400'}`}>
                  {testResult.success ? 'Email Configuration Working!' : 'Email Configuration Failed'}
                </h3>
                <p className={testResult.success ? 'text-green-300' : 'text-red-300'}>
                  {testResult.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">{editingId ? 'Edit Contact Email' : 'Add New Contact Email'}</h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                    placeholder="contact@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 text-blue-600 bg-gray-900 border-gray-700 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm font-semibold text-gray-300">Active (receives contact form emails)</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-white font-bold rounded-xl transition-all duration-300 hover:scale-110 border border-blue-500/30"
                >
                  {editingId ? 'Update Email' : 'Add Email'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-3 bg-gray-700/20 hover:bg-gray-700/30 text-white font-bold rounded-xl transition-all duration-300 hover:scale-110 border border-gray-600/30"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Emails List */}
        <div className="space-y-4">
          {emails.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12 text-center">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400 text-lg">No contact emails configured yet. Click "Add Email" to create one.</p>
            </div>
          ) : (
            emails.map((email) => (
              <div
                key={email.id}
                className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 shadow-lg"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-white">{email.email}</h3>
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                          email.isActive 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {email.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">Order: {email.order}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(email)}
                      className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-white font-medium rounded-xl transition-all duration-300 hover:scale-110 border border-blue-500/30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(email.id)}
                      className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-white font-medium rounded-xl transition-all duration-300 hover:scale-110 border border-red-500/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-white font-semibold mb-2">How it works</h4>
              <p className="text-gray-300 text-sm mb-3">
                When someone submits the contact form on your website, an email will be sent to all active email addresses listed here. 
                You can add multiple emails to ensure the right team members receive contact inquiries.
              </p>
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 mt-3">
                <h5 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Setup with Resend (Recommended)
                </h5>
                <p className="text-gray-400 text-sm mb-3">
                  We use Resend for email delivery - it's simple, reliable, and free for up to 3,000 emails/month.
                </p>
                <ol className="text-gray-400 text-sm space-y-2 ml-4 list-decimal">
                  <li>Go to <a href="https://resend.com/signup" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">resend.com/signup</a> and create a free account</li>
                  <li>Navigate to <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">API Keys</a> and create a new key</li>
                  <li>Copy the API key and add it to your <code className="bg-gray-800 px-1 rounded text-blue-400">.env</code> file:
                    <div className="bg-gray-800 p-2 rounded mt-1 font-mono text-xs text-green-400">
                      RESEND_API_KEY="re_your_api_key_here"
                    </div>
                  </li>
                  <li>Restart your development server</li>
                  <li>Click the "Test Email" button above to verify it's working</li>
                </ol>
                <p className="text-green-400 text-sm mt-3 font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No SMTP configuration needed! Just one API key and you're done.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
