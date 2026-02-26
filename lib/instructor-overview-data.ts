/**
 * Instructor Overview (Dashboard) — action-first: KPIs, to-do, course health.
 * Replace with API later.
 */

import { COURSES } from '@/lib/courses-data'
import { MOCK_GRADING_ROWS } from '@/lib/grading-queue-data'
import { COURSE_ANALYTICS } from '@/lib/course-analytics-data'
import { ASSIGNMENT_MONITOR_ROWS } from '@/lib/assignment-monitor-data'
import { MOCK_LIVE_SESSIONS } from '@/lib/live-sessions-data'

// --- KPIs ---
export interface InstructorKPIs {
  myCoursesActive: number
  myCoursesDraft: number
  activeLearnersThisWeek: number
  avgScoreLast7: number
  avgScoreLast30: number
  pendingGrading: number
}

export function getInstructorKPIs(): InstructorKPIs {
  const courses = COURSES
  const active = courses.filter((c) => c.status === 'published').length
  const draft = courses.filter((c) => c.status === 'draft').length
  const pendingGrading = MOCK_GRADING_ROWS.filter((r) => r.status === 'pending').length
  const activeLearners = ASSIGNMENT_MONITOR_ROWS.filter(
    (r) => r.status === 'in_progress' || r.status === 'assigned'
  ).length
  return {
    myCoursesActive: active,
    myCoursesDraft: draft,
    activeLearnersThisWeek: activeLearners,
    avgScoreLast7: 78,
    avgScoreLast30: 74,
    pendingGrading,
  }
}

// --- To-Do ---
export interface ToDoItem {
  id: string
  label: string
  count?: number
  href: string
  actionLabel: string
  type: 'grading' | 'qa' | 'overdue' | 'live'
}

export function getInstructorToDo(): ToDoItem[] {
  const pendingGrading = MOCK_GRADING_ROWS.filter((r) => r.status === 'pending').length
  const overdueCount = ASSIGNMENT_MONITOR_ROWS.filter((r) => r.status === 'overdue').length
  const today = new Date().toISOString().slice(0, 10)
  const liveToday = MOCK_LIVE_SESSIONS.filter(
    (s) => s.status === 'scheduled' && s.startAt.slice(0, 10) === today
  )
  const items: ToDoItem[] = [
    {
      id: 'grading',
      label: 'Pending grading',
      count: pendingGrading,
      href: '/dashboard/instructor/grading',
      actionLabel: 'Open Grading',
      type: 'grading',
    },
    {
      id: 'qa',
      label: 'Unanswered Q&A',
      count: 3,
      href: '/dashboard/instructor/communication',
      actionLabel: 'Reply Q&A',
      type: 'qa',
    },
    {
      id: 'overdue',
      label: 'Overdue learners',
      count: overdueCount,
      href: '/dashboard/instructor/insights',
      actionLabel: 'View Overdue',
      type: 'overdue',
    },
  ]
  if (liveToday.length > 0) {
    items.push({
      id: 'live',
      label: 'Upcoming live session today',
      count: liveToday.length,
      href: '/dashboard/instructor/communication',
      actionLabel: 'Open Live Session',
      type: 'live',
    })
  }
  return items
}

// --- Course Health Table ---
export type CourseHealthAlert = 'red' | 'amber' | null

export interface CourseHealthRow {
  courseId: string
  courseName: string
  activeLearners: number
  completionPercent: number
  dropOffLesson: string | null
  avgScore: number
  alert: CourseHealthAlert
}

export function getCourseHealthTable(): CourseHealthRow[] {
  return COURSE_ANALYTICS.map((row) => {
    let alert: CourseHealthAlert = null
    if (row.completionRate < 60 || row.dropOffRate > 40) alert = 'red'
    else if (row.completionRate < 75 || row.dropOffRate > 25) alert = 'amber'
    return {
      courseId: row.courseId,
      courseName: row.courseTitle,
      activeLearners: 24,
      completionPercent: row.completionRate,
      dropOffLesson: row.dropOffLessonTitle,
      avgScore: row.quizAvgScore,
      alert,
    }
  })
}

// --- Questions Inbox (Unanswered Q&A — Help Desk style) ---
export type QATag = 'SOP' | 'Quality' | 'Safety' | 'Tech'

export interface UnansweredQuestion {
  id: string
  question: string
  tag: QATag
  age: string // "2h ago" / "1 day ago"
  courseName: string
  replyHref: string
}

