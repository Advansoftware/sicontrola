'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useApp } from '@/contexts/AppContext'
import { cn } from '@/lib/utils'
import type { Notification } from '@/lib/types'
import {
  Bell,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  CheckCheck,
  BellOff,
} from 'lucide-react'
import { formatDistanceToNow, parseISO, isToday, isYesterday, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

function getRelativeTime(dateStr: string): string {
  try {
    const date = parseISO(dateStr)
    if (isToday(date)) return 'hoje'
    if (isYesterday(date)) return 'ontem'
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
  } catch {
    return dateStr
  }
}

function getNotifIcon(type: Notification['type']) {
  switch (type) {
    case 'info':
      return <Info className="w-5 h-5 text-blue-500" />
    case 'success':
      return <CheckCircle2 className="w-5 h-5 text-green-500" />
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    case 'error':
      return <XCircle className="w-5 h-5 text-red-500" />
  }
}

function getTypeIndicatorColor(type: Notification['type']) {
  switch (type) {
    case 'info': return 'bg-blue-500'
    case 'success': return 'bg-green-500'
    case 'warning': return 'bg-yellow-500'
    case 'error': return 'bg-red-500'
  }
}

function getTypeBadgeClass(type: Notification['type']) {
  switch (type) {
    case 'info': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'success': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'warning': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'error': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }
}

function getTypeLabel(type: Notification['type']) {
  switch (type) {
    case 'info': return 'Info'
    case 'success': return 'Sucesso'
    case 'warning': return 'Aviso'
    case 'error': return 'Erro'
  }
}

type FilterTab = 'all' | 'unread' | 'info' | 'success' | 'warning' | 'error'

export default function NotificationsView() {
  const { state, markNotificationRead } = useApp()
  const { notifications } = state
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  )

  const filteredNotifications = useMemo(() => {
    let result = [...notifications]
    switch (activeFilter) {
      case 'unread':
        result = result.filter((n) => !n.read)
        break
      case 'info':
      case 'success':
      case 'warning':
      case 'error':
        result = result.filter((n) => n.type === activeFilter)
        break
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [notifications, activeFilter])

  const handleMarkAllRead = () => {
    notifications.forEach((n) => {
      if (!n.read) markNotificationRead(n.id)
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-700 dark:text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notificações</h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm mt-0.5">
              {unreadCount > 0
                ? `${unreadCount} notificação${unreadCount > 1 ? 'ões' : ''} não lida${unreadCount > 1 ? 's' : ''}`
                : 'Todas as notificações foram lidas'
              }
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="text-xs">
            <CheckCheck className="w-4 h-4 mr-1.5" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as FilterTab)}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="unread" className="gap-1">
            Não lidas
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 min-w-[18px] h-[18px] flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="info" className="gap-1">
            <Info className="w-3 h-3" />
            Info
          </TabsTrigger>
          <TabsTrigger value="success" className="gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Sucesso
          </TabsTrigger>
          <TabsTrigger value="warning" className="gap-1">
            <AlertTriangle className="w-3 h-3" />
            Aviso
          </TabsTrigger>
          <TabsTrigger value="error" className="gap-1">
            <XCircle className="w-3 h-3" />
            Erro
          </TabsTrigger>
        </TabsList>

        {/* Notification List */}
        <TabsContent value={activeFilter} className="mt-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="py-16 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <BellOff className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-slate-400 font-medium">Nenhuma notificação</p>
                <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">
                  {activeFilter === 'unread'
                    ? 'Todas as notificações já foram lidas'
                    : 'Não há notificações nesta categoria'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredNotifications.map((notif) => (
                <Card
                  key={notif.id}
                  className={cn(
                    'cursor-pointer transition-all hover:shadow-md',
                    !notif.read && 'border-l-4 border-l-transparent',
                    !notif.read && notif.type === 'info' && 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10',
                    !notif.read && notif.type === 'success' && 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10',
                    !notif.read && notif.type === 'warning' && 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10',
                    !notif.read && notif.type === 'error' && 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10',
                  )}
                  onClick={() => !notif.read && markNotificationRead(notif.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Left color indicator */}
                      <div className={cn(
                        'w-1 h-full min-h-[40px] rounded-full shrink-0',
                        getTypeIndicatorColor(notif.type)
                      )} />

                      {/* Icon */}
                      <div className="shrink-0 mt-0.5">
                        {getNotifIcon(notif.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={cn(
                            'text-sm leading-snug',
                            !notif.read ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-slate-300'
                          )}>
                            {notif.title}
                          </h4>
                          <Badge className={cn('text-[10px] shrink-0 px-1.5 py-0', getTypeBadgeClass(notif.type))}>
                            {getTypeLabel(notif.type)}
                          </Badge>
                        </div>
                        <p className={cn(
                          'text-sm mt-1 leading-relaxed',
                          !notif.read ? 'text-gray-600 dark:text-slate-300' : 'text-gray-500 dark:text-slate-400'
                        )}>
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[11px] text-gray-400 dark:text-slate-500">
                            {getRelativeTime(notif.createdAt)}
                          </span>
                          {!notif.read && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
