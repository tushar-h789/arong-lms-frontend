/**
 * Points rules — small rewards for habits. Lesson/course/quiz/on-time/attendance. Daily cap, no duplicate for rewatch. Points ledger (admin audit). Aarong: few but meaningful; extra weight on on-time & attendance.
 */

export type PointsEarnRuleType = 'lesson_complete' | 'course_complete' | 'quiz_pass' | 'on_time_bonus' | 'attendance_bonus'

export type PointsRule = {
  id: string
  type: PointsEarnRuleType
  label: string
  points: number
  enabled: boolean
}

export type PointsLedgerEntry = {
  id: string
  userId: string
  userName: string
  action: string
  points: number
  ruleId: string
  sourceId: string
  createdAt: string
}

export const POINTS_RULE_TYPES: { id: PointsEarnRuleType; label: string }[] = [
  { id: 'lesson_complete', label: 'Lesson complete' },
  { id: 'course_complete', label: 'Course complete' },
  { id: 'quiz_pass', label: 'Quiz pass' },
  { id: 'on_time_bonus', label: 'On-time completion bonus' },
  { id: 'attendance_bonus', label: 'Attendance bonus (live class)' },
]

export const DEFAULT_POINTS_RULES: PointsRule[] = [
  { id: 'pr1', type: 'lesson_complete', label: 'Lesson complete', points: 5, enabled: true },
  { id: 'pr2', type: 'course_complete', label: 'Course complete', points: 25, enabled: true },
  { id: 'pr3', type: 'quiz_pass', label: 'Quiz pass', points: 15, enabled: true },
  { id: 'pr4', type: 'on_time_bonus', label: 'On-time completion bonus', points: 20, enabled: true },
  { id: 'pr5', type: 'attendance_bonus', label: 'Attendance bonus (live class)', points: 15, enabled: true },
]

export const MOCK_LEDGER: PointsLedgerEntry[] = [
  { id: 'le1', userId: 'u1', userName: 'Rahim Uddin', action: 'Course complete', points: 25, ruleId: 'pr2', sourceId: 'c1', createdAt: '2025-02-20T10:00:00Z' },
  { id: 'le2', userId: 'u1', userName: 'Rahim Uddin', action: 'On-time bonus', points: 20, ruleId: 'pr4', sourceId: 'c1', createdAt: '2025-02-20T10:00:00Z' },
  { id: 'le3', userId: 'u2', userName: 'Fatima Begum', action: 'Attendance (live)', points: 15, ruleId: 'pr5', sourceId: 's1', createdAt: '2025-02-22T14:30:00Z' },
]
