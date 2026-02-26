/**
 * Integrations Hub — all integrations in one place. Status, test connection, last sync, next run. Admin/IT see what is broken.
 */

export type IntegrationId = 'ams' | 'hr_sync' | 'sso' | 'meet' | 'zoom' | 'teams'

export type IntegrationRow = {
  id: IntegrationId
  name: string
  status: 'connected' | 'disconnected' | 'error'
  lastRun: string | null
  nextRun: string | null
  configUrl?: string
}

export const MOCK_INTEGRATIONS: IntegrationRow[] = [
  { id: 'ams', name: 'AMS', status: 'connected', lastRun: null, nextRun: null },
  { id: 'hr_sync', name: 'HR Sync', status: 'connected', lastRun: '2025-02-23T06:00:00Z', nextRun: '2025-02-24T06:00:00Z', configUrl: '/dashboard/admin/settings/hr-sync' },
  { id: 'sso', name: 'SSO', status: 'disconnected', lastRun: null, nextRun: null },
  { id: 'meet', name: 'Google Meet', status: 'connected', lastRun: null, nextRun: null },
  { id: 'zoom', name: 'Zoom', status: 'connected', lastRun: null, nextRun: null },
  { id: 'teams', name: 'Microsoft Teams', status: 'disconnected', lastRun: null, nextRun: null },
]
