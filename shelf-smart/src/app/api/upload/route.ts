import { NextRequest, NextResponse } from 'next/server';
import { saveBase64Image } from '../../lib/upload';

// POST /api/upload - Upload a bookshelf image
export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();
    
    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }
    
    // Save the image and get the image path
    const imagePath = await saveBase64Image(image);
    
    return NextResponse.json({ imagePath });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
} 