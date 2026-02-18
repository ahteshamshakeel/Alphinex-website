'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  portfolio?: string;
  linkedinUrl?: string;
  cvUrl: string;
  coverLetter?: string;
  status: string;
  createdAt: string;
  job: {
    title: string;
    department: string;
  };
}

function ApplicationsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchApplications();
    }
  }, [status, jobId]);

  const fetchApplications = async () => {
    const url = jobId ? `/api/applications?jobId=${jobId}` : '/api/applications';
    const response = await fetch(url);
    const data = await response.json();
    setApplications(data);
    if (data.length > 0) {
      setJobTitle(data[0].job.title);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await fetch(`/api/applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchApplications();
    if (selectedApp?.id === id) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }
  };

  const deleteApplication = async (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      await fetch(`/api/applications/${id}`, { method: 'DELETE' });
      fetchApplications();
      setSelectedApp(null);
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
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/jobs"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white">Job Applications</h1>
            {jobTitle && <p className="text-gray-400 mt-1">For: {jobTitle}</p>}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Applications List */}
          <div className="lg:col-span-2 space-y-4">
            {applications.length === 0 ? (
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12 text-center">
                <p className="text-gray-400 text-lg">No applications yet for this position.</p>
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border rounded-2xl p-6 cursor-pointer hover:border-blue-500/50 transition-all duration-300 ${
                    selectedApp?.id === app.id ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-gray-700/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white">{app.name}</h3>
                      <p className="text-sm text-gray-400">{app.email}</p>
                      <p className="text-sm text-gray-400">{app.phone}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      app.status === 'reviewed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      app.status === 'shortlisted' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">
                    <strong>Position:</strong> {app.job.title}
                  </p>
                  <p className="text-sm text-gray-300 mb-2">
                    <strong>Department:</strong> {app.job.department}
                  </p>
                  <p className="text-xs text-gray-500">
                    Applied: {new Date(app.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Application Details */}
          <div className="lg:col-span-1">
            {selectedApp ? (
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 sticky top-4 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Application Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-400">Name</label>
                    <p className="text-white font-medium">{selectedApp.name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-400">Email</label>
                    <a href={`mailto:${selectedApp.email}`} className="text-blue-400 hover:text-blue-300 block">
                      {selectedApp.email}
                    </a>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-400">Phone</label>
                    <a href={`tel:${selectedApp.phone}`} className="text-blue-400 hover:text-blue-300 block">
                      {selectedApp.phone}
                    </a>
                  </div>
                  
                  {selectedApp.portfolio && (
                    <div>
                      <label className="text-sm font-semibold text-gray-400">Portfolio</label>
                      <a href={selectedApp.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block break-all">
                        View Portfolio →
                      </a>
                    </div>
                  )}
                  
                  {selectedApp.linkedinUrl && (
                    <div>
                      <label className="text-sm font-semibold text-gray-400">LinkedIn</label>
                      <a href={selectedApp.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 block break-all">
                        View Profile →
                      </a>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-400">CV/Resume</label>
                    <a href={selectedApp.cvUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download CV
                    </a>
                  </div>
                  
                  {selectedApp.coverLetter && (
                    <div>
                      <label className="text-sm font-semibold text-gray-400 block mb-2">Cover Letter</label>
                      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 max-h-48 overflow-y-auto">
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{selectedApp.coverLetter}</p>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-400 block mb-2">Update Status</label>
                    <select
                      value={selectedApp.status}
                      onChange={(e) => updateStatus(selectedApp.id, e.target.value)}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={() => deleteApplication(selectedApp.id)}
                    className="w-full px-4 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Application
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12 text-center sticky top-4">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-400">Select an application to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}


export default function AdminApplications() {
  return (
    <Suspense fallback={
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </AdminLayout>
    }>
      <ApplicationsContent />
    </Suspense>
  );
}
