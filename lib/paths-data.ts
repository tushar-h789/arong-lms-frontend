/**
 * Learning Paths (List) — create/manage/assign/track.
 * Aarong: Path type, target craft, level badge (skill ladder).
 */

export type PathStatus = 'draft' | 'active' | 'archived'

export type PathType = 'onboarding' | 'skill_upgrade' | 'safety' | 'quality_sop' | 'refresher'

export type TargetCraft = 'weaving' | 'embroidery' | 'dyeing' | 'finishing'

export type PathRow = {
  id: string
  name: string
  status: PathStatus
  pathType: PathType
  targetCraft: TargetCraft
  level: 1 | 2 | 3
  targetRole: string
  category: string
  centerGroup: string[]
  createdBy: string
  createdAt: string
  completionPercent: number
  overdueCount: number
  activeLearners: number
}

export const PATHS: PathRow[] = [
  {
    id: 'p1',
    name: 'New Artisan Onboarding',
    status: 'active',
    pathType: 'onboarding',
    targetCraft: 'weaving',
    level: 1,
    targetRole: 'artisan',
    category: 'Onboarding',
    centerGroup: ['Dhaka HQ', 'Chittagong', 'Weaving A'],
    createdBy: 'Nadia Islam',
    createdAt: '2025-01-10T09:00:00Z',
    completionPercent: 63,
    overdueCount: 12,
    activeLearners: 58,
  },
  {
    id: 'p2',
    name: 'Skill Ladder - Level 2 Weaving',
    status: 'active',
    pathType: 'skill_upgrade',
    targetCraft: 'weaving',
    level: 2,
    targetRole: 'artisan',
    category: 'Skill',
    centerGroup: ['Dhaka HQ', 'Chittagong'],
    createdBy: 'Abdul Karim',
    createdAt: '2025-02-01T11:00:00Z',
    completionPercent: 70,
    overdueCount: 5,
    activeLearners: 27,
  },
  {
    id: 'p3',
    name: 'Safety & Compliance Path',
    status: 'active',
    pathType: 'safety',
    targetCraft: 'weaving',
    level: 1,
    targetRole: 'artisan',
    category: 'Safety',
    centerGroup: ['Dhaka HQ', 'Chittagong', 'Field Center 1'],
    createdBy: 'Admin User',
    createdAt: '2025-01-05T08:00:00Z',
    completionPercent: 81,
    overdueCount: 8,
    activeLearners: 47,
  },
  {
    id: 'p4',
    name: 'Quality SOP Refresher',
    status: 'draft',
    pathType: 'refresher',
    targetCraft: 'embroidery',
    level: 2,
    targetRole: 'artisan',
    category: 'Quality',
    centerGroup: [],
    createdBy: 'Fatima Begum',
    createdAt: '2025-02-20T14:00:00Z',
    completionPercent: 0,
    overdueCount: 0,
    activeLearners: 0,
  },
]

export const PATH_TYPE_LABELS: Record<PathType, string> = {
  onboarding: 'Onboarding',
  skill_upgrade: 'Skill Upgrade',
  safety: 'Safety',
  quality_sop: 'Quality SOP',
  refresher: 'Refresher',
}

export const TARGET_CRAFT_LABELS: Record<TargetCraft, string> = {
  weaving: 'Weaving',
  embroidery: 'Embroidery',
  dyeing: 'Dyeing',
  finishing: 'Finishing',
}

export const PATH_STATUS_LABELS: Record<PathStatus, string> = {
  draft: 'Draft',
  active: 'Active',
  archived: 'Archived',
}
