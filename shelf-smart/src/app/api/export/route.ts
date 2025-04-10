import { NextResponse } from 'next/server';
import { getAllBooks } from '../../lib/db';

// GET /api/export - Export books as CSV
export async function GET() {
  try {
    const books = await getAllBooks();
    
    if (!books || books.length === 0) {
      return NextResponse.json(
        { error: 'No books to export' },
        { status: 404 }
      );
    }
    
    // Format the data for CSV
    const rows = books.map(book => ({
      title: book.title,
      author: book.author || '',
      isbn10: book.isbn10 || '',
      isbn13: book.isbn13 || '',
      dateAdded: book.dateAdded ? new Date(book.dateAdded).toISOString().split('T')[0] : ''
    }));
    
    return NextResponse.json({ books: rows });
  } catch (error) {
    console.error('Error exporting books:', error);
    return NextResponse.json(
      { error: 'Failed to export books' },
      { status: 500 }
    );
  }
} 