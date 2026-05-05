#!/bin/sh

npx prisma db push --accept-data-loss

node -e '
const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("better-auth/crypto");

async function seed() {
  const prisma = new PrismaClient();

  const users = [
    { name: "Administrador", email: "admin@sicontrola.com.br", password: "admin123", role: "ADMIN" },
    { name: "Secretaria", email: "secretaria@sicontrola.com.br", password: "secretaria123", role: "SECRETARIA" },
    { name: "Aluno Demo", email: "aluno@sicontrola.com.br", password: "aluno123", role: "ALUNO" },
    { name: "Motorista Demo", email: "motorista@sicontrola.com.br", password: "motorista123", role: "MOTORISTA" },
  ];

  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) { console.log("Já existe: " + u.email); continue; }
    const hashed = await hashPassword(u.password);
    await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        emailVerified: true,
        role: u.role,
        accounts: { create: { providerId: "credential", accountId: u.email, type: "credential", password: hashed } }
      }
    });
    console.log("Criado: " + u.email);
  }

  await prisma.$disconnect();
  console.log("Seed concluído.");
}
seed().catch(e => { console.error(e); process.exit(1); });
'

node dist/src/main
