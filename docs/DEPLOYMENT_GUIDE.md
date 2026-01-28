# Deployment Guide - Flight Planner

## 🚀 Building for Production

### Step 1: Build the Application

Run the production build command:

```bash
npm run build
```

This will:
- Type-check your TypeScript code
- Bundle and optimize all assets
- Generate production-ready files in the `dist/` folder

**Note:** If you have TypeScript errors that you want to skip (not recommended), you can use:
```bash
npm run build:skip-check
```

### Step 2: Check the Build Output

After building, you'll find all production files in the `dist/` directory:

```
dist/
├── index.html          # Main HTML file
├── assets/
│   ├── index-[hash].js    # Bundled JavaScript
│   ├── index-[hash].css   # Bundled CSS
│   └── [other assets]     # Images, fonts, etc.
```

### Step 3: Test the Build Locally (Optional)

Before deploying, test the production build locally:

```bash
npm run preview
```

This serves the `dist/` folder at `http://localhost:4173` so you can verify everything works.

---

## 📤 Deployment Options

### Option 1: Static Web Hosting (Recommended)

Since this app uses **HashRouter** (`#` in URLs), it works perfectly with static hosting. No server-side configuration needed!

#### Popular Static Hosting Services:

**Netlify** (Easiest)
1. Sign up at [netlify.com](https://netlify.com)
2. Drag and drop your `dist/` folder to deploy
3. Or connect your Git repository for automatic deployments

**Vercel**
1. Sign up at [vercel.com](https://vercel.com)
2. Import your project
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy!

**GitHub Pages**
1. Build your app: `npm run build`
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Add to `package.json`:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```
4. Run: `npm run deploy`

**Cloudflare Pages**
1. Connect your Git repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy!

---

### Option 2: Traditional Web Server

If you have your own web server (Apache, Nginx, etc.):

#### Apache Configuration

1. Upload the entire `dist/` folder contents to your web root
2. Create/update `.htaccess` file in the root:
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

#### Nginx Configuration

1. Upload the entire `dist/` folder contents to your web root
2. Update your Nginx config:
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;
     root /path/to/dist;
     index index.html;

     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

**Note:** Since you're using HashRouter (`#`), the above rewrite rules are actually optional - the `#` routes work without server configuration. But it's good practice to include them.

---

## 🔧 Build Configuration

### Current Vite Config

Your `vite.config.ts` is already optimized for production. Vite automatically:
- Minifies JavaScript and CSS
- Tree-shakes unused code
- Optimizes images
- Splits code for better caching

### Environment Variables (if needed)

If you need environment variables:

1. Create `.env.production` file:
   ```
   VITE_API_URL=https://api.example.com
   VITE_MAPBOX_TOKEN=your_token_here
   ```

2. Access in code:
   ```typescript
   const apiUrl = import.meta.env.VITE_API_URL;
   ```

3. Variables must start with `VITE_` to be exposed to the client

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure:

- [ ] Build completes without errors: `npm run build`
- [ ] Preview works locally: `npm run preview`
- [ ] All routes work (test navigation)
- [ ] No console errors in browser DevTools
- [ ] Mobile responsive (test on phone)
- [ ] All images/assets load correctly
- [ ] localStorage works (data persists)
- [ ] External resources load (if any)

---

## 🎯 Quick Deploy Commands

### Build Only
```bash
npm run build
```

### Build + Preview Locally
```bash
npm run build && npm run preview
```

### Build Output Location
The built files are in: `./dist/`

---

## 🌐 Important Notes

### HashRouter vs BrowserRouter

Your app uses **HashRouter** (URLs like `/#/results`), which means:
- ✅ Works on any static hosting (no server config needed)
- ✅ No need for URL rewriting
- ✅ Works with GitHub Pages, Netlify, etc. out of the box
- ⚠️ URLs have `#` in them (e.g., `yoursite.com/#/assessment`)

If you want cleaner URLs (without `#`), you'd need to:
1. Switch to `BrowserRouter` in `App.tsx`
2. Configure server rewrites (see Apache/Nginx configs above)

### File Size Optimization

Vite automatically optimizes your build. To check bundle sizes:

```bash
npm run build
# Check the output - it shows file sizes
```

If bundles are large, consider:
- Code splitting (already done with lazy loading)
- Image optimization
- Removing unused dependencies

---

## 🚨 Common Issues

### Issue: Blank page after deployment

**Solution:** Make sure you uploaded the `dist/` folder contents, not the `dist/` folder itself.

### Issue: Routes don't work (404 errors)

**Solution:** Since you're using HashRouter, this shouldn't happen. But if you switch to BrowserRouter, you need server rewrite rules (see above).

### Issue: Assets not loading

**Solution:** Check that all files in `dist/assets/` are uploaded. Paths should be relative.

### Issue: Build fails with TypeScript errors

**Solution:** Fix the errors, or use `npm run build:skip-check` (not recommended for production).

---

## 📦 What Gets Deployed

Only the `dist/` folder contents need to be uploaded:

```
dist/
├── index.html
└── assets/
    ├── index-[hash].js
    ├── index-[hash].css
    └── [other assets]
```

**Do NOT upload:**
- `node_modules/`
- `src/`
- `public/` (contents are already in dist)
- `.git/`
- `package.json` (not needed for static hosting)

---

## 🎉 You're Ready!

Once you've built and uploaded the `dist/` folder contents, your Flight Planner app will be live!

**Recommended:** Start with Netlify or Vercel for the easiest deployment experience.

