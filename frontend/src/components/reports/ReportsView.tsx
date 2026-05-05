'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Line,
  LineChart,
} from 'recharts'
import { useApp } from '@/contexts/AppContext'
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusLabel,
  getPlanLabel,
} from '@/lib/utils'
import {
  FileDown,
  FileSpreadsheet,
  Users,
  UserCheck,
  UserX,
  UserMinus,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Activity,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { toast } from 'sonner'

const PIE_COLORS = ['#22c55e', '#eab308', '#ef4444', '#f97316', '#8b5cf6']

const studentsChartConfig: ChartConfig = {
  value: { label: 'Alunos' },
  Aprovados: { color: '#22c55e' },
  Pendentes: { color: '#eab308' },
  Rejeitados: { color: '#ef4444' },
  Correcao: { color: '#f97316' },
}

const revenueChartConfig: ChartConfig = {
  receita: { label: 'Receita (R$)' },
}

const planPieConfig: ChartConfig = {
  '1x por semana': { color: '#8b5cf6' },
  '3x por semana': { color: '#3b82f6' },
  '5x por semana': { color: '#22c55e' },
}

const boardingsChartConfig: ChartConfig = {
  embarques: { label: 'Embarques' },
}

const comparisonConfig: ChartConfig = {
  mesAtual: { label: 'Mês Atual' },
  mesAnterior: { label: 'Mês Anterior' },
}

export default function ReportsView() {
  const { state } = useApp()
  const { students, boardingRecords, routes, planConfigs } = state

  // ── Alunos Tab Data ──
  const alunosStats = useMemo(() => {
    const approved = students.filter((s) => s.status === 'approved').length
    const pending = students.filter((s) => s.status === 'pending').length
    const rejected = students.filter((s) => s.status === 'rejected').length
    return { approved, pending, rejected, total: students.length }
  }, [students])

  const studentsByStatusData = useMemo(
    () => [
      { name: 'Aprovados', value: alunosStats.approved, fill: '#22c55e' },
      { name: 'Pendentes', value: alunosStats.pending, fill: '#eab308' },
      { name: 'Rejeitados', value: alunosStats.rejected, fill: '#ef4444' },
      { name: 'Correção', value: students.length - alunosStats.approved - alunosStats.pending - alunosStats.rejected, fill: '#f97316' },
    ],
    [alunosStats, students.length]
  )

  // ── Financeiro Tab Data ──
  const financeiroStats = useMemo(() => {
    const paid = students.filter((s) => s.paymentStatus === 'paid')
    const monthlyRevenue = paid.reduce((sum, s) => sum + s.planPrice, 0)
    const overdue = students.filter((s) => s.paymentStatus === 'overdue').length
    const mostUsedPlan = planConfigs.reduce((prev, curr) =>
      students.filter((s) => s.plan === curr.plan).length > students.filter((s) => s.plan === prev.plan).length
        ? curr
        : prev
    )
    return { monthlyRevenue, overdue, mostUsedPlan }
  }, [students, planConfigs])

  const revenueByMonthData = [
    { name: 'Set', receita: 980 },
    { name: 'Out', receita: 1250 },
    { name: 'Nov', receita: 1100 },
    { name: 'Dez', receita: 1350 },
    { name: 'Jan', receita: financeiroStats.monthlyRevenue },
  ]

  const planDistributionData = useMemo(() => {
    return planConfigs.map((p) => ({
      name: p.label,
      value: students.filter((s) => s.plan === p.plan).length,
      fill: p.plan === '1x' ? '#8b5cf6' : p.plan === '3x' ? '#3b82f6' : '#22c55e',
    }))
  }, [students, planConfigs])

  const overdueStudents = useMemo(() => {
    return students
      .filter((s) => s.paymentStatus === 'overdue')
      .map((s) => {
        const dueDate = s.paymentDueDate ? new Date(s.paymentDueDate) : null
        const today = new Date()
        const daysOverdue = dueDate ? Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / 86400000)) : 0
        return { ...s, daysOverdue }
      })
  }, [students])

  // ── Utilização Tab Data ──
  const boardingsByDayData = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const recordsByDay: Record<string, number> = {}
    days.forEach((d) => (recordsByDay[d] = 0))
    boardingRecords.forEach((r) => {
      const date = new Date(r.date + 'T00:00:00')
      const dayIndex = date.getDay()
      recordsByDay[days[dayIndex]] = (recordsByDay[days[dayIndex]] || 0) + 1
    })
    return days.map((d) => ({ name: d, embarques: recordsByDay[d] }))
  }, [boardingRecords])

  const usageByStudent = useMemo(() => {
    return students
      .filter((s) => s.status === 'approved')
      .map((s) => {
        const limit = planConfigs.find((p) => p.plan === s.plan)?.weeklyLimit || 0
        return {
          name: s.name,
          plan: getPlanLabel(s.plan),
          used: s.weeklyUsage,
          limit,
        }
      })
      .sort((a, b) => b.used - a.used)
  }, [students, planConfigs])

  const usageByRoute = useMemo(() => {
    return routes.map((r) => {
      const total = boardingRecords.filter((b) => b.route === r.id).length
      const uniqueDays = new Set(boardingRecords.filter((b) => b.route === r.id).map((b) => b.date))
      const avgPerDay = uniqueDays.size > 0 ? (total / uniqueDays.size).toFixed(1) : '0'
      return { name: r.name, total, avgPerDay: Number(avgPerDay) }
    }).sort((a, b) => b.total - a.total)
  }, [boardingRecords, routes])

  // ── Análises Tab Data ──
  const paidNoUsage = useMemo(() => {
    return students.filter(
      (s) => s.paymentStatus === 'paid' && s.weeklyUsage === 0 && s.status === 'approved'
    )
  }, [students])

  const topRoutes = useMemo(() => {
    return routes
      .map((r) => ({
        ...r,
        boardingCount: boardingRecords.filter((b) => b.route === r.id).length,
      }))
      .sort((a, b) => b.boardingCount - a.boardingCount)
  }, [routes, boardingRecords])

  const monthlyComparisonData = [
    { metric: 'Alunos', mesAtual: alunosStats.approved, mesAnterior: 7 },
    { metric: 'Receita', mesAtual: 1175, mesAnterior: 1350 },
    { metric: 'Embarques', mesAtual: boardingRecords.length, mesAnterior: 95 },
    { metric: 'Novos Cadastros', mesAtual: 5, mesAnterior: 4 },
  ]

  const handleExportPDF = () => {
    toast.info('Exportação PDF iniciada', { description: 'O relatório será baixado em instantes.' })
  }

  const handleExportExcel = () => {
    toast.info('Exportação Excel iniciada', { description: 'O relatório será baixado em instantes.' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Análises detalhadas do sistema de transporte</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <FileDown className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="alunos" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="alunos"><Users className="w-4 h-4 mr-1.5" />Alunos</TabsTrigger>
          <TabsTrigger value="financeiro"><DollarSign className="w-4 h-4 mr-1.5" />Financeiro</TabsTrigger>
          <TabsTrigger value="utilizacao"><Activity className="w-4 h-4 mr-1.5" />Utilização</TabsTrigger>
          <TabsTrigger value="analises"><Lightbulb className="w-4 h-4 mr-1.5" />Análises</TabsTrigger>
        </TabsList>

        {/* ── ALUNOS TAB ── */}
        <TabsContent value="alunos" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Ativos', value: alunosStats.approved, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100' },
              { label: 'Pendentes', value: alunosStats.pending, icon: UserMinus, color: 'text-yellow-600', bg: 'bg-yellow-100' },
              { label: 'Reprovados', value: alunosStats.rejected, icon: UserX, color: 'text-red-600', bg: 'bg-red-100' },
              { label: 'Total', value: alunosStats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart - Students by Status */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-gray-400" />
                  Alunos por Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={studentsChartConfig} className="h-[280px] w-full">
                  <BarChart data={studentsByStatusData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {studentsByStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Student Table */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Lista de Alunos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[320px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Nome</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-xs hidden sm:table-cell">Plano</TableHead>
                        <TableHead className="text-xs hidden md:table-cell">Cadastro</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.slice(0, 15).map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium text-sm">{s.name}</TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(s.status)} text-[11px]`}>
                              {getStatusLabel(s.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-xs text-gray-500">
                            {getPlanLabel(s.plan)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs text-gray-500">
                            {formatDate(s.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── FINANCEIRO TAB ── */}
        <TabsContent value="financeiro" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Receita Mensal</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(financeiroStats.monthlyRevenue)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Inadimplentes</p>
                  <p className="text-xl font-bold text-red-600">{financeiroStats.overdue}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Plano Mais Utilizado</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{financeiroStats.mostUsedPlan.label}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Month Bar Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  Receita por Mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={revenueChartConfig} className="h-[280px] w-full">
                  <BarChart data={revenueByMonthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="receita" fill="#22c55e" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Pie Chart - Distribution by Plan */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-gray-400" />
                  Distribuição por Plano
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={planPieConfig} className="h-[280px] w-full">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={planDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      nameKey="name"
                    >
                      {planDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Overdue Students Table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Alunos com Pagamento Vencido
              </CardTitle>
            </CardHeader>
            <CardContent>
              {overdueStudents.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>Nenhum aluno com pagamento vencido</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Aluno</TableHead>
                      <TableHead className="text-xs">Plano</TableHead>
                      <TableHead className="text-xs">Valor Devido</TableHead>
                      <TableHead className="text-xs">Dias em Atraso</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overdueStudents.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium text-sm">{s.name}</TableCell>
                        <TableCell className="text-xs">{getPlanLabel(s.plan)}</TableCell>
                        <TableCell className="font-semibold text-red-600 text-sm">{formatCurrency(s.planPrice)}</TableCell>
                        <TableCell>
                          <Badge className="bg-red-100 text-red-700 text-xs">{s.daysOverdue} dias</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── UTILIZAÇÃO TAB ── */}
        <TabsContent value="utilizacao" className="space-y-6">
          {/* Boardings by Day of Week Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-400" />
                Embarques por Dia da Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={boardingsChartConfig} className="h-[280px] w-full">
                <BarChart data={boardingsByDayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="embarques" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Usage per Student Table */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Uso Semanal por Aluno</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[320px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Aluno</TableHead>
                        <TableHead className="text-xs">Plano</TableHead>
                        <TableHead className="text-xs">Usado</TableHead>
                        <TableHead className="text-xs">Limite</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usageByStudent.map((s) => (
                        <TableRow key={s.name}>
                          <TableCell className="font-medium text-sm truncate max-w-[150px]">{s.name}</TableCell>
                          <TableCell className="text-xs text-gray-500">{s.plan}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={`text-xs ${s.used >= s.limit ? 'bg-red-100 text-red-700' : ''}`}>
                              {s.used}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-gray-500">{s.limit}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Usage by Route Table */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Uso por Rota</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Rota</TableHead>
                      <TableHead className="text-xs">Total Embarques</TableHead>
                      <TableHead className="text-xs">Média/Dia</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usageByRoute.map((r) => (
                      <TableRow key={r.name}>
                        <TableCell className="font-medium text-sm truncate max-w-[200px]">{r.name}</TableCell>
                        <TableCell className="font-semibold text-sm">{r.total}</TableCell>
                        <TableCell className="text-sm text-gray-500">{r.avgPerDay}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── ANÁLISES TAB ── */}
        <TabsContent value="analises" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Paid but No Usage */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Alunos que Pagam e Não Utilizam
                </CardTitle>
              </CardHeader>
              <CardContent>
                {paidNoUsage.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Nenhum aluno encontrado nessa condição</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[250px] overflow-y-auto">
                    {paidNoUsage.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800">
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-white">{s.name}</p>
                          <p className="text-xs text-gray-500">{getPlanLabel(s.plan)} - {formatCurrency(s.planPrice)}</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-700 text-xs">0 usos</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Routes by Demand */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Linhas com Maior Demanda
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topRoutes.map((r, index) => (
                    <div key={r.id} className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-700' : 'bg-gray-300'}`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{r.name}</p>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-green-500 h-1.5 rounded-full"
                            style={{ width: `${topRoutes[0]?.boardingCount ? (r.boardingCount / topRoutes[0].boardingCount) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{r.boardingCount}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Comparison */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gray-400" />
                Comparativo Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={comparisonConfig} className="h-[280px] w-full">
                <BarChart data={monthlyComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="mesAnterior" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="mesAtual" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <ChartLegend content={<ChartLegendContent />} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
