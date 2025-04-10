import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Directory to store uploaded images
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
export async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
  }
}

/**
 * Save a base64 encoded image to the uploads directory
 * @param base64Image - The base64 encoded image data
 * @returns The URL path to the saved image
 */
export async function saveBase64Image(base64Image: string): Promise<string> {
  await ensureUploadDir();
  
  // Extract the actual base64 data from the data URL
  const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 image format');
  }
  
  const imageType = matches[1];
  const imageData = matches[2];
  const buffer = Buffer.from(imageData, 'base64');
  
  // Determine file extension
  const extension = imageType.split('/')[1] || 'jpg';
  
  // Generate a unique filename
  const filename = `${uuidv4()}.${extension}`;
  const filePath = path.join(UPLOAD_DIR, filename);
  
  // Save the image
  await fs.writeFile(filePath, buffer);
  
  // Return the URL path
  return `/uploads/${filename}`;
}

/**
 * Get the full URL for an image path
 * @param imagePath - The image path relative to public directory
 * @returns The full URL for the image
 */
export function getImageUrl(imagePath: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
  return `${baseUrl}${imagePath}`;
} 