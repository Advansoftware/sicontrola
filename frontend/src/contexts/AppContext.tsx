'use client'

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react'
import type {
  UserRole,
  Student,
  BoardingRecord,
  Notification,
  School,
  Route,
  Driver,
  PlanConfig,
  DashboardStats,
} from '@/lib/types'
import {
  students as mockStudents,
  boardingRecords as mockBoardingRecords,
  notifications as mockNotifications,
  schools as mockSchools,
  routes as mockRoutes,
  drivers as mockDrivers,
  planConfigs as mockPlanConfigs,
} from '@/lib/mock-data'

// ── State ──
interface AppState {
  currentRole: UserRole
  currentView: string
  students: Student[]
  boardingRecords: BoardingRecord[]
  notifications: Notification[]
  schools: School[]
  routes: Route[]
  drivers: Driver[]
  planConfigs: PlanConfig[]
}

// ── Actions ──
type AppAction =
  | { type: 'SET_VIEW'; view: string }
  | { type: 'ADD_STUDENT'; student: Student }
  | { type: 'UPDATE_STUDENT'; id: string; updates: Partial<Student> }
  | { type: 'APPROVE_STUDENT'; id: string }
  | { type: 'REJECT_STUDENT'; id: string; reason: string }
  | { type: 'REQUEST_CORRECTION'; id: string; reason: string }
  | { type: 'REGISTER_PAYMENT'; studentId: string }
  | { type: 'ADD_BOARDING_RECORD'; record: BoardingRecord }
  | { type: 'MARK_NOTIFICATION_READ'; id: string }

// ── Context value ──
interface AppContextValue {
  state: AppState
  setView: (view: string) => void
  addStudent: (student: Student) => void
  updateStudent: (id: string, updates: Partial<Student>) => void
  approveStudent: (id: string) => void
  rejectStudent: (id: string, reason: string) => void
  requestCorrection: (id: string, reason: string) => void
  registerPayment: (studentId: string) => void
  addBoardingRecord: (record: BoardingRecord) => void
  markNotificationRead: (id: string) => void
  getDashboardStats: () => DashboardStats
  getUnreadNotificationCount: () => number
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

// ── Default views per role ──
function getDefaultView(role: UserRole): string {
  switch (role) {
    case 'driver':
      return 'escanear-qr'
    case 'student':
      return 'meu-cadastro'
    default:
      return 'dashboard'
  }
}

// ── Provider ──
interface AppProviderProps {
  children: React.ReactNode
  initialRole?: UserRole
}

export function AppProvider({ children, initialRole = 'admin' }: AppProviderProps) {
  const [state, dispatch] = useReducer(
    appReducer,
    {
      currentRole: initialRole,
      currentView: getDefaultView(initialRole),
      students: mockStudents,
      boardingRecords: mockBoardingRecords,
      notifications: mockNotifications,
      schools: mockSchools,
      routes: mockRoutes,
      drivers: mockDrivers,
      planConfigs: mockPlanConfigs,
    } as AppState,
  )

  const setView = useCallback((view: string) => {
    dispatch({ type: 'SET_VIEW', view })
  }, [])

  const addStudent = useCallback((student: Student) => {
    dispatch({ type: 'ADD_STUDENT', student })
  }, [])

  const updateStudent = useCallback((id: string, updates: Partial<Student>) => {
    dispatch({ type: 'UPDATE_STUDENT', id, updates })
  }, [])

  const approveStudent = useCallback((id: string) => {
    dispatch({ type: 'APPROVE_STUDENT', id })
  }, [])

  const rejectStudent = useCallback((id: string, reason: string) => {
    dispatch({ type: 'REJECT_STUDENT', id, reason })
  }, [])

  const requestCorrection = useCallback((id: string, reason: string) => {
    dispatch({ type: 'REQUEST_CORRECTION', id, reason })
  }, [])

  const registerPayment = useCallback((studentId: string) => {
    dispatch({ type: 'REGISTER_PAYMENT', studentId })
  }, [])

  const addBoardingRecord = useCallback((record: BoardingRecord) => {
    dispatch({ type: 'ADD_BOARDING_RECORD', record })
  }, [])

  const markNotificationRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', id })
  }, [])

  const getDashboardStats = useCallback((): DashboardStats => {
    const approvedStudents = state.students.filter((s) => s.status === 'approved').length
    const pendingStudents = state.students.filter((s) => s.status === 'pending').length
    const monthlyRevenue = state.students
      .filter((s) => s.paymentStatus === 'paid')
      .reduce((sum, s) => sum + s.planPrice, 0)
    const today = new Date().toISOString().split('T')[0]
    const activeBoardingsToday = state.boardingRecords.filter(
      (b) => b.date === today && b.allowed
    ).length
    const routesActive = state.routes.length

    return {
      totalStudents: state.students.length,
      approvedStudents,
      pendingStudents,
      monthlyRevenue,
      activeBoardingsToday,
      routesActive,
    }
  }, [state.students, state.boardingRecords, state.routes])

  const getUnreadNotificationCount = useCallback((): number => {
    return state.notifications.filter((n) => !n.read).length
  }, [state.notifications])

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      setView,
      addStudent,
      updateStudent,
      approveStudent,
      rejectStudent,
      requestCorrection,
      registerPayment,
      addBoardingRecord,
      markNotificationRead,
      getDashboardStats,
      getUnreadNotificationCount,
    }),
    [
      state,
      setView,
      addStudent,
      updateStudent,
      approveStudent,
      rejectStudent,
      requestCorrection,
      registerPayment,
      addBoardingRecord,
      markNotificationRead,
      getDashboardStats,
      getUnreadNotificationCount,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// ── Reducer ──
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.view }
    case 'ADD_STUDENT':
      return { ...state, students: [...state.students, action.student] }
    case 'UPDATE_STUDENT':
      return {
        ...state,
        students: state.students.map((s) =>
          s.id === action.id ? { ...s, ...action.updates, updatedAt: new Date().toISOString() } : s
        ),
      }
    case 'APPROVE_STUDENT': {
      const cardNumber = `CARD-2025-${String(state.students.filter((s) => s.status === 'approved').length + 1).padStart(4, '0')}`
      return {
        ...state,
        students: state.students.map((s) =>
          s.id === action.id
            ? {
                ...s,
                status: 'approved' as const,
                cardId: cardNumber,
                updatedAt: new Date().toISOString(),
              }
            : s
        ),
      }
    }
    case 'REJECT_STUDENT':
      return {
        ...state,
        students: state.students.map((s) =>
          s.id === action.id
            ? {
                ...s,
                status: 'rejected' as const,
                rejectionReason: action.reason,
                updatedAt: new Date().toISOString(),
              }
            : s
        ),
      }
    case 'REQUEST_CORRECTION':
      return {
        ...state,
        students: state.students.map((s) =>
          s.id === action.id
            ? {
                ...s,
                status: 'correction' as const,
                correctionReason: action.reason,
                updatedAt: new Date().toISOString(),
              }
            : s
        ),
      }
    case 'REGISTER_PAYMENT':
      return {
        ...state,
        students: state.students.map((s) =>
          s.id === action.studentId
            ? {
                ...s,
                paymentStatus: 'paid' as const,
                updatedAt: new Date().toISOString(),
              }
            : s
        ),
      }
    case 'ADD_BOARDING_RECORD':
      return {
        ...state,
        boardingRecords: [...state.boardingRecords, action.record],
      }
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.id ? { ...n, read: true } : n
        ),
      }
    default:
      return state
  }
}

// ── Hook ──
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
