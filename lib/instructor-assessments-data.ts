/**
 * Instructor Assessments — Question Bank (own/global), Quiz Builder, Attempts & Results.
 * Replace with API later.
 */

import {
  QUESTIONS,
  type QuestionRow,
  type QuestionType,
  type QuestionTopic,
  type CraftTag,
  type Difficulty,
  TOPIC_LABELS,
  CRAFT_LABELS,
  DIFFICULTY_LABELS,
  QUESTION_TYPE_LABELS,
} from '@/lib/question-bank-data'
import {
  QUIZ_PRESETS,
  DEFAULT_QUIZ_SETTINGS,
  type QuizSettings,
  type BuildMode,
  type FeedbackWhen,
} from '@/lib/quiz-builder-data'
import { getInstructorCourseList } from '@/lib/instructor-my-courses-data'

/** Current instructor ID for "own" scope (mock). */
const CURRENT_INSTRUCTOR_ID = 'instructor-1'

export type QuestionScope = 'own' | 'global'

export type ApprovalStatus = 'draft' | 'pending' | 'approved'

export type InstructorQuestionItem = QuestionRow & {
  scope: QuestionScope
  approved: boolean
  approvalStatus: ApprovalStatus
  createdByUserId?: string
}

// Mark ownership and approval (mock: odd index = own, q1/q3 = approved global)
const OWN_QUESTION_IDS = new Set(['q1', 'q4']) // instructor's own
const APPROVED_QUESTION_IDS = new Set(['q1', 'q2', 'q3']) // approved for global bank
const PENDING_QUESTION_IDS = new Set(['q4']) // submitted, not yet approved

function toInstructorQuestion(q: QuestionRow): InstructorQuestionItem {
  const isOwn = OWN_QUESTION_IDS.has(q.id)
  const approved = APPROVED_QUESTION_IDS.has(q.id)
  const pending = PENDING_QUESTION_IDS.has(q.id)
  return {
    ...q,
    scope: isOwn ? 'own' : 'global',
    approved,
    approvalStatus: approved ? 'approved' : pending ? 'pending' : 'draft',
    createdByUserId: isOwn ? CURRENT_INSTRUCTOR_ID : undefined,
  }
}

export function getInstructorQuestionBank(opts: {
  scope?: QuestionScope | 'all'
  search?: string
  topic?: QuestionTopic | ''
  craft?: CraftTag | ''
  difficulty?: Difficulty | ''
  type?: QuestionType | ''
}): InstructorQuestionItem[] {
  const {
    scope = 'all',
    search = '',
    topic = '',
    craft = '',
    difficulty = '',
    type = '',
  } = opts
  let list = QUESTIONS.filter((q) => !q.deprecated).map(toInstructorQuestion)
  if (scope === 'own') list = list.filter((q) => q.scope === 'own')
  if (scope === 'global') list = list.filter((q) => q.scope === 'global' && q.approved)
  const q = search.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.body.toLowerCase().includes(q) ||
        (item.bodyBn ?? '').toLowerCase().includes(q)
    )
  }
  if (topic) list = list.filter((item) => item.topics.includes(topic))
  if (craft) list = list.filter((item) => item.craft === craft)
  if (difficulty) list = list.filter((item) => item.difficulty === difficulty)
  if (type) list = list.filter((item) => item.type === type)
  return list
}

export const SCOPE_OPTIONS: { id: QuestionScope; label: string }[] = [
  { id: 'own', label: 'Own questions' },
  { id: 'global', label: 'Global questions (approved)' },
]

// --- Quiz Builder (instructor) ---

export type InstructorQuizItem = {
  id: string
  title: string
  questionCount: number
  passScorePercent: number
  timeLimitMinutes: number | null
  linkedCourseId: string | null
  linkedCourseTitle: string | null
  mustPassToComplete: boolean
  isTemplate: boolean
  createdAt: string
}

const MOCK_INSTRUCTOR_QUIZZES: InstructorQuizItem[] = [
  {
    id: 'iq1',
    title: 'Workplace Safety Quiz',
    questionCount: 5,
    passScorePercent: 60,
    timeLimitMinutes: 15,
    linkedCourseId: 'c1',
    linkedCourseTitle: 'Fire Safety at Workplace',
    mustPassToComplete: true,
    isTemplate: false,
    createdAt: '2025-02-10T09:00:00Z',
  },
  {
    id: 'iq2',
    title: 'SOP Check (Dyeing)',
    questionCount: 8,
    passScorePercent: 70,
    timeLimitMinutes: 20,
    linkedCourseId: null,
    linkedCourseTitle: null,
    mustPassToComplete: false,
    isTemplate: true,
    createdAt: '2025-02-12T14:00:00Z',
  },
]

