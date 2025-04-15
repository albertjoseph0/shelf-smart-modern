import { NextRequest, NextResponse } from 'next/server';
import { getAllBooks, addBook, addBooks, Book } from '../../../lib/db';

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

// POST /api/books - Add a new book or multiple books
export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    
    // Handle array of books
    if (Array.isArray(requestData.books)) {
      if (requestData.books.length === 0) {
        return NextResponse.json(
          { error: 'No books provided' },
          { status: 400 }
        );
      }
      
      // Validate required fields in all books
      const invalidBooks = requestData.books.filter((book: Partial<Book>) => !book.title);
      if (invalidBooks.length > 0) {
        return NextResponse.json(
          { error: 'All books must have a title' },
          { status: 400 }
        );
      }
      
      // Add the books to the database
      const newBooks = await addBooks(requestData.books);
      
      return NextResponse.json(newBooks, { status: 201 });
    } 
    // Handle single book
    else if (requestData.title) {
      // Add the book to the database
      const newBook = await addBook(requestData);
      
      return NextResponse.json(newBook, { status: 201 });
    }
    // Handle invalid request
    else {
      return NextResponse.json(
        { error: 'Invalid request. Provide either a book object or an array of books' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error adding book(s):', error);
    return NextResponse.json(
      { error: 'Failed to add book(s)' },
      { status: 500 }
    );
  }
} 