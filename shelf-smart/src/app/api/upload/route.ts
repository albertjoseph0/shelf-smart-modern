import { NextRequest, NextResponse } from 'next/server';
import { processBase64Image } from '../../lib/upload';
import { auth } from '@clerk/nextjs/server';

// POST /api/upload - Process a bookshelf image
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { image } = await request.json();
    
    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }
    
    // Process the image and get a unique ID
    const imageId = await processBase64Image(image);
    
    // Return both the ID and the original base64 data
    return NextResponse.json({ 
      imageId, 
      imageData: image 
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
} 