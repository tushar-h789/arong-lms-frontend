/**
 * Auto-Assignment Rules — when new user joins, auto assign training.
 * Rule: If Role=X AND Craft=Y → assign path/course. Effective date + versioning. Reduces HR workload.
 */

export type RuleCondition = {
  field: 'role' | 'craft' | 'center' | 'compliance_required'
  op: 'eq' | 'in'
  value: string | string[]
}

export type AutoAssignmentRuleRow = {
  id: string
  name: string
  conditions: RuleCondition[]
  assignContentType: 'course' | 'path'
  assignContentId: string
  assignContentName: string
  effectiveFrom: string
  effectiveTo: string
  version: number
  active: boolean
}

export const AUTO_ASSIGNMENT_RULES: AutoAssignmentRuleRow[] = [
  {
    id: 'ar1',
    name: 'Artisan Embroidery L1',
    conditions: [{ field: 'role', op: 'eq', value: 'artisan' }, { field: 'craft', op: 'eq', value: 'embroidery' }],
    assignContentType: 'path',
    assignContentId: 'p1',
    assignContentName: 'Embroidery L1 Path',
    effectiveFrom: '2025-01-01',
    effectiveTo: '',
    version: 1,
    active: true,
  },
  {
    id: 'ar2',
    name: 'Compliance Safety',
    conditions: [{ field: 'compliance_required', op: 'eq', value: 'true' }],
    assignContentType: 'course',
    assignContentId: 'c1',
    assignContentName: 'Safety & Values',
    effectiveFrom: '2025-01-01',
    effectiveTo: '',
    version: 1,
    active: true,
  },
]
