import { NextRequest, NextResponse } from 'next/server';
import { getAllBooks, addBook } from '../../lib/db';

// GET /api/books - Get all books
export async function GET() {
  try {
    const books = await getAllBooks();
    return NextResponse.json(books);
  } catch (error) {
    console.error('Error getting books:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve books' },
      { status: 500 }
    );
  }
}

// POST /api/books - Add a new book
export async function POST(request: NextRequest) {
  try {
    const book = await request.json();
    
    // Validate required fields
    if (!book.title) {
      return NextResponse.json(
        { error: 'Book title is required' },
        { status: 400 }
      );
    }
    
    // Add the book to the database
    const newBook = await addBook(book);
    
    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error('Error adding book:', error);
    return NextResponse.json(
      { error: 'Failed to add book' },
      { status: 500 }
    );
  }
} 