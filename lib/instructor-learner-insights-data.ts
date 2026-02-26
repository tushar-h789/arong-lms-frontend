/**
 * Learner Insights (Course-level) — KPIs, completion, drop-off, item analysis, at-risk learners.
 * Filters: date range, center, group, craft, batch. Actions: announcement, live session, export, flag lesson.
 */

import {
  ASSIGNMENT_MONITOR_ROWS,
  isInactive,
  CENTERS as ASSIGNMENT_CENTERS,
  GROUPS as ASSIGNMENT_GROUPS,
  type AssignmentMonitorRow,
} from '@/lib/assignment-monitor-data'
import { COURSE_ANALYTICS } from '@/lib/course-analytics-data'
import { COURSE_COMPLETION, type ModuleLessonRow } from '@/lib/course-completion-data'
import { COURSES } from '@/lib/courses-data'
import type { CraftFilter } from '@/lib/instructor-my-courses-data'

// —— Filters ——
export type LearnerInsightsFilters = {
  dateFrom?: string
  dateTo?: string
  center?: string
  group?: string
  craft?: CraftFilter | ''
  batch?: string
}

// —— A) Top Summary KPIs ——
export type CourseInsightsSummary = {
  enrolled: number
  completionPercent: number
  avgScore: number | null // null if no quiz
  dropOffAlert: { lessonId: string; lessonTitle: string; dropOffPercent: number }
}

// —— B) Module / Lesson Completion ——
export type LessonCompletionItem = {
  id: string
  title: string
  moduleName: string
  completed: number
  reached: number
  completionPercent: number
  dropOffPercent: number
  isLowest?: boolean
}

// —— C) Drop-off ——
export type DropOffPoint = {
  lessonId: string
  lessonTitle: string
  dropped: number
  dropOffPercent: number
}

export type DropOffByCenter = {
  center: string
  completionRate: number
  enrolled: number
  completed: number
}

// —— D) Item Analysis Snapshot ——
export type MissedQuestionItem = {
  questionId: string
  questionText: string
  topicTag: 'Safety' | 'QC' | 'SOP' | 'General'
  missRatePercent: number
  attemptCount: number
}

export type WeakTopicItem = {
  tag: string
  missRatePercent: number
  questionCount: number
}

// —— E) At-risk Learners ——
export type AtRiskReason = 'inactive_14_days' | 'overdue' | 'failed_quiz_twice'

export type AtRiskLearnerRow = {
  userId: string
  userName: string
  userEmail: string
  center: string
  group: string
  craft: string
  progressPercent: number
  lastActivityAt: string
  dueDate: string
  status: string
  reasons: AtRiskReason[]
}

// —— Batch/Cohort options (mock) ——
export const BATCH_OPTIONS = [
  { value: '', label: 'All batches' },
  { value: 'batch-feb', label: 'Feb 2025' },
  { value: 'batch-jan', label: 'Jan 2025' },
]

const CRAFT_OPTIONS: { value: '' | CraftFilter; label: string }[] = [
  { value: '', label: 'All crafts' },
  { value: 'weaving', label: 'Weaving' },
  { value: 'embroidery', label: 'Embroidery' },
  { value: 'dyeing', label: 'Dyeing' },
  { value: 'finishing', label: 'Finishing' },
]

export const LEARNER_INSIGHTS_FILTER_DEFAULTS = {
  centers: ['', ...ASSIGNMENT_CENTERS].map((c) => ({ value: c, label: c || 'All centers' })),
  groups: ['', ...ASSIGNMENT_GROUPS].map((g) => ({ value: g, label: g || 'All groups' })),
  crafts: CRAFT_OPTIONS,
  batches: BATCH_OPTIONS,
}

// Mock: quiz attempts with pass/fail (for "failed twice" and avg score)
const MOCK_QUIZ_ATTEMPTS: { userId: string; courseId: string; score: number; passed: boolean; attemptedAt: string }[] = [
  { userId: 'u2', courseId: 'c1', score: 45, passed: false, attemptedAt: '2025-02-18T10:00:00Z' },
  { userId: 'u2', courseId: 'c1', score: 48, passed: false, attemptedAt: '2025-02-20T14:00:00Z' },
  { userId: 'u5', courseId: 'c1', score: 55, passed: false, attemptedAt: '2025-02-08T09:00:00Z' },
  { userId: 'u5', courseId: 'c1', score: 52, passed: false, attemptedAt: '2025-02-10T11:00:00Z' },
  { userId: 'u1', courseId: 'c1', score: 85, passed: true, attemptedAt: '2025-02-14T10:00:00Z' },
  { userId: 'u4', courseId: 'c2', score: 72, passed: true, attemptedAt: '2025-02-19T12:00:00Z' },
]

