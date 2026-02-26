/**
 * Message Templates (Admin/Trainer) — reuse same messages; simple Bangla in production. Placeholders: {name}, {center}, {course}. Speeds up operational work.
 */

export type MessageTemplate = {
  id: string
  name: string
  body: string
  placeholders: string[]
  channel: 'in_app' | 'sms' | 'whatsapp' | 'email'
  createdAt: string
}

/** Supported personalization placeholders */
export const PLACEHOLDERS = ['{name}', '{center}', '{course}', '{due_date}', '{link}']

export const PLACEHOLDER_LABELS: Record<string, string> = {
  '{name}': 'Learner name',
  '{center}': 'Center / location',
  '{course}': 'Course name',
  '{due_date}': 'Due date',
  '{link}': 'Link (e.g. course link)',
}

export const MOCK_MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'mt1',
    name: 'Class today',
    body: 'Hi {name}, your live class is today. Join from your dashboard. — {center}',
    placeholders: ['{name}', '{center}'],
    channel: 'in_app',
    createdAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 'mt2',
    name: 'Deadline tomorrow',
    body: '{name}, your training "{course}" is due tomorrow. Please complete on time.',
    placeholders: ['{name}', '{course}'],
    channel: 'whatsapp',
    createdAt: '2025-02-05T09:00:00Z',
  },
  {
    id: 'mt3',
    name: 'Watch the video again',
    body: 'Please watch the video again for {course}. Link: {link}',
    placeholders: ['{course}', '{link}'],
    channel: 'in_app',
    createdAt: '2025-02-10T14:00:00Z',
  },
]
