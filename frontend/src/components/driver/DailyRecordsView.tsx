'use client'

import React, { useState, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Bus,
  CheckCircle2,
  XCircle,
  ClipboardList,
  User,
  MapPin,
  Clock,
} from 'lucide-react'
import { getPlanLabel } from '@/lib/utils'

export default function DailyRecordsView() {
  const { state } = useApp()
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Get today's boarding records (use the latest date available)
  const todayRecords = useMemo(() => {
    if (state.boardingRecords.length === 0) return []
    // Find the most recent date
    const latestDate = [...state.boardingRecords].sort(
      (a, b) => b.date.localeCompare(a.date)
    )[0]?.date
    return state.boardingRecords
      .filter((r) => r.date === latestDate)
      .sort((a, b) => b.time.localeCompare(a.time))
  }, [state.boardingRecords])

  // Filter records
  const filteredRecords = useMemo(() => {
    if (filterStatus === 'all') return todayRecords
    if (filterStatus === 'allowed') return todayRecords.filter((r) => r.allowed)
    return todayRecords.filter((r) => !r.allowed)
  }, [todayRecords, filterStatus])

  // Compute stats
  const totalBoardings = todayRecords.length
  const allowedBoardings = todayRecords.filter((r) => r.allowed).length
  const blockedBoardings = todayRecords.filter((r) => !r.allowed).length

  // Current driver & route
  const currentDriver = state.drivers[0]
  const currentRoute = state.routes.find((r) => r.id === currentDriver?.route)
  const latestDate = todayRecords[0]?.date

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Registros de embarque do dia - {latestDate}
        </p>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <ClipboardList className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total de Embarques</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{totalBoardings}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Entradas Liberadas</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{allowedBoardings}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle className="size-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Acessos Bloqueados</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">{blockedBoardings}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Bus className="size-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Rota Atual</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {currentRoute?.name.split(' - ')[0] || '-'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Records Table ── */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <CardTitle className="text-base">Registros de Embarque</CardTitle>
                <Tabs value={filterStatus} onValueChange={setFilterStatus}>
                  <TabsList>
                    <TabsTrigger value="all" className="text-xs px-3">
                      Todos ({totalBoardings})
                    </TabsTrigger>
                    <TabsTrigger value="allowed" className="text-xs px-3">
                      Liberados ({allowedBoardings})
                    </TabsTrigger>
                    <TabsTrigger value="blocked" className="text-xs px-3">
                      Bloqueados ({blockedBoardings})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hora</TableHead>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Motivo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-slate-500 dark:text-slate-400">
                          Nenhum registro encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRecords.map((record) => (
                        <TableRow
                          key={record.id}
                          className={
                            record.allowed
                              ? ''
                              : 'bg-red-50/50 dark:bg-red-900/10'
                          }
                        >
                          <TableCell className="font-mono text-slate-600 dark:text-slate-400">
                            {record.time}
                          </TableCell>
                          <TableCell className="font-medium text-slate-900 dark:text-white">
                            {record.studentName}
                          </TableCell>
                          <TableCell className="text-slate-600 dark:text-slate-400">
                            {/* Find student to get plan */}
                            {getPlanLabel(
                              state.students.find((s) => s.id === record.studentId)?.plan || '5x'
                            )}
                          </TableCell>
                          <TableCell>
                            {record.allowed ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-transparent">
                                <CheckCircle2 className="size-3 mr-1" />
                                Liberado
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-transparent">
                                <XCircle className="size-3 mr-1" />
                                Bloqueado
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                            {record.allowed ? '-' : record.reason || 'Sem motivo registrado'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Route Info Card ── */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="size-4" />
                Informacoes da Rota
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">Rota</span>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {currentRoute?.name || '-'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">Descricao</span>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {currentRoute?.description || '-'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">Motorista</span>
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <User className="size-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {currentDriver?.name || '-'}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">Turno</span>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Matutino</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