// Mock: item analysis (most missed questions, weak topics)
const MOCK_MISSED_QUESTIONS: (MissedQuestionItem & { courseId: string })[] = [
  { courseId: 'c1', questionId: 'q1', questionText: 'What is the first step in using a fire extinguisher?', topicTag: 'Safety', missRatePercent: 42, attemptCount: 180 },
  { courseId: 'c1', questionId: 'q2', questionText: 'Where is the nearest emergency exit from the dyeing section?', topicTag: 'Safety', missRatePercent: 38, attemptCount: 178 },
  { courseId: 'c1', questionId: 'q3', questionText: 'Correct temperature range for dye fixation (SOP)?', topicTag: 'SOP', missRatePercent: 55, attemptCount: 175 },
  { courseId: 'c1', questionId: 'q4', questionText: 'Which quality check is done before packing?', topicTag: 'QC', missRatePercent: 32, attemptCount: 170 },
  { courseId: 'c1', questionId: 'q5', questionText: 'When to replace PPE (gloves)?', topicTag: 'Safety', missRatePercent: 28, attemptCount: 168 },
  { courseId: 'c2', questionId: 'q6', questionText: 'Dye concentration ratio per batch (SOP)', topicTag: 'SOP', missRatePercent: 48, attemptCount: 120 },
  { courseId: 'c2', questionId: 'q7', questionText: 'Fabric inspection criteria (QC)', topicTag: 'QC', missRatePercent: 40, attemptCount: 118 },
]

function filterAssignmentsByCourseAndFilters(
  courseId: string,
  filters: LearnerInsightsFilters
): AssignmentMonitorRow[] {
  let rows = ASSIGNMENT_MONITOR_ROWS.filter(
    (r) => r.contentId === courseId && r.contentType === 'course'
  )
  if (filters.center && filters.center !== 'All Centers') rows = rows.filter((r) => r.center === filters.center)
  if (filters.group && filters.group !== 'All Groups') rows = rows.filter((r) => r.group === filters.group)
  if (filters.craft) rows = rows.filter((r) => r.craft === filters.craft)
  if (filters.dateFrom) rows = rows.filter((r) => r.assignedAt >= filters.dateFrom!)
  if (filters.dateTo) {
    const end = filters.dateTo!.includes('T') ? filters.dateTo! : `${filters.dateTo}T23:59:59.999Z`
    rows = rows.filter((r) => r.assignedAt <= end)
  }
  return rows
}

/** A) Top Summary: enrolled, completion %, avg score, drop-off alert */
export function getCourseInsightsSummary(
  courseId: string,
  filters: LearnerInsightsFilters = {}
): CourseInsightsSummary {
  const rows = filterAssignmentsByCourseAndFilters(courseId, filters)
  const enrolled = rows.length
  const completed = rows.filter((r) => r.status === 'completed').length
  const completionPercent = enrolled ? Math.round((completed / enrolled) * 100) : 0

  const analytics = COURSE_ANALYTICS.find((a) => a.courseId === courseId)
  const avgScore = analytics?.quizAvgScore ?? null

  const detail = COURSE_COMPLETION.details.find((d) => d.courseId === courseId)
  let dropOffAlert = {
    lessonId: '',
    lessonTitle: '—',
    dropOffPercent: 0,
  }
  if (detail) {
    const allLessons: ModuleLessonRow[] = detail.modules.flatMap((mod) => mod.lessons)
    const maxLesson = allLessons.reduce<ModuleLessonRow | null>(
      (best, l) =>
        l.dropOffPercent > (best?.dropOffPercent ?? 0) ? l : best,
      null
    )
    if (maxLesson) {
      dropOffAlert = {
        lessonId: maxLesson.id,
        lessonTitle: maxLesson.name,
        dropOffPercent: maxLesson.dropOffPercent,
      }
    }
  } else if (analytics) {
    dropOffAlert = {
      lessonId: analytics.dropOffLessonId,
      lessonTitle: analytics.dropOffLessonTitle,
      dropOffPercent: analytics.dropOffRate,
    }
  }

  return {
    enrolled,
    completionPercent,
    avgScore,
    dropOffAlert,
  }
}

/** B) Module / Lesson completion: flat list for bars + lowest highlight */
export function getLessonCompletionList(
  courseId: string,
  _filters: LearnerInsightsFilters = {}
): LessonCompletionItem[] {
  const detail = COURSE_COMPLETION.details.find((d) => d.courseId === courseId)
  if (!detail) return []

  const flat: LessonCompletionItem[] = []
  detail.modules.forEach((mod) => {
    mod.lessons.forEach((l) => {
      const completionPercent = l.reached ? Math.round((l.completed / l.reached) * 100) : 0
      flat.push({
        id: l.id,
        title: l.name,
        moduleName: mod.name,
        completed: l.completed,
        reached: l.reached,
        completionPercent,
        dropOffPercent: l.dropOffPercent,
      })
    })
  })

  const maxDropOff = Math.max(...flat.map((f) => f.dropOffPercent), 0)
  return flat.map((f) => ({
    ...f,
    isLowest: f.dropOffPercent === maxDropOff && maxDropOff > 0,
  }))
}

