/**
 * Mock data for Export Center — all report exports in one place.
 * Export job status (queued/running/ready/failed), download links, expiry, re-run.
 * Replace with real API calls later.
 */

export type ExportStatus = 'queued' | 'running' | 'ready' | 'failed'

export type ExportJob = {
  id: string
  reportName: string
  reportHref: string
  status: ExportStatus
  format: 'csv' | 'xlsx' | 'pdf'
  filters: string
  createdAt: string
  finishedAt?: string
  downloadUrl?: string
  expiresAt?: string
  errorMessage?: string
}

export const EXPORT_JOBS: ExportJob[] = [
  {
    id: 'e1',
    reportName: 'Learner Progress',
    reportHref: '/dashboard/admin/reports/learner-progress',
    status: 'ready',
    format: 'csv',
    filters: 'Department: All, Date: Last 30 days',
    createdAt: '2025-02-21T10:00:00Z',
    finishedAt: '2025-02-21T10:02:15Z',
    downloadUrl: '/exports/learner-progress-20250221.csv',
    expiresAt: '2025-02-24T10:02:15Z',
  },
  {
    id: 'e2',
    reportName: 'Course Completion',
    reportHref: '/dashboard/admin/reports/course-completion',
    status: 'running',
    format: 'xlsx',
    filters: 'Course: Safety Basics, Date: Jan 2025',
    createdAt: '2025-02-22T09:15:00Z',
  },
  {
    id: 'e3',
    reportName: 'Compliance & Certificates',
    reportHref: '/dashboard/admin/reports/compliance-certificates',
    status: 'queued',
    format: 'pdf',
    filters: 'Cert type: Fire Safety, Expiry: 30/60/90 days',
    createdAt: '2025-02-22T09:20:00Z',
  },
  {
    id: 'e4',
    reportName: 'Assessments',
    reportHref: '/dashboard/admin/reports/assessments',
    status: 'failed',
    format: 'csv',
    filters: 'Assessment: Safety Quiz, Attempts: All',
    createdAt: '2025-02-21T14:30:00Z',
    finishedAt: '2025-02-21T14:30:45Z',
    errorMessage: 'Timeout generating large dataset. Try narrower filters.',
  },
  {
    id: 'e5',
    reportName: 'Attendance & Activity',
    reportHref: '/dashboard/admin/reports/attendance-activity',
    status: 'ready',
    format: 'xlsx',
    filters: 'Center: Dhaka HQ, Month: Feb 2025',
    createdAt: '2025-02-20T11:00:00Z',
    finishedAt: '2025-02-20T11:05:22Z',
    downloadUrl: '/exports/attendance-feb2025.xlsx',
    expiresAt: '2025-02-23T11:05:22Z',
  },
  {
    id: 'e6',
    reportName: 'Learning Paths',
    reportHref: '/dashboard/admin/reports/learning-paths',
    status: 'ready',
    format: 'csv',
    filters: 'Path: New Artisan Onboarding',
    createdAt: '2025-02-22T08:00:00Z',
    finishedAt: '2025-02-22T08:00:32Z',
    downloadUrl: '/exports/learning-paths-onboarding.csv',
    expiresAt: '2025-02-25T08:00:32Z',
  },
]
