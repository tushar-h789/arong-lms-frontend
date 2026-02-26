/**
 * Settings Overview (Home) — entry point. Quick tiles to Branding, Integrations, Security, Audit Logs. System status snapshot.
 */

export type SystemStatus = {
  hrSyncLastRun: string | null
  ssoEnabled: boolean
  exportJobsHealthy: boolean | null
  pendingApprovalsCount: number
}

export const MOCK_SYSTEM_STATUS: SystemStatus = {
  hrSyncLastRun: '2025-02-23T06:00:00Z',
  ssoEnabled: false,
  exportJobsHealthy: true,
  pendingApprovalsCount: 2,
}

export const SETTINGS_TILES = [
  { id: 'branding', label: 'Branding & Theme', href: '/dashboard/admin/settings/branding', description: 'Logo, colors, typography, language' },
  { id: 'certificates', label: 'Certificate Templates', href: '/dashboard/admin/settings/certificate-templates', description: 'Certificate design, signatures, ID/QR' },
  { id: 'email-sms', label: 'Email/SMS/Message Templates', href: '/dashboard/admin/settings/email-sms-templates', description: 'System notifications, variables' },
  { id: 'integrations', label: 'Integrations Hub', href: '/dashboard/admin/settings/integrations', description: 'HR sync, SSO, Meet/Zoom/Teams' },
  { id: 'hr-sync', label: 'HR Sync', href: '/dashboard/admin/settings/hr-sync', description: 'User/org sync, field mapping' },
  { id: 'ams-integration', label: 'AMS Integration', href: '/dashboard/admin/settings/ams-integration', description: 'Approval/workflow, training request sync' },
  { id: 'sso-auth', label: 'SSO / Authentication', href: '/dashboard/admin/settings/sso-auth', description: 'SAML/OIDC, role mapping' },
  { id: 'video-conferencing', label: 'Video Conferencing', href: '/dashboard/admin/settings/video-conferencing', description: 'Meet/Zoom/Teams, attendance' },
  { id: 'security', label: 'Security Policies', href: '/dashboard/admin/settings/security', description: 'Password, 2FA, session, lock rules' },
  { id: 'access-control', label: 'Access Control', href: '/dashboard/admin/settings/access-control', description: 'RBAC shortcut, data scope' },
  { id: 'audit', label: 'Audit Logs', href: '/dashboard/admin/settings/audit-logs', description: 'Activity and compliance logs' },
  { id: 'system-logs', label: 'System Logs / Health', href: '/dashboard/admin/settings/system-logs', description: 'Uptime, export/integration failures, storage' },
]
