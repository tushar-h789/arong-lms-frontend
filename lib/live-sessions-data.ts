/**
 * Live Sessions — schedule live class, Meet/Zoom/Teams link, date/time, target audience. Attendance (manual/sync). Materials: handout PDF, recording link.
 */

export type LiveSessionStatus = 'scheduled' | 'live' | 'ended'

export type LiveSession = {
  id: string
  title: string
  meetLink: string
  platform: 'meet' | 'zoom' | 'teams'
  startAt: string
  durationMinutes: number
  targetType: 'course' | 'center' | 'group'
  targetLabel: string
  status: LiveSessionStatus
  handoutPdfUrl?: string
  recordingUrl?: string
  attendanceMarked: number
  attendanceTotal: number
  createdBy: string
  createdAt: string
}

export const PLATFORMS: { id: 'meet' | 'zoom' | 'teams'; label: string }[] = [
  { id: 'meet', label: 'Google Meet' },
  { id: 'zoom', label: 'Zoom' },
  { id: 'teams', label: 'Microsoft Teams' },
]

export const MOCK_LIVE_SESSIONS: LiveSession[] = [
  {
    id: 's1',
    title: 'Dyeing SOP Live Demo',
    meetLink: 'https://meet.google.com/xxx-xxxx-xxx',
    platform: 'meet',
    startAt: '2025-02-25T10:00:00Z',
    durationMinutes: 60,
    targetType: 'course',
    targetLabel: 'Quality & SOP',
    status: 'scheduled',
    handoutPdfUrl: '/handouts/dyeing-demo.pdf',
    attendanceMarked: 0,
    attendanceTotal: 24,
    createdBy: 'Nadia Islam',
    createdAt: '2025-02-20T08:00:00Z',
  },
  {
    id: 's2',
    title: 'Weaving Defect Correction',
    meetLink: 'https://zoom.us/j/xxxxx',
    platform: 'zoom',
    startAt: '2025-02-22T14:00:00Z',
    durationMinutes: 45,
    targetType: 'center',
    targetLabel: 'Dhaka North',
    status: 'ended',
    handoutPdfUrl: '/handouts/weaving-defects.pdf',
    recordingUrl: 'https://drive.google.com/recording/xxx',
    attendanceMarked: 18,
    attendanceTotal: 20,
    createdBy: 'Admin',
    createdAt: '2025-02-18T12:00:00Z',
  },
]
