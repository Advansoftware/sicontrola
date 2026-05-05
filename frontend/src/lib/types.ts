// User Roles
export type UserRole = 'admin' | 'secretary' | 'student' | 'driver'

// Student Status
export type StudentStatus = 'pending' | 'approved' | 'rejected' | 'correction'

// Payment Status
export type PaymentStatus = 'paid' | 'pending' | 'overdue'

// Shift
export type Shift = 'morning' | 'afternoon' | 'night'

// Transport Plan
export type TransportPlan = '1x' | '3x' | '5x'

export interface Student {
  id: string
  name: string
  cpf: string
  birthDate: string
  phone: string
  email: string
  address: string
  neighborhood: string
  institution: string
  course: string
  shift: Shift
  schoolYear: number
  plan: TransportPlan
  planPrice: number
  status: StudentStatus
  photo?: string
  documents: {
    schoolDeclaration?: string
    residenceProof?: string
    personalDocument?: string
  }
  createdAt: string
  updatedAt: string
  rejectionReason?: string
  correctionReason?: string
  paymentStatus?: PaymentStatus
  paymentDueDate?: string
  cardId?: string
  weeklyUsage: number
}

export interface Driver {
  id: string
  name: string
  route: string
}

export interface BoardingRecord {
  id: string
  studentId: string
  studentName: string
  date: string
  time: string
  route: string
  driverName: string
  allowed: boolean
  reason?: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
}

export interface Route {
  id: string
  name: string
  description: string
}

export interface School {
  id: string
  name: string
  address: string
}

export interface PlanConfig {
  plan: TransportPlan
  label: string
  price: number
  weeklyLimit: number
  description: string
}

export interface DashboardStats {
  totalStudents: number
  approvedStudents: number
  pendingStudents: number
  monthlyRevenue: number
  activeBoardingsToday: number
  routesActive: number
}

export interface ChartData {
  name: string
  value: number
}

export interface User {
  id: string
  name: string
  role: UserRole
  email: string
  avatar?: string
}
