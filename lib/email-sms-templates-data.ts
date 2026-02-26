/**
 * Email/SMS/Message Templates — system notifications (assignment, due, overdue, certificate). Variables: name, course, dueDate, center. Bangla-friendly, WhatsApp/SMS style.
 */

export type SystemTemplateType = 'assignment_created' | 'due_reminder' | 'overdue_alert' | 'certificate_issued'

export type SystemTemplate = {
  id: string
  type: SystemTemplateType
  name: string
  body: string
  channel: 'email' | 'sms' | 'whatsapp' | 'in_app'
  variables: string[]
  updatedAt: string
}

export const TEMPLATE_VARIABLES = ['{name}', '{course}', '{dueDate}', '{center}', '{link}']

export const MOCK_SYSTEM_TEMPLATES: SystemTemplate[] = [
  { id: 'st1', type: 'assignment_created', name: 'Assignment created', body: 'Hi {name}, you have been assigned "{course}". Due: {dueDate}. Center: {center}.', channel: 'in_app', variables: ['{name}', '{course}', '{dueDate}', '{center}'], updatedAt: '2025-02-20T10:00:00Z' },
  { id: 'st2', type: 'due_reminder', name: 'Due reminder', body: '{name}, your training "{course}" is due on {dueDate}. Complete on time.', channel: 'sms', variables: ['{name}', '{course}', '{dueDate}'], updatedAt: '2025-02-20T10:00:00Z' },
  { id: 'st3', type: 'overdue_alert', name: 'Overdue alert', body: 'Overdue: {course} for {name}. Please complete as soon as possible.', channel: 'whatsapp', variables: ['{name}', '{course}'], updatedAt: '2025-02-20T10:00:00Z' },
  { id: 'st4', type: 'certificate_issued', name: 'Certificate issued', body: 'Congratulations {name}! Your certificate for "{course}" is ready. Link: {link}', channel: 'email', variables: ['{name}', '{course}', '{link}'], updatedAt: '2025-02-20T10:00:00Z' },
]
