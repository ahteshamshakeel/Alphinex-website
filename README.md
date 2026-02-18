# Alphinex Solutions Website

Modern company website built with Next.js 14, TypeScript, Tailwind CSS, and Prisma.

## Features

- Modern, responsive design
- Dynamic team member management
- Dynamic testimonials management
- Admin panel with authentication
- PostgreSQL database with Prisma ORM
- SEO-friendly structure

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up your environment variables:

```bash
cp .env.example .env
```

Edit `.env` and add your database URL and other credentials:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for development)

3. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

4. Seed the database with an admin user:

```bash
npx tsx scripts/seed.ts
```

Default admin credentials:
- Email: admin@alphinexsolutions.com
- Password: admin123

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## Admin Panel

Access the admin panel at [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

From the admin panel you can:
- Add, edit, and delete team members
- Add, edit, and delete testimonials
- Manage content dynamically

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   └── (public pages)/    # Public website pages
├── components/            # React components
├── lib/                   # Utility functions and configurations
├── prisma/               # Database schema
└── scripts/              # Utility scripts
```

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Deployment**: Vercel (recommended)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Make sure to:
1. Set up PostgreSQL database
2. Configure environment variables
3. Run `npx prisma generate` and `npx prisma db push`
4. Run the seed script to create admin user

## Customization

- Update company information in pages
- Modify colors in `tailwind.config.ts`
- Add more sections as needed
- Customize the admin panel

## License

Private - Alphinex Solutions
