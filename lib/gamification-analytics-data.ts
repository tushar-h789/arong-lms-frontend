/**
 * Gamification Analytics — impact tracking. Completion before/after badges, engagement uplift, center-wise, badge distribution. So gamification is not just a feature.
 */

export type MetricRow = {
  id: string
  label: string
  before: number
  after: number
  upliftPercent: number
  unit: string
}

export const MOCK_COMPLETION_BEFORE_AFTER: MetricRow[] = [
  { id: 'm1', label: 'Course completion rate', before: 62, after: 78, upliftPercent: 25.8, unit: '%' },
  { id: 'm2', label: 'On-time completion rate', before: 45, after: 58, upliftPercent: 28.9, unit: '%' },
]

export const MOCK_ENGAGEMENT = [
  { label: 'Active users (7d)', value: 340, change: 12 },
  { label: 'Active users (30d)', value: 520, change: 8 },
]

export const MOCK_CENTER_UPLIFT = [
  { center: 'Dhaka North', before: 65, after: 82, uplift: 26 },
  { center: 'Savar', before: 58, after: 71, uplift: 22 },
]

export const MOCK_BADGE_DISTRIBUTION = [
  { badge: 'Safety Ready', earned: 120, totalEligible: 200, percent: 60 },
  { badge: 'On-time Learner', earned: 85, totalEligible: 200, percent: 42.5 },
]
