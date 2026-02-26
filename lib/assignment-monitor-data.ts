/**
 * Assignment Monitor — operational tracking: who completed / overdue / in progress.
 * Status filters, center/group/trainer/craft/content/date filters, drilldown, export, overdue priority, inactive users, quick actions.
 */

export type AssignmentStatus = 'assigned' | 'in_progress' | 'completed' | 'overdue'

export type AssignmentContentType = 'course' | 'path'

export type AssignmentMonitorRow = {
  id: string
  userId: string
  userName: string
  userEmail: string
  center: string
  group: string
  trainer: string
  craft: string
  contentId: string
  contentName: string
  contentType: AssignmentContentType
  assignedAt: string
  dueDate: string
  status: AssignmentStatus
  completedAt: string
  lastActivityAt: string
  progressPercent: number
}

export const ASSIGNMENT_MONITOR_ROWS: AssignmentMonitorRow[] = [
  { id: 'am1', userId: 'u1', userName: 'Rahim Ahmed', userEmail: 'rahim@aarong.com', center: 'Dhaka HQ', group: 'Weaving A', trainer: 'Abdul Karim', craft: 'weaving', contentId: 'c1', contentName: 'Fire Safety at Workplace', contentType: 'course', assignedAt: '2025-02-01T00:00:00Z', dueDate: '2025-02-15T23:59:59Z', status: 'completed', completedAt: '2025-02-14T10:00:00Z', lastActivityAt: '2025-02-14T10:00:00Z', progressPercent: 100 },
  { id: 'am2', userId: 'u2', userName: 'Fatima Khan', userEmail: 'fatima@aarong.com', center: 'Dhaka HQ', group: 'Embroidery B', trainer: 'Nadia Islam', craft: 'embroidery', contentId: 'c1', contentName: 'Fire Safety at Workplace', contentType: 'course', assignedAt: '2025-02-01T00:00:00Z', dueDate: '2025-02-15T23:59:59Z', status: 'overdue', completedAt: '', lastActivityAt: '2025-02-18T09:00:00Z', progressPercent: 65 },
  { id: 'am3', userId: 'u3', userName: 'Karim Hossain', userEmail: 'karim@aarong.com', center: 'Chittagong', group: 'Dyeing C', trainer: 'Rahim Uddin', craft: 'dyeing', contentId: 'p1', contentName: 'New Artisan Onboarding', contentType: 'path', assignedAt: '2025-02-05T00:00:00Z', dueDate: '2025-02-25T23:59:59Z', status: 'in_progress', completedAt: '', lastActivityAt: '2025-02-22T11:00:00Z', progressPercent: 45 },
  { id: 'am4', userId: 'u9', userName: 'Tasnim Akter', userEmail: 'tasnim@aarong.com', center: 'Dhaka HQ', group: 'Weaving A', trainer: 'Abdul Karim', craft: 'weaving', contentId: 'c2', contentName: 'Standard Operating Procedure: Dyeing', contentType: 'course', assignedAt: '2025-02-10T00:00:00Z', dueDate: '2025-02-20T23:59:59Z', status: 'overdue', completedAt: '', lastActivityAt: '2025-02-12T14:00:00Z', progressPercent: 30 },
  { id: 'am5', userId: 'u5', userName: 'Imran Rahman', userEmail: 'imran@aarong.com', center: 'Dhaka HQ', group: 'Weaving B', trainer: 'Abdul Karim', craft: 'weaving', contentId: 'c1', contentName: 'Fire Safety at Workplace', contentType: 'course', assignedAt: '2025-01-20T00:00:00Z', dueDate: '2025-02-10T23:59:59Z', status: 'overdue', completedAt: '', lastActivityAt: '2025-02-01T16:00:00Z', progressPercent: 20 },
  { id: 'am6', userId: 'u10', userName: 'Mofizul Islam', userEmail: 'mofizul@aarong.com', center: 'Chittagong', group: 'Dyeing C', trainer: 'Rahim Uddin', craft: 'dyeing', contentId: 'p1', contentName: 'New Artisan Onboarding', contentType: 'path', assignedAt: '2025-02-01T00:00:00Z', dueDate: '2025-02-28T23:59:59Z', status: 'assigned', completedAt: '', lastActivityAt: '2025-01-28T09:00:00Z', progressPercent: 0 },
]

export const ASSIGNMENT_STATUS_LABELS: Record<AssignmentStatus, string> = {
  assigned: 'Assigned',
  in_progress: 'In Progress',
  completed: 'Completed',
  overdue: 'Overdue',
}

export const CENTERS = ['Dhaka HQ', 'Chittagong', 'Field Center 1'] as const
export const GROUPS = ['Weaving A', 'Weaving B', 'Embroidery A', 'Embroidery B', 'Dyeing C'] as const
export const TRAINERS = ['Abdul Karim', 'Nadia Islam', 'Rahim Uddin', 'Fatima Begum'] as const
export const CRAFTS = ['weaving', 'embroidery', 'dyeing', 'finishing'] as const

export function getDaysSince(dateIso: string): number {
  const d = new Date(dateIso)
  const now = new Date()
  return Math.floor((now.getTime() - d.getTime()) / (24 * 60 * 60 * 1000))
}

export function isInactive(row: AssignmentMonitorRow, days: 14 | 30): boolean {
  const daysSince = getDaysSince(row.lastActivityAt || row.assignedAt)
  return daysSince >= days && row.status !== 'completed'
}

/** Due today or in the future within next 7 days */
export function isDueSoon(row: AssignmentMonitorRow, withinDays = 7): boolean {
  const due = new Date(row.dueDate).getTime()
  const now = new Date().getTime()
  const end = now + withinDays * 24 * 60 * 60 * 1000
  return row.status !== 'completed' && row.status !== 'overdue' && due >= now && due <= end
}
