import { PrismaClient } from '@prisma/client';
import { hashPassword } from 'better-auth/crypto';

const prisma = new PrismaClient();

async function main() {
  // --- Roles and Users ---
  const users = [
    { name: 'Admin', email: 'admin@sicontrola.com', password: 'Admin123!', role: 'ADMIN' },
    { name: 'Secretaria', email: 'secretaria@sicontrola.com', password: 'Secretaria123!', role: 'SECRETARIA' },
    { name: 'Motorista Piloto', email: 'motorista@sicontrola.com', password: 'Motorista123!', role: 'MOTORISTA' },
    { name: 'Aluno Teste', email: 'aluno@test.com', password: 'Aluno123!', role: 'ALUNO' },
  ];


  for (const u of users) {
    const existingUser = await prisma.user.findUnique({ where: { email: u.email } });
    if (!existingUser) {
      const hashedPassword = await hashPassword(u.password);
      const user = await prisma.user.create({
        data: {
          name: u.name,
          email: u.email,
          emailVerified: true,
          role: u.role as any,
          accounts: {
            create: {
              providerId: 'credential',
              accountId: u.email,
              type: 'credential',
              password: hashedPassword,
            },
          },
        },
      });
      console.log(`User ${u.role} created: ${u.email}`);
      
      // Se for motorista, cria o perfil de motorista também
      if (u.role === 'MOTORISTA') {
        await prisma.driver.create({
          data: {
            userId: user.id,
            name: u.name,
            cnh: '123456789',
            category: 'D',
            validity: new Date('2030-12-31'),
          }
        });
      }
    } else {
      // Update role if exists
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: u.role as any }
      });
      console.log(`User ${u.role} already exists, updated role.`);
    }
  }

  // --- Plans ---
  const plans = [
    { name: '1 vez por semana', price: 20, usesPerWeek: 1 },
    { name: '3 vezes por semana', price: 50, usesPerWeek: 3 },
    { name: '5 vezes por semana', price: 70, usesPerWeek: 5 },
  ];

  for (const p of plans) {
    await prisma.plan.upsert({
      where: { id: p.name }, // This is a bit hacky but works for seed since we don't have id
      update: { price: p.price, usesPerWeek: p.usesPerWeek },
      create: { name: p.name, price: p.price, usesPerWeek: p.usesPerWeek },
    }).catch(async () => {
       // Se o where por ID falhar (porque não existe), tenta find by name
       const existingPlan = await prisma.plan.findFirst({ where: { name: p.name } });
       if (!existingPlan) {
         await prisma.plan.create({ data: { name: p.name, price: p.price, usesPerWeek: p.usesPerWeek } });
       }
    });
  }
  console.log('Plans seeded.');

  // --- Schools ---
  const schools = [
    { name: 'Escola Municipal Dom Pedro II' },
    { name: 'Colégio Estadual Tiradentes' },
    { name: 'IFSP - Campus Municipal' },
  ];

  for (const s of schools) {
    const existing = await prisma.school.findFirst({ where: { name: s.name } });
    if (!existing) {
      await prisma.school.create({ data: { name: s.name } });
    }
  }
  console.log('Schools seeded.');
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
