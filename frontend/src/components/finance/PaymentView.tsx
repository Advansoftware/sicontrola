'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useApp } from '@/contexts/AppContext'
import { formatCurrency, formatDate, getPlanLabel } from '@/lib/utils'
import {
  CreditCard,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  QrCode,
  Copy,
  Banknote,
  Wallet,
  ArrowRight,
  ExternalLink,
  Loader2,
  Building2,
} from 'lucide-react'
import { toast } from 'sonner'

// Mock payment history for the student-facing view
const mockPaymentHistory = [
  { id: 'pay-001', date: '2025-01-10', amount: 150.0, method: 'Pix', status: 'paid' as const },
  { id: 'pay-002', date: '2024-12-10', amount: 150.0, method: 'Boleto', status: 'paid' as const },
  { id: 'pay-003', date: '2024-11-10', amount: 150.0, method: 'Pix', status: 'paid' as const },
  { id: 'pay-004', date: '2024-10-10', amount: 150.0, method: 'Boleto', status: 'paid' as const },
  { id: 'pay-005', date: '2024-09-10', amount: 95.0, method: 'Pix', status: 'paid' as const },
]

function getMethodBadgeClass(method: string) {
  switch (method) {
    case 'Pix':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'Boleto':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'Stripe':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    case 'Mercado Pago':
      return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
  }
}

type PaymentStep = 'method' | 'provider' | 'details'
type PaymentProvider = 'pix' | 'boleto' | 'stripe' | 'mercadopago'

