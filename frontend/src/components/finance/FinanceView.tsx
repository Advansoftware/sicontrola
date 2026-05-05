'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useApp } from '@/contexts/AppContext'
import {
  getStatusColor,
  getStatusLabel,
  getPlanLabel,
  formatCPF,
  formatCurrency,
  formatDate,
} from '@/lib/utils'
import type { PaymentStatus, Student } from '@/lib/types'
import {
  Search,
  DollarSign,
  Clock,
  AlertTriangle,
  Users,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  CheckCircle2,
} from 'lucide-react'

const ITEMS_PER_PAGE = 10

type PaymentFilter = 'all' | PaymentStatus

export default function FinanceView() {
  const { state, updateStudent } = useApp()
  const students = state.students
  const [searchQuery, setSearchQuery] = useState('')
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  // Only approved students have payment data
  const studentsWithPayments = useMemo(() => {
    let result = students.filter((s) => s.status === 'approved')

    if (paymentFilter !== 'all') {
      result = result.filter((s) => s.paymentStatus === paymentFilter)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (s) => s.name.toLowerCase().includes(query) || s.cpf.includes(query)
      )
    }

    // Sort by payment status (overdue first, then pending, then paid)
    const statusOrder: Record<string, number> = { overdue: 0, pending: 1, paid: 2 }
    result.sort((a, b) => (statusOrder[a.paymentStatus || 'pending'] || 1) - (statusOrder[b.paymentStatus || 'pending'] || 1))

    return result
  }, [students, paymentFilter, searchQuery])

  // Summary stats
  const totalRevenue = students
    .filter((s) => s.status === 'approved' && s.paymentStatus === 'paid')
    .reduce((sum, s) => sum + s.planPrice, 0)

  const pendingPayments = students.filter(
    (s) => s.status === 'approved' && s.paymentStatus === 'pending'
  )
  const pendingTotal = pendingPayments.reduce((sum, s) => sum + s.planPrice, 0)

  const overduePayments = students.filter(
    (s) => s.status === 'approved' && s.paymentStatus === 'overdue'
  )
  const overdueTotal = overduePayments.reduce((sum, s) => sum + s.planPrice, 0)

  const activeStudents = students.filter(
    (s) => s.status === 'approved' && s.paymentStatus === 'paid'
  ).length

  const totalPages = Math.ceil(studentsWithPayments.length / ITEMS_PER_PAGE)
  const paginatedStudents = studentsWithPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleOpenPayment = (student: Student) => {
    setSelectedStudent(student)
    setPaymentMethod('')
    setPaymentSuccess(false)
    setShowPaymentDialog(true)
  }

  const handleRegisterPayment = () => {
    if (selectedStudent && paymentMethod) {
      updateStudent(selectedStudent.id, {
        paymentStatus: 'paid',
      })
      setPaymentSuccess(true)
      setTimeout(() => {
        setShowPaymentDialog(false)
        setPaymentSuccess(false)
      }, 1500)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
        <p className="text-gray-500 mt-1">Gerencie os pagamentos e receitas do transporte estudantil</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Receita Total</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pendentes</p>
              <p className="text-xl font-bold text-yellow-600">{formatCurrency(pendingTotal)}</p>
              <p className="text-xs text-gray-400">{pendingPayments.length} aluno(s)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Vencidos</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(overdueTotal)}</p>
              <p className="text-xs text-gray-400">{overduePayments.length} aluno(s)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Alunos Ativos</p>
              <p className="text-xl font-bold text-blue-600">{activeStudents}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome ou CPF..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'Todos' },
            { key: 'paid', label: 'Pagos' },
            { key: 'pending', label: 'Pendentes' },
            { key: 'overdue', label: 'Vencidos' },
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={paymentFilter === tab.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setPaymentFilter(tab.key as PaymentFilter)
                setCurrentPage(1)
              }}
              className={paymentFilter === tab.key ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Aluno</TableHead>
                  <TableHead className="font-semibold">CPF</TableHead>
                  <TableHead className="font-semibold hidden md:table-cell">Plano</TableHead>
                  <TableHead className="font-semibold">Valor</TableHead>
                  <TableHead className="font-semibold hidden sm:table-cell">Vencimento</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-400">
                      <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhum pagamento encontrado</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell className="text-sm text-gray-500">{formatCPF(student.cpf)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary" className="text-xs">
                          {getPlanLabel(student.plan)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{formatCurrency(student.planPrice)}</TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-gray-500">
                        {student.paymentDueDate ? formatDate(student.paymentDueDate) : '—'}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(student.paymentStatus || 'pending')} text-xs`}>
                          {getStatusLabel(student.paymentStatus || 'pending')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {student.paymentStatus !== 'paid' && (
                          <Button
                            size="sm"
                            onClick={() => handleOpenPayment(student)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                          >
                            <CreditCard className="w-3 h-3 mr-1" />
                            PAGAR
                          </Button>
                        )}
                        {student.paymentStatus === 'paid' && (
                          <div className="flex items-center justify-end gap-1 text-green-600">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-xs font-medium">Pago</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <span className="text-sm text-gray-500">
                Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, studentsWithPayments.length)} de{' '}
                {studentsWithPayments.length}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          {paymentSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Pagamento Registrado!</h3>
              <p className="text-gray-500 mt-1">O pagamento foi confirmado com sucesso.</p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Registrar Pagamento
                </DialogTitle>
                <DialogDescription>
                  Confirme o pagamento do aluno abaixo.
                </DialogDescription>
              </DialogHeader>
              {selectedStudent && (
                <div className="space-y-6">
                  {/* Student info */}
                  <div className="rounded-lg bg-gray-50 p-4 space-y-2">
                    <p className="font-semibold text-gray-900">{selectedStudent.name}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Plano</span>
                      <span className="font-medium">{getPlanLabel(selectedStudent.plan)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Valor</span>
                      <span className="font-bold text-blue-600 text-lg">{formatCurrency(selectedStudent.planPrice)}</span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Método de Pagamento *</Label>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="space-y-3"
                    >
                      <div className={`flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                        paymentMethod === 'pix' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <RadioGroupItem value="pix" id="pix" />
                        <Label htmlFor="pix" className="cursor-pointer flex-1">
                          <p className="font-medium">Pix</p>
                          <p className="text-xs text-gray-500">Pagamento instantâneo</p>
                        </Label>
                        <Badge className="bg-green-100 text-green-700 text-xs">Recomendado</Badge>
                      </div>
                      <div className={`flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                        paymentMethod === 'boleto' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <RadioGroupItem value="boleto" id="boleto" />
                        <Label htmlFor="boleto" className="cursor-pointer flex-1">
                          <p className="font-medium">Boleto Bancário</p>
                          <p className="text-xs text-gray-500">Pagamento por boleto</p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                  CANCELAR
                </Button>
                <Button
                  onClick={handleRegisterPayment}
                  disabled={!paymentMethod}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  CONFIRMAR PAGAMENTO
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
