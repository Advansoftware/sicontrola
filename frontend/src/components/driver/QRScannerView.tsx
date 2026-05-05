'use client'

import React, { useState, useCallback } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  QrCode,
  Camera,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Bus,
  UserCheck,
  UserX,
  ShieldCheck,
  Clock,
} from 'lucide-react'
import { planConfigs } from '@/lib/mock-data'
import { getPlanLabel } from '@/lib/utils'
import type { Student } from '@/lib/types'

type ScanResult = {
  student: Student
  result: 'allowed' | 'overdue' | 'limit_reached'
}

// Possible scan scenarios for simulation
const scenarios: ScanResult['result'][] = ['allowed', 'allowed', 'allowed', 'overdue', 'limit_reached']

export default function QRScannerView() {
  const { state, addBoardingRecord } = useApp()
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [scanCount, setScanCount] = useState(0)
  const [successCount, setSuccessCount] = useState(0)
  const [blockedCount, setBlockedCount] = useState(0)

  // Get approved students for simulation
  const approvedStudents = state.students.filter((s) => s.status === 'approved')

  const simulateScan = useCallback(() => {
    if (approvedStudents.length === 0) return

    setScanning(true)
    setResult(null)

    // Simulate scanning delay
    setTimeout(() => {
      // Pick a random approved student
      const randomStudent = approvedStudents[Math.floor(Math.random() * approvedStudents.length)]
      // Pick a random scenario
      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)]

      const scanResult: ScanResult = {
        student: randomStudent,
        result: randomScenario,
      }

      setResult(scanResult)
      setScanning(false)
      setScanCount((prev) => prev + 1)

      if (randomScenario === 'allowed') {
        setSuccessCount((prev) => prev + 1)
        // Add a boarding record
        addBoardingRecord({
          id: `board-sim-${Date.now()}`,
          studentId: randomStudent.id,
          studentName: randomStudent.name,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          route: 'route-001',
          driverName: 'Carlos Eduardo Silva',
          allowed: true,
        })
      } else {
        setBlockedCount((prev) => prev + 1)
      }
    }, 1500)
  }, [approvedStudents, addBoardingRecord])

  const resetScan = useCallback(() => {
    setResult(null)
    setScanning(false)
  }, [])

  const currentDriver = state.drivers[0]
  const currentRoute = state.routes.find((r) => r.id === currentDriver?.route)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Escaneie a carteirinha do aluno para registrar o embarque
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main Scanner Area ── */}
        <div className="lg:col-span-2 space-y-6">
          {!result && !scanning && (
            <ScannerIdleArea onScan={simulateScan} />
          )}

          {scanning && (
            <ScanningAnimation />
          )}

          {result && !scanning && (
            <ScanResultCard result={result} onReset={resetScan} />
          )}
        </div>

        {/* ── Today's Scan Summary ── */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumo de Hoje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="size-4 text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total de Escaneamentos</span>
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{scanCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="size-4 text-green-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Entradas Liberadas</span>
                </div>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">{successCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserX className="size-4 text-red-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Acessos Bloqueados</span>
                </div>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">{blockedCount}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bus className="size-4" />
                Rota Atual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">Motorista</span>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {currentDriver?.name || '-'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">Rota</span>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {currentRoute?.name || '-'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">Turno</span>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Matutino
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ── Scanner Idle Area ──
function ScannerIdleArea({ onScan }: { onScan: () => void }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative flex flex-col items-center justify-center bg-slate-900 rounded-xl m-4 aspect-video max-h-[400px]">
          {/* Viewfinder corners */}
          <div className="absolute top-8 left-8 w-12 h-12 border-t-3 border-l-3 border-blue-400 rounded-tl-lg" />
          <div className="absolute top-8 right-8 w-12 h-12 border-t-3 border-r-3 border-blue-400 rounded-tr-lg" />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-b-3 border-l-3 border-blue-400 rounded-bl-lg" />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-b-3 border-r-3 border-blue-400 rounded-br-lg" />

          {/* Center content */}
          <div className="flex flex-col items-center gap-4">
            <div className="size-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <QrCode className="size-8 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold text-lg">Pronto para Escanear</h3>
            <p className="text-slate-400 text-sm text-center max-w-xs">
              Posicione o QR Code da carteirinha do aluno na area indicada
            </p>
          </div>
        </div>

        <div className="p-6 flex justify-center">
          <Button
            size="lg"
            onClick={onScan}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-base gap-2"
          >
            <Camera className="size-5" />
            ESCANEAR QR CODE
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Scanning Animation ──
function ScanningAnimation() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative flex flex-col items-center justify-center bg-slate-900 rounded-xl m-4 aspect-video max-h-[400px] overflow-hidden">
          {/* Viewfinder corners */}
          <div className="absolute top-8 left-8 w-12 h-12 border-t-3 border-l-3 border-blue-400 rounded-tl-lg" />
          <div className="absolute top-8 right-8 w-12 h-12 border-t-3 border-r-3 border-blue-400 rounded-tr-lg" />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-b-3 border-l-3 border-blue-400 rounded-bl-lg" />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-b-3 border-r-3 border-blue-400 rounded-br-lg" />

          {/* Animated scanning line */}
          <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan-line" />

          {/* Pulsing QR icon */}
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="size-16 rounded-2xl bg-blue-500/20 flex items-center justify-center backdrop-blur-sm">
              <QrCode className="size-8 text-blue-400" />
            </div>
            <h3 className="text-blue-400 font-semibold text-lg">Escaneando...</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Scan Result Card ──
function ScanResultCard({
  result,
  onReset,
}: {
  result: ScanResult
  onReset: () => void
}) {
  const { student, result: scanResult } = result

  const config = {
    allowed: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-300 dark:border-green-700',
      icon: <CheckCircle2 className="size-8 text-green-500" />,
      title: 'ENTRADA LIBERADA',
      titleColor: 'text-green-700 dark:text-green-400',
      badge: <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-transparent">Pago</Badge>,
      description: 'Embarque autorizado com sucesso.',
    },
    overdue: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-300 dark:border-red-700',
      icon: <XCircle className="size-8 text-red-500" />,
      title: 'BLOQUEADO - INADIMPLENCIA',
      titleColor: 'text-red-700 dark:text-red-400',
      badge: <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-transparent">Vencido</Badge>,
      description: 'Pagamento vencido. O aluno deve regularizar para utilizar o transporte.',
    },
    limit_reached: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-300 dark:border-orange-700',
      icon: <AlertTriangle className="size-8 text-orange-500" />,
      title: 'LIMITE SEMANAL ATINGIDO',
      titleColor: 'text-orange-700 dark:text-orange-400',
      badge: <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-transparent">Limite</Badge>,
      description: 'O aluno atingiu o limite semanal de embarques do seu plano.',
    },
  }

  const current = config[scanResult]
  const planConfig = planConfigs.find((p) => p.plan === student.plan)

  return (
    <Card className={`overflow-hidden border-2 ${current.border}`}>
      <CardContent className="p-0">
        <div className={`${current.bg} p-6`}>
          {/* Result header */}
          <div className="flex items-center gap-4 mb-6">
            {current.icon}
            <div>
              <h2 className={`text-xl font-bold ${current.titleColor}`}>{current.title}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{current.description}</p>
            </div>
          </div>

          {/* Student info */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-start gap-4">
              {/* Photo placeholder */}
              <div className="size-16 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                <UserCheck className="size-6 text-slate-400" />
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                    {student.name}
                  </h3>
                  {current.badge}
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Carteirinha: </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{student.cardId || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Plano: </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{getPlanLabel(student.plan)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Uso Semanal: </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {student.weeklyUsage}/{planConfig?.weeklyLimit || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Instituicao: </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                      {student.institution}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reset button */}
          <div className="flex justify-center mt-6">
            <Button
              size="lg"
              onClick={onReset}
              variant="outline"
              className="px-8 h-12 text-base gap-2"
            >
              <RotateCcw className="size-5" />
              NOVO ESCANEAMENTO
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
