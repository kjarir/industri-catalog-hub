/**
 * Converts Google Drive sharing links to direct image URLs
 * Supports multiple Google Drive link formats
 * 
 * IMPORTANT: For images to work, the Google Drive file must be:
 * 1. Shared with "Anyone with the link" permission
 * 2. Not in a folder that requires access
 * 3. An image file (jpg, png, gif, webp, etc.)
 */
export const convertGoogleDriveUrl = (url: string | null | undefined): string | null => {
  if (!url || url.trim() === '') return null;

  // If it's already a direct image URL (Supabase Storage, Imgur, etc.), return as is
  if (!url.includes('drive.google.com') && !url.includes('googleusercontent.com')) {
    return url.trim();
  }

  // If it's already a googleusercontent.com URL, return as is (these are direct image URLs)
  if (url.includes('googleusercontent.com')) {
    return url.trim();
  }

  // If it's a Supabase Storage URL, return as is
  if (url.includes('supabase.co') || url.includes('supabase.storage')) {
    return url.trim();
  }

  // Extract file ID from various Google Drive URL formats
  let fileId: string | null = null;

  // Format 1: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match1) {
    fileId = match1[1];
  }

  // Format 2: https://drive.google.com/open?id=FILE_ID
  if (!fileId) {
    const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match2) {
      fileId = match2[1];
    }
  }

  // Format 3: https://drive.google.com/uc?id=FILE_ID (already in correct format)
  if (url.includes('/uc?') && url.includes('id=')) {
    // Make sure it has export=view parameter
    if (!url.includes('export=view')) {
      const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (idMatch) {
        return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
      }
    }
    return url;
  }

  // If we found a file ID, try multiple methods to get the image
  if (fileId) {
    // Try standard export method first (full quality)
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
    
    // Alternative: Thumbnail API (uncomment if export=view doesn't work)
    // return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1920`;
  }

  // If we couldn't parse it, return the original URL
  return url;
};

/**
 * Checks if an image URL is valid and accessible
 */
export const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  
  // Basic URL validation
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

