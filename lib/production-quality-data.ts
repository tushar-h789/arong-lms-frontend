/**
 * Mock data for Production Quality Impact report.
 * Requires QA/production data integration (future phase).
 * Whether work quality improves after training.
 * Replace with real API calls when QA/production data is integrated.
 */

export type TrainingVsDefectRow = {
  id: string
  courseName: string
  center: string
  trainingCompleted: number
  defectRateBefore: number
  defectRateAfter: number
  defectRateChange: number // negative = improvement
}

export type ReworkReductionRow = {
  id: string
  center: string
  location: string
  reworkBefore: number
  reworkAfter: number
  reductionPercent: number
  traineesCount: number
}

export type BeforeAfterRow = {
  id: string
  metric: string
  center: string
  beforeTraining: number
  afterTraining: number
  improvement: number
  unit: string
}

export const PRODUCTION_QUALITY = {
  trainingVsDefect: [
    { id: 'tvd1', courseName: 'Workplace Safety Essentials', center: 'Dhaka HQ', trainingCompleted: 245, defectRateBefore: 8.2, defectRateAfter: 5.1, defectRateChange: -3.1 },
    { id: 'tvd2', courseName: 'Workplace Safety Essentials', center: 'Chittagong', trainingCompleted: 98, defectRateBefore: 9.5, defectRateAfter: 6.2, defectRateChange: -3.3 },
    { id: 'tvd3', courseName: 'Data Privacy Basics', center: 'Dhaka HQ', trainingCompleted: 156, defectRateBefore: 12.1, defectRateAfter: 8.4, defectRateChange: -3.7 },
    { id: 'tvd4', courseName: 'Fire Safety Fundamentals', center: 'Field Centers', trainingCompleted: 89, defectRateBefore: 11.8, defectRateAfter: 9.2, defectRateChange: -2.6 },
  ] as TrainingVsDefectRow[],
  reworkReduction: [
    { id: 'rr1', center: 'Dhaka HQ', location: 'Dhaka', reworkBefore: 245, reworkAfter: 165, reductionPercent: 33, traineesCount: 425 },
    { id: 'rr2', center: 'Chittagong', location: 'Chittagong', reworkBefore: 128, reworkAfter: 98, reductionPercent: 23, traineesCount: 198 },
    { id: 'rr3', center: 'Field Centers (Rural)', location: 'Multiple', reworkBefore: 186, reworkAfter: 155, reductionPercent: 17, traineesCount: 269 },
  ] as ReworkReductionRow[],
  beforeAfter: [
    { id: 'ba1', metric: 'Defect rate', center: 'Dhaka HQ', beforeTraining: 8.2, afterTraining: 5.1, improvement: 3.1, unit: '%' },
    { id: 'ba2', metric: 'Rework count', center: 'Dhaka HQ', beforeTraining: 245, afterTraining: 165, improvement: 80, unit: 'units' },
    { id: 'ba3', metric: 'First-pass yield', center: 'Dhaka HQ', beforeTraining: 82, afterTraining: 89, improvement: 7, unit: '%' },
    { id: 'ba4', metric: 'Defect rate', center: 'Chittagong', beforeTraining: 9.5, afterTraining: 6.2, improvement: 3.3, unit: '%' },
    { id: 'ba5', metric: 'Rework count', center: 'Chittagong', beforeTraining: 128, afterTraining: 98, improvement: 30, unit: 'units' },
    { id: 'ba6', metric: 'First-pass yield', center: 'Field Centers', beforeTraining: 78, afterTraining: 84, improvement: 6, unit: '%' },
  ] as BeforeAfterRow[],
}
