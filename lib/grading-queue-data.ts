/**
 * Grading Queue — manual review for short answer / trainer-reviewed. Filter by course/path, center/group, pending/graded. Preset feedback comments.
 */

export type GradingStatus = 'pending' | 'graded' | 'recheck'

export type GradingRow = {
  id: string
  learnerName: string
  learnerId: string
  courseName: string
  pathName: string | null
  centerName: string
  groupName: string
  questionTitle: string
  questionType: string
  answerText: string
  maxScore: number
  score: number | null
  status: GradingStatus
  submittedAt: string
  gradedAt: string | null
  graderName: string | null
  feedbackComment: string | null
}

export const GRADING_STATUS_LABELS: Record<GradingStatus, string> = {
  pending: 'Pending',
  graded: 'Graded',
  recheck: 'Recheck',
}

/** Preset feedback comments for quick use (localized / artisan-friendly). */
export const PRESET_FEEDBACK_COMMENTS = [
  'Correct. Good understanding.',
  'Partially correct. Review the SOP again.',
  'Incorrect. Please complete the remedial module.',
  'Well explained. Full marks.',
  'Needs improvement. Practice the steps.',
  'Answer incomplete. Add more detail next time.',
]

export const MOCK_GRADING_ROWS: GradingRow[] = [
  {
    id: 'g1',
    learnerName: 'Rahim Uddin',
    learnerId: 'u1',
    courseName: 'Safety Basics',
    pathName: 'Weaving Level 1',
    centerName: 'Dhaka North',
    groupName: 'Weaving A',
    questionTitle: 'Name two quality checkpoints in the weaving process.',
    questionType: 'Short Answer',
    answerText: 'Thread tension and weave alignment.',
    maxScore: 10,
    score: null,
    status: 'pending',
    submittedAt: '2025-02-20T10:30:00Z',
    gradedAt: null,
    graderName: null,
    feedbackComment: null,
  },
  {
    id: 'g2',
    learnerName: 'Fatima Begum',
    learnerId: 'u2',
    courseName: 'Quality & SOP',
    pathName: null,
    centerName: 'Savar',
    groupName: 'Dyeing B',
    questionTitle: 'Describe the correct order of dyeing steps.',
    questionType: 'Short Answer',
    answerText: 'First prepare the solution, then check temperature, then add fabric and stir.',
    maxScore: 10,
    score: 8,
    status: 'graded',
    submittedAt: '2025-02-19T14:00:00Z',
    gradedAt: '2025-02-20T09:00:00Z',
    graderName: 'Nadia Islam',
    feedbackComment: 'Well explained. Full marks.',
  },
]
