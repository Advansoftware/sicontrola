'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useApp } from '@/contexts/AppContext'
import {
  getStatusColor,
  getStatusLabel,
  getPlanLabel,
  formatCPF,
  formatCurrency,
  formatDate,
} from '@/lib/utils'
import { schools } from '@/lib/mock-data'
import type { Student, StudentStatus } from '@/lib/types'
import {
  Search,
  Check,
  X,
  FileEdit,
  Eye,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  GraduationCap,
  FileText,
  Camera,
  Home,
} from 'lucide-react'

const ITEMS_PER_PAGE = 10

type FilterTab = 'all' | StudentStatus

export default function SecretaryValidationView() {
  const { state, approveStudent, rejectStudent, requestCorrection } = useApp()
  const students = state.students
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showDetailPanel, setShowDetailPanel] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showCorrectionDialog, setShowCorrectionDialog] = useState(false)
  const [reasonText, setReasonText] = useState('')

  const filteredStudents = useMemo(() => {
    let result = students

    if (activeTab !== 'all') {
      result = result.filter((s) => s.status === activeTab)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.cpf.includes(query)
      )
    }

    return result
  }, [students, activeTab, searchQuery])

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE)
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleOpenDetail = (student: Student) => {
    setSelectedStudent(student)
    setShowDetailPanel(true)
  }

  const handleCloseDetail = () => {
    setShowDetailPanel(false)
    setSelectedStudent(null)
  }

  const handleApprove = () => {
    if (selectedStudent) {
      approveStudent(selectedStudent.id)
      setSelectedStudent({ ...selectedStudent, status: 'approved', paymentStatus: 'pending' })
    }
  }

  const handleReject = () => {
    if (selectedStudent && reasonText.trim()) {
      rejectStudent(selectedStudent.id, reasonText.trim())
      setSelectedStudent({
        ...selectedStudent,
        status: 'rejected',
        rejectionReason: reasonText.trim(),
      })
      setShowRejectDialog(false)
      setReasonText('')
    }
  }

  const handleCorrection = () => {
    if (selectedStudent && reasonText.trim()) {
      requestCorrection(selectedStudent.id, reasonText.trim())
      setSelectedStudent({
        ...selectedStudent,
        status: 'correction',
        correctionReason: reasonText.trim(),
      })
      setShowCorrectionDialog(false)
      setReasonText('')
    }
  }

  const getSchoolName = (id: string) => {
    return schools.find((s) => s.id === id)?.name || id
  }

  const getStatusIcon = (status: StudentStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'correction':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Validação de Cadastros</h1>
          <p className="text-gray-500 mt-1">Analise e gerencie as solicitações de transporte estudantil</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            {filteredStudents.length} resultado(s)
          </Badge>
        </div>
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
        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val as FilterTab)
            setCurrentPage(1)
          }}
        >
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="approved">Aprovados</TabsTrigger>
            <TabsTrigger value="rejected">Reprovados</TabsTrigger>
            <TabsTrigger value="correction">Em Correção</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Nome</TableHead>
                  <TableHead className="font-semibold">CPF</TableHead>
                  <TableHead className="font-semibold hidden md:table-cell">Instituição</TableHead>
                  <TableHead className="font-semibold hidden lg:table-cell">Plano</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold hidden sm:table-cell">Data</TableHead>
                  <TableHead className="font-semibold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-400">
                      <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhum cadastro encontrado</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedStudents.map((student) => (
                    <TableRow
                      key={student.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleOpenDetail(student)}
                    >
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell className="text-sm text-gray-500">{formatCPF(student.cpf)}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-gray-500 max-w-[200px] truncate">
                        {getSchoolName(student.institution)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="secondary" className="text-xs">
                          {getPlanLabel(student.plan)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(student.status)} text-xs`}>
                          {getStatusLabel(student.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-gray-500">
                        {formatDate(student.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleOpenDetail(student)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
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
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredStudents.length)} de{' '}
                {filteredStudents.length}
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

      {/* Detail Panel (Dialog) */}
      <Dialog open={showDetailPanel} onOpenChange={setShowDetailPanel}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <div className="flex flex-col h-full">
            {/* Dialog Header */}
            <div className="px-6 py-4 border-b bg-gray-50/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedStudent?.name}</h2>
                  <p className="text-sm text-gray-500">{selectedStudent?.cpf ? formatCPF(selectedStudent.cpf) : ''}</p>
                </div>
              </div>
              {selectedStudent && (
                <Badge className={`${getStatusColor(selectedStudent.status)} text-xs`}>
                  {getStatusIcon(selectedStudent.status)}
                  <span className="ml-1">{getStatusLabel(selectedStudent.status)}</span>
                </Badge>
              )}
            </div>

            {/* Dialog Body */}
            <ScrollArea className="flex-1 px-6 py-4">
              {selectedStudent && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Personal Data */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Dados Pessoais</h3>
                    </div>

                    {/* Photo placeholder */}
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shrink-0">
                        <Camera className="w-8 h-8 text-blue-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900">{selectedStudent.name}</p>
                        <p className="text-sm text-gray-500">CPF: {formatCPF(selectedStudent.cpf)}</p>
                        <Badge variant="secondary" className="text-xs">
                          {getPlanLabel(selectedStudent.plan)} — {formatCurrency(selectedStudent.planPrice)}
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <DetailField label="Data de Nascimento" value={formatDate(selectedStudent.birthDate)} />
                      <DetailField label="Telefone" value={selectedStudent.phone} />
                      <DetailField label="E-mail" value={selectedStudent.email} />
                      <DetailField label="Bairro" value={selectedStudent.neighborhood} />
                      <div className="col-span-2">
                        <DetailField label="Endereço" value={selectedStudent.address} />
                      </div>
                    </div>
                  </div>

                  {/* Right Column - School Data + Documents */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Dados Escolares</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="col-span-2">
                        <DetailField label="Instituição" value={getSchoolName(selectedStudent.institution)} />
                      </div>
                      <DetailField label="Curso" value={selectedStudent.course} />
                      <DetailField label="Ano Letivo" value={String(selectedStudent.schoolYear)} />
                      <DetailField label="Turno" value={getStatusLabel(selectedStudent.shift)} />
                      <DetailField
                        label="Uso Semanal"
                        value={`${selectedStudent.weeklyUsage} de ${selectedStudent.plan === '1x' ? 1 : selectedStudent.plan === '3x' ? 3 : 5}`}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Documentos</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <DocStatus
                        icon={<Camera className="w-4 h-4" />}
                        label="Foto"
                        status={selectedStudent.photo ? 'uploaded' : 'pending'}
                      />
                      <DocStatus
                        icon={<FileText className="w-4 h-4" />}
                        label="Declaração Escolar"
                        status={selectedStudent.documents.schoolDeclaration || 'pending'}
                      />
                      <DocStatus
                        icon={<Home className="w-4 h-4" />}
                        label="Comp. Residência"
                        status={selectedStudent.documents.residenceProof || 'pending'}
                      />
                      <DocStatus
                        icon={<FileEdit className="w-4 h-4" />}
                        label="Doc. Pessoal"
                        status={selectedStudent.documents.personalDocument || 'pending'}
                      />
                    </div>

                    {/* Status History / Notes */}
                    {(selectedStudent.rejectionReason || selectedStudent.correctionReason) && (
                      <>
                        <Separator />
                        <div className="rounded-lg bg-gray-50 p-3 space-y-1">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {selectedStudent.rejectionReason ? 'Motivo da Rejeição' : 'Solicitação de Correção'}
                          </p>
                          <p className="text-sm text-gray-700">
                            {selectedStudent.rejectionReason || selectedStudent.correctionReason}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </ScrollArea>

            {/* Dialog Footer - Action Buttons */}
            {selectedStudent && (
              <div className="px-6 py-4 border-t bg-gray-50/50 flex items-center justify-between shrink-0">
                <div className="text-xs text-gray-400">
                  Atualizado em {formatDate(selectedStudent.updatedAt)}
                </div>
                <div className="flex items-center gap-2">
                  {selectedStudent.status === 'pending' && (
                    <>
                      <Button
                        onClick={handleApprove}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        APROVAR
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                        onClick={() => {
                          setReasonText('')
                          setShowRejectDialog(true)
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        REPROVAR
                      </Button>
                      <Button
                        variant="outline"
                        className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                        onClick={() => {
                          setReasonText('')
                          setShowCorrectionDialog(true)
                        }}
                      >
                        <FileEdit className="w-4 h-4 mr-1" />
                        CORREÇÃO
                      </Button>
                    </>
                  )}
                  {selectedStudent.status === 'correction' && (
                    <>
                      <Button
                        onClick={handleApprove}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        APROVAR
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                        onClick={() => {
                          setReasonText('')
                          setShowRejectDialog(true)
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        REPROVAR
                      </Button>
                    </>
                  )}
                  {(selectedStudent.status === 'approved' || selectedStudent.status === 'rejected') && (
                    <Button variant="outline" onClick={handleCloseDetail}>
                      FECHAR
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              Reprovar Cadastro
            </DialogTitle>
            <DialogDescription>
              Informe o motivo da reprovação. O aluno será notificado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason">Motivo da Reprovação *</Label>
              <Textarea
                id="reject-reason"
                placeholder="Descreva o motivo da reprovação..."
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              CANCELAR
            </Button>
            <Button
              onClick={handleReject}
              disabled={!reasonText.trim()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              CONFIRMAR REPROVAÇÃO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Correction Dialog */}
      <Dialog open={showCorrectionDialog} onOpenChange={setShowCorrectionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="w-5 h-5" />
              Solicitar Correção
            </DialogTitle>
            <DialogDescription>
              Informe o que precisa ser corrigido. O aluno será notificado para atualizar os dados.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="correction-reason">Observações para Correção *</Label>
              <Textarea
                id="correction-reason"
                placeholder="Descreva o que precisa ser corrigido..."
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCorrectionDialog(false)}>
              CANCELAR
            </Button>
            <Button
              onClick={handleCorrection}
              disabled={!reasonText.trim()}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              SOLICITAR CORREÇÃO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="text-gray-900 font-medium">{value || '—'}</p>
    </div>
  )
}

function DocStatus({
  icon,
  label,
  status,
}: {
  icon: React.ReactNode
  label: string
  status: string
}) {
  const isUploaded = status === 'uploaded'
  return (
    <div className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${isUploaded ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
      <div className={isUploaded ? 'text-green-600' : 'text-yellow-500'}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-700 truncate">{label}</p>
        <p className={`text-xs ${isUploaded ? 'text-green-600' : 'text-yellow-600'}`}>
          {isUploaded ? 'Enviado' : 'Pendente'}
        </p>
      </div>
      {isUploaded ? (
        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
      ) : (
        <Clock className="w-4 h-4 text-yellow-500 shrink-0" />
      )}
    </div>
  )
}
