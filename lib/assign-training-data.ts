/**
 * Assign Training (Create Assignment) — deploy course/path at scale.
 * Target: individual, group/department/center/location, role-based, craft-based (Aarong).
 * Details: due date, reminders, enrollment window, mandatory, notes.
 * Rules: completion override, min score, attendance, watch %.
 */

export type AssignTargetType =
  | 'individual'
  | 'group'
  | 'department'
  | 'center'
  | 'location'
  | 'role'
  | 'craft'

export type AssignContentType = 'course' | 'path'

export type ReminderDays = 7 | 3 | 1

export type AssignmentForm = {
  contentType: AssignContentType
  contentId: string
  contentName: string
  targetType: AssignTargetType
  targetValue: string
  individualUserIds: string[]
  dueDate: string
  reminderDays: ReminderDays[]
  enrollmentStart: string
  enrollmentEnd: string
  mandatory: boolean
  notesInstructions: string
  completionCriteriaOverride: string
  minimumScoreRequired: number
  attendanceRequired: boolean
  watchPercentRequired: number
}

export const TARGET_TYPE_LABELS: Record<AssignTargetType, string> = {
  individual: 'Individual user',
  group: 'Group',
  department: 'Department',
  center: 'Center',
  location: 'Location',
  role: 'Role (Artisan / Trainer / Staff)',
  craft: 'Craft (weaving / embroidery / dyeing)',
}

export const CRAFT_OPTIONS = ['weaving', 'embroidery', 'dyeing', 'finishing'] as const
export const ROLE_OPTIONS = ['artisan', 'trainer', 'staff', 'learner'] as const
export const CENTER_OPTIONS = ['Dhaka HQ', 'Chittagong', 'Field Center 1'] as const
export const GROUP_OPTIONS = ['Weaving A', 'Weaving B', 'Embroidery A', 'Embroidery B', 'Dyeing C'] as const

/** Mock: users already assigned to a given course/path (for duplicate detection) */
export const MOCK_ALREADY_ASSIGNED: Set<string> = new Set(['u1', 'u2', 'u4'])
