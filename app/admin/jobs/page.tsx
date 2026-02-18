'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string;
  salary?: string;
  isActive: boolean;
  order: number;
  _count: {
    applications: number;
  };
}

export default function AdminJobs() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    experience: 'Mid Level',
    description: '',
    requirements: '',
    salary: '',
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
      fetchJobs();
    }
  }, [status]);

  const fetchJobs = async () => {
    const response = await fetch('/api/jobs');
    const data = await response.json();
    setJobs(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = editingJob ? `/api/jobs/${editingJob.id}` : '/api/jobs';
    const method = editingJob ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    resetForm();
    fetchJobs();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      department: '',
      location: '',
      type: 'Full-time',
      experience: 'Mid Level',
      description: '',
      requirements: '',
      salary: '',
      isActive: true,
      order: 0,
    });
    setShowForm(false);
    setEditingJob(null);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      experience: job.experience,
      description: job.description,
      requirements: job.requirements,
      salary: job.salary || '',
      isActive: job.isActive,
      order: job.order,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      fetchJobs();
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
            <h1 className="text-4xl font-bold text-white mb-2">Manage Jobs</h1>
            <p className="text-gray-400">Post and manage job openings</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-white font-bold rounded-xl transition-all duration-300 hover:scale-110 flex items-center gap-2 border border-blue-500/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Job
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">{editingJob ? 'Edit Job' : 'Add New Job'}</h2>
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
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                    placeholder="e.g., Senior Full Stack Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Department *</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                    placeholder="e.g., Engineering"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                    placeholder="e.g., Remote / Rawalpindi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Job Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Remote</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Experience Level *</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  >
                    <option>Entry Level</option>
                    <option>Mid Level</option>
                    <option>Senior Level</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Salary Range</label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  placeholder="e.g., $80k - $120k"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Job Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 resize-none"
                  placeholder="Describe the role, responsibilities, and what makes it exciting..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Requirements * (one per line)</label>
                <textarea
                  required
                  rows={6}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 resize-none"
                  placeholder="3+ years of experience with React and Node.js&#10;Strong understanding of TypeScript&#10;Experience with cloud platforms (AWS/Azure)&#10;..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 text-blue-600 bg-gray-900 border-gray-700 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm font-semibold text-gray-300">Active (visible on careers page)</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-white font-bold rounded-xl transition-all duration-300 hover:scale-110 border border-blue-500/30"
                >
                  {editingJob ? 'Update Job' : 'Add Job'}
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

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12 text-center">
              <p className="text-gray-400 text-lg">No jobs posted yet. Click "Add New Job" to create one.</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-white">{job.title}</h3>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        job.isActive 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-sm font-medium border border-blue-500/30">
                        {job.type}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        {job.experience}
                      </span>
                    </div>

                    <p className="text-gray-300 mb-4 line-clamp-2">{job.description}</p>

                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-lg font-medium border border-purple-500/30">
                        {job._count.applications} Applications
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Link
                      href={`/admin/applications?jobId=${job.id}`}
                      className="px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-white font-medium rounded-xl transition-all duration-300 hover:scale-110 text-center whitespace-nowrap border border-cyan-500/30"
                    >
                      View Applications
                    </Link>
                    <button
                      onClick={() => handleEdit(job)}
                      className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-white font-medium rounded-xl transition-all duration-300 hover:scale-110 border border-blue-500/30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
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
      </div>
    </AdminLayout>
  );
}
