/**
 * Mock data for My Learning page — learner's assigned/enrolled queue.
 * Replace with real API later.
 */

export type LearningItemType = 'course' | 'path'
export type LearningStatus = 'assigned' | 'in_progress' | 'completed' | 'overdue'

export interface BadgeTeaser {
  badgeName: string
  message: string // e.g. "Complete 1 more lesson to get 'On-time Learner' badge"
}

export interface MyLearningItem {
  id: string
  title: string
  type: LearningItemType
  status: LearningStatus
  progress: number // 0–100
  nextStep: string // one line: next lesson/step
  dueDate: string | null // display e.g. "Feb 22"
  dueDateRaw: string | null // ISO for sorting
  lastOpenedAt: string | null // ISO for "recently opened" sort
  href: string
  certificateHref: string | null // for completed, if certificate exists
  /** Future-ready: has video/PDF for offline download (slow network) */
  downloadable?: boolean
  /** Gamification: show hint when 1 lesson away from badge */
  badgeTeaser?: BadgeTeaser | null
}

/** Due within next 7 days = "due soon" */
function isDueWithinSevenDays(raw: string | null): boolean {
  if (!raw) return false
  const due = new Date(raw)
  const now = new Date()
  const sevenDays = 7 * 24 * 60 * 60 * 1000
  return due >= now && due.getTime() - now.getTime() <= sevenDays
}

function isOverdue(raw: string | null): boolean {
  if (!raw) return false
  return new Date(raw) < new Date()
}

export const MY_LEARNING_ITEMS: MyLearningItem[] = [
  {
    id: 'c1',
    title: 'Workplace Safety Essentials',
    type: 'course',
    status: 'in_progress',
    progress: 65,
    nextStep: 'Module 4: Fire Safety',
    dueDate: 'Feb 22',
    dueDateRaw: '2025-02-22',
    lastOpenedAt: '2025-02-25T10:00:00Z',
    href: '/dashboard/learner/course/c1',
    certificateHref: null,
    downloadable: true,
    badgeTeaser: {
      badgeName: 'On-time Learner',
      message: "Complete 1 more lesson to get 'On-time Learner' badge",
    },
  },
  {
    id: 'c2',
    title: 'Data Privacy Basics',
    type: 'course',
    status: 'in_progress',
    progress: 30,
    nextStep: 'Lesson 2: Your Data Rights',
    dueDate: 'Feb 25',
    dueDateRaw: '2025-02-25',
    lastOpenedAt: '2025-02-24T14:00:00Z',
    href: '/dashboard/learner/course/c2',
    certificateHref: null,
    downloadable: true,
  },
  {
    id: 'p1',
    title: 'Quality SOP Path',
    type: 'path',
    status: 'assigned',
    progress: 0,
    nextStep: 'Start with Introduction',
    dueDate: 'Mar 5',
    dueDateRaw: '2025-03-05',
    lastOpenedAt: null,
    href: '/dashboard/learner/course/p1',
    certificateHref: null,
    downloadable: true,
  },
  {
    id: 'c3',
    title: 'Fire Safety at Work',
    type: 'course',
    status: 'assigned',
    progress: 0,
    nextStep: 'Start course',
    dueDate: 'Feb 28',
    dueDateRaw: '2025-02-28',
    lastOpenedAt: null,
    href: '/dashboard/learner/course/c3',
    certificateHref: null,
    downloadable: true,
  },
  {
    id: 'c4',
    title: 'Safety Fundamentals',
    type: 'course',
    status: 'completed',
    progress: 100,
    nextStep: 'View certificate',
    dueDate: null,
    dueDateRaw: null,
    lastOpenedAt: '2025-02-20T09:00:00Z',
    href: '/dashboard/learner/course/c4',
    certificateHref: '/dashboard/learner/certificates',
  },
  {
    id: 'c5',
    title: 'Quality Basics',
    type: 'course',
    status: 'completed',
    progress: 100,
    nextStep: 'View',
    dueDate: null,
    dueDateRaw: null,
    lastOpenedAt: '2025-02-18T11:00:00Z',
    href: '/dashboard/learner/course/c5',
    certificateHref: null,
  },
  {
    id: 'c6',
    title: 'Handling Complaints',
    type: 'course',
    status: 'completed',
    progress: 100,
    nextStep: 'View',
    dueDate: null,
    dueDateRaw: null,
    lastOpenedAt: '2025-02-15T16:00:00Z',
    href: '/dashboard/learner/course/c6',
    certificateHref: '/dashboard/learner/certificates',
  },
  {
    id: 'c7',
    title: 'Old Compliance Module',
    type: 'course',
    status: 'overdue',
    progress: 20,
    nextStep: 'Module 2: Policies',
    dueDate: 'Feb 20',
    dueDateRaw: '2025-02-20',
    lastOpenedAt: '2025-02-19T10:00:00Z',
    href: '/dashboard/learner/course/c7',
    certificateHref: null,
  },
]

