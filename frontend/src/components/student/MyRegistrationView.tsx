'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/contexts/AppContext'
import { getStatusColor, getStatusLabel, formatDate, formatCurrency } from '@/lib/utils'
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileEdit,
  ArrowRight,
  CreditCard,
  Eye,
} from 'lucide-react'

export default function MyRegistrationView() {
  const { state, setView } = useApp()

  // Use the first student as the "current student" for demo purposes
  // In a real app, this would come from auth context
  const student = state.students.find((s) => s.id === 'stu-004') || state.students[0]

  if (!student) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <FileEdit className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma inscrição encontrada</h2>
        <p className="text-gray-500 mb-6">
          Você ainda não possui uma inscrição no sistema de transporte estudantil.
        </p>
        <Button onClick={() => setView('registration')} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
          FAZER INSCRIÇÃO
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    )
  }

  const statusConfig: Record<string, {
    icon: React.ReactNode
    title: string
    description: string
    color: string
    bgColor: string
  }> = {
    pending: {
      icon: <Clock className="w-8 h-8" />,
      title: 'Inscrição em Análise',
      description: 'Sua inscrição está sendo analisada pela secretaria. Você receberá uma notificação assim que houver uma atualização.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 border-yellow-200',
    },
    approved: {
      icon: <CheckCircle2 className="w-8 h-8" />,
      title: 'Inscrição Aprovada!',
      description: 'Parabéns! Sua inscrição foi aprovada. Agora você pode acessar sua carteirinha digital e realizar o pagamento.',
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
    },
    rejected: {
      icon: <XCircle className="w-8 h-8" />,
      title: 'Inscrição Reprovada',
      description: student.rejectionReason || 'Sua inscrição não foi aprovada. Verifique o motivo abaixo e faça uma nova inscrição se desejar.',
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
    },
    correction: {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: 'Correção Necessária',
      description: student.correctionReason || 'Alguns dados precisam ser corrigidos. Verifique as observações abaixo.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200',
    },
  }

  const config = statusConfig[student.status]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Minha Inscrição</h1>
        <p className="text-gray-500 mt-1">Acompanhe o status da sua solicitação</p>
      </div>

      {/* Status Card */}
      <Card className={`border-2 ${config.bgColor}`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={config.color}>{config.icon}</div>
            <div className="flex-1">
              <h2 className={`text-lg font-semibold ${config.color}`}>{config.title}</h2>
              <p className="text-gray-600 mt-1 text-sm leading-relaxed">{config.description}</p>
            </div>
            <Badge className={getStatusColor(student.status)}>
              {getStatusLabel(student.status)}
            </Badge>
          </div>

          {/* Progress indicator for pending */}
          {student.status === 'pending' && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-gray-700">Dados enviados em {formatDate(student.createdAt)}</span>
              </div>
              <div className="ml-4 w-0.5 h-6 bg-blue-200" />
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-yellow-400 text-white flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-yellow-700 font-medium">Aguardando análise da secretaria</span>
              </div>
              <div className="ml-4 w-0.5 h-6 bg-gray-200" />
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-gray-400">Aprovação</span>
              </div>
            </div>
          )}

          {/* Action buttons for specific statuses */}
          <div className="mt-6 flex gap-3">
            {student.status === 'approved' && (
              <>
                <Button onClick={() => setView('my-card')} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <CreditCard className="w-4 h-4 mr-2" />
                  VER CARTEIRINHA
                </Button>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  VER PAGAMENTO
                </Button>
              </>
            )}
            {student.status === 'rejected' && (
              <Button onClick={() => setView('registration')} className="bg-blue-600 hover:bg-blue-700 text-white">
                <FileEdit className="w-4 h-4 mr-2" />
                NOVA INSCRIÇÃO
              </Button>
            )}
            {student.status === 'correction' && (
              <Button onClick={() => setView('registration')} className="bg-blue-600 hover:bg-blue-700 text-white">
                <FileEdit className="w-4 h-4 mr-2" />
                CORRIGIR DADOS
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Registration Details */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Dados da Inscrição</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Nome</span>
              <p className="font-medium text-gray-900">{student.name}</p>
            </div>
            <div>
              <span className="text-gray-500">CPF</span>
              <p className="font-medium text-gray-900">{student.cpf}</p>
            </div>
            <div>
              <span className="text-gray-500">Instituição</span>
              <p className="font-medium text-gray-900">{student.institution}</p>
            </div>
            <div>
              <span className="text-gray-500">Curso</span>
              <p className="font-medium text-gray-900">{student.course}</p>
            </div>
            <div>
              <span className="text-gray-500">Plano</span>
              <p className="font-medium text-gray-900">
                {getStatusLabel(student.plan)} — {formatCurrency(student.planPrice)}/mês
              </p>
            </div>
            <div>
              <span className="text-gray-500">Data da Inscrição</span>
              <p className="font-medium text-gray-900">{formatDate(student.createdAt)}</p>
            </div>
            {student.status === 'approved' && student.paymentDueDate && (
              <div>
                <span className="text-gray-500">Vencimento</span>
                <p className="font-medium text-gray-900">{formatDate(student.paymentDueDate)}</p>
              </div>
            )}
            {student.status === 'approved' && (
              <div>
                <span className="text-gray-500">Pagamento</span>
                <p className="font-medium">
                  <Badge className={getStatusColor(student.paymentStatus || 'pending')}>
                    {getStatusLabel(student.paymentStatus || 'pending')}
                  </Badge>
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
