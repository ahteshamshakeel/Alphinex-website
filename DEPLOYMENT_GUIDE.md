# Netlify Deployment Guide for Alphinex Solutions Website

## Prerequisites
- GitHub account
- Netlify account (free tier is fine)
- PostgreSQL database (we'll use Neon - free tier)

---

## Step 1: Prepare Your Code for Deployment

### 1.1 Update package.json
Make sure your `package.json` has the correct build script:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 1.2 Create .gitignore (if not exists)
Ensure these are in your `.gitignore`:

```
node_modules/
.next/
.env
.env.local
.DS_Store
*.log
```

### 1.3 Commit Your Code
```bash
git add .
git commit -m "Prepare for Netlify deployment"
```

---

## Step 2: Set Up PostgreSQL Database (Neon)

### 2.1 Create Neon Account
1. Go to https://neon.tech
2. Sign up with GitHub (free)
3. Click "Create a project"

### 2.2 Get Database Connection String
1. After creating project, go to "Dashboard"
2. Click "Connection Details"
3. Copy the connection string (looks like):
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Save this - you'll need it later

### 2.3 Run Database Migrations
In your local terminal:

```bash
# Set the database URL temporarily
$env:DATABASE_URL="your-neon-connection-string-here"

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

---

## Step 3: Push Code to GitHub

### 3.1 Create GitHub Repository
1. Go to https://github.com
2. Click "New repository"
3. Name it: `alphinex-solutions`
4. Don't initialize with README (you already have code)
5. Click "Create repository"

### 3.2 Push Your Code
```bash
# Initialize git (if not already done)
git init

# Add remote
git remote add origin https://github.com/YOUR-USERNAME/alphinex-solutions.git

# Push code
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy to Netlify

### 4.1 Create Netlify Account
1. Go to https://netlify.com
2. Sign up with GitHub
3. Authorize Netlify to access your repositories

### 4.2 Import Your Project
1. Click "Add new site" → "Import an existing project"
2. Choose "Deploy with GitHub"
3. Select your `alphinex-solutions` repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Functions directory:** (leave empty)

### 4.3 Add Environment Variables
Before deploying, click "Show advanced" → "New variable" and add:

```
DATABASE_URL=your-neon-connection-string-here
NEXTAUTH_SECRET=generate-a-random-secret-here
NEXTAUTH_URL=https://your-site-name.netlify.app
```

To generate NEXTAUTH_SECRET, run in terminal:
```bash
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32

### 4.4 Deploy
1. Click "Deploy site"
2. Wait 3-5 minutes for build to complete
3. Your site will be live at: `https://random-name-123.netlify.app`

---

## Step 5: Configure Custom Domain (Optional)

### 5.1 Add Custom Domain in Netlify
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain: `alphinex.com`
4. Click "Verify"

### 5.2 Update DNS in Namecheap
1. Log in to Namecheap
2. Go to Domain List → Manage
3. Go to "Advanced DNS"
4. Add these records:

**For root domain (alphinex.com):**
```
Type: A Record
Host: @
Value: 75.2.60.5
TTL: Automatic
```

**For www subdomain:**
```
Type: CNAME Record
Host: www
Value: your-site-name.netlify.app
TTL: Automatic
```

### 5.3 Enable HTTPS
1. In Netlify, go to Domain settings
2. Click "Verify DNS configuration"
3. Wait 24-48 hours for DNS propagation
4. Netlify will automatically provision SSL certificate

### 5.4 Update Environment Variables
Update `NEXTAUTH_URL` in Netlify:
```
NEXTAUTH_URL=https://alphinex.com
```

---

## Step 6: Set Up File Uploads

### 6.1 Configure Netlify Large Media (Optional)
For file uploads, you have two options:

**Option A: Use Cloudinary (Recommended)**
1. Sign up at https://cloudinary.com (free tier)
2. Get your credentials
3. Add to Netlify environment variables:
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Option B: Use Netlify Blob Storage**
1. Enable Netlify Blobs in site settings
2. Update your upload API route to use Netlify Blobs

---

## Step 7: Test Your Deployment

### 7.1 Test Core Features
1. Visit your site: `https://your-site.netlify.app`
2. Test navigation
3. Test contact form
4. Test admin login at `/admin/login`
5. Test job applications
6. Test blog creation and viewing

### 7.2 Check Admin Panel
1. Go to `/admin/login`
2. Login with your credentials
3. Test creating/editing content

---

## Step 8: Set Up Continuous Deployment

### 8.1 Automatic Deployments
Netlify automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update content"
git push origin main

# Netlify will automatically rebuild and deploy
```

### 8.2 Deploy Previews
- Every pull request gets a preview URL
- Test changes before merging to main

---

## Troubleshooting

### Build Fails
1. Check build logs in Netlify dashboard
2. Common issues:
   - Missing environment variables
   - Database connection issues
   - Node version mismatch

### Database Connection Issues
1. Verify DATABASE_URL is correct
2. Check Neon database is active
3. Ensure SSL mode is enabled: `?sslmode=require`

### Images Not Loading
1. Check file paths are correct
2. Verify uploads directory exists
3. Consider using Cloudinary for production

### Admin Login Not Working
1. Verify NEXTAUTH_SECRET is set
2. Check NEXTAUTH_URL matches your domain
3. Clear browser cookies and try again

---

## Performance Optimization

### 1. Enable Caching
In `next.config.js`:
```javascript
module.exports = {
  images: {
    domains: ['your-domain.com'],
  },
  headers: async () => [
    {
      source: '/:all*(svg|jpg|png)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
}
```

### 2. Optimize Images
- Use Next.js Image component
- Compress images before upload
- Use WebP format when possible

### 3. Monitor Performance
- Use Netlify Analytics
- Check Core Web Vitals
- Monitor build times

---

## Maintenance

### Regular Updates
```bash
# Update dependencies
npm update

# Check for security issues
npm audit

# Push updates
git add .
git commit -m "Update dependencies"
git push origin main
```

### Database Backups
1. Neon provides automatic backups
2. Export data regularly:
```bash
npx prisma db pull
```

### Monitor Logs
- Check Netlify function logs
- Monitor error rates
- Set up alerts for downtime

---

## Cost Breakdown

### Free Tier Includes:
- **Netlify:** 100GB bandwidth, 300 build minutes/month
- **Neon:** 0.5GB storage, 1 database
- **Total:** $0/month for small traffic

### Paid Plans (if needed):
- **Netlify Pro:** $19/month (1TB bandwidth, 1000 build minutes)
- **Neon Pro:** $19/month (10GB storage, multiple databases)

---

## Support Resources

- **Netlify Docs:** https://docs.netlify.com
- **Next.js Docs:** https://nextjs.org/docs
- **Neon Docs:** https://neon.tech/docs
- **Prisma Docs:** https://www.prisma.io/docs

---

## Quick Commands Reference

```bash
# Local development
npm run dev

# Build for production
npm run build

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Push to GitHub
git add .
git commit -m "Your message"
git push origin main

# View Prisma Studio (database GUI)
npx prisma studio
```

---

## Next Steps After Deployment

1. ✅ Test all features thoroughly
2. ✅ Set up Google Analytics
3. ✅ Configure SEO metadata
4. ✅ Set up email notifications
5. ✅ Create backup strategy
6. ✅ Monitor performance
7. ✅ Set up status page
8. ✅ Document admin procedures

---

**Congratulations! Your Alphinex Solutions website is now live! 🎉**

For any issues, check the Netlify build logs or contact support.
