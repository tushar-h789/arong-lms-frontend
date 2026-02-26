/**
 * Access Control — RBAC shortcut. Role templates quick view, data scope (manager → team only), read-only roles (auditor).
 */

export type RoleTemplate = {
  id: string
  name: string
  dataScope: string
  readOnly: boolean
}

export const MOCK_ROLE_TEMPLATES: RoleTemplate[] = [
  { id: 'admin', name: 'Admin', dataScope: 'All', readOnly: false },
  { id: 'manager', name: 'Manager', dataScope: 'Team only', readOnly: false },
  { id: 'auditor', name: 'Auditor', dataScope: 'All (read)', readOnly: true },
]
