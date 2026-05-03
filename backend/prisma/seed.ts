import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo organization
  const org = await prisma.organization.upsert({
    where: { slug: 'nexoragrid-demo' },
    update: {},
    create: {
      name: 'NexoraGrid Demo',
      slug: 'nexoragrid-demo',
      plan: 'PRO',
      subscriptionStatus: 'ACTIVE',
      billingInterval: 'MONTHLY',
    },
  });

  console.log(`✅ Organization created: ${org.name}`);

  // Create admin user
  const hashedPassword = await bcrypt.hash('Demo1234!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@nexoragrid.com' },
    update: {},
    create: {
      email: 'admin@nexoragrid.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      displayName: 'Admin User',
      role: 'ADMIN',
      status: 'ACTIVE',
      organizationId: org.id,
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);

  // Create demo member
  const member = await prisma.user.upsert({
    where: { email: 'member@nexoragrid.com' },
    update: {},
    create: {
      email: 'member@nexoragrid.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      displayName: 'Jane Smith',
      role: 'MEMBER',
      status: 'ACTIVE',
      organizationId: org.id,
    },
  });

  console.log(`✅ Member user created: ${member.email}`);

  // Create demo project
  const project = await prisma.project.upsert({
    where: { organizationId_slug: { organizationId: org.id, slug: 'main-project' } },
    update: {},
    create: {
      name: 'Main Project',
      slug: 'main-project',
      description: 'The primary NexoraGrid demo project',
      status: 'ACTIVE',
      organizationId: org.id,
      color: '#6366f1',
    },
  });

  console.log(`✅ Project created: ${project.name}`);

  // Add members to project
  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: project.id, userId: admin.id } },
    update: {},
    create: { projectId: project.id, userId: admin.id, role: 'ADMIN' },
  });

  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: project.id, userId: member.id } },
    update: {},
    create: { projectId: project.id, userId: member.id, role: 'MEMBER' },
  });

  console.log('✅ Project members added');
  console.log('\n🎉 Seed complete!');
  console.log('\nDemo credentials:');
  console.log('  Admin: admin@nexoragrid.com / Demo1234!');
  console.log('  Member: member@nexoragrid.com / Demo1234!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