/** Summary counts for top bar */
export function getMyLearningSummary(items: MyLearningItem[]) {
  const dueSoon = items.filter(
    (i) => i.dueDateRaw && isDueWithinSevenDays(i.dueDateRaw) && !isOverdue(i.dueDateRaw) && i.status !== 'completed'
  ).length
  const inProgress = items.filter((i) => i.status === 'in_progress').length
  const completed = items.filter((i) => i.status === 'completed').length
  const overdue = items.filter((i) => i.dueDateRaw && isOverdue(i.dueDateRaw) && i.status !== 'completed').length
  return { dueSoon, inProgress, completed, overdue }
}

/** Single "continue where you left off" item — most recent in-progress or first due soon */
export function getContinueItem(items: MyLearningItem[]): MyLearningItem | null {
  const inProgress = items.filter((i) => i.status === 'in_progress')
  if (inProgress.length === 0) return null
  const byLastOpened = [...inProgress].sort(
    (a, b) => (b.lastOpenedAt || '').localeCompare(a.lastOpenedAt || '')
  )
  return byLastOpened[0] ?? null
}

/** Due within 7 days, not completed, sorted by due date (for "Due Soon" section) */
export function getDueSoonItems(items: MyLearningItem[], max = 3): MyLearningItem[] {
  const dueSoon = items.filter(
    (i) =>
      i.dueDateRaw &&
      isDueWithinSevenDays(i.dueDateRaw) &&
      !isOverdue(i.dueDateRaw) &&
      i.status !== 'completed'
  )
  return dueSoon
    .sort((a, b) => (a.dueDateRaw || '').localeCompare(b.dueDateRaw || ''))
    .slice(0, max)
}

/** Items not in continue or due-soon list (for "All Assigned" section) */
export function getRestItems(
  items: MyLearningItem[],
  continueItem: MyLearningItem | null,
  dueSoonItems: MyLearningItem[]
): MyLearningItem[] {
  const excludeIds = new Set([
    ...(continueItem ? [continueItem.id] : []),
    ...dueSoonItems.map((i) => i.id),
  ])
  return items.filter((i) => !excludeIds.has(i.id))
}

export type SortOption = 'due_date' | 'recently_opened' | 'progress' | 'type'

export function sortMyLearningItems(
  items: MyLearningItem[],
  sortBy: SortOption
): MyLearningItem[] {
  const copy = [...items]
  switch (sortBy) {
    case 'due_date':
      return copy.sort((a, b) => {
        if (!a.dueDateRaw) return 1
        if (!b.dueDateRaw) return -1
        return a.dueDateRaw.localeCompare(b.dueDateRaw)
      })
    case 'recently_opened':
      return copy.sort((a, b) => {
        const ta = a.lastOpenedAt || ''
        const tb = b.lastOpenedAt || ''
        return tb.localeCompare(ta)
      })
    case 'progress':
      return copy.sort((a, b) => b.progress - a.progress)
    case 'type':
      return copy.sort((a, b) => {
        const typeOrder = (t: LearningItemType) => (t === 'path' ? 0 : 1)
        const diff = typeOrder(a.type) - typeOrder(b.type)
        if (diff !== 0) return diff
        return (a.title || '').localeCompare(b.title || '')
      })
    default:
      return copy
  }
}
