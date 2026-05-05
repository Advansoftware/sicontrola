import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

// Tipo dos campos adicionais do usuário definidos no backend
type AuthSchema = {
  user: {
    role: string
    studentId?: string
    driverId?: string
  }
}

export const authClient = createAuthClient({
  // aponta para o Next.js que vai proxiar para o backend
  baseURL: typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  plugins: [
    inferAdditionalFields<AuthSchema>()
  ]
})

export const { signIn, signUp, signOut, useSession } = authClient
