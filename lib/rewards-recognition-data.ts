/**
 * Rewards & Recognition — badge/points in exchange for recognition (Aarong culture). Monthly top centers, best improvement. Non-cash/certificate/post. Export for HR.
 */

export type RecognitionRuleType = 'monthly_top_centers' | 'best_improvement'

export type RewardType = 'non_cash' | 'certificate' | 'recognition_post'

export type RecognitionRule = {
  id: string
  type: RecognitionRuleType
  label: string
  config: { topN?: number; metric?: string }
  enabled: boolean
}

export type RewardMapping = {
  ruleId: string
  rewardType: RewardType
  description: string
}

export const RECOGNITION_RULES: { id: RecognitionRuleType; label: string }[] = [
  { id: 'monthly_top_centers', label: 'Monthly top 3 centers' },
  { id: 'best_improvement', label: 'Best improvement award (progress increased)' },
]

export const REWARD_TYPES: { id: RewardType; label: string }[] = [
  { id: 'non_cash', label: 'Non-cash reward' },
  { id: 'certificate', label: 'Certificate' },
  { id: 'recognition_post', label: 'Recognition post' },
]

export const MOCK_WINNERS = [
  { period: 'Feb 2025', rule: 'Monthly top 3 centers', center: 'Dhaka North', reward: 'Certificate + recognition post' },
  { period: 'Feb 2025', rule: 'Best improvement', center: 'Savar', reward: 'Recognition post' },
]
