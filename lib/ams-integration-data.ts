/**
 * AMS Integration — Approval Management System. Training request → LMS assignment, completion → AMS update. API credentials, webhooks, retry, logs.
 */

export type AMSSyncLog = {
  id: string
  direction: 'in' | 'out'
  action: string
  status: 'success' | 'failed'
  at: string
  message?: string
}

export const MOCK_AMS_LOGS: AMSSyncLog[] = [
  { id: 'a1', direction: 'in', action: 'Training request → assignment', status: 'success', at: '2025-02-23T08:00:00Z' },
  { id: 'a2', direction: 'out', action: 'Completion status → AMS', status: 'success', at: '2025-02-22T14:00:00Z' },
  { id: 'a3', direction: 'out', action: 'Completion status → AMS', status: 'failed', at: '2025-02-22T12:00:00Z', message: 'Connection timeout' },
]
