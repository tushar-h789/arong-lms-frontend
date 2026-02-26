/**
 * Mock data for Gamification / Leaderboard.
 * Replace with real API calls later.
 */

export type LeaderboardEntry = {
  id: string
  name: string
  email: string
  rank: number
  completed: number
  points: number
  badges: number
  avatarColor: string
}

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { id: '1', name: 'John Doe', email: 'doe.john123@xyzmail.com', rank: 1, completed: 13, points: 250, badges: 5, avatarColor: 'bg-orange-400' },
  { id: '2', name: 'Roger', email: 'roger@xyzmail.com', rank: 2, completed: 12, points: 240, badges: 4, avatarColor: 'bg-green-500' },
  { id: '3', name: 'Amy Smith', email: 'amy001@xyzmail.com', rank: 3, completed: 10, points: 200, badges: 3, avatarColor: 'bg-amber-700' },
  { id: '4', name: 'Alex21', email: 'alex21@xyzmail.com', rank: 4, completed: 7, points: 140, badges: 2, avatarColor: 'bg-purple-500' },
  { id: '5', name: 'Sarah Lee', email: 'sarah.lee@xyzmail.com', rank: 5, completed: 6, points: 120, badges: 2, avatarColor: 'bg-blue-500' },
  { id: '6', name: 'Mike Chen', email: 'mike.chen@xyzmail.com', rank: 6, completed: 5, points: 100, badges: 1, avatarColor: 'bg-teal-500' },
  { id: '7', name: 'Emma Wilson', email: 'emma.w@xyzmail.com', rank: 7, completed: 4, points: 80, badges: 1, avatarColor: 'bg-pink-500' },
]
