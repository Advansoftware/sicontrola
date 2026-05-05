import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { UserRole } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

export function formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return phone
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    correction: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  }
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    approved: 'Aprovado',
    pending: 'Pendente',
    rejected: 'Rejeitado',
    correction: 'Correção',
    paid: 'Pago',
    overdue: 'Vencido',
    morning: 'Matutino',
    afternoon: 'Vespertino',
    night: 'Noturno',
    info: 'Informação',
    success: 'Sucesso',
    warning: 'Aviso',
    error: 'Erro',
  }
  return labels[status] || status
}

export function getPlanLabel(plan: string): string {
  const labels: Record<string, string> = {
    '1x': '1x por semana',
    '3x': '3x por semana',
    '5x': '5x por semana',
  }
  return labels[plan] || plan
}

export const roleLabels: Record<UserRole, string> = {
  admin: 'Administrador',
  secretary: 'Secretaria',
  student: 'Aluno',
  driver: 'Motorista',
}
