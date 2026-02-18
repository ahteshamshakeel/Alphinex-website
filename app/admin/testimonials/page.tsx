'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/AdminLayout';

interface Testimonial {
  id: string;
  clientName: string;
  company?: string;
  message: string;
  rating: number;
  photoUrl?: string;
  order: number;
}

export default function AdminTestimonials() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    clientName: '',
    company: '',
    message: '',
    rating: 5,
    photoUrl: '',
    order: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const res = await fetch('/api/testimonials');
    const data = await res.json();
    setTestimonials(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = editingId ? `/api/testimonials/${editingId}` : '/api/testimonials';
    const method = editingId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setFormData({ clientName: '', company: '', message: '', rating: 5, photoUrl: '', order: 0 });
    setShowForm(false);
    setEditingId(null);
    fetchTestimonials();
  };

  const handleEdit = (testimonial: Testimonial) => {
    setFormData({
      clientName: testimonial.clientName,
      company: testimonial.company || '',
      message: testimonial.message,
      rating: testimonial.rating,
      photoUrl: testimonial.photoUrl || '',
      order: testimonial.order,
    });
    setEditingId(testimonial.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      fetchTestimonials();
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
            <h1 className="text-4xl font-bold text-white mb-2">Manage Testimonials</h1>
            <p className="text-gray-400">Add, edit, or remove client testimonials</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setFormData({ clientName: '', company: '', message: '', rating: 5, photoUrl: '', order: 0 });
                setEditingId(null);
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
                Add Testimonial
              </>
            )}
          </button>
        </div>

        {showForm && (
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Client Name *</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Company</label>
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Photo URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Rating (1-5) *</label>
                  <input
                    type="number"
                    placeholder="5"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  />
                </div>
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
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Message *</label>
                <textarea
                  placeholder="Client testimonial message..."
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 resize-none"
                  rows={4}
                />
              </div>

              <button 
                type="submit" 
                className="px-8 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-white font-bold rounded-xl transition-all duration-300 hover:scale-110 border border-blue-500/30"
              >
                {editingId ? 'Update Testimonial' : 'Add Testimonial'}
              </button>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.length === 0 ? (
            <div className="col-span-full bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12 text-center">
              <p className="text-gray-400 text-lg">No testimonials yet. Click "Add Testimonial" to create one.</p>
            </div>
          ) : (
            testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 shadow-lg">
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-white">{testimonial.clientName}</h3>
                {testimonial.company && <p className="text-blue-400 font-medium mb-3">{testimonial.company}</p>}
                <p className="text-gray-300 mb-4 line-clamp-4">{testimonial.message}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="flex-1 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-white font-medium rounded-xl transition-all duration-300 hover:scale-110 border border-blue-500/30"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
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
