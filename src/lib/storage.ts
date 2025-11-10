import { supabase } from './supabase';

const BUCKET_NAME = 'product-images';

/**
 * Upload an image file to Supabase Storage
 * @param file - The image file to upload
 * @param productId - Optional product ID to use in filename
 * @returns Public URL of the uploaded image
 */
export const uploadProductImage = async (
  file: File,
  productId?: string
): Promise<string> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 5MB per image)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 5MB');
    }

    // Try to verify bucket exists by attempting to list files
    // This is more reliable than listBuckets() which may require admin permissions
    const { error: testError } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', { limit: 1 });
    
    if (testError) {
      // If we get a "Bucket not found" error, the bucket doesn't exist
      if (testError.message.includes('not found') || testError.message.includes('Bucket')) {
        throw new Error(
          `Storage bucket "${BUCKET_NAME}" not found. Please create it in Supabase Dashboard:\n` +
          `1. Go to Storage in Supabase Dashboard\n` +
          `2. Click "New bucket"\n` +
          `3. Name it: "${BUCKET_NAME}"\n` +
          `4. Set it to Public\n` +
          `5. Click "Create bucket"`
        );
      }
      // Other errors might be permission-related, but we'll try to upload anyway
      console.warn('Bucket access test failed, but continuing:', testError.message);
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const fileName = productId
      ? `${productId}-${timestamp}.${fileExt}`
      : `product-${timestamp}-${randomId}.${fileExt}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false, // Don't overwrite existing files
      });

    if (error) {
      console.error('Upload error:', error);
      console.error('Error status:', error.statusCode);
      console.error('Error message:', error.message);
      
      // Check for bucket not found
      if (error.message?.includes('Bucket not found') || error.message?.includes('not found') || error.statusCode === '404') {
        throw new Error(
          `Storage bucket "${BUCKET_NAME}" not found. Please create it in Supabase Dashboard:\n` +
          `1. Go to Storage in Supabase Dashboard\n` +
          `2. Click "New bucket"\n` +
          `3. Name it: "${BUCKET_NAME}"\n` +
          `4. Set it to Public\n` +
          `5. Click "Create bucket"`
        );
      }
      
      // Check for permission errors (403)
      if (error.message?.includes('permission') || error.message?.includes('policy') || error.message?.includes('403') || error.statusCode === '403' || error.statusCode === 403) {
        throw new Error(
          `Permission denied. You need to set up Storage Policies:\n` +
          `1. Go to Supabase Dashboard → Storage → Policies\n` +
          `2. Click on "product-images" bucket\n` +
          `3. Add policy for INSERT (upload) for authenticated users\n` +
          `4. See SUPABASE-STORAGE-SETUP.md for SQL commands`
        );
      }
      
      // Generic error with more details
      throw new Error(error.message || `Failed to upload image. Status: ${error.statusCode || 'unknown'}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    throw new Error(error.message || 'Failed to upload image');
  }
};

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - The public URL of the image to delete
 */
export const deleteProductImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract file path from Supabase Storage URL
    // Format: https://[project].supabase.co/storage/v1/object/public/product-images/filename.jpg
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    
    // Find the index of the bucket name in the path
    const bucketIndex = pathParts.indexOf(BUCKET_NAME);
    if (bucketIndex === -1) {
      throw new Error('Invalid Supabase Storage URL');
    }
    
    // Get the file path (everything after the bucket name)
    const filePath = pathParts.slice(bucketIndex + 1).join('/');

    // Delete file from storage
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error('Error deleting image:', error);
    // Don't throw - image deletion failure shouldn't break the app
  }
};

/**
 * Check if the storage bucket exists
 * Tries multiple methods to verify bucket existence
 */
export const checkBucketExists = async (): Promise<boolean> => {
  try {
    // Method 1: List all buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.warn('Error listing buckets (may not have permission):', listError);
      
      // Method 2: Try to access the bucket directly by listing files
      // This works even if listBuckets() fails due to permissions
      const { data: files, error: filesError } = await supabase.storage
        .from(BUCKET_NAME)
        .list('', { limit: 1 });
      
      if (!filesError) {
        // If we can list files, the bucket exists
        console.log('Bucket exists (verified by file listing)');
        return true;
      }
      
      console.error('Cannot verify bucket existence:', filesError);
      return false;
    }
    
    // Check if bucket is in the list
    const exists = buckets?.some(bucket => bucket.name === BUCKET_NAME) || false;
    
    if (exists) {
      console.log('Bucket exists (verified by bucket list)');
      return true;
    }
    
    // Method 3: Try to access the bucket directly as fallback
    const { data: files, error: filesError } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', { limit: 1 });
    
    if (!filesError) {
      console.log('Bucket exists (verified by file listing fallback)');
      return true;
    }
    
    console.log('Bucket does not exist or is not accessible');
    return false;
  } catch (error) {
    console.error('Error checking bucket existence:', error);
    return false;
  }
};

/**
 * Get storage usage information
 */
export const getStorageInfo = async () => {
  try {
    const bucketExists = await checkBucketExists();
    if (!bucketExists) {
      return null;
    }

    const { data, error } = await supabase.storage.from(BUCKET_NAME).list();
    if (error) throw error;

    const totalSize = data.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
    const fileCount = data.length;

    return {
      totalSize,
      fileCount,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return null;
  }
};

