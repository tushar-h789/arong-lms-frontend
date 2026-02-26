/**
 * Audit Logs — who did what when. Compliance proof. Filters: user, action, date, entity. Export. Highlight critical actions.
 */

export type AuditAction = 'role_change' | 'delete_course' | 'archive_course' | 'security_setting' | 'bulk_import' | 'login' | 'edit_course'

export type AuditLogEntry = {
  id: string
  userId: string
  userName: string
  action: AuditAction
  entityType: string
  entityId: string
  details: string
  at: string
  critical: boolean
}

export const CRITICAL_ACTIONS: AuditAction[] = ['role_change', 'delete_course', 'archive_course', 'security_setting', 'bulk_import']

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'al1', userId: 'u1', userName: 'Admin', action: 'role_change', entityType: 'user', entityId: 'u2', details: 'Role set to Manager', at: '2025-02-23T10:00:00Z', critical: true },
  { id: 'al2', userId: 'u1', userName: 'Admin', action: 'edit_course', entityType: 'course', entityId: 'c1', details: 'Updated Safety Basics', at: '2025-02-23T09:30:00Z', critical: false },
  { id: 'al3', userId: 'u2', userName: 'Nadia', action: 'security_setting', entityType: 'settings', entityId: 's1', details: 'Password policy updated', at: '2025-02-22T16:00:00Z', critical: true },
]
