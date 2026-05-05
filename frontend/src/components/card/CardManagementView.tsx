'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useApp } from '@/contexts/AppContext'
import {
  getStatusColor,
  getStatusLabel,
  getPlanLabel,
  formatCPF,
  formatCurrency,
  formatDate,
} from '@/lib/utils'
import { Search, CreditCard, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { schools } from '@/lib/mock-data'

const ITEMS_PER_PAGE = 10

export default function CardManagementView() {
  const { state } = useApp()
  const students = state.students
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

  // Only show approved students
  const approvedStudents = useMemo(() => {
    let result = students.filter((s) => s.status === 'approved' && s.cardId)

    if (statusFilter !== 'all') {
      result = result.filter((s) => {
        if (statusFilter === 'active') return s.paymentStatus === 'paid'
        if (statusFilter === 'blocked') return s.paymentStatus !== 'paid'
        return true
      })
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (s) => s.name.toLowerCase().includes(query) || s.cpf.includes(query)
      )
    }

    return result
  }, [students, statusFilter, searchQuery])

  const totalPages = Math.ceil(approvedStudents.length / ITEMS_PER_PAGE)
  const paginatedStudents = approvedStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const getCardStatus = (student: typeof students[0]) => {
    if (student.paymentStatus === 'paid') {
      return { label: 'Ativo', color: 'bg-green-100 text-green-800' }
    }
    if (student.paymentStatus === 'overdue') {
      return { label: 'Bloqueado', color: 'bg-red-100 text-red-800' }
    }
    return { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' }
  }

  const getSchoolName = (id: string) => {
    return schools.find((s) => s.id === id)?.name || id
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestão de Carteirinhas</h1>
        <p className="text-gray-500 mt-1">Visualize e gerencie as carteirinhas digitais dos alunos</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cartões Ativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {students.filter((s) => s.status === 'approved' && s.paymentStatus === 'paid').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">
                {students.filter((s) => s.status === 'approved' && s.paymentStatus === 'pending').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Bloqueados</p>
              <p className="text-2xl font-bold text-gray-900">
                {students.filter((s) => s.status === 'approved' && s.paymentStatus === 'overdue').length}
              </p>
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
            { key: 'active', label: 'Ativos' },
            { key: 'blocked', label: 'Bloqueados' },
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={statusFilter === tab.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setStatusFilter(tab.key)
                setCurrentPage(1)
              }}
              className={statusFilter === tab.key ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Aluno</TableHead>
                  <TableHead className="font-semibold">CPF</TableHead>
                  <TableHead className="font-semibold hidden md:table-cell">Cartão</TableHead>
                  <TableHead className="font-semibold hidden lg:table-cell">Instituição</TableHead>
                  <TableHead className="font-semibold hidden lg:table-cell">Plano</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-400">
                      <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma carteirinha encontrada</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedStudents.map((student) => {
                    const cardStatus = getCardStatus(student)
                    return (
                      <TableRow key={student.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {student.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate max-w-[200px]">{student.name}</p>
                              <p className="text-xs text-gray-500 hidden sm:block">{student.course}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">{formatCPF(student.cpf)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{student.cardId}</code>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-gray-500 max-w-[180px] truncate">
                          {getSchoolName(student.institution)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant="secondary" className="text-xs">
                            {getPlanLabel(student.plan)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${cardStatus.color} text-xs`}>
                            {cardStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedStudent(student)
                              setShowDetailDialog(true)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <span className="text-sm text-gray-500">
                Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, approvedStudents.length)} de{' '}
                {approvedStudents.length}
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

      {/* Card Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Carteirinha</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              {/* Mini Card Preview */}
              <div className="mx-auto w-[340px] h-[210px] rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-5 text-white shadow-2xl relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg border-2 border-white/30">
                        {selectedStudent.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <p className="text-xs text-blue-200 font-medium">SICONTROLA</p>
                        <p className="font-bold text-sm leading-tight">{selectedStudent.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <QRCodeSVG
                        value={selectedStudent.cardId || selectedStudent.id}
                        size={48}
                        bgColor="transparent"
                        fgColor="white"
                      />
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-blue-200">{getSchoolName(selectedStudent.institution)}</p>
                      <p className="text-xs font-medium">{selectedStudent.course}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={`text-[10px] px-2 py-0.5 ${
                          selectedStudent.paymentStatus === 'paid'
                            ? 'bg-green-500 text-white'
                            : selectedStudent.paymentStatus === 'overdue'
                            ? 'bg-red-500 text-white'
                            : 'bg-yellow-500 text-white'
                        }`}
                      >
                        {selectedStudent.paymentStatus === 'paid' ? 'ATIVO' : selectedStudent.paymentStatus === 'overdue' ? 'BLOQUEADO' : 'PENDENTE'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Details */}
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-400 text-xs">Cartão ID</p>
                    <p className="font-mono font-medium">{selectedStudent.cardId}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">CPF</p>
                    <p className="font-medium">{formatCPF(selectedStudent.cpf)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Plano</p>
                    <p className="font-medium">{getPlanLabel(selectedStudent.plan)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Valor</p>
                    <p className="font-medium">{formatCurrency(selectedStudent.planPrice)}/mês</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Vencimento</p>
                    <p className="font-medium">{selectedStudent.paymentDueDate ? formatDate(selectedStudent.paymentDueDate) : '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Pagamento</p>
                    <Badge className={`${getStatusColor(selectedStudent.paymentStatus || 'pending')} text-xs`}>
                      {getStatusLabel(selectedStudent.paymentStatus || 'pending')}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
