/**
 * Mock data for Item Analysis (Question Analytics) report.
 * Replace with real API calls later.
 */

export type QuestionRow = {
  id: string
  questionText: string
  topic: string
  correctPercent: number
  mostMissed: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  attempts: number
  correctCount: number
  needsReview?: boolean
}

export type TopicBreakdownRow = {
  id: string
  topic: string
  avgCorrect: number
  strength: boolean // true = strength, false = weakness
  questionCount: number
  attemptedCount: number
}

export const ITEM_ANALYSIS = {
  assessments: [
    { value: '', label: 'All assessments' },
    { value: 'as1', label: 'Workplace Safety Quiz' },
    { value: 'as2', label: 'Data Privacy Assessment' },
    { value: 'as3', label: 'Fire Safety Test' },
  ],
  questions: [
    { id: 'q1', questionText: 'What does PPE stand for?', topic: 'Safety Basics', correctPercent: 92, mostMissed: false, difficulty: 'easy' as const, attempts: 245, correctCount: 225, needsReview: false },
    { id: 'q2', questionText: 'Which fire extinguisher is used for electrical fires?', topic: 'Fire Safety', correctPercent: 45, mostMissed: true, difficulty: 'hard' as const, attempts: 240, correctCount: 108, needsReview: true },
    { id: 'q3', questionText: 'How often should evacuation drills be conducted?', topic: 'Evacuation', correctPercent: 68, mostMissed: false, difficulty: 'medium' as const, attempts: 238, correctCount: 162, needsReview: false },
    { id: 'q4', questionText: 'Under GDPR, how long can personal data be stored?', topic: 'Data Retention', correctPercent: 38, mostMissed: true, difficulty: 'hard' as const, attempts: 189, correctCount: 72, needsReview: true },
    { id: 'q5', questionText: 'What is the correct order of using a fire extinguisher?', topic: 'Fire Safety', correctPercent: 55, mostMissed: true, difficulty: 'medium' as const, attempts: 235, correctCount: 129, needsReview: false },
    { id: 'q6', questionText: 'Which hazard requires immediate reporting?', topic: 'Safety Basics', correctPercent: 85, mostMissed: false, difficulty: 'easy' as const, attempts: 242, correctCount: 206, needsReview: false },
    { id: 'q7', questionText: 'Define "right to erasure" under GDPR', topic: 'Data Rights', correctPercent: 52, mostMissed: true, difficulty: 'hard' as const, attempts: 185, correctCount: 96, needsReview: true },
  ] as QuestionRow[],
  topicBreakdown: [
    { id: 't1', topic: 'Safety Basics', avgCorrect: 88, strength: true, questionCount: 4, attemptedCount: 245 },
    { id: 't2', topic: 'Evacuation', avgCorrect: 72, strength: true, questionCount: 2, attemptedCount: 238 },
    { id: 't3', topic: 'Fire Safety', avgCorrect: 50, strength: false, questionCount: 3, attemptedCount: 240 },
    { id: 't4', topic: 'Data Rights', avgCorrect: 48, strength: false, questionCount: 2, attemptedCount: 185 },
    { id: 't5', topic: 'Data Retention', avgCorrect: 40, strength: false, questionCount: 2, attemptedCount: 189 },
  ] as TopicBreakdownRow[],
}
