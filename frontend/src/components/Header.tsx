'use client'

import React from 'react'
import { Search, Bell, User, LogOut } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { useSession, signOut } from '@/lib/auth-client'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// ── View title map ──
const viewTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  cadastros: 'Cadastros',
  validacao: 'Validação de Documentos',
  financeiro: 'Financeiro',
  carteirinhas: 'Gestão de Carteirinhas',
  motoristas: 'Gestão de Motoristas',
  relatorios: 'Relatórios',
  notificacoes: 'Notificações',
  configuracoes: 'Configurações',
  'meu-cadastro': 'Meu Cadastro',
  'minha-carteirinha': 'Minha Carteirinha',
  pagamento: 'Pagamento',
  'escanear-qr': 'Escanear QR Code',
  'registros-dia': 'Registros do Dia',
}

export default function Header() {
  const { state, setView, getUnreadNotificationCount } = useApp()
  const { data: session } = useSession()
  const { currentView } = state
  const unreadCount = getUnreadNotificationCount()

  const pageTitle = viewTitles[currentView] || 'Dashboard'

  const userName = (session?.user as Record<string, unknown>)?.name as string || 'Usuario'
  const userEmail = (session?.user as Record<string, unknown>)?.email as string || ''

  const handleLogout = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/50">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6 gap-4">
        {/* Left: Page title */}
        <div className="pl-10 lg:pl-0">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {pageTitle}
          </h2>
        </div>

        {/* Center: Search bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Buscar alunos, documentos..."
              className="pl-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm h-9"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile search */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 text-slate-500"
          >
            <Search className="w-4 h-4" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            onClick={() => setView('notificacoes')}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] font-bold bg-red-500 text-white border-0 rounded-full flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </Button>

          {/* User info */}
          <div className="hidden sm:flex items-center gap-2.5 ml-2 pl-3 border-l border-slate-200 dark:border-slate-700">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-tight">
                {userName}
              </p>
              <p className="text-[11px] text-slate-400 leading-tight">
                {userEmail}
              </p>
            </div>
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-slate-400 hover:text-red-500 ml-1"
            onClick={handleLogout}
            title="Sair do sistema"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