const MOCK_UNANSWERED_QA: UnansweredQuestion[] = [
  { id: 'qa1', question: 'What is the correct order for dyeing steps in cold water?', tag: 'SOP', age: '2h ago', courseName: 'Dyeing SOP', replyHref: '/dashboard/instructor/communication?reply=qa1' },
  { id: 'qa2', question: 'Quality checkpoints for weaving — how many before handoff?', tag: 'Quality', age: '1 day ago', courseName: 'Weaving Basics', replyHref: '/dashboard/instructor/communication?reply=qa2' },
  { id: 'qa3', question: 'PPE required in cutting area?', tag: 'Safety', age: '1 day ago', courseName: 'Safety Basics', replyHref: '/dashboard/instructor/communication?reply=qa3' },
  { id: 'qa4', question: 'App not loading lessons on slow network', tag: 'Tech', age: '2 days ago', courseName: 'All', replyHref: '/dashboard/instructor/communication?reply=qa4' },
  { id: 'qa5', question: 'Thread tension values for synthetic vs cotton', tag: 'SOP', age: '3 days ago', courseName: 'Weaving Basics', replyHref: '/dashboard/instructor/communication?reply=qa5' },
]

export function getUnansweredQuestions(limit = 5): UnansweredQuestion[] {
  return MOCK_UNANSWERED_QA.slice(0, limit)
}

// --- Upcoming Live Sessions (This week) ---
export interface UpcomingLiveSession {
  id: string
  title: string
  startAt: string
  dateTimeLabel: string // "Feb 25, 10:00 AM"
  targetLabel: string
  meetLink: string
  platform: 'meet' | 'zoom' | 'teams'
  canMarkAttendance: boolean
}

export function getUpcomingLiveSessionsThisWeek(): UpcomingLiveSession[] {
  const now = Date.now()
  const weekFromNow = now + 7 * 24 * 60 * 60 * 1000
  return MOCK_LIVE_SESSIONS.filter((s) => {
    if (s.status !== 'scheduled') return false
    const t = new Date(s.startAt).getTime()
    return t >= now && t <= weekFromNow
  }).map((s) => {
    const d = new Date(s.startAt)
    const dateTimeLabel = d.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    const canMarkAttendance = d.getTime() < Date.now() // session already started
    return {
      id: s.id,
      title: s.title,
      startAt: s.startAt,
      dateTimeLabel,
      targetLabel: s.targetLabel,
      meetLink: s.meetLink,
      platform: s.platform,
      canMarkAttendance,
    }
  })
}

// --- At-Risk Learners (inactive 14d / overdue / failed quiz 2x) ---
export type AtRiskReason = 'inactive_14d' | 'overdue' | 'failed_quiz_twice'

export interface AtRiskLearner {
  id: string
  learnerName: string
  reason: AtRiskReason
  reasonLabel: string
  courseOrContent: string
  sendReminderHref: string
}

export function getAtRiskLearners(limit = 5): AtRiskLearner[] {
  const overdue = ASSIGNMENT_MONITOR_ROWS.filter((r) => r.status === 'overdue').slice(0, 3).map((r) => ({
    id: `at-${r.id}`,
    learnerName: r.userName,
    reason: 'overdue' as AtRiskReason,
    reasonLabel: 'Overdue training',
    courseOrContent: r.contentName,
    sendReminderHref: '/dashboard/instructor/communication?reminder=' + r.userId,
  }))
  const inactive = [
    { id: 'at-in1', learnerName: 'Mina Begum', reason: 'inactive_14d' as AtRiskReason, reasonLabel: 'Inactive 14 days', courseOrContent: 'Safety Basics', sendReminderHref: '/dashboard/instructor/communication?reminder=in1' },
    { id: 'at-in2', learnerName: 'Rafiq Islam', reason: 'inactive_14d' as AtRiskReason, reasonLabel: 'Inactive 14 days', courseOrContent: 'Weaving Level 1', sendReminderHref: '/dashboard/instructor/communication?reminder=in2' },
  ]
  const failed = [
    { id: 'at-f1', learnerName: 'Tasnim Akter', reason: 'failed_quiz_twice' as AtRiskReason, reasonLabel: 'Failed quiz twice', courseOrContent: 'Data Privacy Quiz', sendReminderHref: '/dashboard/instructor/communication?reminder=f1' },
  ]
  const combined = [...overdue, ...inactive, ...failed]
  return combined.slice(0, limit)
}
