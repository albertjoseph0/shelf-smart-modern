'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserButton, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import ImageUpload from '../components/ImageUpload';
import BookTable from '../components/BookTable';
import ExportButton from '../components/ExportButton';

export default function UploadPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to trigger a refresh of the book table
  const handleBooksAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <SignedIn>
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <header className="mb-10 flex items-center justify-between">
                <div className="flex items-center">
                  <Link href="/" className="text-blue-600 hover:text-blue-800 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                  <h1 className="text-3xl font-bold text-gray-800">ShelfSmart</h1>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-gray-600">Catalog your physical book collection from shelf images</p>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </header>

              <ImageUpload onBooksAdded={handleBooksAdded} />
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Your Book Collection</h2>
                  <ExportButton />
                </div>
                
                <BookTable refreshTrigger={refreshTrigger} />
              </div>
              
              <footer className="mt-12 text-center text-gray-500 text-sm">
                <p>© {new Date().getFullYear()} ShelfSmart - Built with Next.js, React, and Azure SQL</p>
              </footer>
            </div>
          </div>
        </main>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
} 