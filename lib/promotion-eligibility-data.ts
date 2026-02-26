/**
 * Promotion & Eligibility — People & Growth. Ladder, eligibility rules, candidates, reviews.
 * Backend planning: positions, eligibility_rules, user_current_position, eligibility_status, evidence, review_decisions + audit.
 */

import { CENTERS, GROUPS, CRAFTS } from '@/lib/assignment-monitor-data'

export type PositionStatus = 'active' | 'archived'
export type CraftFilter = (typeof CRAFTS)[number]
export type PositionLevel = 'L1' | 'L2' | 'L3' | 'L4'

export type EligibilityRule = {
  requiredPathIds: string[]
  requiredCourseIds: string[]
  minQuizScorePercent: number
  practicalVerificationRequired: boolean
  attendanceMinPercent: number
  complianceTrainingRequired: boolean
  certificateValidityDays: number | null
}

export type PositionRow = {
  id: string
  name: string
  level: PositionLevel
  craft: CraftFilter
  centerVisibility: string[] // empty = all
  status: PositionStatus
  rule: EligibilityRule
  createdAt: string
  updatedAt: string
}

export type EligibilityStatus = 'eligible' | 'in_progress' | 'under_review' | 'approved' | 'rejected'

export type EligibleCandidateRow = {
  id: string
  userId: string
  userName: string
  center: string
  group: string
  craft: string
  currentPositionId: string
  currentPositionName: string
  targetPositionId: string
  targetPositionName: string
  status: EligibilityStatus
  missingRequirements: string[]
  evidenceScorePercent: number | null
  becameEligibleAt: string
  underReviewSince: string | null
  reviewedAt: string | null
  reviewedBy: string | null
  rejectReason: string | null
}

export type EvidenceChecklistItem = {
  id: string
  label: string
  met: boolean
  detail?: string
}

export type ReviewDecisionRow = {
  candidateId: string
  userId: string
  userName: string
  center: string
  group: string
  targetPositionName: string
  underReviewSince: string
  pendingDays: number
  evidenceChecklist: EvidenceChecklistItem[]
  attachments: { name: string; url: string }[]
  hrNotes: string
}

// —— Overview ——
export type PromotionOverview = {
  eligibleCount: number
  underReviewCount: number
  approvedThisMonth: number
  rejectedThisMonth: number
  topCentersWithEligible: { center: string; count: number }[]
  complianceBlocks: { reason: string; count: number }[]
}

// —— Mock: Positions & Rules ——
const MOCK_POSITIONS: PositionRow[] = [
  {
    id: 'pos1',
    name: 'Embroidery Level 2',
    level: 'L2',
    craft: 'embroidery',
    centerVisibility: [],
    status: 'active',
    rule: {
      requiredPathIds: ['p1'],
      requiredCourseIds: ['c1', 'c2'],
      minQuizScorePercent: 70,
      practicalVerificationRequired: true,
      attendanceMinPercent: 80,
      complianceTrainingRequired: true,
      certificateValidityDays: 365,
    },
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-02-20T00:00:00Z',
  },
  {
    id: 'pos2',
    name: 'Weaving Level 2',
    level: 'L2',
    craft: 'weaving',
    centerVisibility: [],
    status: 'active',
    rule: {
      requiredPathIds: ['p1'],
      requiredCourseIds: ['c1'],
      minQuizScorePercent: 65,
      practicalVerificationRequired: true,
      attendanceMinPercent: 75,
      complianceTrainingRequired: true,
      certificateValidityDays: 365,
    },
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-02-18T00:00:00Z',
  },
  {
    id: 'pos3',
    name: 'Dyeing Level 3',
    level: 'L3',
    craft: 'dyeing',
    centerVisibility: ['Chittagong', 'Dhaka HQ'],
    status: 'active',
    rule: {
      requiredPathIds: ['p1'],
      requiredCourseIds: ['c1', 'c2'],
      minQuizScorePercent: 75,
      practicalVerificationRequired: true,
      attendanceMinPercent: 85,
      complianceTrainingRequired: true,
      certificateValidityDays: 180,
    },
    createdAt: '2025-02-01T00:00:00Z',
    updatedAt: '2025-02-22T00:00:00Z',
  },
]

