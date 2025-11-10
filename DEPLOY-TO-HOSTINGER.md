# Deploy to Hostinger - Fix 404 Errors

## Problem
When you access routes like `flowravalves.com/products`, you get a 404 error because the server doesn't know to serve `index.html` for all routes.

## Solution
I've created `.htaccess` and `web.config` files that will fix this issue.

## Quick Fix Steps:

### 1. Build Your Project
```bash
npm run build
```

### 2. Upload to Hostinger
1. Go to Hostinger File Manager
2. Navigate to `public_html` folder
3. **Delete all old files** (or backup first)
4. Upload **ALL files** from the `dist` folder:
   - `index.html`
   - `.htaccess` ⚠️ **IMPORTANT - Make sure this is uploaded!**
   - `web.config` (backup for Windows hosting)
   - `favicon.ico`
   - `flowravalves.png`
   - `robots.txt`
   - `assets/` folder (with all files inside)

### 3. Make Sure .htaccess is Visible
- In Hostinger File Manager, make sure "Show Hidden Files" is enabled
- The `.htaccess` file should be visible in the root of `public_html`

### 4. Test Your Website
- Visit `flowravalves.com` ✅
- Visit `flowravalves.com/products` ✅
- Visit `flowravalves.com/about` ✅
- Visit `flowravalves.com/contact` ✅

All routes should now work!

## If .htaccess Doesn't Work:

### Option 1: Check Apache mod_rewrite
- Contact Hostinger support to enable `mod_rewrite`
- Or check if it's enabled in your hosting panel

### Option 2: Use web.config (Windows Hosting)
- If you're on Windows hosting, use `web.config` instead
- Make sure `web.config` is in the root of `public_html`

### Option 3: Manual Configuration
1. Go to Hostinger Control Panel
2. Look for "Index Manager" or "Directory Index"
3. Set default file to `index.html`

## Important Notes:

- **Always upload `.htaccess`** - This is the key file that fixes routing
- **Upload the entire `dist` folder contents** - Don't miss any files
- **Clear browser cache** - Press Ctrl+Shift+R after deployment
- **Check file permissions** - Make sure `.htaccess` has read permissions

## Files You Need to Upload:

```
public_html/
├── .htaccess          ← CRITICAL: Fixes routing
├── web.config         ← Backup for Windows hosting
├── index.html         ← Main HTML file
├── favicon.ico
├── flowravalves.png
├── robots.txt
└── assets/
    ├── index-*.js     ← JavaScript bundle
    ├── index-*.css    ← CSS bundle
    └── hero-*.jpg     ← Images
```

## After Deployment:

1. ✅ Test all routes work
2. ✅ Check images load correctly
3. ✅ Verify Supabase connection works
4. ✅ Test admin panel (Ctrl+Shift+A)
5. ✅ Check contact form works

Your website should now work perfectly! 🚀

