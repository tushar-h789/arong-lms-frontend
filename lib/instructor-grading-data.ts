/**
 * Instructor Grading Queue — own courses only. Short Answer + Practical checklist verification.
 * Summary counts, filters (course, assessment type, status, center/group, date), review with rubric/comment.
 */

import { getInstructorCourseList } from '@/lib/instructor-my-courses-data'

export type AssessmentTypeFilter = 'short_answer' | 'practical_checklist' | 'all'

export type GradingQueueStatus = 'pending' | 'in_review' | 'graded' | 'recheck_requested'

export type InstructorGradingRow = {
  id: string
  learnerId: string
  learnerName: string
  centerName: string
  groupName: string
  courseId: string
  courseName: string
  quizName: string
  submittedAt: string
  attemptNumber: number
  status: GradingQueueStatus
  assessmentType: 'short_answer' | 'practical_checklist'
  // For review panel
  answerText?: string
  /** Uploaded proof (e.g. photo for practical checklist) */
  proofImageUrls?: string[]
  /** Optional link to related lesson/resource */
  relatedLessonLink?: string | null
  relatedLessonLabel?: string | null
  checklistItems?: { label: string; verified: boolean; note?: string }[]
  maxScore: number
  score: number | null
  feedbackComment: string | null
  gradedAt: string | null
  graderName: string | null
  dueBy?: string | null
}

/** Simple rubric criteria for grading (checkbox per criterion). Audit: who graded, when. */
export const RUBRIC_CRITERIA = [
  { id: 'understanding', label: 'Understanding correct?' },
  { id: 'steps_followed', label: 'Steps followed?' },
  { id: 'quality_met', label: 'Quality standard met?' },
] as const

/** Standard score scale (0–10 or 0–100). */
export const DEFAULT_SCORE_MAX = 10

export type GradingSummary = {
  pending: number
  gradedToday: number
  recheckRequested: number
  overdue: number
}

export const ASSESSMENT_TYPE_OPTIONS: { id: AssessmentTypeFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'short_answer', label: 'Short Answer' },
  { id: 'practical_checklist', label: 'Practical checklist verification' },
]

export const GRADING_STATUS_OPTIONS: { id: GradingQueueStatus | ''; label: string }[] = [
  { id: '', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'in_review', label: 'In Review' },
  { id: 'graded', label: 'Graded' },
  { id: 'recheck_requested', label: 'Recheck requested' },
]

export const GRADING_STATUS_LABELS: Record<GradingQueueStatus, string> = {
  pending: 'Pending',
  in_review: 'In Review',
  graded: 'Graded',
  recheck_requested: 'Recheck requested',
}

export const PRESET_FEEDBACK_COMMENTS = [
  'Correct. Good understanding.',
  'Partially correct. Review the SOP again.',
  'Incorrect. Please complete the remedial module.',
  'Well explained. Full marks.',
  'Needs improvement. Practice the steps.',
  'Answer incomplete. Add more detail next time.',
  'Checklist completed satisfactorily.',
  'Some steps need re-demonstration.',
]

/** Bangla-friendly quick comment chips (artisan-friendly). */
export const PRESET_COMMENT_CHIPS: { label: string; text: string }[] = [
  { label: 'ভালো হয়েছে, একইভাবে চালিয়ে যান', text: 'ভালো হয়েছে, একইভাবে চালিয়ে যান' },
  { label: 'Step-2 আবার দেখুন', text: 'Step-2 আবার দেখুন' },
  { label: 'ভিডিওটা ২ মিনিট থেকে আবার দেখুন', text: 'ভিডিওটা ২ মিনিট থেকে আবার দেখুন' },
  { label: 'সঠিক। ভালো বুঝেছেন।', text: 'সঠিক। ভালো বুঝেছেন।' },
  { label: 'আরও অনুশীলন করুন', text: 'আরও অনুশীলন করুন' },
  { label: 'চেকলিস্ট ঠিকমতো সম্পন্ন হয়েছে', text: 'চেকলিস্ট ঠিকমতো সম্পন্ন হয়েছে' },
]

// Centers/groups from typical Aarong setup (for filter dropdowns)
export const CENTERS = ['Dhaka HQ', 'Dhaka North', 'Savar', 'Chittagong', 'All Centers'] as const
export const GROUPS = ['Weaving A', 'Weaving B', 'Embroidery A', 'Embroidery B', 'Dyeing B', 'Dyeing C', 'All Groups'] as const