// —— Mock: Eligible Candidates ——
const MOCK_CANDIDATES: EligibleCandidateRow[] = [
  {
    id: 'ec1',
    userId: 'u1',
    userName: 'Rahim Ahmed',
    center: 'Dhaka HQ',
    group: 'Weaving A',
    craft: 'weaving',
    currentPositionId: 'pos1l1',
    currentPositionName: 'Weaving L1',
    targetPositionId: 'pos2',
    targetPositionName: 'Weaving Level 2',
    status: 'eligible',
    missingRequirements: [],
    evidenceScorePercent: 92,
    becameEligibleAt: '2025-02-20T10:00:00Z',
    underReviewSince: null,
    reviewedAt: null,
    reviewedBy: null,
    rejectReason: null,
  },
  {
    id: 'ec2',
    userId: 'u2',
    userName: 'Fatima Khan',
    center: 'Dhaka HQ',
    group: 'Embroidery B',
    craft: 'embroidery',
    currentPositionId: 'pos1l1',
    currentPositionName: 'Embroidery L1',
    targetPositionId: 'pos1',
    targetPositionName: 'Embroidery Level 2',
    status: 'under_review',
    missingRequirements: [],
    evidenceScorePercent: 88,
    becameEligibleAt: '2025-02-19T14:00:00Z',
    underReviewSince: '2025-02-22T09:00:00Z',
    reviewedAt: null,
    reviewedBy: null,
    rejectReason: null,
  },
  {
    id: 'ec3',
    userId: 'u3',
    userName: 'Karim Hossain',
    center: 'Chittagong',
    group: 'Dyeing C',
    craft: 'dyeing',
    currentPositionId: 'pos3l2',
    currentPositionName: 'Dyeing L2',
    targetPositionId: 'pos3',
    targetPositionName: 'Dyeing Level 3',
    status: 'in_progress',
    missingRequirements: ['Practical verification pending', 'Safety certificate expires in 30 days'],
    evidenceScorePercent: 65,
    becameEligibleAt: '2025-02-18T11:00:00Z',
    underReviewSince: null,
    reviewedAt: null,
    reviewedBy: null,
    rejectReason: null,
  },
  {
    id: 'ec4',
    userId: 'u9',
    userName: 'Tasnim Akter',
    center: 'Dhaka HQ',
    group: 'Weaving A',
    craft: 'weaving',
    currentPositionId: 'pos1l1',
    currentPositionName: 'Weaving L1',
    targetPositionId: 'pos2',
    targetPositionName: 'Weaving Level 2',
    status: 'approved',
    missingRequirements: [],
    evidenceScorePercent: 90,
    becameEligibleAt: '2025-02-15T08:00:00Z',
    underReviewSince: '2025-02-18T10:00:00Z',
    reviewedAt: '2025-02-23T14:00:00Z',
    reviewedBy: 'Nadia Islam',
    rejectReason: null,
  },
  {
    id: 'ec5',
    userId: 'u10',
    userName: 'Mofizul Islam',
    center: 'Chittagong',
    group: 'Dyeing C',
    craft: 'dyeing',
    currentPositionId: 'pos3l2',
    currentPositionName: 'Dyeing L2',
    targetPositionId: 'pos3',
    targetPositionName: 'Dyeing Level 3',
    status: 'rejected',
    missingRequirements: [],
    evidenceScorePercent: 72,
    becameEligibleAt: '2025-02-10T12:00:00Z',
    underReviewSince: '2025-02-20T09:00:00Z',
    reviewedAt: '2025-02-22T16:00:00Z',
    reviewedBy: 'Rahim Uddin',
    rejectReason: 'Attendance below minimum for promotion period.',
  },
]

export const ELIGIBILITY_STATUS_LABELS: Record<EligibilityStatus, string> = {
  eligible: 'Eligible',
  in_progress: 'In Progress',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
}

export const POSITION_LEVELS: PositionLevel[] = ['L1', 'L2', 'L3', 'L4']
export const POSITION_STATUS_OPTIONS: { value: PositionStatus | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
]
export const CRAFT_OPTIONS = CRAFTS
export const PROMOTION_CENTERS = CENTERS
export const PROMOTION_GROUPS = GROUPS

