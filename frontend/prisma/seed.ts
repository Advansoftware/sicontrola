import { db } from '../src/lib/db'

async function main() {
  console.log('Seeding database...')

  // Users are handled by the /api/debug/seed-demo route to ensure 
  // correct password hashing via Better Auth API.
  console.log('Skipping users in Prisma seed (use /api/debug/seed-demo)');

  console.log('Seed complete!')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
