#!/bin/sh

npx prisma db push --accept-data-loss

node -e '
const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("better-auth/crypto");

async function seed() {
  const prisma = new PrismaClient();
  const email = "admin@sicontrola.com";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) { console.log("Admin user already exists."); await prisma.$disconnect(); return; }
  const hashed = await hashPassword("Admin123!");
  await prisma.user.create({
    data: {
      name: "Admin",
      email,
      emailVerified: true,
      accounts: { create: { providerId: "credential", accountId: email, type: "credential", password: hashed } }
    }
  });
  console.log("Admin user created.");
  await prisma.$disconnect();
}
seed().catch(e => { console.error(e); process.exit(1); });
'

node dist/src/main
