/**
 * Cohorts / Batches — batch-based training (village/center). Common in rural context.
 * Cohort create, members, progress dashboard, attendance + trainer notes.
 */

export type CohortRow = {
  id: string
  name: string
  pathId: string
  pathName: string
  centerOrVillage: string
  batchLabel: string
  startDate: string
  endDate: string
  memberCount: number
  completedCount: number
  completionPercent: number
  trainerName: string
  createdAt: string
}

export type CohortMemberRow = {
  id: string
  cohortId: string
  userId: string
  name: string
  role: string
  progressPercent: number
  attendancePercent: number
  status: 'active' | 'completed' | 'dropped'
}

export type CohortNoteRow = {
  id: string
  cohortId: string
  date: string
  type: 'attendance' | 'trainer_note'
  content: string
  author: string
}

export const COHORTS: CohortRow[] = [
  {
    id: 'ch1',
    name: 'Embroidery Batch Feb 2026',
    pathId: 'p1',
    pathName: 'New Artisan Onboarding',
    centerOrVillage: 'Dhaka HQ',
    batchLabel: 'Feb 2026',
    startDate: '2026-02-01',
    endDate: '2026-02-07',
    memberCount: 24,
    completedCount: 18,
    completionPercent: 75,
    trainerName: 'Fatima Begum',
    createdAt: '2026-01-25T10:00:00Z',
  },
  {
    id: 'ch2',
    name: 'Weaving Batch Jan 2026 - Rajshahi',
    pathId: 'p2',
    pathName: 'Skill Ladder - Level 2 Weaving',
    centerOrVillage: 'Rajshahi cluster',
    batchLabel: 'Jan 2026',
    startDate: '2026-01-15',
    endDate: '2026-02-28',
    memberCount: 12,
    completedCount: 8,
    completionPercent: 67,
    trainerName: 'Abdul Karim',
    createdAt: '2026-01-10T09:00:00Z',
  },
]

export const COHORT_MEMBERS: CohortMemberRow[] = [
  { id: 'cm1', cohortId: 'ch1', userId: 'u1', name: 'Rahim Ahmed', role: 'artisan', progressPercent: 100, attendancePercent: 95, status: 'completed' },
  { id: 'cm2', cohortId: 'ch1', userId: 'u2', name: 'Fatima Khan', role: 'artisan', progressPercent: 85, attendancePercent: 90, status: 'active' },
  { id: 'cm3', cohortId: 'ch1', userId: 'u3', name: 'Karim Hossain', role: 'artisan', progressPercent: 60, attendancePercent: 75, status: 'active' },
]

export const COHORT_NOTES: CohortNoteRow[] = [
  { id: 'cn1', cohortId: 'ch1', date: '2026-02-03', type: 'attendance', content: '22/24 present. 2 on leave.', author: 'Fatima Begum' },
  { id: 'cn2', cohortId: 'ch1', date: '2026-02-04', type: 'trainer_note', content: 'Day 4 practice went well. Extra support for 3 learners on quality checklist.', author: 'Fatima Begum' },
]
