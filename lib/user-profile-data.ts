/**
 * Mock data for User Profile (Detail) page.
 * Replace with real API calls later.
 */

import { USERS } from './users-data'

export type UserProfile = {
  id: string
  name: string
  email: string
  mobile?: string
  center: string
  group: string
  craftType: string
  joiningDate: string
  role: string
  status: string
  trainer?: string
}

export type LearningItem = {
  id: string
  title: string
  type: 'course' | 'path'
  assignedDate: string
  progress: number
  status: 'not_started' | 'in_progress' | 'completed'
  overdue: boolean
}

export type AssessmentAttempt = {
  id: string
  name: string
  date: string
  score: number
  maxScore: number
  passed: boolean
  attempts: number
}

export type AttendanceRecord = {
  id: string
  date: string
  type: 'virtual' | 'physical'
  courseOrSession?: string
  status: 'present' | 'absent' | 'late'
}

export type CertificateRecord = {
  id: string
  name: string
  issuedDate: string
  expiryDate: string
  status: 'valid' | 'expiring_30' | 'expired'
}

export type ActivityLogEntry = {
  id: string
  action: string
  timestamp: string
  detail?: string
}

export function getUserProfile(id: string): UserProfile | null {
  const u = USERS.find((x) => x.id === id)
  if (!u) return null
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    mobile: undefined,
    center: u.center,
    group: u.group,
    craftType: u.skillCategory ?? 'general',
    joiningDate: '2024-01-15',
    role: u.role,
    status: u.status,
    trainer: u.trainer,
  }
}

export const MOCK_LEARNING: LearningItem[] = [
  { id: 'l1', title: 'Safety Basics', type: 'course', assignedDate: '2025-01-10', progress: 100, status: 'completed', overdue: false },
  { id: 'l2', title: 'Tool Handling', type: 'course', assignedDate: '2025-02-01', progress: 60, status: 'in_progress', overdue: false },
  { id: 'l3', title: 'New Artisan Onboarding', type: 'path', assignedDate: '2025-01-15', progress: 75, status: 'in_progress', overdue: true },
]

export const MOCK_ASSESSMENTS: AssessmentAttempt[] = [
  { id: 'a1', name: 'Safety Quiz', date: '2025-02-01', score: 85, maxScore: 100, passed: true, attempts: 1 },
  { id: 'a2', name: 'Equipment Test', date: '2025-02-15', score: 62, maxScore: 100, passed: false, attempts: 2 },
]

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 'at1', date: '2025-02-22', type: 'virtual', courseOrSession: 'Safety Basics', status: 'present' },
  { id: 'at2', date: '2025-02-21', type: 'physical', courseOrSession: 'Weaving Workshop', status: 'present' },
  { id: 'at3', date: '2025-02-20', type: 'virtual', status: 'absent' },
]

export const MOCK_CERTIFICATES: CertificateRecord[] = [
  { id: 'c1', name: 'Fire Safety', issuedDate: '2025-01-20', expiryDate: '2026-01-20', status: 'valid' },
  { id: 'c2', name: 'Workplace Safety', issuedDate: '2024-06-01', expiryDate: '2025-05-31', status: 'expiring_30' },
]

export const MOCK_ACTIVITY_LOG: ActivityLogEntry[] = [
  { id: 'al1', action: 'Last login', timestamp: '2025-02-22T08:30:00Z', detail: 'Chrome on Android' },
  { id: 'al2', action: 'Last course access', timestamp: '2025-02-22T08:45:00Z', detail: 'Tool Handling' },
  { id: 'al3', action: 'Assessment attempted', timestamp: '2025-02-15T10:00:00Z', detail: 'Equipment Test' },
]
