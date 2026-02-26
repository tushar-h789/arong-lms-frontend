/**
 * Leaderboards — friendly competition, handled sensitively. Center/department ranking. No "lowest performers" public list; top performers highlight only.
 */

export type LeaderboardType = 'department' | 'center' | 'company'

export type TimeWindow = 'weekly' | 'monthly'

export type CraftFilter = 'all' | 'weaving' | 'embroidery' | 'dyeing'

export type LeaderboardConfig = {
  type: LeaderboardType
  timeWindow: TimeWindow
  craftFilter: CraftFilter
  enabledForRoles: string[]
  hideIndividualNames: boolean
  showTopNOnly: number
}

export const LEADERBOARD_TYPES: { id: LeaderboardType; label: string }[] = [
  { id: 'department', label: 'Department leaderboard' },
  { id: 'center', label: 'Center leaderboard' },
  { id: 'company', label: 'Company-wide (optional)' },
]

export const TIME_WINDOWS: { id: TimeWindow; label: string }[] = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
]

export const CRAFT_FILTERS: { id: CraftFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'weaving', label: 'Weaving' },
  { id: 'embroidery', label: 'Embroidery' },
  { id: 'dyeing', label: 'Dyeing' },
]

export const MOCK_TOP_ENTRIES = [
  { rank: 1, label: 'Dhaka North', points: 420, isAnonymized: false },
  { rank: 2, label: 'Savar', points: 385, isAnonymized: false },
  { rank: 3, label: 'Center A', points: 350, isAnonymized: true },
]
