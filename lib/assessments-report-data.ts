/**
 * Mock data for Assessments report.
 * Replace with real API calls later.
 */

export type AssessmentResultRow = {
  id: string
  learnerName: string
  assessmentName: string
  courseName: string
  score: number
  passStatus: 'pass' | 'fail'
  attempts: number
  timeTaken: string // e.g. "12m 30s"
  completionTime: string // e.g. "2025-02-20 14:30"
}

export type AttemptRow = {
  id: string
  learnerName: string
  assessmentName: string
  attemptNumber: number
  score: number
  passStatus: 'pass' | 'fail'
  timeTaken: string
  completedAt: string
}

export type PassFailBreakdownRow = {
  assessmentId: string
  assessmentName: string
  courseName: string
  totalAttempts: number
  passed: number
  failed: number
  passRate: number
  avgScore: number
}

export const ASSESSMENTS_REPORT = {
  results: [
    { id: 'r1', learnerName: 'Rahim Ahmed', assessmentName: 'Workplace Safety Quiz', courseName: 'Workplace Safety Essentials', score: 85, passStatus: 'pass' as const, attempts: 1, timeTaken: '12m 30s', completionTime: '2025-02-20 14:30' },
    { id: 'r2', learnerName: 'Fatima Khan', assessmentName: 'Workplace Safety Quiz', courseName: 'Workplace Safety Essentials', score: 72, passStatus: 'pass' as const, attempts: 2, timeTaken: '18m 45s', completionTime: '2025-02-19 10:15' },
    { id: 'r3', learnerName: 'Karim Hossain', assessmentName: 'Data Privacy Assessment', courseName: 'Data Privacy Basics', score: 58, passStatus: 'fail' as const, attempts: 1, timeTaken: '8m 10s', completionTime: '2025-02-21 09:00' },
    { id: 'r4', learnerName: 'Nadia Islam', assessmentName: 'Workplace Safety Quiz', courseName: 'Workplace Safety Essentials', score: 90, passStatus: 'pass' as const, attempts: 1, timeTaken: '10m 20s', completionTime: '2025-02-18 16:45' },
    { id: 'r5', learnerName: 'Imran Rahman', assessmentName: 'Fire Safety Test', courseName: 'Fire Safety Fundamentals', score: 78, passStatus: 'pass' as const, attempts: 2, timeTaken: '15m 00s', completionTime: '2025-02-17 11:20' },
    { id: 'r6', learnerName: 'Sadia Akter', assessmentName: 'Data Privacy Assessment', courseName: 'Data Privacy Basics', score: 65, passStatus: 'fail' as const, attempts: 3, timeTaken: '22m 15s', completionTime: '2025-02-22 08:30' },
  ] as AssessmentResultRow[],
  attempts: [
    { id: 'a1', learnerName: 'Fatima Khan', assessmentName: 'Workplace Safety Quiz', attemptNumber: 1, score: 62, passStatus: 'fail' as const, timeTaken: '14m 00s', completedAt: '2025-02-18 15:00' },
    { id: 'a2', learnerName: 'Fatima Khan', assessmentName: 'Workplace Safety Quiz', attemptNumber: 2, score: 72, passStatus: 'pass' as const, timeTaken: '18m 45s', completedAt: '2025-02-19 10:15' },
    { id: 'a3', learnerName: 'Imran Rahman', assessmentName: 'Fire Safety Test', attemptNumber: 1, score: 65, passStatus: 'fail' as const, timeTaken: '12m 30s', completedAt: '2025-02-16 09:00' },
    { id: 'a4', learnerName: 'Imran Rahman', assessmentName: 'Fire Safety Test', attemptNumber: 2, score: 78, passStatus: 'pass' as const, timeTaken: '15m 00s', completedAt: '2025-02-17 11:20' },
    { id: 'a5', learnerName: 'Sadia Akter', assessmentName: 'Data Privacy Assessment', attemptNumber: 1, score: 48, passStatus: 'fail' as const, timeTaken: '10m 00s', completedAt: '2025-02-20 14:00' },
    { id: 'a6', learnerName: 'Sadia Akter', assessmentName: 'Data Privacy Assessment', attemptNumber: 2, score: 55, passStatus: 'fail' as const, timeTaken: '18m 00s', completedAt: '2025-02-21 10:30' },
    { id: 'a7', learnerName: 'Sadia Akter', assessmentName: 'Data Privacy Assessment', attemptNumber: 3, score: 65, passStatus: 'fail' as const, timeTaken: '22m 15s', completedAt: '2025-02-22 08:30' },
  ] as AttemptRow[],
  passFailBreakdown: [
    { assessmentId: 'as1', assessmentName: 'Workplace Safety Quiz', courseName: 'Workplace Safety Essentials', totalAttempts: 156, passed: 128, failed: 28, passRate: 82, avgScore: 76 },
    { assessmentId: 'as2', assessmentName: 'Data Privacy Assessment', courseName: 'Data Privacy Basics', totalAttempts: 98, passed: 62, failed: 36, passRate: 63, avgScore: 64 },
    { assessmentId: 'as3', assessmentName: 'Fire Safety Test', courseName: 'Fire Safety Fundamentals', totalAttempts: 134, passed: 118, failed: 16, passRate: 88, avgScore: 81 },
  ] as PassFailBreakdownRow[],
}
