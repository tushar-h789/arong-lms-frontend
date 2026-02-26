/**
 * Notifications Center (Learner-facing) — reminders + announcements + live class link in one place. Read/unread. Critical for users who don't open the app often.
 */

export type NotificationType = 'due_reminder' | 'live_session' | 'announcement'

export type NotificationItem = {
  id: string
  type: NotificationType
  title: string
  body: string
  linkUrl?: string
  read: boolean
  createdAt: string
  meta?: { dueDate?: string; sessionStart?: string; announcementId?: string }
}

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  due_reminder: 'Due reminder',
  live_session: 'Live session',
  announcement: 'Announcement',
}

/** Optional 1-line message for learner inbox (Bangla-friendly) */
export interface NotificationItemDisplay extends NotificationItem {
  oneLine?: string
  actionLabel?: string
}

export const MOCK_NOTIFICATIONS: NotificationItemDisplay[] = [
  {
    id: 'n1',
    type: 'due_reminder',
    title: 'Training due soon',
    body: 'Safety Basics — due in 2 days.',
    oneLine: 'Complete \'Safety Basics\' today',
    linkUrl: '/dashboard/learner/my-learning',
    read: false,
    createdAt: new Date().toISOString(),
    meta: { dueDate: '2025-02-23' },
    actionLabel: 'Continue',
  },
  {
    id: 'n2',
    type: 'live_session',
    title: 'Live class tomorrow',
    body: 'Dyeing SOP Live Demo — Feb 25, 3:00 PM.',
    oneLine: 'Live class tomorrow: Dyeing SOP (3:00 PM)',
    linkUrl: 'https://meet.google.com/xxx',
    read: false,
    createdAt: new Date(Date.now() - 86400 * 1000).toISOString(),
    meta: { sessionStart: '2025-02-25T15:00:00Z' },
    actionLabel: 'Join',
  },
  {
    id: 'n3',
    type: 'announcement',
    title: 'Safety Week Reminder',
    body: 'Wear PPE at all times in production area.',
    oneLine: 'Wear PPE at all times in production',
    read: true,
    createdAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    meta: { announcementId: 'a1' },
    actionLabel: 'View',
  },
  {
    id: 'n4',
    type: 'due_reminder',
    title: 'Overdue',
    body: 'Data Privacy Basics is overdue.',
    oneLine: 'Complete \'Data Privacy Basics\' on time',
    linkUrl: '/dashboard/learner/my-learning',
    read: false,
    createdAt: new Date(Date.now() - 3 * 86400 * 1000).toISOString(),
    meta: { dueDate: '2025-02-22' },
    actionLabel: 'Continue',
  },
]

export type NotificationTab = 'all' | 'reminders' | 'announcements' | 'live'

export function getLearnerNotifications(tab: NotificationTab): NotificationItemDisplay[] {
  const list = [...MOCK_NOTIFICATIONS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  if (tab === 'all') return list
  if (tab === 'reminders') return list.filter((n) => n.type === 'due_reminder')
  if (tab === 'announcements') return list.filter((n) => n.type === 'announcement')
  if (tab === 'live') return list.filter((n) => n.type === 'live_session')
  return list
}

export function formatNotificationTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const today = now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === today) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
