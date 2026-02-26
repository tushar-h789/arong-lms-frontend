/**
 * System Logs / Health — system status, errors, uptime overview. Admin view to see where issues are.
 */

export type UptimeSummary = {
  period: string
  uptimePercent: number
  downtimeMinutes: number
  incidents: number
}

export type ExportJobFailure = {
  id: string
  jobType: string
  failedAt: string
  reason: string
}

export type IntegrationFailure = {
  id: string
  integration: string
  failedAt: string
  reason: string
}

export const MOCK_UPTIME: UptimeSummary = {
  period: 'Last 30 days',
  uptimePercent: 99.8,
  downtimeMinutes: 86,
  incidents: 2,
}

export const MOCK_EXPORT_FAILURES: ExportJobFailure[] = [
  { id: 'e1', jobType: 'Learner progress CSV', failedAt: '2025-02-22T03:00:00Z', reason: 'Timeout' },
]

export const MOCK_INTEGRATION_FAILURES: IntegrationFailure[] = [
  { id: 'i1', integration: 'AMS', failedAt: '2025-02-22T12:00:00Z', reason: 'Connection timeout' },
]

export const MOCK_STORAGE = {
  assetsUsedMB: 1250,
  assetsLimitMB: 5000,
  percentUsed: 25,
}
