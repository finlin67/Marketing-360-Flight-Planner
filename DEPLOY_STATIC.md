# Static HTML Export - Deployment Guide

## Build Output Location

Your static files are in the `dist/` folder:
```
dist/
├── index.html          (Main entry point)
├── assets/
│   ├── index-*.css     (All styles)
│   └── index-*.js       (All JavaScript)
```

## Quick Deploy to Web Server

### Option 1: Copy to Web Server
1. Copy the entire `dist/` folder contents to your web server
2. Make sure `index.html` is in the root of your web directory
3. Ensure your server serves `index.html` for all routes (since this uses HashRouter)

### Option 2: Upload via FTP/SFTP
- Upload all files from `dist/` to your web server's public directory
- Example: `/var/www/html/` or `/public_html/`

### Option 3: GitHub Pages / Netlify / Vercel
- These platforms can deploy directly from the `dist/` folder
- Or connect your repo and they'll build automatically

## Important Notes

### HashRouter Configuration
This app uses **HashRouter** (URLs like `/#/results`), so:
- ✅ Works on any static hosting (no server config needed)
- ✅ No need for URL rewriting rules
- ✅ Works with GitHub Pages, Netlify, Vercel, etc.

### Server Configuration (if using regular hosting)
If you're using Apache, add this to `.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

If using Nginx:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Testing Locally

Before uploading, test the build locally:
```bash
npm run preview
```
This serves the `dist/` folder at `http://localhost:4173`

## Rebuilding

When you make changes:
```bash
npm run build:skip-check    # Quick build (skips TypeScript checks)
# OR
npm run build                # Full build with type checking (will fail if TS errors)
```

## File Sizes
- Total: ~780 KB (gzipped: ~222 KB)
- CSS: ~32 KB (gzipped: ~6 KB)
- JS: ~780 KB (gzipped: ~222 KB)

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- No server-side rendering needed

---

**Note:** This is a test build. TypeScript errors were skipped. For production, fix TypeScript errors and use `npm run build`.

