/**
 * Reminder Center — centralized reminders and follow-ups.
 * Scheduled list, manual send (SMS/WhatsApp/Email), localized templates, delivery status.
 */

export type ReminderChannel = 'email' | 'sms' | 'whatsapp'

export type ReminderStatus = 'scheduled' | 'sent' | 'delivered' | 'failed'

export type ReminderRow = {
  id: string
  assignmentId: string
  userName: string
  contentName: string
  dueDate: string
  channel: ReminderChannel
  scheduledAt: string
  status: ReminderStatus
  sentAt: string
}

export type ReminderTemplate = {
  id: string
  name: string
  bodyBn: string
  bodyEn: string
  channel: ReminderChannel
}

export const REMINDERS: ReminderRow[] = [
  { id: 'rm1', assignmentId: 'am2', userName: 'Fatima Khan', contentName: 'Fire Safety at Workplace', dueDate: '2025-02-15', channel: 'email', scheduledAt: '2025-02-14T09:00:00Z', status: 'sent', sentAt: '2025-02-14T09:01:00Z' },
  { id: 'rm2', assignmentId: 'am4', userName: 'Tasnim Akter', contentName: 'SOP: Dyeing', dueDate: '2025-02-20', channel: 'whatsapp', scheduledAt: '2025-02-19T10:00:00Z', status: 'scheduled', sentAt: '' },
]

export const REMINDER_TEMPLATES: ReminderTemplate[] = [
  { id: 't1', name: 'Due tomorrow', bodyBn: 'Your training is due tomorrow. Please complete on time.', bodyEn: 'Your training is due tomorrow. Please complete on time.', channel: 'sms' },
  { id: 't2', name: 'Overdue', bodyBn: 'Your assignment is overdue. Please complete as soon as possible.', bodyEn: 'Your assignment is overdue. Please complete as soon as possible.', channel: 'whatsapp' },
]

export const CHANNEL_LABELS: Record<ReminderChannel, string> = {
  email: 'Email',
  sms: 'SMS',
  whatsapp: 'WhatsApp',
}

export const REMINDER_STATUS_LABELS: Record<ReminderStatus, string> = {
  scheduled: 'Scheduled',
  sent: 'Sent',
  delivered: 'Delivered',
  failed: 'Failed',
}
