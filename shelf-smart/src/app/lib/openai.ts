import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ExtractedBook {
  title: string;
  author: string;
}

/**
 * Extract book information from an image using OpenAI's GPT-4o Vision API
 * @param imageUrl - The URL of the image to analyze
 * @returns An array of extracted book information (title and author)
 */
export async function extractBooksFromImage(imageUrl: string): Promise<ExtractedBook[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a book identification expert. Given an image input, identify all visible book titles and authors. Respond in JSON format with an array of books, each containing 'title' and 'author' fields. If only the title or author is visible, include what's identifiable. If no books are identified or the image cannot be processed, return an empty array."
        },
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: imageUrl } }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 4000,
    });

    // Parse the response to get the extracted books
    const content = response.choices[0]?.message?.content || '{"books": []}';
    const parsedContent = JSON.parse(content);
    
    // Handle different possible response formats
    // The API might return either {"books": [...]} or just the array directly
    const extractedBooks = parsedContent.books || parsedContent;
    
    // Ensure we have an array, and properly handle the empty array case specified in the prompt
    if (!Array.isArray(extractedBooks)) {
      console.log('Unexpected response format from OpenAI, defaulting to empty array');
      return [];
    }
    
    // Map each book to ensure consistent format with title and author properties
    return extractedBooks.map((book: any) => ({
      title: book.title || '',
      author: book.author || '',
    }));
      
  } catch (error) {
    console.error('Error extracting books from image:', error);
    throw error;
  }
} 