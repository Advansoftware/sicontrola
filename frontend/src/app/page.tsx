'use client'

import { useSession } from '@/lib/auth-client'
import { AppProvider } from '@/contexts/AppContext'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import ViewRouter from '@/components/ViewRouter'
import LoginView from '@/components/LoginView'
import type { UserRole } from '@/lib/types'

function AppShell({ userRole }: { userRole?: string }) {
  return (
    <AppProvider initialRole={(userRole as UserRole) || 'student'}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar />
        <div className="lg:pl-[280px] min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 p-4 lg:p-6">
            <ViewRouter />
          </main>
          <footer className="border-t border-slate-200 dark:border-slate-800 px-4 lg:px-6 py-4 mt-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                &copy; 2025 SICONTROLA — Sistema de Controle de Transporte Estudantil Municipal
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Prefeitura Municipal — Todos os direitos reservados
              </p>
            </div>
          </footer>
        </div>
      </div>
    </AppProvider>
  )
}

export default function Home() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <LoginView />
  }

  const userRole = (session.user as Record<string, unknown>)?.role as string || 'student'

  return <AppShell userRole={userRole} />
}
