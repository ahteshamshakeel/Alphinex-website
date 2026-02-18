'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  cost: string;
  demoUrl?: string;
  username?: string;
  password?: string;
  images: string[];
  coverImage?: string;
}

export default function ProjectDetail() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string);
    }
  }, [params.id]);

  const fetchProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`);
      const data = await response.json();
      setProject(data);
      setSelectedImage(data.coverImage || data.images[0] || '');
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`, {
      duration: 2000,
      style: {
        background: '#1f2937',
        color: '#fff',
        border: '1px solid #3b82f6',
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0f1420] to-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-400 mt-4">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0f1420] to-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Project not found</p>
          <Link href="/projects" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0f1420] to-[#0a0a0f]">
      <Toaster position="top-right" />
      
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-40 right-40 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-40 left-40 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={project.title}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-purple-600/20">
                  <svg className="w-24 h-24 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {project.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {project.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 ${
                      selectedImage === image ? 'border-blue-500' : 'border-gray-700/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${project.title} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Title and Cost */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <h1 className="text-4xl font-bold text-white mb-4">{project.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-400 font-bold text-2xl">{project.cost}</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Project Description</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{project.description}</p>
            </div>

            {/* Login Details */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Demo Access</h2>
              
              {project.demoUrl || project.username || project.password ? (
                <div className="space-y-4">
                  {project.username && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">Username</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={project.username}
                          readOnly
                          className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                        />
                        <button
                          onClick={() => copyToClipboard(project.username!, 'Username')}
                          className="px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-white rounded-xl transition-all duration-300 hover:scale-110 border border-blue-500/30"
                          title="Copy username"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {project.password && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">Password</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={project.password}
                          readOnly
                          className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                        />
                        <button
                          onClick={() => copyToClipboard(project.password!, 'Password')}
                          className="px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-white rounded-xl transition-all duration-300 hover:scale-110 border border-blue-500/30"
                          title="Copy password"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl transition-all duration-300 hover:scale-110 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 hover:from-blue-700 hover:to-purple-700 flex items-center justify-center gap-2 group"
                    >
                      View Live Demo
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-gray-400 text-lg font-medium">No Demo Available</p>
                  <p className="text-gray-500 text-sm mt-2">Demo access is not provided for this project</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
