'use client'

import React from 'react'
import { useApp } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  Bus,
  AlertTriangle,
  ShieldAlert,
  CalendarClock,
  TrendingUp,
  TrendingDown,
  Activity,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { formatCurrency } from '@/lib/utils'
import {
  studentsByStatus,
  plansDistribution,
  revenueByMonth,
} from '@/lib/mock-data'

// ── Chart configs ──
const statusChartConfig: ChartConfig = {
  value: { label: 'Alunos' },
  Aprovados: { label: 'Aprovados', color: '#22c55e' },
  Pendentes: { label: 'Pendentes', color: '#eab308' },
  Rejeitados: { label: 'Rejeitados', color: '#ef4444' },
  Correcao: { label: 'Correcao', color: '#f97316' },
}

const plansChartConfig: ChartConfig = {
  value: { label: 'Alunos' },
  '1x por semana': { label: '1x por semana', color: '#3b82f6' },
  '3x por semana': { label: '3x por semana', color: '#8b5cf6' },
  '5x por semana': { label: '5x por semana', color: '#06b6d4' },
}

const boardingChartConfig: ChartConfig = {
  embarques: { label: 'Embarques', color: '#3b82f6' },
}

const revenueChartConfig: ChartConfig = {
  receita: { label: 'Receita (R$)', color: '#22c55e' },
}

const statusColors = ['#22c55e', '#eab308', '#ef4444', '#f97316']
const plansColors = ['#3b82f6', '#8b5cf6', '#06b6d4']

// ── Mock data for weekly boardings ──
const weeklyBoardings = [
  { day: 'Seg', embarques: 45 },
  { day: 'Ter', embarques: 52 },
  { day: 'Qua', embarques: 38 },
  { day: 'Qui', embarques: 61 },
  { day: 'Sex', embarques: 55 },
  { day: 'Sab', embarques: 12 },
  { day: 'Dom', embarques: 3 },
]

// ── Revenue area data ──
const revenueAreaData = revenueByMonth.map((item) => ({
  month: item.name,
  receita: item.value,
}))

// ── Alerts data ──
const alerts = [
  {
    id: 1,
    type: 'warning' as const,
    icon: Clock,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    message: '4 cadastros incompletos',
  },
  {
    id: 2,
    type: 'error' as const,
    icon: ShieldAlert,
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    message: '2 alunos sem utilizacao ha 30 dias',
  },
  {
    id: 3,
    type: 'warning' as const,
    icon: CalendarClock,
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-200 dark:border-orange-800',
    message: '3 pagamentos vencidos',
  },
  {
    id: 4,
    type: 'error' as const,
    icon: AlertTriangle,
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    message: '1 tentativa de uso invalido hoje',
  },
]

export default function DashboardView() {
  const { state, getDashboardStats } = useApp()
  const stats = getDashboardStats()
  const rejectedStudents = state.students.filter((s) => s.status === 'rejected').length

  // Recent activity from boarding records
  const recentRecords = [...state.boardingRecords]
    .sort((a, b) => b.time.localeCompare(a.time))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Subtitle */}
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Visao geral do sistema de transporte estudantil
        </p>
      </div>

      {/* ── Stats Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<GraduationCap className="size-5" />}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
          borderAccent="border-l-blue-500"
          label="Total de Alunos Cadastrados"
          value={stats.totalStudents}
          change="+12%"
          changePositive
        />
        <StatCard
          icon={<CheckCircle2 className="size-5" />}
          iconBg="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
          borderAccent="border-l-green-500"
          label="Alunos Aprovados"
          value={stats.approvedStudents}
          change="+8%"
          changePositive
        />
        <StatCard
          icon={<Clock className="size-5" />}
          iconBg="bg-yellow-100 dark:bg-yellow-900/30"
          iconColor="text-yellow-600 dark:text-yellow-400"
          borderAccent="border-l-yellow-500"
          label="Cadastros Pendentes"
          value={stats.pendingStudents}
          change="+2"
          changePositive={false}
        />
        <StatCard
          icon={<XCircle className="size-5" />}
          iconBg="bg-red-100 dark:bg-red-900/30"
          iconColor="text-red-600 dark:text-red-400"
          borderAccent="border-l-red-500"
          label="Cadastros Reprovados"
          value={rejectedStudents}
          change="-1"
          changePositive
        />
        <StatCard
          icon={<DollarSign className="size-5" />}
          iconBg="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
          borderAccent="border-l-green-500"
          label="Receita Mensal"
          value={formatCurrency(stats.monthlyRevenue)}
          change="+5.2%"
          changePositive
        />
        <StatCard
          icon={<Bus className="size-5" />}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
          borderAccent="border-l-blue-500"
          label="Embarques Hoje"
          value={stats.activeBoardingsToday}
          change="+18%"
          changePositive
        />
      </div>

      {/* ── Charts Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Students by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alunos por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={statusChartConfig} className="h-[280px] w-full">
              <BarChart data={studentsByStatus} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {studentsByStatus.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Plans Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuicao de Planos</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={plansChartConfig} className="h-[280px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={plansDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                >
                  {plansDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={plansColors[index % plansColors.length]} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Line Chart - Weekly Boardings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Embarques por Dia da Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={boardingChartConfig} className="h-[280px] w-full">
              <LineChart data={weeklyBoardings} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="embarques"
                  stroke="var(--color-embarques)"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: 'var(--color-embarques)' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Area Chart - Monthly Revenue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Receita Mensal (Ultimos 6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueChartConfig} className="h-[280px] w-full">
              <AreaChart data={revenueAreaData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-receita)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-receita)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="receita"
                  stroke="var(--color-receita)"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Alerts Section ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="size-4 text-yellow-500" />
            Alertas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${alert.bg} ${alert.border}`}
              >
                <alert.icon className={`size-5 shrink-0 mt-0.5 ${alert.color}`} />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {alert.message}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Recent Activity Table ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="size-4 text-slate-500" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Aluno</TableHead>
                <TableHead>Acao</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="text-slate-500 dark:text-slate-400">
                    {record.date} {record.time}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900 dark:text-white">
                    {record.studentName}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    Embarque
                  </TableCell>
                  <TableCell>
                    {record.allowed ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-transparent">
                        Liberado
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-transparent">
                        Bloqueado
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// ── Stat Card Component ──
function StatCard({
  icon,
  iconBg,
  iconColor,
  borderAccent,
  label,
  value,
  change,
  changePositive,
}: {
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  borderAccent: string
  label: string
  value: string | number
  change: string
  changePositive: boolean
}) {
  return (
    <Card className={`border-l-4 ${borderAccent}`}>
      <CardContent className="flex items-center gap-4 p-4">
        <div className={`flex items-center justify-center size-10 rounded-lg ${iconBg} ${iconColor}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{label}</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{value}</p>
        </div>
        <div className="flex items-center gap-1 text-xs">
          {changePositive ? (
            <TrendingUp className="size-3 text-green-500" />
          ) : (
            <TrendingDown className="size-3 text-red-500" />
          )}
          <span className={changePositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
