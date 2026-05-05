'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/contexts/AppContext'
import { getPlanLabel, formatDate, formatCurrency, getStatusLabel } from '@/lib/utils'
import { getStatusColor } from '@/lib/utils'
import { schools } from '@/lib/mock-data'
import { QRCodeSVG } from 'qrcode.react'
import { Download, CreditCard, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react'

export default function MyCardView() {
  const { state, setView } = useApp()

  // Use first approved student as the "current student" for demo
  const student = state.students.find((s) => s.status === 'approved' && s.cardId) || state.students[0]

  if (!student || student.status !== 'approved') {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <CreditCard className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Carteirinha Indisponível</h2>
        <p className="text-gray-500 mb-6">
          Sua carteirinha digital estará disponível após a aprovação do cadastro.
        </p>
        <Button onClick={() => setView('my-registration')} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
          VER MINHA INSCRIÇÃO
        </Button>
      </div>
    )
  }

  const getSchoolName = (id: string) => {
    return schools.find((s) => s.id === id)?.name || id
  }

  const isCardActive = student.paymentStatus === 'paid'

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Minha Carteirinha</h1>
        <p className="text-gray-500 mt-1">Cartão de Transporte Estudantil Digital</p>
      </div>

      {/* Digital Card */}
      <div className="relative mx-auto w-[340px] sm:w-[380px] aspect-[340/210] rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white shadow-2xl overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full opacity-50" />
        </div>
        {/* Diagonal stripe pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 11px)',
        }} />

        <div className="relative z-10 p-5 sm:p-6 h-full flex flex-col justify-between">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* Photo placeholder */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30 shrink-0 overflow-hidden">
                <span className="text-xl sm:text-2xl font-bold">
                  {student.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-blue-200 font-semibold tracking-wider uppercase">
                  SICONTROLA
                </p>
                <p className="font-bold text-sm sm:text-base leading-tight truncate max-w-[180px] sm:max-w-[220px]">
                  {student.name}
                </p>
                <p className="text-[10px] sm:text-xs text-blue-200 mt-0.5">
                  Cartão de Transporte Estudantil
                </p>
              </div>
            </div>
            {/* QR Code */}
            <div className="bg-white rounded-lg p-1.5 shrink-0">
              <QRCodeSVG
                value={student.cardId || student.id}
                size={56}
                bgColor="#ffffff"
                fgColor="#1e40af"
                level="M"
              />
            </div>
          </div>

          {/* Middle info */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div>
              <p className="text-[9px] sm:text-[10px] text-blue-300 uppercase tracking-wide">Instituição</p>
              <p className="text-[11px] sm:text-xs font-medium truncate">{getSchoolName(student.institution)}</p>
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] text-blue-300 uppercase tracking-wide">Curso</p>
              <p className="text-[11px] sm:text-xs font-medium truncate">{student.course}</p>
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] text-blue-300 uppercase tracking-wide">Ano</p>
              <p className="text-[11px] sm:text-xs font-medium">{student.schoolYear}</p>
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] text-blue-300 uppercase tracking-wide">Plano</p>
              <p className="text-[11px] sm:text-xs font-medium">{getPlanLabel(student.plan)}</p>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-blue-300" />
              <div>
                <p className="text-[9px] text-blue-300 uppercase tracking-wide">Válido até</p>
                <p className="text-xs font-semibold">
                  {student.paymentDueDate ? formatDate(student.paymentDueDate) : '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Status Badge */}
              <div className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide ${
                isCardActive
                  ? 'bg-green-500/90 text-white'
                  : student.paymentStatus === 'overdue'
                  ? 'bg-red-500/90 text-white'
                  : 'bg-yellow-500/90 text-white'
              }`}>
                {isCardActive ? '● ATIVO' : student.paymentStatus === 'overdue' ? '● BLOQUEADO' : '● PENDENTE'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card ID */}
      <div className="text-center">
        <p className="text-xs text-gray-400">ID do Cartão</p>
        <p className="font-mono font-semibold text-gray-600 text-sm">{student.cardId}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-3">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
          <Download className="w-4 h-4 mr-2" />
          BAIXAR CARTEIRINHA
        </Button>
      </div>

      {/* Payment Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {isCardActive ? (
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
            )}
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">Status do Pagamento</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge className={`${getStatusColor(student.paymentStatus || 'pending')} text-xs`}>
                  {getStatusLabel(student.paymentStatus || 'pending')}
                </Badge>
                {student.paymentDueDate && (
                  <span className="text-xs text-gray-500">
                    Vencimento: {formatDate(student.paymentDueDate)}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-gray-400">Valor do Plano</p>
              <p className="font-bold text-blue-600">{formatCurrency(student.planPrice)}</p>
              <p className="text-[10px] text-gray-400">/mês</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Info */}
      <Card>
        <CardContent className="p-4">
          <p className="font-medium text-gray-900 text-sm mb-3">Uso Semanal</p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    student.weeklyUsage >= (student.plan === '1x' ? 1 : student.plan === '3x' ? 3 : 5)
                      ? 'bg-red-500'
                      : student.weeklyUsage >= (student.plan === '1x' ? 0.75 : student.plan === '3x' ? 2.25 : 3.75)
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{
                    width: `${Math.min(100, (student.weeklyUsage / (student.plan === '1x' ? 1 : student.plan === '3x' ? 3 : 5)) * 100)}%`,
                  }}
                />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-700 shrink-0">
              {student.weeklyUsage}/{student.plan === '1x' ? 1 : student.plan === '3x' ? 3 : 5} viagens
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