export function getInstructorQuizList(): InstructorQuizItem[] {
  return MOCK_INSTRUCTOR_QUIZZES
}

export function getCoursesForLinking(): { id: string; title: string }[] {
  return getInstructorCourseList({ status: 'published' })
    .concat(getInstructorCourseList({ status: 'draft' }))
    .map((c) => ({ id: c.id, title: c.title }))
}

// --- Attempts & Results (course-scope) ---

export type AttemptResultRow = {
  attemptId: string
  learnerId: string
  learnerName: string
  score: number
  passFail: 'pass' | 'fail'
  completedAt: string
  attemptNumber: number
}

export type LowScoreLearnerRow = {
  learnerId: string
  learnerName: string
  bestScore: number
  attemptCount: number
  lastAttemptAt: string
}

export type TopMissedQuestionRow = {
  questionId: string
  questionTitle: string
  totalAttempts: number
  missCount: number
  missRatePercent: number
}

const MOCK_ATTEMPTS: AttemptResultRow[] = [
  { attemptId: 'a1', learnerId: 'l1', learnerName: 'Rahim Uddin', score: 85, passFail: 'pass', completedAt: '2025-02-20T10:00:00Z', attemptNumber: 1 },
  { attemptId: 'a2', learnerId: 'l2', learnerName: 'Fatima Akter', score: 52, passFail: 'fail', completedAt: '2025-02-19T14:00:00Z', attemptNumber: 2 },
  { attemptId: 'a3', learnerId: 'l3', learnerName: 'Karim Ahmed', score: 90, passFail: 'pass', completedAt: '2025-02-21T09:00:00Z', attemptNumber: 1 },
  { attemptId: 'a4', learnerId: 'l4', learnerName: 'Ayesha Begum', score: 45, passFail: 'fail', completedAt: '2025-02-18T11:00:00Z', attemptNumber: 1 },
]

const MOCK_LOW_SCORE: LowScoreLearnerRow[] = [
  { learnerId: 'l4', learnerName: 'Ayesha Begum', bestScore: 45, attemptCount: 1, lastAttemptAt: '2025-02-18T11:00:00Z' },
  { learnerId: 'l2', learnerName: 'Fatima Akter', bestScore: 52, attemptCount: 2, lastAttemptAt: '2025-02-19T14:00:00Z' },
]

const MOCK_TOP_MISSED: TopMissedQuestionRow[] = [
  { questionId: 'q1', questionTitle: 'Fire extinguisher use', totalAttempts: 12, missCount: 5, missRatePercent: 42 },
  { questionId: 'q3', questionTitle: 'SOP step identification', totalAttempts: 12, missCount: 4, missRatePercent: 33 },
]

export function getAttemptsResultsByCourse(courseId: string): {
  passFailList: AttemptResultRow[]
  lowScoreLearners: LowScoreLearnerRow[]
  topMissedQuestions: TopMissedQuestionRow[]
} {
  // In real app, filter by courseId. For mock return same data for any course.
  return {
    passFailList: MOCK_ATTEMPTS,
    lowScoreLearners: MOCK_LOW_SCORE,
    topMissedQuestions: MOCK_TOP_MISSED,
  }
}

export function getInstructorCoursesForAttempts(): { id: string; title: string }[] {
  return getInstructorCourseList({}).map((c) => ({ id: c.id, title: c.title }))
}

// Re-export for UI
export {
  TOPIC_LABELS,
  CRAFT_LABELS,
  DIFFICULTY_LABELS,
  QUESTION_TYPE_LABELS,
}
export type { QuestionRow, QuestionType, QuestionTopic, CraftTag, Difficulty }
export { QUESTION_TYPES, QUESTION_TOPICS, CRAFT_TAGS, DIFFICULTIES } from '@/lib/question-bank-data'
export { QUIZ_PRESETS, DEFAULT_QUIZ_SETTINGS, FEEDBACK_WHEN_OPTIONS } from '@/lib/quiz-builder-data'
export type { QuizSettings, BuildMode, FeedbackWhen }
