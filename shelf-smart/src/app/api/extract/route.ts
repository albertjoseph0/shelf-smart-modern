import { NextRequest, NextResponse } from 'next/server';
import { extractBooksFromImage } from '../../lib/openai';
import { getBooksDetails } from '../../lib/googleBooks';
import { auth } from '@clerk/nextjs/server';

// POST /api/extract - Extract books from image and get details
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { imageData, imageId } = await request.json();
    
    if (!imageData) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }
    
    // Extract books from the image using OpenAI GPT-4o Vision
    const extractedBooks = await extractBooksFromImage(imageData);
    
    // Get detailed information for each book using Google Books API
    const booksWithDetails = await getBooksDetails(extractedBooks);
    
    // Add the image ID and userId to each book for reference
    const books = booksWithDetails.map(book => ({
      ...book,
      imageId,
      userId
    }));
    
    return NextResponse.json({ books });
  } catch (error) {
    console.error('Error extracting books:', error);
    return NextResponse.json(
      { error: 'Failed to extract books from image' },
      { status: 500 }
    );
  }
} 