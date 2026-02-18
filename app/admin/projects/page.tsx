'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/AdminLayout';

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
  order: number;
  isActive: boolean;
}

export default function AdminProjects() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cost: '',
    demoUrl: '',
    username: '',
    password: '',
    order: 0,
    isActive: true,
  });
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState<number>(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    setProjects(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Add new files to existing ones
      setSelectedFiles([...selectedFiles, ...files]);
      
      // Create preview URLs for new files
      const previews: string[] = [];
      let loadedCount = 0;
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          loadedCount++;
          if (loadedCount === files.length) {
            // Add new previews to existing ones
            setPreviewUrls([...previewUrls, ...previews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
    // Reset the input so the same file can be selected again if needed
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrls = uploadedImages;

      // Upload new files if selected
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map(async (file) => {
          const uploadFormData = new FormData();
          uploadFormData.append('file', file);

          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData,
          });

          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            return uploadData.url;
          }
          return null;
        });

        const newUrls = await Promise.all(uploadPromises);
        imageUrls = [...uploadedImages, ...newUrls.filter(url => url !== null)];
      }

      const coverImage = imageUrls[coverImageIndex] || imageUrls[0] || '';

      const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
      const method = editingId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          images: imageUrls,
          coverImage,
        }),
      });

      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save project');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      title: '', 
      description: '', 
      cost: '', 
      demoUrl: '', 
      username: '', 
      password: '', 
      order: 0,
      isActive: true,
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
    setUploadedImages([]);
    setCoverImageIndex(0);
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      cost: project.cost,
      demoUrl: project.demoUrl || '',
      username: project.username || '',
      password: project.password || '',
      order: project.order,
      isActive: project.isActive,
    });
    setUploadedImages(project.images);
    setPreviewUrls(project.images);
    setCoverImageIndex(project.images.indexOf(project.coverImage || '') || 0);
    setEditingId(project.id);
    setShowForm(true);
    setSelectedFiles([]);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      fetchProjects();
    }
  };

  const removeImage = (index: number) => {
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newPreviews);
    
    // If this is an already uploaded image (from editing), remove from uploadedImages
    if (index < uploadedImages.length) {
      const newUploadedImages = uploadedImages.filter((_, i) => i !== index);
      setUploadedImages(newUploadedImages);
    } else {
      // If this is a newly selected file, remove from selectedFiles
      const fileIndex = index - uploadedImages.length;
      const newSelectedFiles = selectedFiles.filter((_, i) => i !== fileIndex);
      setSelectedFiles(newSelectedFiles);
    }
    
    // Adjust cover image index if needed
    if (coverImageIndex >= newPreviews.length) {
      setCoverImageIndex(Math.max(0, newPreviews.length - 1));
    } else if (coverImageIndex === index) {
      setCoverImageIndex(0);
    } else if (coverImageIndex > index) {
      setCoverImageIndex(coverImageIndex - 1);
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
            <h1 className="text-4xl font-bold text-white mb-2">Manage Projects</h1>
            <p className="text-gray-400">Add, edit, or remove projects from your portfolio</p>
          </div>
          <button
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
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
                Add Project
              </>
            )}
          </button>
        </div>

        {showForm && (
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Project' : 'Add New Project'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Project Title *</label>
                  <input
                    type="text"
                    placeholder="E-commerce Website"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Cost *</label>
                  <input
                    type="text"
                    placeholder="$5,000"
                    required
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Description *</label>
                <textarea
                  placeholder="Detailed description of the project..."
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 resize-none"
                  rows={5}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Project Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
                />
                {previewUrls.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-3">Select cover image by clicking on it:</p>
                    <div className="grid grid-cols-4 gap-4">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <div
                            onClick={() => setCoverImageIndex(index)}
                            className={`cursor-pointer rounded-lg overflow-hidden border-4 transition-all ${
                              coverImageIndex === index 
                                ? 'border-blue-500 shadow-lg shadow-blue-500/50' 
                                : 'border-gray-700 hover:border-blue-400'
                            }`}
                          >
                            <img src={url} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover" />
                            {coverImageIndex === index && (
                              <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-lg font-bold">
                                Cover
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-lg font-bold text-white mb-4">Demo Access (Optional)</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Demo URL</label>
                    <input
                      type="text"
                      placeholder="https://demo.example.com"
                      value={formData.demoUrl}
                      onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
                    <input
                      type="text"
                      placeholder="demo_user"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                    <input
                      type="text"
                      placeholder="demo123"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                    />
                  </div>
                </div>
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
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Status</label>
                  <select
                    value={formData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  type="submit" 
                  disabled={uploading}
                  className="px-8 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-white font-bold rounded-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-blue-500/30"
                >
                  {uploading ? 'Saving...' : editingId ? 'Update Project' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-full bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12 text-center">
              <p className="text-gray-400 text-lg">No projects yet. Click "Add Project" to create one.</p>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 shadow-lg">
                {/* Cover Image */}
                <div className="relative h-48 bg-gray-800">
                  {project.coverImage || project.images[0] ? (
                    <img
                      src={project.coverImage || project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-purple-600/20">
                      <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {!project.isActive && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-3 py-1 rounded-lg font-bold">
                      Inactive
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-green-400 font-bold mb-3">{project.cost}</p>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="flex-1 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-white font-medium rounded-xl transition-all duration-300 hover:scale-110 border border-blue-500/30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="flex-1 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-white font-medium rounded-xl transition-all duration-300 hover:scale-110 border border-red-500/30"
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
