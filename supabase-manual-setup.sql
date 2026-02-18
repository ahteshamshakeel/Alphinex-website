-- Run this SQL in Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/utcrulmuqngwcdfdczzw/sql/new

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create TeamMember table
CREATE TABLE IF NOT EXISTS "TeamMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT,
    "photoUrl" TEXT,
    "linkedinUrl" TEXT,
    "twitterUrl" TEXT,
    "githubUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Testimonial table
CREATE TABLE IF NOT EXISTS "Testimonial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientName" TEXT NOT NULL,
    "company" TEXT,
    "message" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "photoUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Job table
CREATE TABLE IF NOT EXISTS "Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "salary" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Application table
CREATE TABLE IF NOT EXISTS "Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "portfolio" TEXT,
    "linkedinUrl" TEXT,
    "cvUrl" TEXT NOT NULL,
    "coverLetter" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create ContactEmail table
CREATE TABLE IF NOT EXISTS "ContactEmail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Project table
CREATE TABLE IF NOT EXISTS "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cost" TEXT NOT NULL,
    "demoUrl" TEXT,
    "username" TEXT,
    "password" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "coverImage" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Blog table
CREATE TABLE IF NOT EXISTS "Blog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "author" TEXT NOT NULL DEFAULT 'Alphinex Solutions',
    "category" TEXT NOT NULL DEFAULT 'Technology',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "Application_jobId_idx" ON "Application"("jobId");
CREATE INDEX IF NOT EXISTS "Blog_slug_idx" ON "Blog"("slug");
CREATE INDEX IF NOT EXISTS "Blog_isPublished_idx" ON "Blog"("isPublished");

-- Success message
SELECT 'Database schema created successfully!' as message;
