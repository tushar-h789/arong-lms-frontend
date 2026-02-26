/**
 * Content Review & Approval workflow.
 * Draft → Review → Approved → Published. Reviewer assign (HR/Compliance/Quality). Change request comments. Publish lock until approved.
 */

export type ReviewStatus = 'draft' | 'review' | 'approved' | 'published'

export type ReviewItemRow = {
  id: string
  title: string
  type: 'course' | 'asset'
  status: ReviewStatus
  submittedForReviewAt: string
  reviewerAssign: string
  reviewerTeam: 'hr' | 'compliance' | 'quality'
  changeRequestComments: string
  approvedAt: string
  publishedAt: string
  createdBy: string
}

export const REVIEW_ITEMS: ReviewItemRow[] = [
  {
    id: 'r1',
    title: 'Dyeing SOP v2',
    type: 'course',
    status: 'review',
    submittedForReviewAt: '2025-02-21T09:00:00Z',
    reviewerAssign: 'Nadia Islam',
    reviewerTeam: 'quality',
    changeRequestComments: '',
    approvedAt: '',
    publishedAt: '',
    createdBy: 'Rahim Uddin',
  },
  {
    id: 'r2',
    title: 'Fire Safety at Workplace',
    type: 'course',
    status: 'approved',
    submittedForReviewAt: '2025-02-15T10:00:00Z',
    reviewerAssign: 'HR Team',
    reviewerTeam: 'compliance',
    changeRequestComments: '',
    approvedAt: '2025-02-18T14:00:00Z',
    publishedAt: '',
    createdBy: 'Nadia Islam',
  },
  {
    id: 'r3',
    title: 'Quality Checklist PDF',
    type: 'asset',
    status: 'draft',
    submittedForReviewAt: '',
    reviewerAssign: '',
    reviewerTeam: 'quality',
    changeRequestComments: '',
    approvedAt: '',
    publishedAt: '',
    createdBy: 'Nadia Islam',
  },
]

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  draft: 'Draft',
  review: 'In review',
  approved: 'Approved',
  published: 'Published',
}

export const REVIEWER_TEAM_LABELS: Record<ReviewItemRow['reviewerTeam'], string> = {
  hr: 'HR',
  compliance: 'Compliance',
  quality: 'Quality team',
}
