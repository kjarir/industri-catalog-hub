# Hostinger Deployment Guide

## Fix 404 Errors on Routes (e.g., /products)

When you deploy a React SPA (Single Page Application) to Hostinger, you need to configure the server to serve `index.html` for all routes.

### Solution: Add .htaccess File

I've created a `.htaccess` file in the `public` folder. This file will be automatically copied to your `dist` folder when you build.

### Steps to Fix:

1. **Build your project:**
   ```bash
   npm run build
   ```

2. **Upload the `dist` folder contents to Hostinger:**
   - Go to Hostinger File Manager
   - Navigate to `public_html` folder
   - Upload all files from the `dist` folder

3. **Make sure `.htaccess` is uploaded:**
   - The `.htaccess` file should be in the root of `public_html`
   - It should be visible (not hidden)
   - If it's not there, upload it manually from `dist/.htaccess`

4. **Verify the file is working:**
   - Try accessing `flowravalves.com/products`
   - It should now work instead of showing 404

### Alternative: If .htaccess doesn't work

If `.htaccess` doesn't work (some Hostinger plans don't support it), you can:

1. **Use Hostinger's File Manager:**
   - Go to File Manager
   - Look for "Index Manager" or "Directory Index"
   - Set it to `index.html`

2. **Or create a `web.config` file** (if using Windows hosting):
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <configuration>
     <system.webServer>
       <rewrite>
         <rules>
           <rule name="React Routes" stopProcessing="true">
             <match url=".*" />
             <conditions logicalGrouping="MatchAll">
               <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
               <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
             </conditions>
             <action type="Rewrite" url="/index.html" />
           </rule>
         </rules>
       </rewrite>
     </system.webServer>
   </configuration>
   ```

### Important Notes:

- **Base URL:** Make sure your React Router is configured correctly
- **Environment Variables:** Update any API URLs to use production URLs
- **Supabase:** Make sure your Supabase project is set to production mode
- **HTTPS:** Hostinger should automatically provide SSL certificates

### Testing:

After deployment, test these URLs:
- `flowravalves.com` ✅
- `flowravalves.com/products` ✅
- `flowravalves.com/about` ✅
- `flowravalves.com/contact` ✅
- `flowravalves.com/products/[id]` ✅

All should work without 404 errors!