const MOCK_ROWS: InstructorGradingRow[] = [
  {
    id: 'ig1',
    learnerId: 'u1',
    learnerName: 'Rahim Uddin',
    centerName: 'Dhaka North',
    groupName: 'Weaving A',
    courseId: 'c1',
    courseName: 'Fire Safety at Workplace',
    quizName: 'Safety Quiz',
    submittedAt: '2025-02-24T10:30:00Z',
    attemptNumber: 1,
    status: 'pending',
    assessmentType: 'short_answer',
    answerText: 'Thread tension and weave alignment are the two quality checkpoints I check.',
    relatedLessonLink: '/dashboard/learner/course/c1/lesson/s1',
    relatedLessonLabel: 'Quality checkpoints (Lesson 2)',
    maxScore: 10,
    score: null,
    feedbackComment: null,
    gradedAt: null,
    graderName: null,
  },
  {
    id: 'ig2',
    learnerId: 'u2',
    learnerName: 'Fatima Begum',
    centerName: 'Savar',
    groupName: 'Dyeing B',
    courseId: 'c1',
    courseName: 'Fire Safety at Workplace',
    quizName: 'Safety Quiz',
    submittedAt: '2025-02-23T14:00:00Z',
    attemptNumber: 2,
    status: 'graded',
    assessmentType: 'short_answer',
    answerText: 'First prepare the solution, then check temperature, then add fabric and stir.',
    maxScore: 10,
    score: 8,
    feedbackComment: 'Well explained. Full marks.',
    gradedAt: '2025-02-24T09:00:00Z',
    graderName: 'Nadia Islam',
  },
  {
    id: 'ig3',
    learnerId: 'u3',
    learnerName: 'Karim Ahmed',
    centerName: 'Dhaka HQ',
    groupName: 'Embroidery A',
    courseId: 'c2',
    courseName: 'Quality & SOP',
    quizName: 'Practical Verification',
    submittedAt: '2025-02-24T08:00:00Z',
    attemptNumber: 1,
    status: 'pending',
    assessmentType: 'practical_checklist',
    checklistItems: [
      { label: 'Correct tool handling', verified: true },
      { label: 'Sequence of steps followed', verified: true },
      { label: 'Safety gear worn', verified: false, note: 'Missing gloves' },
    ],
    proofImageUrls: ['/assets/sample-proof.jpg'],
    relatedLessonLink: '/dashboard/learner/course/c2/lesson/l1',
    relatedLessonLabel: 'Dyeing steps (video 2:00)',
    maxScore: 15,
    score: null,
    feedbackComment: null,
    gradedAt: null,
    graderName: null,
  },
  {
    id: 'ig4',
    learnerId: 'u4',
    learnerName: 'Ayesha Khatun',
    centerName: 'Chittagong',
    groupName: 'Weaving B',
    courseId: 'c1',
    courseName: 'Fire Safety at Workplace',
    quizName: 'Safety Quiz',
    submittedAt: '2025-02-20T11:00:00Z',
    attemptNumber: 1,
    status: 'recheck_requested',
    assessmentType: 'short_answer',
    answerText: 'I check the machine and the output.',
    maxScore: 10,
    score: 4,
    feedbackComment: 'Answer incomplete. Add more detail next time.',
    gradedAt: '2025-02-21T10:00:00Z',
    graderName: 'Nadia Islam',
  },
  {
    id: 'ig5',
    learnerId: 'u5',
    learnerName: 'Mohammad Hassan',
    centerName: 'Dhaka North',
    groupName: 'Weaving A',
    courseId: 'c2',
    courseName: 'Quality & SOP',
    quizName: 'Short Answer',
    submittedAt: '2025-02-22T16:00:00Z',
    attemptNumber: 1,
    status: 'in_review',
    assessmentType: 'short_answer',
    answerText: 'Quality checkpoints include raw material check and final inspection.',
    maxScore: 10,
    score: null,
    feedbackComment: null,
    gradedAt: null,
    graderName: null,
  },
  {
    id: 'ig6',
    learnerId: 'u6',
    learnerName: 'Sultana Parvin',
    centerName: 'Savar',
    groupName: 'Embroidery B',
    courseId: 'c1',
    courseName: 'Fire Safety at Workplace',
    quizName: 'Safety Quiz',
    submittedAt: '2025-02-18T09:00:00Z',
    attemptNumber: 1,
    status: 'pending',
    assessmentType: 'short_answer',
    answerText: 'Report to supervisor and use extinguisher if trained.',
    maxScore: 10,
    score: null,
    feedbackComment: null,
    gradedAt: null,
    graderName: null,
    dueBy: '2025-02-22T23:59:00Z',
  },
]

const todayStart = () => {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  return d.toISOString()
}

export function getGradingSummary(opts: {
  courseId?: string
  centerName?: string
  groupName?: string
} = {}): GradingSummary {
  let rows = MOCK_ROWS
  if (opts.courseId) rows = rows.filter((r) => r.courseId === opts.courseId)
  if (opts.centerName && opts.centerName !== 'All Centers') rows = rows.filter((r) => r.centerName === opts.centerName)
  if (opts.groupName && opts.groupName !== 'All Groups') rows = rows.filter((r) => r.groupName === opts.groupName)
  const today = todayStart()
  return {
    pending: rows.filter((r) => r.status === 'pending').length,
    gradedToday: rows.filter((r) => r.gradedAt && r.gradedAt >= today).length,
    recheckRequested: rows.filter((r) => r.status === 'recheck_requested').length,
    overdue: rows.filter((r) => r.status === 'pending' && r.dueBy && r.dueBy < new Date().toISOString()).length,
  }
}

export function getInstructorGradingQueue(opts: {
  courseId?: string
  assessmentType?: AssessmentTypeFilter
  status?: GradingQueueStatus | ''
  centerName?: string
  groupName?: string
  dateFrom?: string
  dateTo?: string
}): InstructorGradingRow[] {
  const {
    courseId = '',
    assessmentType = 'all',
    status = '',
    centerName = '',
    groupName = '',
    dateFrom = '',
    dateTo = '',
  } = opts
  let list = MOCK_ROWS.slice()
  if (courseId) list = list.filter((r) => r.courseId === courseId)
  if (assessmentType !== 'all') list = list.filter((r) => r.assessmentType === assessmentType)
  if (status) list = list.filter((r) => r.status === status)
  if (centerName && centerName !== 'All Centers') list = list.filter((r) => r.centerName === centerName)
  if (groupName && groupName !== 'All Groups') list = list.filter((r) => r.groupName === groupName)
  if (dateFrom) list = list.filter((r) => r.submittedAt >= dateFrom)
  if (dateTo) {
    const end = dateTo.includes('T') ? dateTo : `${dateTo}T23:59:59.999Z`
    list = list.filter((r) => r.submittedAt <= end)
  }
  list.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
  return list
}

export function getInstructorCoursesForGrading(): { id: string; title: string }[] {
  return getInstructorCourseList({}).map((c) => ({ id: c.id, title: c.title }))
}
