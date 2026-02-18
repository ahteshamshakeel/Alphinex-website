'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/AdminLayout';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photoUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  order: number;
}

export default function AdminTeam() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    photoUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    githubUrl: '',
    order: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const res = await fetch('/api/team');
    const data = await res.json();
    setMembers(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let photoUrl = formData.photoUrl;

      // Upload file if selected
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          photoUrl = uploadData.url;
        }
      }

      const url = editingId ? `/api/team/${editingId}` : '/api/team';
      const method = editingId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, photoUrl }),
      });

      setFormData({ name: '', role: '', bio: '', photoUrl: '', linkedinUrl: '', twitterUrl: '', githubUrl: '', order: 0 });
      setSelectedFile(null);
      setPreviewUrl('');
      setShowForm(false);
      setEditingId(null);
      fetchMembers();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save team member');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      photoUrl: member.photoUrl || '',
      linkedinUrl: member.linkedinUrl || '',
      twitterUrl: member.twitterUrl || '',
      githubUrl: member.githubUrl || '',
      order: member.order,
    });
    setEditingId(member.id);
    setShowForm(true);
    setPreviewUrl(member.photoUrl || '');
    setSelectedFile(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      await fetch(`/api/team/${id}`, { method: 'DELETE' });
      fetchMembers();
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

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Manage Team</h1>
            <p className="text-gray-400">Add, edit, or remove team members</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setFormData({ name: '', role: '', bio: '', photoUrl: '', linkedinUrl: '', twitterUrl: '', githubUrl: '', order: 0 });
                setEditingId(null);
                setPreviewUrl('');
                setSelectedFile(null);
              }
            }}
            className="px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-white font-bold rounded-xl transition-all duration-300 hover:scale-110 flex items-center gap-2 border border-blue-500/30"
          >
            {showForm ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Member
              </>
            )}
          </button>
        </div>

        {showForm && (
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Team Member' : 'Add New Team Member'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Name *</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Role *</label>
                  <input
                    type="text"
                    placeholder="Senior Developer"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Photo Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
                />
                {previewUrl && (
                  <div className="mt-4">
                    <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg border-2 border-gray-700" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Bio</label>
                <textarea
                  placeholder="Brief description about the team member..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 resize-none"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Display Order</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">LinkedIn URL</label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/..."
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Twitter URL</label>
                  <input
                    type="text"
                    placeholder="https://twitter.com/..."
                    value={formData.twitterUrl}
                    onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">GitHub URL</label>
                  <input
                    type="text"
                    placeholder="https://github.com/..."
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  type="submit" 
                  disabled={uploading}
                  className="px-8 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-white font-bold rounded-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-blue-500/30"
                >
                  {uploading ? 'Uploading...' : editingId ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.length === 0 ? (
            <div className="col-span-full bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12 text-center">
              <p className="text-gray-400 text-lg">No team members yet. Click "Add Member" to create one.</p>
            </div>
          ) : (
            members.map((member) => (
              <div key={member.id} className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 shadow-lg">
                {member.photoUrl && (
                  <img src={member.photoUrl} alt={member.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-gray-700" />
                )}
                <h3 className="text-xl font-bold text-white text-center">{member.name}</h3>
                <p className="text-blue-400 text-center font-medium mb-3">{member.role}</p>
                {member.bio && <p className="text-gray-400 text-sm mb-4 line-clamp-3">{member.bio}</p>}
                
                <div className="flex gap-2 justify-center mb-4">
                  {member.linkedinUrl && (
                    <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  )}
                  {member.twitterUrl && (
                    <a href={member.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                  )}
                  {member.githubUrl && (
                    <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="flex-1 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-white font-medium rounded-xl transition-all duration-300 hover:scale-110 border border-blue-500/30"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="flex-1 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-white font-medium rounded-xl transition-all duration-300 hover:scale-110 border border-red-500/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
