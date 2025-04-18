'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useEffect } from 'react';
import { SignIn } from '@clerk/nextjs';

export default function LandingPage() {
  const authSectionRef = useRef<HTMLDivElement>(null);

  // Function to scroll to auth section with enhanced focus
  const scrollToAuth = () => {
    // Simply scroll to top of page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Keep the highlight effect for the auth component
    if (authSectionRef.current) {
      setTimeout(() => {
        // Add highlight animation
        authSectionRef.current?.classList.add('ring-4', 'ring-blue-500', 'ring-opacity-70');
        authSectionRef.current?.classList.add('scale-105');
        
        // Remove the effect after 1.5 seconds
        setTimeout(() => {
          authSectionRef.current?.classList.remove('ring-4', 'ring-blue-500', 'ring-opacity-70');
          authSectionRef.current?.classList.remove('scale-105');
        }, 1500);
      }, 500);
    }
  };
  
  // Add a pulsing animation effect to draw attention to the auth component when page loads
  useEffect(() => {
    const authElement = authSectionRef.current;
    if (authElement) {
      // Add initial pulse animation
      setTimeout(() => {
        authElement.classList.add('animate-pulse');
        
        // Remove animation after 2 seconds
        setTimeout(() => {
          authElement.classList.remove('animate-pulse');
        }, 2000);
      }, 1000);
    }
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">Shelf Smart</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600">How It Works</a>
            <a href="#faq" className="text-gray-600 hover:text-blue-600">FAQ</a>
          </nav>
          <button 
            onClick={scrollToAuth} 
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Catalog Your Books With Just One Photo</h2>
            <p className="text-xl text-gray-600 mb-8">
              Transform your bookshelf into a digital catalog instantly.
              Upload a photo, get all your books' details in seconds.
            </p>
            <button 
              onClick={scrollToAuth} 
              className="bg-blue-600 text-white text-lg py-3 px-8 rounded-md hover:bg-blue-700 transition inline-block"
            >
              Try It Now
            </button>
          </div>
          <div id="auth-section" ref={authSectionRef} className="md:w-1/2 flex justify-center transition-all duration-500 transform hover:scale-105 rounded-xl p-2 pt-4">
            <SignIn routing="hash" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Shelf Smart</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Simple Photo Upload</h3>
              <p className="text-gray-600">Just take a photo of your bookshelf and upload it. No manual entry required.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Complete Book Details</h3>
              <p className="text-gray-600">Get titles, authors, and ISBN numbers automatically extracted from your image.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy CSV Export</h3>
              <p className="text-gray-600">Export your catalog as CSV to import into Libib, LibraryThing, BookBuddy, and more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div className="flex-1 text-center mb-8 md:mb-0">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Take a Photo</h3>
              <p className="text-gray-600 px-4">Capture your bookshelf with a clear, well-lit photo</p>
            </div>
            <div className="hidden md:block w-8 pt-8">
              <div className="border-t-2 border-dashed border-blue-300"></div>
            </div>
            <div className="flex-1 text-center mb-8 md:mb-0">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Upload Image</h3>
              <p className="text-gray-600 px-4">Upload the image to our smart recognition system</p>
            </div>
            <div className="hidden md:block w-8 pt-8">
              <div className="border-t-2 border-dashed border-blue-300"></div>
            </div>
            <div className="flex-1 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Get Results</h3>
              <p className="text-gray-600 px-4">Receive a complete CSV with all your book details</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <button
              onClick={scrollToAuth}
              className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition inline-block"
            >
              Upload Your Books
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-500 text-sm">Book Collector</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I've been looking for an easy way to catalog my home library for years. Shelf Smart saved me hours of manual data entry. Simply amazing!"
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">David Chen</h4>
                  <p className="text-gray-500 text-sm">Librarian</p>
                </div>
              </div>
              <p className="text-gray-600">
                "As a small community librarian, this tool has revolutionized how we catalog donations. What used to take days now takes minutes."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">How accurate is the book recognition?</h3>
              <p className="text-gray-600">
                Our system can recognize most books with clearly visible spines. The accuracy depends on image quality, lighting, and how visible the book spines are. We recommend taking clear, well-lit photos.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Which book management apps can I export to?</h3>
              <p className="text-gray-600">
                You can export your catalog as a CSV file, which is compatible with most book management apps including Libib, LibraryThing, BookBuddy, and more.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Is there a limit to how many books I can scan at once?</h3>
              <p className="text-gray-600">
                There's no strict limit, but for best results, we recommend photos that capture 20-30 books at a time. For larger collections, you can take multiple photos.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Is my book data kept private?</h3>
              <p className="text-gray-600">
                Yes, we take privacy seriously. Your book data is only used to provide you with the service and is not shared with third parties. You can delete your data at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Catalog Your Library?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of book lovers who have simplified their cataloging process with Shelf Smart.
          </p>
          <button
            onClick={scrollToAuth}
            className="bg-white text-blue-600 py-3 px-8 rounded-md hover:bg-gray-100 transition inline-block text-lg font-medium"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-bold mb-4">Shelf Smart</h3>
              <p className="text-gray-400 max-w-xs">
                The easiest way to catalog your physical book collection and manage your library.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                  <li><a href="#how-it-works" className="text-gray-400 hover:text-white">How It Works</a></li>
                  <li><a href="#faq" className="text-gray-400 hover:text-white">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="mailto:shelfsmartbook@gmail.com" className="text-gray-400 hover:text-white">
                      shelfsmartbook@gmail.com
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Shelf Smart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
} 