export default function PaymentView() {
  const { state } = useApp()

  // Use the first approved student as "current student" for the demo
  const currentStudent = useMemo(
    () => state.students.find((s) => s.id === 'stu-001') || state.students[0],
    [state.students]
  )

  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentProvider | ''>('')
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('method')
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)

  // Stripe mock state
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')

  // Calculate days until due / days overdue
  const dueDate = currentStudent.paymentDueDate ? new Date(currentStudent.paymentDueDate + 'T00:00:00') : null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const daysUntilDue = dueDate ? Math.ceil((dueDate.getTime() - today.getTime()) / 86400000) : null

  const paymentStatusColor = currentStudent.paymentStatus === 'paid'
    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    : currentStudent.paymentStatus === 'overdue'
    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'

  const paymentStatusLabel = currentStudent.paymentStatus === 'paid'
    ? 'Em Dia'
    : currentStudent.paymentStatus === 'overdue'
    ? 'Vencido'
    : 'Pendente'

  const planConfig = state.planConfigs.find((p) => p.plan === currentStudent.plan)

  const handleOpenPayment = () => {
    setPaymentMethod('')
    setPaymentStep('method')
    setPaymentSuccess(false)
    setCardNumber('')
    setCardExpiry('')
    setCardCvc('')
    setShowPaymentDialog(true)
  }

  const handleMethodSelect = (method: string) => {
    setPaymentMethod(method as PaymentProvider)
    if (method === 'stripe' || method === 'mercadopago') {
      setPaymentStep('details')
    } else {
      setPaymentStep('details')
    }
  }

  const handleBackToMethod = () => {
    setPaymentMethod('')
    setPaymentStep('method')
  }

  const handleConfirmPayment = async () => {
    setPaymentLoading(true)

    try {
      if (paymentMethod === 'stripe') {
        // Call Stripe API
        const res = await fetch('/api/payment/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: currentStudent.planPrice,
            studentName: currentStudent.name,
            studentEmail: currentStudent.email,
            planLabel: planConfig?.label || getPlanLabel(currentStudent.plan),
          }),
        })
        const data = await res.json()
        if (data.clientSecret) {
          toast.success('Pagamento com Stripe processado!', {
            description: `Pagamento de ${formatCurrency(currentStudent.planPrice)} registrado.`,
          })
        }
      } else if (paymentMethod === 'mercadopago') {
        // Call Mercado Pago API
        const res = await fetch('/api/payment/mercadopago', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: currentStudent.planPrice,
            studentName: currentStudent.name,
            studentEmail: currentStudent.email,
            planLabel: planConfig?.label || getPlanLabel(currentStudent.plan),
          }),
        })
        const data = await res.json()
        if (data.preferenceId) {
          toast.info('Redirecionando para Mercado Pago...', {
            description: 'Voce sera redirecionado para completar o pagamento.',
          })
        }
      } else {
        // Pix / Boleto - confirm payment
        const res = await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: currentStudent.id,
            provider: paymentMethod,
            transactionId: `txn_${Date.now()}`,
            amount: currentStudent.planPrice,
          }),
        })
        await res.json()
      }

      setPaymentSuccess(true)
      toast.success('Pagamento confirmado com sucesso!', {
        description: `Pagamento de ${formatCurrency(currentStudent.planPrice)} registrado.`,
      })
      setTimeout(() => {
        setShowPaymentDialog(false)
        setPaymentSuccess(false)
      }, 2500)
    } catch {
      toast.error('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleCopyPix = () => {
    toast.success('Chave Pix copiada!', { description: 'Cole no app do seu banco para pagar.' })
  }

  const handleCopyBoleto = () => {
    toast.success('Numero do boleto copiado!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pagamento</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">Gerencie o plano de transporte e efetue pagamentos</p>
      </div>

      {/* Current Plan Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center gap-2 text-blue-100">
            <Wallet className="w-5 h-5" />
            <span className="text-sm font-medium">Meu Plano</span>
          </div>
        </div>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {planConfig?.label || getPlanLabel(currentStudent.plan)}
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                {currentStudent.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(currentStudent.planPrice)}</p>
              <p className="text-xs text-gray-400">/mes</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Payment Status */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                currentStudent.paymentStatus === 'paid'
                  ? 'bg-green-100'
                  : currentStudent.paymentStatus === 'overdue'
                  ? 'bg-red-100'
                  : 'bg-yellow-100'
              }`}>
                {currentStudent.paymentStatus === 'paid' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : currentStudent.paymentStatus === 'overdue' ? (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                ) : (
                  <Clock className="w-5 h-5 text-yellow-600" />
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">Status</p>
                <Badge className={`${paymentStatusColor} text-xs`}>{paymentStatusLabel}</Badge>
              </div>
            </div>

            {/* Next Due Date */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-gray-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">Proximo Vencimento</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {currentStudent.paymentDueDate ? formatDate(currentStudent.paymentDueDate) : '—'}
                </p>
              </div>
            </div>

            {/* Days Until Due */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                daysUntilDue !== null && daysUntilDue < 0
                  ? 'bg-red-100'
                  : daysUntilDue !== null && daysUntilDue <= 3
                  ? 'bg-yellow-100'
                  : 'bg-green-100'
              }`}>
                <Clock className={`w-5 h-5 ${
                  daysUntilDue !== null && daysUntilDue < 0
                    ? 'text-red-600'
                    : daysUntilDue !== null && daysUntilDue <= 3
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {daysUntilDue !== null && daysUntilDue < 0 ? 'Dias em Atraso' : 'Dias ate Venc.'}
                </p>
                <p className={`text-sm font-semibold ${
                  daysUntilDue !== null && daysUntilDue < 0
                    ? 'text-red-600'
                    : daysUntilDue !== null && daysUntilDue <= 3
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}>
                  {daysUntilDue !== null
                    ? daysUntilDue < 0
                      ? `${Math.abs(daysUntilDue)} dias`
                      : `${daysUntilDue} dias`
                    : '—'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Action Button */}
      <Button
        size="lg"
        className="w-full bg-green-600 hover:bg-green-700 text-white h-14 text-base font-semibold"
        onClick={handleOpenPayment}
      >
        <Banknote className="w-5 h-5 mr-2" />
        REALIZAR PAGAMENTO
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>

      {/* Payment History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gray-400" />
            Historico de Pagamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold">Data</TableHead>
                  <TableHead className="text-xs font-semibold">Valor</TableHead>
                  <TableHead className="text-xs font-semibold">Metodo</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPaymentHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-sm">{formatDate(payment.date)}</TableCell>
                    <TableCell className="text-sm font-semibold">{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>
                      <Badge className={`${getMethodBadgeClass(payment.method)} text-xs`}>
                        {payment.method}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${payment.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'} text-xs`}>
                        {payment.status === 'paid' ? 'Pago' : 'Pendente'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ── Payment Dialog ── */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          {paymentSuccess ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 animate-in zoom-in-50 duration-300">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pagamento Confirmado!</h3>
              <p className="text-gray-500 dark:text-slate-400 mt-2">
                Seu pagamento de <span className="font-semibold text-green-600">{formatCurrency(currentStudent.planPrice)}</span> foi processado com sucesso.
              </p>
              <p className="text-sm text-gray-400 mt-3">A atualizacao do status pode levar alguns minutos.</p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-green-600" />
                  Realizar Pagamento
                </DialogTitle>
                <DialogDescription>
                  Escolha o metodo de pagamento desejado.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Amount Display */}
                <div className="rounded-xl bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/10 dark:to-green-900/10 p-4 text-center border border-blue-100 dark:border-blue-800">
                  <p className="text-xs text-gray-500 dark:text-slate-400">Valor do Pagamento</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {formatCurrency(currentStudent.planPrice)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {planConfig?.label || getPlanLabel(currentStudent.plan)}
                  </p>
                </div>

                {/* Step: Method Selection */}
                {paymentStep === 'method' && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Metodo de Pagamento *</Label>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={handleMethodSelect}
                      className="space-y-3"
                    >
                      {/* Pix Option */}
                      <div className={`flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                        paymentMethod === 'pix' ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}>
                        <RadioGroupItem value="pix" id="payment-pix" />
                        <Label htmlFor="payment-pix" className="cursor-pointer flex-1">
                          <div className="flex items-center gap-2">
                            <QrCode className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Pix</p>
                              <p className="text-xs text-gray-500">Pagamento instantaneo</p>
                            </div>
                          </div>
                        </Label>
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px]">Recomendado</Badge>
                      </div>

                      {/* Boleto Option */}
                      <div className={`flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                        paymentMethod === 'boleto' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}>
                        <RadioGroupItem value="boleto" id="payment-boleto" />
                        <Label htmlFor="payment-boleto" className="cursor-pointer flex-1">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Boleto Bancario</p>
                              <p className="text-xs text-gray-500">Prazo de ate 3 dias uteis</p>
                            </div>
                          </div>
                        </Label>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-white px-3 text-gray-400 font-medium">
                            Gateways de Pagamento
                          </span>
                        </div>
                      </div>

                      {/* Stripe Option */}
                      <div className={`flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                        paymentMethod === 'stripe' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}>
                        <RadioGroupItem value="stripe" id="payment-stripe" />
                        <Label htmlFor="payment-stripe" className="cursor-pointer flex-1">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Pagamento com Stripe</p>
                              <p className="text-xs text-gray-500">Cartao de credito/debito internacional</p>
                            </div>
                          </div>
                        </Label>
                        <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-[10px]">Cartao</Badge>
                      </div>

                      {/* Mercado Pago Option */}
                      <div className={`flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                        paymentMethod === 'mercadopago' ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}>
                        <RadioGroupItem value="mercadopago" id="payment-mp" />
                        <Label htmlFor="payment-mp" className="cursor-pointer flex-1">
                          <div className="flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-cyan-600" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Mercado Pago</p>
                              <p className="text-xs text-gray-500">Pix, boleto, cartao e mais opcoes</p>
                            </div>
                          </div>
                        </Label>
                        <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 text-[10px]">Popular</Badge>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Step: Payment Details */}
                {paymentStep === 'details' && (
                  <div className="space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                    <button
                      onClick={handleBackToMethod}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                    >
                      &larr; Voltar aos metodos
                    </button>

                    <Separator />

                    {/* Pix Details */}
                    {paymentMethod === 'pix' && (
                      <div className="rounded-lg bg-white dark:bg-gray-900 border-2 border-dashed border-green-300 dark:border-green-700 p-6 text-center">
                        <div className="w-40 h-40 mx-auto bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-4">
                          <QrCode className="w-24 h-24 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Escaneie o QR Code ou copie a chave:</p>
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                          <code className="text-xs text-gray-600 dark:text-slate-300 flex-1 truncate">
                            00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="shrink-0 h-7 w-7 p-0 text-green-600 hover:text-green-700"
                            onClick={handleCopyPix}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Boleto Details */}
                    {paymentMethod === 'boleto' && (
                      <div className="rounded-lg bg-white dark:bg-gray-900 border-2 border-dashed border-blue-300 dark:border-blue-700 p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Linha Digitavel do Boleto</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                          <code className="text-xs text-gray-600 dark:text-slate-300 break-all">
                            00190.00009 01234.56789 01234.567890 1 2345.678901 2 3456789012345
                          </code>
                        </div>
                        <div className="flex justify-end mt-3">
                          <Button variant="outline" size="sm" onClick={handleCopyBoleto} className="text-xs">
                            <Copy className="w-3 h-3 mr-1" />
                            Copiar Numero
                          </Button>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-3 text-center">
                          O boleto pode levar ate 3 dias uteis para ser compensado.
                        </p>
                      </div>
                    )}

                    {/* Stripe Details */}
                    {paymentMethod === 'stripe' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                          <CreditCard className="w-4 h-4 text-purple-600" />
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Dados do Cartao</p>
                        </div>
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs text-gray-500">Numero do Cartao</Label>
                            <Input
                              placeholder="4242 4242 4242 4242"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="h-11"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs text-gray-500">Validade</Label>
                              <Input
                                placeholder="MM/AA"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                className="h-11"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs text-gray-500">CVC</Label>
                              <Input
                                placeholder="123"
                                value={cardCvc}
                                onChange={(e) => setCardCvc(e.target.value)}
                                className="h-11"
                              />
                            </div>
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-400 text-center">
                          Pagamento seguro processado via Stripe. Seus dados sao criptografados.
                        </p>
                      </div>
                    )}

                    {/* Mercado Pago Details */}
                    {paymentMethod === 'mercadopago' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Wallet className="w-4 h-4 text-cyan-600" />
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Mercado Pago</p>
                        </div>
                        <div className="rounded-lg bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-200 dark:border-cyan-800 p-6 text-center">
                          <Building2 className="w-12 h-12 text-cyan-600 mx-auto mb-3" />
                          <p className="text-sm text-gray-900 dark:text-white font-medium mb-1">
                            Pagamento via Mercado Pago
                          </p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">
                            Ao confirmar, voce sera redirecionado para o checkout seguro do Mercado Pago, onde podera escolher entre Pix, boleto, cartao de credito e outras opcoes.
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
                          <ExternalLink className="w-3 h-3" />
                          <span>Redirecionamento externo</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmPayment}
                  disabled={!paymentMethod || paymentLoading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {paymentLoading ? (
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  )}
                  Confirmar Pagamento
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
