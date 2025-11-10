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

    // Check if bucket exists first
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
      throw new Error(`Failed to access storage: ${listError.message}`);
    }

    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    if (!bucketExists) {
      throw new Error(
        `Storage bucket "${BUCKET_NAME}" not found. Please create it in Supabase Dashboard:\n` +
        `1. Go to Storage in Supabase Dashboard\n` +
        `2. Click "New bucket"\n` +
        `3. Name it: "${BUCKET_NAME}"\n` +
        `4. Set it to Public\n` +
        `5. Click "Create bucket"`
      );
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
      if (error.message.includes('Bucket not found')) {
        throw new Error(
          `Storage bucket "${BUCKET_NAME}" not found. Please create it in Supabase Dashboard:\n` +
          `1. Go to Storage in Supabase Dashboard\n` +
          `2. Click "New bucket"\n` +
          `3. Name it: "${BUCKET_NAME}"\n` +
          `4. Set it to Public\n` +
          `5. Click "Create bucket"`
        );
      }
      throw error;
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
 */
export const checkBucketExists = async (): Promise<boolean> => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error('Error checking buckets:', error);
      return false;
    }
    return buckets?.some(bucket => bucket.name === BUCKET_NAME) || false;
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

