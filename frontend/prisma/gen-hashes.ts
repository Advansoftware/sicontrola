import { auth } from '../src/lib/auth'

async function main() {
  const passwords = ['admin123', 'secretaria123', 'aluno123', 'motorista123']
  console.log('Generating hashes...')
  for (const pwd of passwords) {
    const hash = await auth.api.hashPassword({ password: pwd })
    console.log(`${pwd}: ${hash}`)
  }
}

main().catch(console.error)
