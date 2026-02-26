/**
 * Path Builder (Create/Edit) — tab-based: Overview, Steps, Unlock Rules, Assignment, Progress & Insights.
 * Aarong: step types (course/assessment/live/practical), step rules, grouping, assign by craft/location.
 */

export type StepType = 'course' | 'assessment' | 'live_session' | 'practical_checklist'

export type PathStep = {
  id: string
  order: number
  title: string
  stepType: StepType
  mandatory: boolean
  groupLabel: string
  /** When stepType is 'course', link to course id from course list */
  courseId?: string
  minScoreRequired?: number
  minAttendanceRequired?: number
  watchPercentRequired?: number
  jobAidUrl?: string
  dueDate?: string
}

export type UnlockRule = {
  stepId: string
  lockedUntilStepId?: string
  optionalUnlockAnytime: boolean
  branchCondition?: string
  remedialCourseStepId?: string
}

export type AssignmentTarget = {
  type: 'individual' | 'center' | 'group' | 'department' | 'craft' | 'location_cluster'
  value: string
}

export type OverviewForm = {
  pathName: string
  shortDescription: string
  targetAudience: 'artisan' | 'staff' | 'trainer'
  skillCategory: string
  level: 1 | 2 | 3
  estimatedTotalMinutes: number | ''
  completionCertificate: boolean
}

export type StepsForm = {
  steps: PathStep[]
}

export type UnlockForm = {
  rules: UnlockRule[]
  dueDatePerStep: boolean
}

export type AssignmentForm = {
  targets: AssignmentTarget[]
  dueDate: string
  reminders: string
  enrollmentStart: string
  enrollmentEnd: string
  autoAssignOnUserCreation: boolean
}

export const STEP_TYPE_LABELS: Record<StepType, string> = {
  course: 'Course step (video/lesson)',
  assessment: 'Assessment step (skill check)',
  live_session: 'Live session step (trainer-led)',
  practical_checklist: 'Practical checklist step (field practice)',
}

export const defaultOverview: OverviewForm = {
  pathName: '',
  shortDescription: '',
  targetAudience: 'artisan',
  skillCategory: 'weaving',
  level: 1,
  estimatedTotalMinutes: '',
  completionCertificate: false,
}

export const defaultSteps: StepsForm = { steps: [] }

export const defaultUnlock: UnlockForm = { rules: [], dueDatePerStep: false }

export const defaultAssignment: AssignmentForm = {
  targets: [],
  dueDate: '',
  reminders: '',
  enrollmentStart: '',
  enrollmentEnd: '',
  autoAssignOnUserCreation: false,
}