/** C) Drop-off: top 3 lessons where learners stop most */
export function getTopDropOffPoints(courseId: string, limit = 3): DropOffPoint[] {
  const detail = COURSE_COMPLETION.details.find((d) => d.courseId === courseId)
  if (!detail) {
    const analytics = COURSE_ANALYTICS.find((a) => a.courseId === courseId)
    if (analytics)
      return [
        {
          lessonId: analytics.dropOffLessonId,
          lessonTitle: analytics.dropOffLessonTitle,
          dropped: 0,
          dropOffPercent: analytics.dropOffRate,
        },
      ]
    return []
  }

  const flat: DropOffPoint[] = []
  detail.modules.forEach((mod) => {
    mod.lessons.forEach((l) => {
      flat.push({
        lessonId: l.id,
        lessonTitle: l.name,
        dropped: l.dropOff,
        dropOffPercent: l.dropOffPercent,
      })
    })
  })
  flat.sort((a, b) => b.dropOffPercent - a.dropOffPercent)
  return flat.slice(0, limit)
}

/** C) Drop-off by center/group */
export function getDropOffByCenter(
  courseId: string,
  filters: LearnerInsightsFilters = {}
): DropOffByCenter[] {
  const analytics = COURSE_ANALYTICS.find((a) => a.courseId === courseId)
  if (analytics)
    return analytics.centerWise.map((c) => ({
      center: c.center,
      completionRate: c.completionRate,
      enrolled: 0,
      completed: 0,
    }))

  const rows = filterAssignmentsByCourseAndFilters(courseId, filters)
  const byCenter = new Map<string, { enrolled: number; completed: number }>()
  rows.forEach((r) => {
    const cur = byCenter.get(r.center) ?? { enrolled: 0, completed: 0 }
    cur.enrolled += 1
    if (r.status === 'completed') cur.completed += 1
    byCenter.set(r.center, cur)
  })
  return Array.from(byCenter.entries()).map(([center, v]) => ({
    center,
    completionRate: v.enrolled ? Math.round((v.completed / v.enrolled) * 100) : 0,
    enrolled: v.enrolled,
    completed: v.completed,
  }))
}

/** D) Item analysis snapshot: top 5 missed questions, weak topics */
export function getItemAnalysisSnapshot(courseId: string): {
  topMissedQuestions: MissedQuestionItem[]
  weakTopics: WeakTopicItem[]
} {
  const questions = MOCK_MISSED_QUESTIONS.filter((q) => q.courseId === courseId)
  const topMissedQuestions = questions
    .sort((a, b) => b.missRatePercent - a.missRatePercent)
    .slice(0, 5)
    .map(({ courseId: _, ...q }) => q)

  const byTag = new Map<string, { totalMiss: number; count: number }>()
  questions.forEach((q) => {
    const cur = byTag.get(q.topicTag) ?? { totalMiss: 0, count: 0 }
    cur.totalMiss += q.missRatePercent
    cur.count += 1
    byTag.set(q.topicTag, cur)
  })
  const weakTopics: WeakTopicItem[] = Array.from(byTag.entries()).map(([tag, v]) => ({
    tag,
    missRatePercent: Math.round(v.totalMiss / v.count),
    questionCount: v.count,
  }))
  weakTopics.sort((a, b) => b.missRatePercent - a.missRatePercent)

  return { topMissedQuestions, weakTopics }
}

/** E) At-risk learners: inactive 14d, overdue, failed quiz twice */
export function getAtRiskLearners(
  courseId: string,
  filters: LearnerInsightsFilters = {}
): AtRiskLearnerRow[] {
  const rows = filterAssignmentsByCourseAndFilters(courseId, filters)
  const failedTwiceByUser = new Set<string>()
  MOCK_QUIZ_ATTEMPTS.filter(
    (a) => a.courseId === courseId && !a.passed
  ).forEach((a) => {
    const fails = MOCK_QUIZ_ATTEMPTS.filter(
      (x) => x.courseId === courseId && x.userId === a.userId && !x.passed
    )
    if (fails.length >= 2) failedTwiceByUser.add(a.userId)
  })

  const atRisk: AtRiskLearnerRow[] = []
  rows.forEach((r) => {
    if (r.status === 'completed') return
    const reasons: AtRiskReason[] = []
    if (isInactive(r, 14)) reasons.push('inactive_14_days')
    if (r.status === 'overdue') reasons.push('overdue')
    if (failedTwiceByUser.has(r.userId)) reasons.push('failed_quiz_twice')
    if (reasons.length === 0) return
    atRisk.push({
      userId: r.userId,
      userName: r.userName,
      userEmail: r.userEmail,
      center: r.center,
      group: r.group,
      craft: r.craft,
      progressPercent: r.progressPercent,
      lastActivityAt: r.lastActivityAt,
      dueDate: r.dueDate,
      status: r.status,
      reasons,
    })
  })
  atRisk.sort((a, b) => b.reasons.length - a.reasons.length)
  return atRisk
}

/** Course list for selector (instructor courses) */
export function getInsightsCourseOptions(): { value: string; label: string }[] {
  const list = COURSES.filter((c) => c.status === 'published').map((c) => ({
    value: c.id,
    label: c.title,
  }))
  return [{ value: '', label: 'Select a course' }, ...list]
}
