'use client'

import React from 'react'
import { useApp } from '@/contexts/AppContext'
import type { UserRole } from '@/lib/types'
import StudentRegistrationView from '@/components/student/StudentRegistrationView'
import MyRegistrationView from '@/components/student/MyRegistrationView'
import SecretaryValidationView from '@/components/secretary/SecretaryValidationView'
import CardManagementView from '@/components/card/CardManagementView'
import MyCardView from '@/components/card/MyCardView'
import FinanceView from '@/components/finance/FinanceView'
import PaymentView from '@/components/finance/PaymentView'
import DashboardView from '@/components/dashboard/DashboardView'
import DriverManagementView from '@/components/dashboard/DriverManagementView'
import QRScannerView from '@/components/driver/QRScannerView'
import DailyRecordsView from '@/components/driver/DailyRecordsView'
import ReportsView from '@/components/reports/ReportsView'
import NotificationsView from '@/components/notifications/NotificationsView'
import SettingsView from '@/components/settings/SettingsView'

// ── View map per role ──
const viewMap: Record<string, React.ComponentType> = {
  dashboard: DashboardView,
  cadastros: StudentRegistrationView,
  validacao: SecretaryValidationView,
  financeiro: FinanceView,
  carteirinhas: CardManagementView,
  motoristas: DriverManagementView,
  relatorios: ReportsView,
  notificacoes: NotificationsView,
  configuracoes: SettingsView,
  'meu-cadastro': MyRegistrationView,
  'minha-carteirinha': MyCardView,
  pagamento: PaymentView,
  'escanear-qr': QRScannerView,
  'registros-dia': DailyRecordsView,
}

// ── Default views per role ──
const defaultViews: Record<UserRole, string> = {
  admin: 'dashboard',
  secretary: 'dashboard',
  student: 'meu-cadastro',
  driver: 'escanear-qr',
}

export default function ViewRouter() {
  const { state } = useApp()
  const { currentView, currentRole } = state

  const ViewComponent = viewMap[currentView] || viewMap[defaultViews[currentRole]]

  return (
    <div className="animate-in fade-in-0 duration-200">
      <ViewComponent />
    </div>
  )
}
