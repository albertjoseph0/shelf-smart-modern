import sql from 'mssql';

// Configuration for Azure SQL connection
const config: sql.config = {
  server: process.env.DB_SERVER || '',
  database: process.env.DB_NAME || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

// Connection pool to be reused
let pool: sql.ConnectionPool | null = null;

export async function getConnection(): Promise<sql.ConnectionPool> {
  try {
    if (pool) {
      return pool;
    }
    
    // Create a new connection pool
    pool = await new sql.ConnectionPool(config).connect();
    console.log('Connected to Azure SQL database');
    return pool;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

// Initialize the books table if it doesn't exist
export async function initializeDatabase(): Promise<void> {
  try {
    const pool = await getConnection();
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'books')
      BEGIN
        CREATE TABLE books (
          id UNIQUEIDENTIFIER PRIMARY KEY,
          title NVARCHAR(255) NOT NULL,
          author NVARCHAR(255),
          isbn10 NVARCHAR(20),
          isbn13 NVARCHAR(20),
          dateAdded DATETIME DEFAULT GETDATE(),
          shelfImageUrl NVARCHAR(MAX)
        )
      END
    `);
    console.log('Database initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Book interface
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn10?: string;
  isbn13?: string;
  dateAdded: Date;
  shelfImageUrl?: string;
}

// CRUD operations for books

// Get all books
export async function getAllBooks(): Promise<Book[]> {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT * FROM books ORDER BY dateAdded DESC
    `);
    return result.recordset;
  } catch (error) {
    console.error('Error getting books:', error);
    throw error;
  }
}

// Add a book
export async function addBook(book: Omit<Book, 'id' | 'dateAdded'>): Promise<Book> {
  try {
    const pool = await getConnection();
    const id = require('uuid').v4();
    
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, id)
      .input('title', sql.NVarChar, book.title)
      .input('author', sql.NVarChar, book.author || null)
      .input('isbn10', sql.NVarChar, book.isbn10 || null)
      .input('isbn13', sql.NVarChar, book.isbn13 || null)
      .input('shelfImageUrl', sql.NVarChar, book.shelfImageUrl || null)
      .query(`
        INSERT INTO books (id, title, author, isbn10, isbn13, shelfImageUrl)
        VALUES (@id, @title, @author, @isbn10, @isbn13, @shelfImageUrl);
        
        SELECT * FROM books WHERE id = @id;
      `);
    
    return result.recordset[0];
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
}

// Add multiple books at once
export async function addBooks(books: Omit<Book, 'id' | 'dateAdded'>[]): Promise<Book[]> {
  try {
    const addedBooks: Book[] = [];
    
    for (const book of books) {
      const addedBook = await addBook(book);
      addedBooks.push(addedBook);
    }
    
    return addedBooks;
  } catch (error) {
    console.error('Error adding multiple books:', error);
    throw error;
  }
} 