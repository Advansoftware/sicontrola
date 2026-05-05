'use client'

import React, { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  UserPlus,
  Pencil,
  Trash2,
  Bus,
  Users,
  MapPin,
  Shield,
} from 'lucide-react'
import type { Driver } from '@/lib/types'

export default function DriverManagementView() {
  const { state, setView } = useApp()
  const { drivers, routes } = state
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)
  const [newDriverName, setNewDriverName] = useState('')
  const [newDriverRoute, setNewDriverRoute] = useState('')
  const [editDriverName, setEditDriverName] = useState('')
  const [editDriverRoute, setEditDriverRoute] = useState('')

  // Local state for drivers (simulated CRUD)
  const [localDrivers, setLocalDrivers] = useState<Driver[]>(drivers)

  const getRouteName = (routeId: string) => {
    return routes.find((r) => r.id === routeId)?.name || 'Sem rota'
  }

  // Available routes (those not assigned)
  const assignedRouteIds = new Set(localDrivers.map((d) => d.route))
  const availableRoutes = routes.filter((r) => !assignedRouteIds.has(r.id))

  const handleAddDriver = () => {
    if (!newDriverName.trim()) return
    const newDriver: Driver = {
      id: `drv-${Date.now()}`,
      name: newDriverName.trim(),
      route: newDriverRoute || 'unassigned',
    }
    setLocalDrivers((prev) => [...prev, newDriver])
    setNewDriverName('')
    setNewDriverRoute('')
    setIsAddOpen(false)
  }

  const handleEditDriver = () => {
    if (!editingDriver || !editDriverName.trim()) return
    setLocalDrivers((prev) =>
      prev.map((d) =>
        d.id === editingDriver.id
          ? { ...d, name: editDriverName.trim(), route: editDriverRoute }
          : d
      )
    )
    setEditingDriver(null)
    setEditDriverName('')
    setEditDriverRoute('')
    setIsEditOpen(false)
  }

  const handleDeleteDriver = (id: string) => {
    setLocalDrivers((prev) => prev.filter((d) => d.id !== id))
  }

  const openEditDialog = (driver: Driver) => {
    setEditingDriver(driver)
    setEditDriverName(driver.name)
    setEditDriverRoute(driver.route)
    setIsEditOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Gerencie motoristas e atribua rotas ao transporte estudantil
        </p>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="size-4" />
              Novo Motorista
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Motorista</DialogTitle>
              <DialogDescription>
                Cadastre um novo motorista e atribua uma rota.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="driver-name">Nome Completo</Label>
                <Input
                  id="driver-name"
                  placeholder="Ex: Joao da Silva"
                  value={newDriverName}
                  onChange={(e) => setNewDriverName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Rota Atribuida</Label>
                <Select value={newDriverRoute} onValueChange={setNewDriverRoute}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma rota" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route.id} value={route.id}>
                        {route.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddDriver} disabled={!newDriverName.trim()}>
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total de Motoristas</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{localDrivers.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <MapPin className="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Rotas Atribuidas</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {localDrivers.filter((d) => d.route && d.route !== 'unassigned').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Bus className="size-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Rotas Disponiveis</p>
              <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                {availableRoutes.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Driver List ── */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Motoristas Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Rota</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Acoes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {localDrivers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-slate-500 dark:text-slate-400">
                          Nenhum motorista cadastrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      localDrivers.map((driver) => {
                        const hasRoute = driver.route && driver.route !== 'unassigned'
                        return (
                          <TableRow key={driver.id}>
                            <TableCell className="font-medium text-slate-900 dark:text-white">
                              {driver.name}
                            </TableCell>
                            <TableCell className="text-slate-600 dark:text-slate-400 max-w-[200px] truncate">
                              {hasRoute ? getRouteName(driver.route) : 'Sem rota'}
                            </TableCell>
                            <TableCell>
                              {hasRoute ? (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-transparent gap-1">
                                  <Shield className="size-3" />
                                  Ativo
                                </Badge>
                              ) : (
                                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-transparent">
                                  Sem rota
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8"
                                  onClick={() => openEditDialog(driver)}
                                >
                                  <Pencil className="size-4 text-slate-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 hover:text-red-600"
                                  onClick={() => handleDeleteDriver(driver.id)}
                                >
                                  <Trash2 className="size-4 text-slate-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Route Assignment ── */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="size-4" />
                Rotas Disponiveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                {routes.map((route) => {
                  const assignedDriver = localDrivers.find((d) => d.route === route.id)
                  return (
                    <div
                      key={route.id}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {route.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {route.description}
                          </p>
                        </div>
                      </div>
                      {assignedDriver ? (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="size-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <Shield className="size-3 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-xs text-green-700 dark:text-green-400 font-medium">
                            {assignedDriver.name}
                          </span>
                        </div>
                      ) : (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="size-5 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                            <Bus className="size-3 text-orange-600 dark:text-orange-400" />
                          </div>
                          <span className="text-xs text-orange-700 dark:text-orange-400 font-medium">
                            Disponivel
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Edit Dialog ── */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Motorista</DialogTitle>
            <DialogDescription>
              Atualize os dados do motorista e a rota atribuida.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-driver-name">Nome Completo</Label>
              <Input
                id="edit-driver-name"
                value={editDriverName}
                onChange={(e) => setEditDriverName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Rota Atribuida</Label>
              <Select value={editDriverRoute} onValueChange={setEditDriverRoute}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma rota" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Sem rota</SelectItem>
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditDriver} disabled={!editDriverName.trim()}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
