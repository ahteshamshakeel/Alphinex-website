'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/AdminLayout';
import { toast, Toaster } from 'react-hot-toast';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  order: number;
  createdAt: string;
  publishedAt?: string;
}

export default function AdminBlogs() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    author: 'Alphinex Solutions',
    category: 'Technology',
    tags: '',
    isPublished: false,
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
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs');
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Fetch error:', errorData);
        setBlogs([]);
        return;
      }
      
      const data = await response.json();
      console.log('Fetched blogs:', data);
      
      if (Array.isArray(data)) {
        setBlogs(data);
      } else {
        console.error('Invalid data format:', data);
        setBlogs([]);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
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
      let coverImage = formData.coverImage;

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
          coverImage = uploadData.url;
        } else {
          const errorData = await uploadRes.json();
          console.error('Upload error:', errorData);
          alert('Failed to upload image: ' + (errorData.error || 'Unknown error'));
          setUploading(false);
          return;
        }
      }

      const url = editingId ? `/api/blogs/${editingId}` : '/api/blogs';
      const method = editingId ? 'PUT' : 'POST';

      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          coverImage,
          tags: tagsArray,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        toast.error('Failed to save blog: ' + (errorData.error || 'Unknown error'), {
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #ef4444',
          },
        });
        setUploading(false);
        return;
      }

      const result = await response.json();
      console.log('Blog saved successfully:', result);
      
      resetForm();
      await fetchBlogs();
      toast.success(editingId ? 'Blog updated successfully!' : 'Blog created successfully!', {
        duration: 4000,
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #3b82f6',
        },
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to save blog: ' + (error instanceof Error ? error.message : 'Unknown error'), {
        duration: 4000,
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #ef4444',
        },
      });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: '',
      author: 'Alphinex Solutions',
      category: 'Technology',
      tags: '',
      isPublished: false,
      order: 0,
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (blog: Blog) => {
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage || '',
      author: blog.author,
      category: blog.category,
      tags: blog.tags.join(', '),
      isPublished: blog.isPublished,
      order: blog.order,
    });
    setPreviewUrl(blog.coverImage || '');
    setEditingId(blog.id);
    setShowForm(true);
    setSelectedFile(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      try {
        await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
        await fetchBlogs();
        toast.success('Blog deleted successfully!', {
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #3b82f6',
          },
        });
      } catch (error) {
        toast.error('Failed to delete blog', {
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #ef4444',
          },
        });
      }
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
      <Toaster position="top-right" />
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Manage Blogs</h1>
            <p className="text-gray-400">Create, edit, or remove blog posts</p>
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
                Add Blog
              </>
            )}
          </button>
        </div>

        {showForm && (
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Blog Post' : 'Add New Blog Post'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Title *</label>
                  <input
                    type="text"
                    placeholder="How AI is Transforming Software Development"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData({ 
                        ...formData, 
                        title,
                        slug: editingId ? formData.slug : generateSlug(title)
                      });
                    }}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Slug *</label>
                  <input
                    type="text"
                    placeholder="how-ai-is-transforming-software-development"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Excerpt *</label>
                <textarea
                  placeholder="Brief summary of the blog post..."
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Content *</label>
                <textarea
                  placeholder="Full blog post content (supports markdown)..."
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 resize-none font-mono text-sm"
                  rows={12}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
                />
                {previewUrl && (
                  <div className="mt-4">
                    <img src={previewUrl} alt="Preview" className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-700" />
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Author</label>
                  <input
                    type="text"
                    placeholder="Alphinex Solutions"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  >
                    <option value="Technology">Technology</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="DevOps">DevOps</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="AI, Machine Learning, Innovation"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
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
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Status</label>
                  <select
                    value={formData.isPublished ? 'published' : 'draft'}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.value === 'published' })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  type="submit" 
                  disabled={uploading}
                  className="px-8 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-white font-bold rounded-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-blue-500/30"
                >
                  {uploading ? 'Saving...' : editingId ? 'Update Blog' : 'Add Blog'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.length === 0 ? (
            <div className="col-span-full bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12 text-center">
              <p className="text-gray-400 text-lg">No blogs yet. Click "Add Blog" to create one.</p>
            </div>
          ) : (
            blogs.map((blog) => (
              <div key={blog.id} className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 shadow-lg">
                {/* Cover Image */}
                <div className="relative h-48 bg-gray-800">
                  {blog.coverImage ? (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-purple-600/20">
                      <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    {blog.isPublished ? (
                      <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-lg font-bold">
                        Published
                      </div>
                    ) : (
                      <div className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-lg font-bold">
                        Draft
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-xs font-medium">
                      {blog.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{blog.title}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{blog.excerpt}</p>
                  <p className="text-gray-500 text-xs mb-4">By {blog.author}</p>
                  
                  {blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {blog.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-xs text-gray-500">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="flex-1 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-white font-medium rounded-xl transition-all duration-300 hover:scale-110 border border-blue-500/30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
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
