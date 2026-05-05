'use client'

import React from 'react'
import {
  Bus,
  LayoutDashboard,
  UserPlus,
  ClipboardCheck,
  DollarSign,
  CreditCard,
  Car,
  BarChart3,
  Bell,
  Settings,
  User,
  IdCard,
  Wallet,
  QrCode,
  ClipboardList,
  Menu,
  X,
  Shield,
  FileText,
  LogOut,
} from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { useSession, signOut } from '@/lib/auth-client'
import type { UserRole } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

// ── Navigation config per role ──
interface NavItem {
  view: string
  label: string
  icon: React.ElementType
  badge?: string
}

const navByRole: Record<UserRole, NavItem[]> = {
  admin: [
    { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { view: 'cadastros', label: 'Cadastros', icon: UserPlus },
    { view: 'validacao', label: 'Validação', icon: ClipboardCheck },
    { view: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { view: 'carteirinhas', label: 'Carteirinhas', icon: CreditCard },
    { view: 'motoristas', label: 'Motoristas', icon: Car },
    { view: 'relatorios', label: 'Relatórios', icon: BarChart3 },
    { view: 'notificacoes', label: 'Notificações', icon: Bell },
    { view: 'configuracoes', label: 'Configurações', icon: Settings },
  ],
  secretary: [
    { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { view: 'validacao', label: 'Validação', icon: ClipboardCheck },
    { view: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { view: 'relatorios', label: 'Relatórios', icon: BarChart3 },
    { view: 'notificacoes', label: 'Notificações', icon: Bell },
  ],
  student: [
    { view: 'meu-cadastro', label: 'Meu Cadastro', icon: FileText },
    { view: 'minha-carteirinha', label: 'Minha Carteirinha', icon: IdCard },
    { view: 'pagamento', label: 'Pagamento', icon: Wallet },
    { view: 'notificacoes', label: 'Notificações', icon: Bell },
  ],
  driver: [
    { view: 'escanear-qr', label: 'Escanear QR Code', icon: QrCode },
    { view: 'registros-dia', label: 'Registros do Dia', icon: ClipboardList },
    { view: 'notificacoes', label: 'Notificações', icon: Bell },
  ],
}

// ── Role labels ──
const roleLabels: Record<UserRole, string> = {
  admin: 'Administrador',
  secretary: 'Secretaria',
  student: 'Aluno',
  driver: 'Motorista',
}

const roleIcons: Record<UserRole, React.ElementType> = {
  admin: Shield,
  secretary: FileText,
  student: User,
  driver: Car,
}

export default function Sidebar() {
  const { state, setView, getUnreadNotificationCount } = useApp()
  const { data: session } = useSession()
  const { currentRole, currentView } = state
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const navItems = navByRole[currentRole]
  const unreadCount = getUnreadNotificationCount()

  const userName = (session?.user as Record<string, unknown>)?.name as string || 'Usuario'
  const sessionRole = (session?.user as Record<string, unknown>)?.role as UserRole || currentRole
  const RoleIcon = roleIcons[sessionRole] || User

  const handleNavClick = (view: string) => {
    setView(view)
    setMobileOpen(false)
  }

  const handleLogout = async () => {
    await signOut()
    window.location.href = '/'
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* ── Brand ── */}
      <div className="flex items-center gap-3 px-5 py-5 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
          <Bus className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">SICONTROLA</h1>
          <p className="text-[10px] text-slate-400 leading-tight">Transporte Estudantil</p>
        </div>
      </div>

      <Separator className="bg-slate-700/50" />

      {/* ── User info ── */}
      <div className="px-3 py-3 shrink-0">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-700/50">
          <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
            <RoleIcon className="w-4 h-4 text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-200 truncate">
              {userName}
            </p>
            <Badge
              variant="outline"
              className="mt-0.5 text-[10px] font-medium border-slate-600 text-slate-400 bg-slate-800 rounded"
            >
              {roleLabels[sessionRole]}
            </Badge>
          </div>
        </div>
      </div>

      <Separator className="bg-slate-700/50" />

      {/* ── Navigation ── */}
      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.view
            const showBadge =
              item.view === 'notificacoes' && unreadCount > 0

            return (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                )}
              >
                <Icon
                  className={cn(
                    'w-[18px] h-[18px] shrink-0 transition-colors',
                    isActive
                      ? 'text-white'
                      : 'text-slate-500 group-hover:text-slate-300'
                  )}
                />
                <span className="flex-1 text-left truncate">{item.label}</span>
                {showBadge && (
                  <Badge className="h-5 min-w-5 px-1.5 text-[10px] font-bold bg-red-500 text-white border-0 rounded-full">
                    {unreadCount}
                  </Badge>
                )}
              </button>
            )
          })}
        </nav>
      </ScrollArea>

      {/* ── Logout button ── */}
      <Separator className="bg-slate-700/50" />
      <div className="px-3 py-3 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-700/50 transition-all duration-150 group"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0 transition-colors text-slate-500 group-hover:text-red-400" />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* ── Mobile hamburger button ── */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 lg:hidden bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-[280px] shrink-0',
          'bg-gradient-to-b from-slate-800 to-slate-900',
          'border-r border-slate-700/50',
          'transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
