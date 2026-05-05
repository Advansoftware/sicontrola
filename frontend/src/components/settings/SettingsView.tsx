'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
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
import { useApp } from '@/contexts/AppContext'
import { toast } from 'sonner'
import {
  Settings,
  School,
  Route,
  CreditCard,
  Shield,
  Sliders,
  Plus,
  Save,
  Trash2,
  Building2,
  MapPin,
} from 'lucide-react'

export default function SettingsView() {
  const { state } = useApp()
  const { schools, routes, planConfigs } = state

  // ── Schools state ──
  const [schoolsList, setSchoolsList] = useState(schools)
  const [showSchoolDialog, setShowSchoolDialog] = useState(false)
  const [newSchoolName, setNewSchoolName] = useState('')
  const [newSchoolAddress, setNewSchoolAddress] = useState('')

  // ── Routes state ──
  const [routesList, setRoutesList] = useState(routes)
  const [showRouteDialog, setShowRouteDialog] = useState(false)
  const [newRouteName, setNewRouteName] = useState('')
  const [newRouteDescription, setNewRouteDescription] = useState('')

  // ── Plans state (editable) ──
  const [editablePlans, setEditablePlans] = useState(
    planConfigs.map((p) => ({ ...p }))
  )

  // ── Rules state ──
  const [autoBlockOverdue, setAutoBlockOverdue] = useState(true)
  const [autoBlockExpiredDoc, setAutoBlockExpiredDoc] = useState(false)
  const [weeklyResetDays, setWeeklyResetDays] = useState<number[]>([1])
  const [inactivityAlertDays, setInactivityAlertDays] = useState('7')

  // ── General params state ──
  const [systemName, setSystemName] = useState('SICONTROLA - Transporte Estudantil')
  const [contactEmail, setContactEmail] = useState('contato@sicontrola.gov.br')
  const [paymentDueDay, setPaymentDueDay] = useState('10')
  const [gracePeriodDays, setGracePeriodDays] = useState('5')

  const handleAddSchool = () => {
    if (!newSchoolName.trim() || !newSchoolAddress.trim()) return
    const newSchool = {
      id: `sch-${String(schoolsList.length + 1).padStart(3, '0')}`,
      name: newSchoolName.trim(),
      address: newSchoolAddress.trim(),
    }
    setSchoolsList([...schoolsList, newSchool])
    setNewSchoolName('')
    setNewSchoolAddress('')
    setShowSchoolDialog(false)
    toast.success('Escola adicionada com sucesso!')
  }

  const handleRemoveSchool = (id: string) => {
    setSchoolsList(schoolsList.filter((s) => s.id !== id))
    toast.success('Escola removida')
  }

  const handleAddRoute = () => {
    if (!newRouteName.trim() || !newRouteDescription.trim()) return
    const newRoute = {
      id: `route-${String(routesList.length + 1).padStart(3, '0')}`,
      name: newRouteName.trim(),
      description: newRouteDescription.trim(),
    }
    setRoutesList([...routesList, newRoute])
    setNewRouteName('')
    setNewRouteDescription('')
    setShowRouteDialog(false)
    toast.success('Rota adicionada com sucesso!')
  }

  const handleRemoveRoute = (id: string) => {
    setRoutesList(routesList.filter((r) => r.id !== id))
    toast.success('Rota removida')
  }

  const handleUpdatePlanPrice = (index: number, price: number) => {
    const updated = [...editablePlans]
    updated[index] = { ...updated[index], price }
    setEditablePlans(updated)
  }

  const handleUpdatePlanLimit = (index: number, limit: number) => {
    const updated = [...editablePlans]
    updated[index] = { ...updated[index], weeklyLimit: limit }
    setEditablePlans(updated)
  }

  const handleSavePlans = () => {
    toast.success('Planos atualizados com sucesso!')
  }

  const toggleResetDay = (day: number) => {
    setWeeklyResetDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const handleSaveGeneralSettings = () => {
    toast.success('Configurações gerais salvas com sucesso!')
  }

  const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configurações</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">Gerencie os parâmetros do sistema de transporte</p>
      </div>

      {/* ── ESCOLAS ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-500" />
            Escolas Cadastradas
          </CardTitle>
          <CardDescription className="text-xs">
            Gerencie as instituições de ensino disponíveis no sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowSchoolDialog(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-1.5" />
              Adicionar Escola
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold">#</TableHead>
                  <TableHead className="text-xs font-semibold">Nome</TableHead>
                  <TableHead className="text-xs font-semibold hidden sm:table-cell">Endereço</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schoolsList.map((school, i) => (
                  <TableRow key={school.id}>
                    <TableCell className="text-xs text-gray-400">{i + 1}</TableCell>
                    <TableCell className="font-medium text-sm">{school.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-gray-500">{school.address}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        onClick={() => handleRemoveSchool(school.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {schoolsList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-400 text-sm">
                      Nenhuma escola cadastrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ── ROTAS ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-500" />
            Rotas / Linhas
          </CardTitle>
          <CardDescription className="text-xs">
            Gerencie as linhas de transporte estudantil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowRouteDialog(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-1.5" />
              Adicionar Rota
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold">#</TableHead>
                  <TableHead className="text-xs font-semibold">Nome</TableHead>
                  <TableHead className="text-xs font-semibold hidden md:table-cell">Descrição</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routesList.map((route, i) => (
                  <TableRow key={route.id}>
                    <TableCell className="text-xs text-gray-400">{i + 1}</TableCell>
                    <TableCell className="font-medium text-sm">{route.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-gray-500 max-w-[300px] truncate">{route.description}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        onClick={() => handleRemoveRoute(route.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {routesList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-400 text-sm">
                      Nenhuma rota cadastrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ── PLANOS DE TRANSPORTE ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-purple-500" />
            Planos de Transporte
          </CardTitle>
          <CardDescription className="text-xs">
            Configure os valores e limites semanais dos planos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {editablePlans.map((plan, index) => (
              <Card key={plan.plan} className="border-2 border-dashed">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${index === 0 ? 'bg-purple-500' : index === 1 ? 'bg-blue-500' : 'bg-green-500'}`}>
                      {plan.weeklyLimit}x
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{plan.label}</p>
                      <p className="text-xs text-gray-400">{plan.description.slice(0, 40)}...</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-500">Preço Mensal (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={plan.price}
                      onChange={(e) => handleUpdatePlanPrice(index, Number(e.target.value))}
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-500">Limite Semanal (viagens)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="7"
                      value={plan.weeklyLimit}
                      onChange={(e) => handleUpdatePlanLimit(index, Number(e.target.value))}
                      className="h-9 text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={handleSavePlans} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="w-4 h-4 mr-1.5" />
              Salvar Alterações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── REGRAS DE USO ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Shield className="w-4 h-4 text-yellow-500" />
            Regras de Uso
          </CardTitle>
          <CardDescription className="text-xs">
            Configure as regras automáticas de bloqueio e alertas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto-block toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Bloqueio automático por inadimplência</p>
                <p className="text-xs text-gray-500">Bloquear automaticamente a carteirinha de alunos com pagamento vencido</p>
              </div>
              <Switch checked={autoBlockOverdue} onCheckedChange={setAutoBlockOverdue} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Bloqueio automático por documento expirado</p>
                <p className="text-xs text-gray-500">Bloquear carteirinha quando a declaração escolar estiver vencida</p>
              </div>
              <Switch checked={autoBlockExpiredDoc} onCheckedChange={setAutoBlockExpiredDoc} />
            </div>
          </div>

          <Separator />

          {/* Weekly Reset Days */}
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Dia(s) de Reset Semanal</p>
              <p className="text-xs text-gray-500">Selecione o(s) dia(s) em que o contador de viagens é reiniciado</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {dayLabels.map((day, index) => (
                <label
                  key={day}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={weeklyResetDays.includes(index)}
                    onCheckedChange={() => toggleResetDay(index)}
                  />
                  <span className="text-sm text-gray-700 dark:text-slate-300">{day}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          {/* Inactivity Alert */}
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Período de alerta de inatividade</p>
              <p className="text-xs text-gray-500">Número de dias sem uso para gerar alerta ao responsável</p>
            </div>
            <div className="max-w-[200px]">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  max="30"
                  value={inactivityAlertDays}
                  onChange={(e) => setInactivityAlertDays(e.target.value)}
                  className="h-9 text-sm"
                />
                <span className="text-sm text-gray-500 shrink-0">dias</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── PARÂMETROS GERAIS ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Sliders className="w-4 h-4 text-gray-500" />
            Parâmetros Gerais
          </CardTitle>
          <CardDescription className="text-xs">
            Configurações gerais do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* System Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nome do Sistema</Label>
              <Input
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            {/* Contact Email */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">E-mail de Contato</Label>
              <Input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            {/* Payment Due Day */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Dia de Vencimento</Label>
              <Select value={paymentDueDay} onValueChange={setPaymentDueDay}>
                <SelectTrigger className="h-9 text-sm w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                    <SelectItem key={day} value={String(day)}>
                      Dia {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Grace Period */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Período de Carência (dias)</Label>
              <Input
                type="number"
                min="0"
                max="15"
                value={gracePeriodDays}
                onChange={(e) => setGracePeriodDays(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button size="sm" onClick={handleSaveGeneralSettings} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="w-4 h-4 mr-1.5" />
              Salvar Configurações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Add School Dialog ── */}
      <Dialog open={showSchoolDialog} onOpenChange={setShowSchoolDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Adicionar Escola
            </DialogTitle>
            <DialogDescription>Preencha os dados da nova instituição de ensino.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nome da Escola *</Label>
              <Input
                value={newSchoolName}
                onChange={(e) => setNewSchoolName(e.target.value)}
                placeholder="Ex: Escola Municipal..."
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Endereço *</Label>
              <Input
                value={newSchoolAddress}
                onChange={(e) => setNewSchoolAddress(e.target.value)}
                placeholder="Ex: Rua..., nº - Bairro"
                className="h-9 text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSchoolDialog(false)}>Cancelar</Button>
            <Button
              onClick={handleAddSchool}
              disabled={!newSchoolName.trim() || !newSchoolAddress.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Add Route Dialog ── */}
      <Dialog open={showRouteDialog} onOpenChange={setShowRouteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Adicionar Rota
            </DialogTitle>
            <DialogDescription>Preencha os dados da nova linha de transporte.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nome da Rota *</Label>
              <Input
                value={newRouteName}
                onChange={(e) => setNewRouteName(e.target.value)}
                placeholder="Ex: Linha 06 - Centro → Zona Norte"
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Descrição *</Label>
              <Input
                value={newRouteDescription}
                onChange={(e) => setNewRouteDescription(e.target.value)}
                placeholder="Ex: Saída do Terminal com destino ao..."
                className="h-9 text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRouteDialog(false)}>Cancelar</Button>
            <Button
              onClick={handleAddRoute}
              disabled={!newRouteName.trim() || !newRouteDescription.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
