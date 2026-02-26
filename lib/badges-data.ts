/**
 * Badges — badge rules & management. Visual motivation for specific achievements. Aarong-friendly: Safety Ready, Quality Champion, On-time Learner, Consistency.
 */

export type BadgeTriggerType = 'course_completion' | 'path_completion' | 'perfect_score' | 'on_time_completion' | 'consistency_days'

export type BadgeVisibility = 'global' | 'center' | 'role'

export type BadgeRow = {
  id: string
  name: string
  description: string
  iconUrl: string
  triggerType: BadgeTriggerType
  triggerConfig: Record<string, unknown>
  visibility: BadgeVisibility
  visibilityTargetId: string | null
  createdAt: string
  createdBy: string
}

export const BADGE_TRIGGER_TYPES: { id: BadgeTriggerType; label: string }[] = [
  { id: 'course_completion', label: 'Course completion' },
  { id: 'path_completion', label: 'Learning path completion' },
  { id: 'perfect_score', label: 'Perfect score (optional)' },
  { id: 'on_time_completion', label: 'On-time completion' },
  { id: 'consistency_days', label: 'Consistency – N days active (optional)' },
]

export const BADGE_VISIBILITY: { id: BadgeVisibility; label: string }[] = [
  { id: 'global', label: 'Global' },
  { id: 'center', label: 'Center-specific' },
  { id: 'role', label: 'Role-specific (artisan / staff)' },
]

/** Aarong-friendly recommended badges */
export const AARONG_RECOMMENDED_BADGES = [
  { name: 'Safety Ready', trigger: 'Safety course complete', icon: 'shield' },
  { name: 'Quality Champion – Level 1', trigger: 'Quality path/course complete', icon: 'star' },
  { name: 'On-time Learner', trigger: 'On-time completion', icon: 'clock' },
  { name: 'Consistency – 7 days active', trigger: '7 days active (optional)', icon: 'flame' },
]

export const MOCK_BADGES: BadgeRow[] = [
  {
    id: 'b1',
    name: 'Safety Ready',
    description: 'Completed Safety course. Good for artisans.',
    iconUrl: '/badges/safety-ready.svg',
    triggerType: 'course_completion',
    triggerConfig: { courseId: 'safety-basics' },
    visibility: 'global',
    visibilityTargetId: null,
    createdAt: '2025-02-01T10:00:00Z',
    createdBy: 'Admin',
  },
  {
    id: 'b2',
    name: 'On-time Learner',
    description: 'Completed assigned training before deadline.',
    iconUrl: '/badges/on-time.svg',
    triggerType: 'on_time_completion',
    triggerConfig: {},
    visibility: 'global',
    visibilityTargetId: null,
    createdAt: '2025-02-05T09:00:00Z',
    createdBy: 'Admin',
  },
]
