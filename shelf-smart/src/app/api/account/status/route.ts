import { getAccountByUserId } from '../../../lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the user ID from Clerk authentication
    const { userId } = await auth();

    if (!userId) {
      // No user ID, should redirect to landing page
      return NextResponse.json({ 
        status: 'UNAUTHENTICATED', 
        redirect: '/' 
      });
    }

    // Get the account from database
    const account = await getAccountByUserId(userId);
    
    // Redirect based on status
    if (account && account.status === 'ACTIVE') {
      return NextResponse.json({ 
        status: 'ACTIVE',
        redirect: '/upload'
      });
    } else {
      // User exists but status is INACTIVE or not set
      return NextResponse.json({ 
        status: account?.status || 'INACTIVE',
        redirect: '/packages'
      });
    }
  } catch (error) {
    console.error('Error checking account status:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      redirect: '/'
    }, { status: 500 });
  }
} 