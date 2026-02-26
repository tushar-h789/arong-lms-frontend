/**
 * HR Sync — user/org data from HR system. Field mapping, sync frequency, new joiners/leavers rules. Center/location/group mapping for assignment and reporting.
 */

export type SyncFrequency = 'daily' | 'weekly' | 'manual'

export type HrSyncConfig = {
  frequency: SyncFrequency
  newJoinersAutoCreate: boolean
  leaversDeactivate: boolean
  fieldMappings: { hrField: string; lmsField: string }[]
}

export type SyncLogEntry = {
  id: string
  runAt: string
  successCount: number
  failCount: number
  status: 'success' | 'partial' | 'failed'
}

export const DEFAULT_FIELD_MAPPINGS = [
  { hrField: 'employee_id', lmsField: 'external_id' },
  { hrField: 'full_name', lmsField: 'name' },
  { hrField: 'email', lmsField: 'email' },
  { hrField: 'department', lmsField: 'department' },
  { hrField: 'location', lmsField: 'center' },
  { hrField: 'group', lmsField: 'group' },
]

export const MOCK_SYNC_LOGS: SyncLogEntry[] = [
  { id: 'sl1', runAt: '2025-02-23T06:00:00Z', successCount: 245, failCount: 0, status: 'success' },
  { id: 'sl2', runAt: '2025-02-22T06:00:00Z', successCount: 243, failCount: 2, status: 'partial' },
]
