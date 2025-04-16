import { prisma } from '@/lib/prisma'; // Import prisma client
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Remove the old db import
// import { getAllBooks } from '../../../lib/db';

// GET /api/export - Export books as CSV
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Fetch books using Prisma
    const books = await prisma.book.findMany({
      orderBy: {
        dateAdded: 'desc',
      },
    });

    // Convert books data to CSV format
    const csvHeader = 'Title,Author,ISBN10,ISBN13,Date Added\n';
    const csvBody = books
      .map(
        (book) =>
          `"${book.title}","${book.author || ''}","${book.isbn10 || ''}","${book.isbn13 || ''}","${book.dateAdded.toISOString()}"`
      )
      .join('\n');
    const csvContent = csvHeader + csvBody;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="books.csv"',
      },
    });
  } catch (error) {
    console.error('Error exporting books:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 