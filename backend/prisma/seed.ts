import { PrismaClient } from '@prisma/client';
import { hashPassword } from 'better-auth/crypto';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@sicontrola.com';
  const name = 'Admin';
  const password = 'Admin123!';

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const existingAccount = await prisma.account.findUnique({
      where: {
        providerId_accountId: {
          providerId: 'credential',
          accountId: email,
        },
      },
    });

    if (existingAccount?.password) {
      console.log('Admin user and credential already exist, skipping seed.');
      return;
    }

    // User exists but missing credential - fix it
    const hashedPassword = await hashPassword(password);
    await prisma.account.upsert({
      where: {
        providerId_accountId: {
          providerId: 'credential',
          accountId: email,
        },
      },
      update: { password: hashedPassword },
      create: {
        providerId: 'credential',
        accountId: email,
        type: 'credential',
        password: hashedPassword,
        userId: existingUser.id,
      },
    });
    console.log('Credential account repaired for existing admin user.');
    return;
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.create({
    data: {
      name,
      email,
      emailVerified: true,
      accounts: {
        create: {
          providerId: 'credential',
          accountId: email,
          type: 'credential',
          password: hashedPassword,
        },
      },
    },
  });

  console.log(`Admin user created successfully: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