export function getPromotionOverview(): PromotionOverview {
  const eligible = MOCK_CANDIDATES.filter((c) => c.status === 'eligible').length
  const underReview = MOCK_CANDIDATES.filter((c) => c.status === 'under_review').length
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()
  const approvedThisMonth = MOCK_CANDIDATES.filter((c) => {
    if (c.status !== 'approved' || !c.reviewedAt) return false
    const d = new Date(c.reviewedAt)
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear
  }).length
  const rejectedThisMonth = MOCK_CANDIDATES.filter((c) => {
    if (c.status !== 'rejected' || !c.reviewedAt) return false
    const d = new Date(c.reviewedAt)
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear
  }).length
  const byCenter = new Map<string, number>()
  MOCK_CANDIDATES.filter((c) => c.status === 'eligible' || c.status === 'under_review').forEach((c) => {
    byCenter.set(c.center, (byCenter.get(c.center) ?? 0) + 1)
  })
  const topCentersWithEligible = Array.from(byCenter.entries())
    .map(([center, count]) => ({ center, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  const complianceBlocks = [
    { reason: 'Safety certificate expired', count: 3 },
    { reason: 'Compliance training overdue', count: 2 },
  ]
  return {
    eligibleCount: eligible,
    underReviewCount: underReview,
    approvedThisMonth,
    rejectedThisMonth,
    topCentersWithEligible,
    complianceBlocks,
  }
}

export function getPositions(filters?: {
  craft?: CraftFilter | ''
  level?: PositionLevel | ''
  status?: PositionStatus | ''
}): PositionRow[] {
  let list = MOCK_POSITIONS.slice()
  if (filters?.craft) list = list.filter((p) => p.craft === filters.craft)
  if (filters?.level) list = list.filter((p) => p.level === filters.level)
  if (filters?.status) list = list.filter((p) => p.status === filters.status)
  return list
}

export function getPositionById(positionId: string): PositionRow | undefined {
  return MOCK_POSITIONS.find((p) => p.id === positionId)
}

export function getEligibleCandidates(filters?: {
  craft?: string
  positionId?: string
  center?: string
  group?: string
  status?: EligibilityStatus | ''
  dateFrom?: string
  dateTo?: string
}): EligibleCandidateRow[] {
  let list = MOCK_CANDIDATES.slice()
  if (filters?.craft) list = list.filter((c) => c.craft === filters.craft)
  if (filters?.positionId) list = list.filter((c) => c.targetPositionId === filters.positionId)
  if (filters?.center) list = list.filter((c) => c.center === filters.center)
  if (filters?.group) list = list.filter((c) => c.group === filters.group)
  if (filters?.status) list = list.filter((c) => c.status === filters.status)
  if (filters?.dateFrom) list = list.filter((c) => c.becameEligibleAt >= filters.dateFrom!)
  if (filters?.dateTo) list = list.filter((c) => c.becameEligibleAt <= filters.dateTo!)
  return list.sort((a, b) => b.becameEligibleAt.localeCompare(a.becameEligibleAt))
}

export function getUnderReviewQueue(): ReviewDecisionRow[] {
  const underReview = MOCK_CANDIDATES.filter((c) => c.status === 'under_review')
  const now = Date.now()
  return underReview.map((c) => {
    const since = new Date(c.underReviewSince!).getTime()
    const pendingDays = Math.floor((now - since) / (24 * 60 * 60 * 1000))
    return {
      candidateId: c.id,
      userId: c.userId,
      userName: c.userName,
      center: c.center,
      group: c.group,
      targetPositionName: c.targetPositionName,
      underReviewSince: c.underReviewSince!,
      pendingDays,
      evidenceChecklist: [
        { id: 'paths', label: 'Paths completed', met: true, detail: 'p1' },
        { id: 'quiz', label: 'Quiz score', met: true, detail: '88%' },
        { id: 'practical', label: 'Practical verification', met: true },
        { id: 'compliance', label: 'Compliance valid', met: true },
        { id: 'attendance', label: 'Attendance', met: true, detail: '92%' },
      ],
      attachments: [{ name: 'Certificate.pdf', url: '/attachments/cert.pdf' }],
      hrNotes: '',
    }
  })
}

export function getCandidateById(candidateId: string): EligibleCandidateRow | undefined {
  return MOCK_CANDIDATES.find((c) => c.id === candidateId)
}
