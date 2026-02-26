/**
 * Learner Assessments (Quizzes/Tests) — pending, in-progress, completed.
 * Replace with API later.
 */

export type FeedbackWhen = 'instant' | 'after_submit' | 'after_close'

export interface PendingAssessment {
  id: string
  quizName: string
  coursePathName: string
  dueDate: string | null // e.g. "Feb 28"
  attemptsLeft: number // e.g. 1
  maxAttempts: number // e.g. 3
  instructions: string // 1–2 lines
  timeLimitMinutes: number | null
  feedbackWhen: FeedbackWhen
  passScorePercent: number
}

export interface InProgressAttempt {
  attemptId: string
  quizId: string
  quizName: string
  lastSavedAt: string // e.g. "2 min ago" or ISO
  lastSavedAtRaw: string
}

export interface CompletedAttempt {
  attemptId: string
  quizId: string
  quizName: string
  coursePathName: string
  score: number
  passFail: 'pass' | 'fail'
  completedAt: string // e.g. "Feb 20, 2025"
  canViewFeedback: boolean
}

export interface QuizQuestion {
  id: string
  type: 'mcq' | 'true_false'
  question: string
  options: { id: string; label: string }[]
  correctId: string
  explanation?: string
}

export interface QuizForAttempt {
  id: string
  title: string
  instructions: string
  timeLimitMinutes: number | null
  feedbackWhen: FeedbackWhen
  passScorePercent: number
  questions: QuizQuestion[]
}

const PENDING: PendingAssessment[] = [
  {
    id: 'q1',
    quizName: 'Workplace Safety Quiz',
    coursePathName: 'Workplace Safety Essentials',
    dueDate: 'Feb 28',
    attemptsLeft: 2,
    maxAttempts: 3,
    instructions: 'Answer all questions. You need 60% to pass. You can resume if you leave.',
    timeLimitMinutes: 15,
    feedbackWhen: 'instant',
    passScorePercent: 60,
  },
  {
    id: 'q2',
    quizName: 'Data Privacy Check',
    coursePathName: 'Data Privacy Basics',
    dueDate: 'Mar 2',
    attemptsLeft: 3,
    maxAttempts: 3,
    instructions: 'Short quiz. Instant feedback after each question.',
    timeLimitMinutes: 10,
    feedbackWhen: 'instant',
    passScorePercent: 70,
  },
  {
    id: 'q3',
    quizName: 'Fire Safety Test',
    coursePathName: 'Fire Safety at Work',
    dueDate: null,
    attemptsLeft: 1,
    maxAttempts: 2,
    instructions: 'Complete all 8 questions. Results after submit.',
    timeLimitMinutes: 20,
    feedbackWhen: 'after_submit',
    passScorePercent: 60,
  },
]

const IN_PROGRESS: InProgressAttempt[] = [
  {
    attemptId: 'att-q1-1',
    quizId: 'q1',
    quizName: 'Workplace Safety Quiz',
    lastSavedAt: '2 min ago',
    lastSavedAtRaw: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
]

const COMPLETED: CompletedAttempt[] = [
  {
    attemptId: 'att-done-1',
    quizId: 'q0',
    quizName: 'Safety Fundamentals Quiz',
    coursePathName: 'Safety Fundamentals',
    score: 85,
    passFail: 'pass',
    completedAt: 'Feb 20, 2025',
    canViewFeedback: true,
  },
  {
    attemptId: 'att-done-2',
    quizId: 'q0',
    quizName: 'Safety Fundamentals Quiz',
    coursePathName: 'Safety Fundamentals',
    score: 52,
    passFail: 'fail',
    completedAt: 'Feb 18, 2025',
    canViewFeedback: true,
  },
]

const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  q1: [
    {
      id: 'q1-1',
      type: 'mcq',
      question: 'What should you do first when you see a fire hazard?',
      options: [
        { id: 'a', label: 'Report to supervisor' },
        { id: 'b', label: 'Try to fix it yourself' },
        { id: 'c', label: 'Ignore if small' },
      ],
      correctId: 'a',
      explanation: 'Always report hazards to your supervisor immediately.',
    },
    {
      id: 'q1-2',
      type: 'mcq',
      question: 'PPE is required in areas marked with signs.',
      options: [
        { id: 't', label: 'True' },
        { id: 'f', label: 'False' },
      ],
      correctId: 't',
      explanation: 'PPE (Personal Protective Equipment) must be worn in marked zones.',
    },
    {
      id: 'q1-3',
      type: 'mcq',
      question: 'Where should you assemble during an evacuation?',
      options: [
        { id: 'a', label: 'At the designated assembly point' },
        { id: 'b', label: 'At your workstation' },
        { id: 'c', label: 'In the parking area' },
      ],
      correctId: 'a',
      explanation: 'Follow exit signs and go to the designated assembly point.',
    },
  ],
  q2: [
    {
      id: 'q2-1',
      type: 'mcq',
      question: 'Personal data should be shared only when necessary.',
      options: [
        { id: 't', label: 'True' },
        { id: 'f', label: 'False' },
      ],
      correctId: 't',
      explanation: 'Data privacy means sharing only when required for work.',
    },
  ],
  q3: [
    {
      id: 'q3-1',
      type: 'mcq',
      question: 'PASS stands for Pull, Aim, Squeeze, and what?',
      options: [
        { id: 'a', label: 'Sweep' },
        { id: 'b', label: 'Spray' },
        { id: 'c', label: 'Stop' },
      ],
      correctId: 'a',
      explanation: 'Fire extinguisher use: Pull pin, Aim at base, Squeeze lever, Sweep.',
    },
  ],
}

export function getPendingAssessments(): PendingAssessment[] {
  return PENDING.slice(0, 5)
}

export function getInProgressAttempts(): InProgressAttempt[] {
  return IN_PROGRESS
}

export function getCompletedAttempts(): CompletedAttempt[] {
  return COMPLETED
}

export function getQuizForAttempt(quizId: string): QuizForAttempt | null {
  const pending = PENDING.find((p) => p.id === quizId)
  if (!pending) return null
  const questions = QUIZ_QUESTIONS[quizId] ?? []
  return {
    id: pending.id,
    title: pending.quizName,
    instructions: pending.instructions,
    timeLimitMinutes: pending.timeLimitMinutes,
    feedbackWhen: pending.feedbackWhen,
    passScorePercent: pending.passScorePercent,
    questions,
  }
}
