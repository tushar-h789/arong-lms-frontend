/**
 * Mock data for Learning Path Progress (Onboarding / Skill Ladder).
 * New artisan onboarding + skill upgrade ladder track.
 * Replace with real API calls later.
 */

export type PathSummary = {
  id: string
  pathName: string
  pathType: 'onboarding' | 'skill_ladder'
  totalEnrolled: number
  completed: number
  completionPercent: number
}

export type StepProgression = {
  id: string
  pathId: string
  pathName: string
  stepOrder: number
  stepName: string
  enrolled: number
  completed: number
  completionPercent: number
  avgDaysToComplete: number
}

export type BottleneckStep = {
  id: string
  pathName: string
  stepName: string
  stepOrder: number
  completionPercent: number
  dropOffCount: number
  isBottleneck: boolean
}

export type PathPerformanceByCenter = {
  id: string
  pathName: string
  center: string
  trainer?: string
  enrolled: number
  completed: number
  completionPercent: number
  avgDaysToComplete: number
}

export const LEARNING_PATHS = {
  pathSummary: [
    { id: 'p1', pathName: 'New Artisan Onboarding', pathType: 'onboarding' as const, totalEnrolled: 156, completed: 98, completionPercent: 63 },
    { id: 'p2', pathName: 'Skill Ladder - Level 2', pathType: 'skill_ladder' as const, totalEnrolled: 89, completed: 62, completionPercent: 70 },
    { id: 'p3', pathName: 'Safety & Compliance Path', pathType: 'onboarding' as const, totalEnrolled: 245, completed: 198, completionPercent: 81 },
  ] as PathSummary[],
  stepProgression: [
    { id: 's1', pathId: 'p1', pathName: 'New Artisan Onboarding', stepOrder: 1, stepName: 'Orientation & Safety Intro', enrolled: 156, completed: 145, completionPercent: 93, avgDaysToComplete: 2 },
    { id: 's2', pathId: 'p1', pathName: 'New Artisan Onboarding', stepOrder: 2, stepName: 'Tool & Equipment Basics', enrolled: 145, completed: 120, completionPercent: 83, avgDaysToComplete: 5 },
    { id: 's3', pathId: 'p1', pathName: 'New Artisan Onboarding', stepOrder: 3, stepName: 'Quality Standards Module', enrolled: 120, completed: 98, completionPercent: 82, avgDaysToComplete: 7 },
    { id: 's4', pathId: 'p1', pathName: 'New Artisan Onboarding', stepOrder: 4, stepName: 'Hands-on Assessment', enrolled: 98, completed: 98, completionPercent: 100, avgDaysToComplete: 3 },
    { id: 's5', pathId: 'p3', pathName: 'Safety & Compliance Path', stepOrder: 1, stepName: 'Workplace Safety Essentials', enrolled: 245, completed: 230, completionPercent: 94, avgDaysToComplete: 10 },
    { id: 's6', pathId: 'p3', pathName: 'Safety & Compliance Path', stepOrder: 2, stepName: 'Fire Safety Certification', enrolled: 230, completed: 205, completionPercent: 89, avgDaysToComplete: 7 },
    { id: 's7', pathId: 'p3', pathName: 'Safety & Compliance Path', stepOrder: 3, stepName: 'Data Privacy Basics', enrolled: 205, completed: 198, completionPercent: 97, avgDaysToComplete: 5 },
  ] as StepProgression[],
  bottleneckSteps: [
    { id: 'b1', pathName: 'New Artisan Onboarding', stepName: 'Quality Standards Module', stepOrder: 3, completionPercent: 82, dropOffCount: 22, isBottleneck: true },
    { id: 'b2', pathName: 'New Artisan Onboarding', stepName: 'Tool & Equipment Basics', stepOrder: 2, completionPercent: 83, dropOffCount: 25, isBottleneck: true },
    { id: 'b3', pathName: 'Safety & Compliance Path', stepName: 'Fire Safety Certification', stepOrder: 2, completionPercent: 89, dropOffCount: 25, isBottleneck: true },
    { id: 'b4', pathName: 'New Artisan Onboarding', stepName: 'Orientation & Safety Intro', stepOrder: 1, completionPercent: 93, dropOffCount: 11, isBottleneck: false },
  ] as BottleneckStep[],
  pathPerformanceByCenter: [
    { id: 'pc1', pathName: 'New Artisan Onboarding', center: 'Dhaka HQ', trainer: 'Abdul Karim', enrolled: 85, completed: 58, completionPercent: 68, avgDaysToComplete: 18 },
    { id: 'pc2', pathName: 'New Artisan Onboarding', center: 'Chittagong', trainer: 'Fatima Begum', enrolled: 45, completed: 28, completionPercent: 62, avgDaysToComplete: 22 },
    { id: 'pc3', pathName: 'New Artisan Onboarding', center: 'Field Centers', trainer: 'Rahim Uddin', enrolled: 26, completed: 12, completionPercent: 46, avgDaysToComplete: 28 },
    { id: 'pc4', pathName: 'Safety & Compliance Path', center: 'Dhaka HQ', trainer: 'Abdul Karim', enrolled: 142, completed: 120, completionPercent: 85, avgDaysToComplete: 18 },
    { id: 'pc5', pathName: 'Safety & Compliance Path', center: 'Chittagong', trainer: 'Nadia Islam', enrolled: 68, completed: 52, completionPercent: 76, avgDaysToComplete: 22 },
    { id: 'pc6', pathName: 'Skill Ladder - Level 2', center: 'Dhaka HQ', trainer: 'Imran Rahman', enrolled: 52, completed: 40, completionPercent: 77, avgDaysToComplete: 14 },
  ] as PathPerformanceByCenter[],
}
