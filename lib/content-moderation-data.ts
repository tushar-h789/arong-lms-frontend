/**
 * Content Moderation & Safety — inappropriate content/abuse prevention (corporate). Reported queue, block/disable posting, keyword flags. Brand risk management.
 */

export type ReportStatus = 'pending' | 'reviewed' | 'action_taken' | 'dismissed'

export type ReportedItem = {
  id: string
  contentType: 'discussion_post' | 'help_desk_reply' | 'comment'
  contentId: string
  contentPreview: string
  authorName: string
  authorId: string
  reportedBy: string
  reportedAt: string
  reason: string
  status: ReportStatus
  moderatorNote?: string
  action?: 'removed' | 'user_warned' | 'user_blocked'
}

export type BlockedUser = {
  id: string
  userId: string
  userName: string
  blockedFrom: 'posting' | 'all_communication'
  blockedAt: string
  blockedBy: string
  reason: string
}

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  pending: 'Pending',
  reviewed: 'Reviewed',
  action_taken: 'Action taken',
  dismissed: 'Dismissed',
}

export const MOCK_REPORTED: ReportedItem[] = [
  {
    id: 'r1',
    contentType: 'discussion_post',
    contentId: 'd2',
    contentPreview: 'Sharing our center checklist. Add yours below.',
    authorName: 'User X',
    authorId: 'ux',
    reportedBy: 'Nadia Islam',
    reportedAt: '2025-02-20T11:00:00Z',
    reason: 'Spam / off-topic',
    status: 'pending',
  },
]

export const MOCK_BLOCKED_USERS: BlockedUser[] = []

export const MOCK_KEYWORD_FLAGS = ['inappropriate', 'abuse', 'spam']
