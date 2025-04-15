import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getAccountByUserId } from '../../lib/db'; // Adjust path if necessary

export default async function AuthCallbackPage() {
  const { userId } = await auth();
  console.log('[AUTH_CALLBACK] User ID:', userId);

  if (!userId) {
    // Should not happen if Clerk redirects here after login,
    // but handle defensively.
    console.warn('AuthCallbackPage reached without userId.');
    redirect('/');
  }

  let account = null;
  
  // Fetch account status
  try {
    console.log('[AUTH_CALLBACK] Fetching account for user:', userId);
    account = await getAccountByUserId(userId);
    console.log('[AUTH_CALLBACK] Account data:', JSON.stringify(account, null, 2));
  } catch (error) {
    console.error('[AUTH_CALLBACK] Error fetching account:', error);
    // Don't redirect here - we'll handle that outside the try/catch
  }

  // Determine redirect path based on account status
  // Moved outside of try/catch to prevent catching the redirect "error"
  if (account?.status === 'ACTIVE') {
    console.log('[AUTH_CALLBACK] Status is ACTIVE, redirecting to /upload');
    redirect('/upload');
  } else {
    console.log('[AUTH_CALLBACK] Status is not ACTIVE:', account?.status, 'redirecting to /packages');
    // Default to packages if inactive, status is null/undefined, or account doesn't exist yet
    redirect('/packages');
  }

  // This will only run if redirects somehow fail
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Loading, please wait...</p>
      {/* You can add a spinner component here */}
    </div>
  );
} 