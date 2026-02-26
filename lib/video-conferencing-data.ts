/**
 * Video Conferencing — Meet/Zoom/Teams. OAuth/API key, default settings (waiting room, mute, recording). Attendance: manual only / auto fetch. Session sync logs.
 */

export type AttendanceSyncMode = 'manual_only' | 'auto_fetch'

export type ProviderConfig = {
  id: string
  name: string
  connected: boolean
  lastSync: string | null
}

export const MOCK_PROVIDERS: ProviderConfig[] = [
  { id: 'meet', name: 'Google Meet', connected: true, lastSync: '2025-02-22T14:30:00Z' },
  { id: 'zoom', name: 'Zoom', connected: true, lastSync: null },
  { id: 'teams', name: 'Microsoft Teams', connected: false, lastSync: null },
]
