import { NextRequest, NextResponse } from 'next/server';
import { extractBooksFromImage } from '../../lib/openai';
import { getBooksDetails } from '../../lib/googleBooks';
import { getImageUrl } from '../../lib/upload';

// POST /api/extract - Extract books from image and get details
export async function POST(request: NextRequest) {
  try {
    const { imagePath } = await request.json();
    
    if (!imagePath) {
      return NextResponse.json(
        { error: 'Image path is required' },
        { status: 400 }
      );
    }
    
    // Get the full image URL
    const imageUrl = getImageUrl(imagePath);
    
    // Extract books from the image using OpenAI GPT-4o Vision
    const extractedBooks = await extractBooksFromImage(imageUrl);
    
    // Get detailed information for each book using Google Books API
    const booksWithDetails = await getBooksDetails(extractedBooks);
    
    // Add the image path to each book
    const books = booksWithDetails.map(book => ({
      ...book,
      shelfImageUrl: imagePath
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