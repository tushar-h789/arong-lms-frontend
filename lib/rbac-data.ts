/**
 * Mock data for Roles & Permissions (RBAC).
 * Role templates, permission matrix (page + action), scope rules.
 * Replace with real API later.
 */

export type RoleId = 'admin' | 'instructor' | 'learner' | 'hr' | 'org' | 'auditor' | 'it' | 'manager'

export type RoleTemplate = {
  id: RoleId
  name: string
  description: string
}

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'export'

export type PermissionRow = {
  page: string
  view: boolean
  create: boolean
  edit: boolean
  delete: boolean
  export: boolean
}

export const ROLE_TEMPLATES: RoleTemplate[] = [
  { id: 'admin', name: 'Admin', description: 'Full system access' },
  { id: 'hr', name: 'HR', description: 'Staff and compliance' },
  { id: 'instructor', name: 'Instructor', description: 'Courses and grading' },
  { id: 'learner', name: 'Learner', description: 'Learning and progress' },
  { id: 'manager', name: 'Manager', description: 'Own team only (scope)' },
  { id: 'auditor', name: 'Auditor', description: 'Read-only + export' },
  { id: 'it', name: 'IT', description: 'Security and integrations' },
  { id: 'org', name: 'Organization', description: 'Org structure' },
]

/** Permission matrix: role id -> list of page permissions */
export const PERMISSION_MATRIX: Record<RoleId, PermissionRow[]> = {
  admin: [
    { page: 'Users', view: true, create: true, edit: true, delete: true, export: true },
    { page: 'Courses', view: true, create: true, edit: true, delete: true, export: true },
    { page: 'Reports', view: true, create: false, edit: false, delete: false, export: true },
    { page: 'Roles', view: true, create: true, edit: true, delete: true, export: true },
  ],
  instructor: [
    { page: 'My Courses', view: true, create: false, edit: true, delete: false, export: true },
    { page: 'Assessments', view: true, create: true, edit: true, delete: false, export: true },
    { page: 'Grading', view: true, create: false, edit: true, delete: false, export: true },
  ],
  learner: [
    { page: 'My Learning', view: true, create: false, edit: false, delete: false, export: false },
    { page: 'Courses', view: true, create: false, edit: false, delete: false, export: false },
    { page: 'Progress', view: true, create: false, edit: false, delete: false, export: false },
  ],
  hr: [
    { page: 'Users', view: true, create: true, edit: true, delete: false, export: true },
    { page: 'Compliance', view: true, create: false, edit: false, delete: false, export: true },
  ],
  manager: [
    { page: 'Team Progress', view: true, create: false, edit: false, delete: false, export: true },
    { page: 'Assign', view: true, create: true, edit: true, delete: false, export: false },
  ],
  auditor: [
    { page: 'Audit Trail', view: true, create: false, edit: false, delete: false, export: true },
    { page: 'Activity Logs', view: true, create: false, edit: false, delete: false, export: true },
  ],
  it: [
    { page: 'Security', view: true, create: false, edit: true, delete: false, export: true },
    { page: 'Integrations', view: true, create: true, edit: true, delete: false, export: false },
  ],
  org: [
    { page: 'Organization', view: true, create: true, edit: true, delete: false, export: true },
  ],
}

export const SCOPE_RULES = [
  { role: 'Manager', rule: 'Sees only own department/group (own team)' },
  { role: 'Instructor', rule: 'Sees only assigned courses' },
  { role: 'Auditor', rule: 'Read-only + export only' },
]

export type PermissionAuditEntry = {
  id: string
  adminUser: string
  action: string
  roleName?: string
  targetUser?: string
  timestamp: string
}

export const PERMISSION_AUDIT_LOG: PermissionAuditEntry[] = [
  { id: '1', adminUser: 'admin@aarong.com', action: 'role_permission_updated', roleName: 'HR', timestamp: '2025-02-22T10:00:00Z' },
  { id: '2', adminUser: 'admin@aarong.com', action: 'role_assigned', targetUser: 'fatima@aarong.com', roleName: 'Instructor', timestamp: '2025-02-21T14:00:00Z' },
]
