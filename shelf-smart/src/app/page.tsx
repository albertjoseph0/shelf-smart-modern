'use client';

import { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import BookTable from './components/BookTable';
import ExportButton from './components/ExportButton';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to trigger a refresh of the book table
  const handleBooksAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <header className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">ShelfSmart</h1>
            <p className="text-gray-600">Catalog your physical book collection from shelf images</p>
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
  );
}
