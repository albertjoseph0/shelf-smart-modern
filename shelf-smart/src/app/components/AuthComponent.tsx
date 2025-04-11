'use client';

import { useState } from 'react';

export default function AuthComponent() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a placeholder for actual authentication logic
    console.log(isSignIn ? 'Signing in' : 'Signing up', { email, password, name });
  };

  return (
    <div className="w-full max-w-md h-full bg-white rounded-lg shadow-lg p-6 transition-all duration-300 border border-blue-100">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">
          {isSignIn ? 'Sign In' : 'Create Account'}
        </h3>
        <p className="text-gray-600 mt-2">
          {isSignIn 
            ? 'Sign in to manage your book collection' 
            : 'Join thousands of book lovers organizing their collections'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isSignIn && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {isSignIn ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsSignIn(!isSignIn)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {isSignIn ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
} 