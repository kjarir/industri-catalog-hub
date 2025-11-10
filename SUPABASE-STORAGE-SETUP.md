# Supabase Storage Setup Guide

## Why Use Supabase Storage?

✅ **More Reliable** - No CORS issues, direct image URLs  
✅ **Integrated** - Works seamlessly with your existing Supabase setup  
✅ **Free Tier** - 500MB storage included  
✅ **Fast** - CDN-backed, optimized for web delivery  
✅ **Secure** - Built-in access control  

## Storage Capacity Calculation

With **500MB free tier**, you can store:

### Optimized Images (~100KB each)
- **~5,000 products** with images
- Best for web-optimized JPG/PNG images

### Average Images (~200KB each)
- **~2,500 products** with images
- Standard quality product photos

### High Quality Images (~500KB each)
- **~1,000 products** with images
- High-resolution, uncompressed images

### Recommendation
Optimize images to **100-200KB** each for best results. This gives you **2,500-5,000 products** with the free tier.

## Setup Instructions

### Step 1: Create Storage Bucket in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Storage** in the left sidebar
4. Click **"New bucket"**
5. Name it: `product-images`
6. Set it to **Public** (so images can be accessed without authentication)
7. Click **"Create bucket"**

### Step 2: Set Up Bucket Policies (Optional but Recommended)

1. Go to **Storage** → **Policies**
2. Click on `product-images` bucket
3. Add policies for:
   - **Upload**: Allow authenticated users to upload
   - **Read**: Allow public to read (for displaying images)

Or use SQL in Supabase SQL Editor:

```sql
-- Allow public to read images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

### Step 3: Test the Upload

1. Open Admin Panel (Ctrl+Shift+A)
2. Add/Edit a product
3. Click **"Upload Image to Supabase Storage"**
4. Select an image file
5. Wait for upload to complete
6. The image URL will be automatically filled in

## Image Optimization Tips

To maximize your storage capacity:

1. **Compress Images Before Upload**
   - Use tools like TinyPNG, Squoosh, or ImageOptim
   - Target: 100-200KB per image

2. **Use Appropriate Formats**
   - JPG for photos
   - PNG for graphics with transparency
   - WebP for modern browsers (best compression)

3. **Resize Images**
   - Product images don't need to be 4K
   - 1200x1200px is usually sufficient
   - Use square aspect ratio for consistency

## Monitoring Storage Usage

To check your storage usage:

1. Go to Supabase Dashboard
2. Navigate to **Storage**
3. Click on `product-images` bucket
4. View total size and file count

## Upgrading Storage

If you need more than 500MB:

- **Pro Plan**: $25/month - 100GB storage
- **Team Plan**: $599/month - 200GB storage
- Or use external storage (AWS S3, Cloudinary, etc.)

## Troubleshooting

### "Bucket not found" error
- Make sure you created the bucket named exactly `product-images`
- Check that the bucket is set to Public

### Upload fails
- Check file size (max 5MB per image)
- Verify you're logged in as admin
- Check browser console for errors

### Images not displaying
- Verify bucket is set to Public
- Check that the URL is correct
- Try accessing the URL directly in browser

## Benefits Over Google Drive

| Feature | Supabase Storage | Google Drive |
|---------|-----------------|--------------|
| Reliability | ✅ Always works | ❌ CORS issues |
| Integration | ✅ Native | ❌ External |
| CDN | ✅ Yes | ❌ No |
| Direct URLs | ✅ Yes | ❌ Needs conversion |
| Free Tier | ✅ 500MB | ✅ 15GB (but unreliable) |

Your images will now load faster and more reliably! 🚀

