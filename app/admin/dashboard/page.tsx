'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0f1420] to-[#0a0a0f] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back, manage your website content</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-600/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Team</h3>
            <p className="text-blue-300 text-sm">Manage team members</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-600/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Testimonials</h3>
            <p className="text-purple-300 text-sm">Client feedback</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-cyan-600/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Jobs</h3>
            <p className="text-cyan-300 text-sm">Career opportunities</p>
          </div>

          <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 backdrop-blur-sm border border-pink-500/30 rounded-2xl p-6 hover:border-pink-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-pink-600/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Applications</h3>
            <p className="text-pink-300 text-sm">Job applications</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/admin/team"
            className="group bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Team</h3>
            </div>
            <p className="text-gray-400 text-sm">Add, edit, or remove team members</p>
          </Link>

          <Link
            href="/admin/testimonials"
            className="group bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600/30 transition-colors">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Testimonials</h3>
            </div>
            <p className="text-gray-400 text-sm">Manage client testimonials and reviews</p>
          </Link>

          <Link
            href="/admin/jobs"
            className="group bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center group-hover:bg-cyan-600/30 transition-colors">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Jobs</h3>
            </div>
            <p className="text-gray-400 text-sm">Post and manage job openings</p>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="group bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-pink-500/50 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-pink-600/20 rounded-lg flex items-center justify-center group-hover:bg-pink-600/30 transition-colors">
                <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">View Site</h3>
            </div>
            <p className="text-gray-400 text-sm">Preview your live website</p>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
