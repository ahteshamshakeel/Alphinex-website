# Setup Guide for Alphinex Solutions Website

## Quick Start Steps

Follow these steps to get your website running:

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
copy .env.example .env
```

Then edit `.env` file with your actual values:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/alphinex"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-this-with-openssl-rand-base64-32"
```

To generate a secure NEXTAUTH_SECRET, run:
```bash
openssl rand -base64 32
```

### 3. Set Up PostgreSQL Database

Make sure PostgreSQL is installed and running on your system.

Create a new database:
```sql
CREATE DATABASE alphinex;
```

### 4. Initialize Prisma

Generate Prisma client and push schema to database:

```bash
npx prisma generate
npx prisma db push
```

### 5. Seed the Database

Create the admin user:

```bash
npx tsx scripts/seed.ts
```

This creates an admin account with:
- Email: `admin@alphinexsolutions.com`
- Password: `admin123`

**IMPORTANT**: Change this password after first login!

### 6. Run Development Server

```bash
npm run dev
```

Visit:
- Website: http://localhost:3000
- Admin Panel: http://localhost:3000/admin/login

## Next Steps

1. Log in to the admin panel
2. Add your team members
3. Add client testimonials
4. Customize the content in the pages
5. Update company information
6. Add your logo and images

## Common Issues

### Database Connection Error
- Make sure PostgreSQL is running
- Check your DATABASE_URL in .env
- Verify database exists

### Authentication Not Working
- Make sure NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

### Prisma Errors
- Run `npx prisma generate` after any schema changes
- Run `npx prisma db push` to sync database

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

Vercel will automatically:
- Install dependencies
- Build the project
- Deploy to production

### Environment Variables for Production

Make sure to set these in your hosting platform:
- `DATABASE_URL` - Your production PostgreSQL URL
- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - Same secret or generate new one

### After Deployment

1. Run migrations on production database
2. Run seed script to create admin user
3. Test admin login
4. Add your content

## Support

For issues or questions, contact your development team.
