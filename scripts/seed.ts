import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@alphinexsolutions.com' },
    update: {},
    create: {
      email: 'admin@alphinexsolutions.com',
      password: hashedPassword,
      name: 'Admin',
    },
  });

  // Create team members
  const teamMembers = [
    {
      name: 'Suleman Khan',
      role: 'CEO & Co-Founder',
      bio: 'Visionary leader with 10+ years of experience in software development and business strategy. Passionate about building innovative solutions that solve real-world problems.',
      linkedinUrl: 'https://www.linkedin.com/company/alphinex-solutions/',
      githubUrl: 'https://github.com/alphinex/',
      order: 1,
    },
    {
      name: 'Nouman Ahmed',
      role: 'CTO & Co-Founder',
      bio: 'Technology enthusiast with expertise in full-stack development, cloud architecture, and AI/ML. Leads our technical team to deliver cutting-edge solutions.',
      linkedinUrl: 'https://www.linkedin.com/company/alphinex-solutions/',
      githubUrl: 'https://github.com/alphinex/',
      order: 2,
    },
    {
      name: 'Sarah Mitchell',
      role: 'Lead UI/UX Designer',
      bio: 'Creative designer with a keen eye for detail. Specializes in creating intuitive and beautiful user experiences that delight customers.',
      linkedinUrl: 'https://www.linkedin.com/company/alphinex-solutions/',
      order: 3,
    },
    {
      name: 'Michael Chen',
      role: 'Senior Full Stack Developer',
      bio: 'Expert in React, Node.js, and cloud technologies. Builds scalable applications that handle millions of users with ease.',
      linkedinUrl: 'https://www.linkedin.com/company/alphinex-solutions/',
      githubUrl: 'https://github.com/alphinex/',
      order: 4,
    },
    {
      name: 'Emily Rodriguez',
      role: 'DevOps Engineer',
      bio: 'Infrastructure specialist ensuring our applications run smoothly 24/7. Expert in AWS, Docker, and Kubernetes.',
      linkedinUrl: 'https://www.linkedin.com/company/alphinex-solutions/',
      githubUrl: 'https://github.com/alphinex/',
      order: 5,
    },
    {
      name: 'David Thompson',
      role: 'Mobile App Developer',
      bio: 'Creates stunning mobile experiences for iOS and Android. Specializes in React Native and Flutter development.',
      linkedinUrl: 'https://www.linkedin.com/company/alphinex-solutions/',
      githubUrl: 'https://github.com/alphinex/',
      order: 6,
    },
  ];

  for (const member of teamMembers) {
    await prisma.teamMember.upsert({
      where: { id: `team-${member.order}` },
      update: member,
      create: {
        id: `team-${member.order}`,
        ...member,
      },
    });
  }

  // Create testimonials
  const testimonials = [
    {
      clientName: 'John Anderson',
      company: 'TechStart Inc.',
      message: 'Alphinex Solutions transformed our business with their innovative web application. The team was professional, responsive, and delivered beyond our expectations. Highly recommended!',
      rating: 5,
      order: 1,
    },
    {
      clientName: 'Lisa Martinez',
      company: 'Digital Ventures',
      message: 'Working with Alphinex was a game-changer for our startup. They built our mobile app in record time without compromising on quality. Their expertise in React Native is outstanding!',
      rating: 5,
      order: 2,
    },
    {
      clientName: 'Robert Williams',
      company: 'Global Solutions Ltd.',
      message: 'The cloud infrastructure they set up for us has been rock solid. Our application handles 10x more traffic now with zero downtime. Excellent work!',
      rating: 5,
      order: 3,
    },
    {
      clientName: 'Amanda Foster',
      company: 'Creative Studios',
      message: 'Their UI/UX design team created an absolutely beautiful interface for our platform. Our user engagement increased by 40% after the redesign. Thank you Alphinex!',
      rating: 5,
      order: 4,
    },
    {
      clientName: 'James Cooper',
      company: 'E-Commerce Pro',
      message: 'Alphinex Solutions helped us automate our entire workflow using N8n. We saved countless hours and reduced operational costs significantly. True automation experts!',
      rating: 5,
      order: 5,
    },
    {
      clientName: 'Maria Garcia',
      company: 'Marketing Masters',
      message: 'Their video editing services are top-notch! They transformed our raw footage into engaging content that boosted our social media presence tremendously.',
      rating: 5,
      order: 6,
    },
    {
      clientName: 'Thomas Brown',
      company: 'FinTech Solutions',
      message: 'The consulting services provided by Alphinex were invaluable. They helped us choose the right tech stack and architecture for our fintech platform. Money well spent!',
      rating: 5,
      order: 7,
    },
    {
      clientName: 'Jennifer Lee',
      company: 'Health Tech Inc.',
      message: 'Outstanding support and maintenance! They keep our healthcare application running smoothly and respond to issues within minutes. True professionals!',
      rating: 5,
      order: 8,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: `testimonial-${testimonial.order}` },
      update: testimonial,
      create: {
        id: `testimonial-${testimonial.order}`,
        ...testimonial,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('📧 Admin email: admin@alphinexsolutions.com');
  console.log('🔑 Admin password: admin123');
  console.log(`👥 Created ${teamMembers.length} team members`);
  console.log(`💬 Created ${testimonials.length} testimonials`);

  // Seed contact emails
  console.log('Seeding contact emails...');
  const contactEmails = [
    { email: 'alphinexsolutions@gmail.com', isActive: true, order: 1 },
    { email: 'suleman@alphinex.com', isActive: true, order: 2 },
    { email: 'nouman@alphinex.com', isActive: true, order: 3 },
  ];

  for (const contactEmail of contactEmails) {
    await prisma.contactEmail.upsert({
      where: { email: contactEmail.email },
      update: contactEmail,
      create: contactEmail,
    });
  }

  console.log(`📧 Created ${contactEmails.length} contact emails`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
