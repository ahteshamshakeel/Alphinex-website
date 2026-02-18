import Link from 'next/link';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

async function getTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { order: 'asc' },
    });
    return testimonials;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

async function getRecentBlogs() {
  try {
    const blogs = await (prisma as any).blog.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    });
    return blogs;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export default async function Home() {
  const testimonials = await getTestimonials();
  const recentBlogs = await getRecentBlogs();

  return (
    <main className="bg-gradient-to-b from-[#0a0a0f] via-[#0f1420] to-[#0a0a0f]">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Testimonials Section */}
      <section className="relative py-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-40 right-40 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-40 left-40 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-white">What Our Clients Say</h2>
          <p className="text-lg sm:text-xl text-center text-gray-400 mb-12 max-w-3xl mx-auto">
            Don't just take our word for it - hear from our satisfied clients.
          </p>
          <TestimonialsCarousel testimonials={testimonials as any} />
        </div>
      </section>

      {/* Recent Blogs Section */}
      {recentBlogs.length > 0 && (
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-40 left-40 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-40 right-40 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Latest Insights</h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                Stay updated with our latest thoughts on AI, technology, and innovation.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {recentBlogs.map((blog: any) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.slug}`}
                  className="group bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
                >
                  {blog.coverImage && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs font-semibold rounded-full">
                        {blog.category}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400 mb-4 line-clamp-2">
                      {blog.excerpt}
                    </p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-gray-500 gap-1">
                      <span className="truncate">{blog.author}</span>
                      <span className="text-xs">{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="text-center">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/20"
              >
                View All Blogs
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative py-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-20 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-20 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
              <div>
                <Link href="/">
                  <img src="/logo.svg" alt="Alphinex Solutions" className="h-10 w-auto mb-4" />
                </Link>
                <p className="text-gray-300 mb-6 text-sm font-medium leading-relaxed break-words">
                  Alphinex Solutions delivers cutting-edge AI-powered software development and intelligent IT consulting services. We specialize in AI web and mobile applications, smart cloud solutions, and AI-driven digital transformation. 
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="https://facebook.com/alphinexsolutions/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-blue-600/20 hover:bg-blue-600/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/company/alphinex-solutions/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-blue-600/20 hover:bg-blue-600/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="https://github.com/alphinex/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-purple-600/20 hover:bg-purple-600/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a href="https://wa.me/923253028856" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-green-600/20 hover:bg-green-600/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold mb-4 text-white text-base">AI Services</h4>
                <ul className="space-y-2 text-sm text-gray-400 font-medium">
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI Web Development</Link></li>
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI Mobile Development</Link></li>
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI Cloud Solutions</Link></li>
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI Video Editing</Link></li>
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI Automation</Link></li>
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI UI/UX Design</Link></li>
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI Consulting</Link></li>
                  <li><Link href="/" className="hover:text-blue-400 transition-colors">AI-Powered Support</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4 text-white text-base">Contact Us</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <h5 className="text-white font-bold mb-2">Email</h5>
                    <div className="space-y-1 text-gray-400 font-medium">
                      <p className="hover:text-blue-400 transition-colors">alphinexsolutions@gmail.com</p>
                      <p className="hover:text-blue-400 transition-colors">suleman@alphinex.com</p>
                      <p className="hover:text-blue-400 transition-colors">nouman@alphinex.com</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-white font-bold mb-2">Phone</h5>
                    <div className="space-y-1 text-gray-400 font-medium">
                      <p className="hover:text-blue-400 transition-colors">+92 325 3028856</p>
                      <p className="hover:text-blue-400 transition-colors">+92 306 4212632</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold mb-4 text-white text-base">Our Locations</h4>
                <div className="space-y-4 text-sm text-gray-400 font-medium">
                  <div>
                    <h5 className="text-white font-bold mb-2">United States</h5>
                    <p>8 The Green, Suite A<br/>Dover, Delaware<br/>United States of America</p>
                  </div>
                  <div>
                    <h5 className="text-white font-bold mb-2">Pakistan</h5>
                    <p>Office# 13, 2nd Floor<br/>Ali Arcade, 6th Road<br/>Rawalpindi, Pakistan</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm font-medium text-center sm:text-left">&copy; 2026 Alphinex Solutions. All rights reserved.</p>
              <Link href="/privacy" className="text-gray-400 hover:text-blue-400 text-sm font-semibold transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
