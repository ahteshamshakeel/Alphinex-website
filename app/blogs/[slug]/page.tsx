'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

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
  publishedAt: string;
}

export default function BlogDetail() {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetchBlog(params.slug as string);
    }
  }, [params.slug]);

  const fetchBlog = async (slug: string) => {
    try {
      const response = await fetch(`/api/blogs/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setBlog(data);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-gradient-to-b from-[#0a0a0f] via-[#0f1420] to-[#0a0a0f] min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="bg-gradient-to-b from-[#0a0a0f] via-[#0f1420] to-[#0a0a0f] min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Blog Not Found</h1>
            <Link href="/blogs" className="text-blue-400 hover:text-blue-300">
              Back to Blogs
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-[#0a0a0f] via-[#0f1420] to-[#0a0a0f]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-40 right-40 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-40 left-40 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blogs" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blogs
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-sm font-medium">
              {blog.category}
            </span>
            <span className="text-gray-400 text-sm">
              {new Date(blog.publishedAt).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">{blog.title}</h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-6">{blog.excerpt}</p>
          
          <div className="flex items-center gap-4 text-gray-400">
            <span>By {blog.author}</span>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {blog.coverImage && (
        <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      )}

      {/* Content */}
      <section className="relative py-8 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 sm:p-8 md:p-12">
            <div className="prose prose-invert prose-sm sm:prose-base md:prose-lg max-w-none">
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                {blog.content}
              </div>
            </div>

            {blog.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-700">
                <h3 className="text-white font-bold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-800/50 text-gray-400 rounded-lg text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Back to Blogs Button */}
          <div className="mt-8 text-center">
            <Link
              href="/blogs"
              className="inline-flex items-center px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-white font-bold rounded-xl transition-all duration-300 hover:scale-110 border border-blue-500/30"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to All Blogs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 overflow-hidden mt-12">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-20 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-20 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300">
            <div className="text-center">
              <p className="text-gray-400 text-sm">&copy; 2026 Alphinex Solutions. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
