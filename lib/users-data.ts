/**
 * Mock data for Users list.
 * Replace with real API calls later.
 * Aarong-friendly: Center, Group, Trainer, Skill category (weaving/embroidery/dyeing).
 */

export type UserStatus = 'active' | 'inactive' | 'locked'

export type SkillCategory = 'weaving' | 'embroidery' | 'dyeing' | 'general' | null

export type UserRow = {
  id: string
  name: string
  email: string
  role: string
  center: string
  group: string
  status: UserStatus
  trainer?: string
  skillCategory: SkillCategory
  lastActive?: string
}

export const USERS: UserRow[] = [
  { id: 'u1', name: 'Rahim Ahmed', email: 'rahim@aarong.com', role: 'learner', center: 'Dhaka HQ', group: 'Weaving A', status: 'active', trainer: 'Abdul Karim', skillCategory: 'weaving', lastActive: '2025-02-22T08:30:00Z' },
  { id: 'u2', name: 'Fatima Khan', email: 'fatima@aarong.com', role: 'learner', center: 'Dhaka HQ', group: 'Embroidery B', status: 'active', trainer: 'Nadia Islam', skillCategory: 'embroidery', lastActive: '2025-02-21T14:20:00Z' },
  { id: 'u3', name: 'Karim Hossain', email: 'karim@aarong.com', role: 'learner', center: 'Chittagong', group: 'Dyeing C', status: 'active', trainer: 'Rahim Uddin', skillCategory: 'dyeing', lastActive: '2025-02-20T11:00:00Z' },
  { id: 'u4', name: 'Nadia Islam', email: 'nadia@aarong.com', role: 'instructor', center: 'Dhaka HQ', group: 'Embroidery', status: 'active', skillCategory: null, lastActive: '2025-02-22T09:15:00Z' },
  { id: 'u5', name: 'Imran Rahman', email: 'imran@aarong.com', role: 'learner', center: 'Dhaka HQ', group: 'Weaving B', status: 'inactive', trainer: 'Abdul Karim', skillCategory: 'weaving', lastActive: '2025-02-10T16:00:00Z' },
  { id: 'u6', name: 'Sadia Akter', email: 'sadia@aarong.com', role: 'learner', center: 'Field Center 1', group: 'Embroidery A', status: 'locked', trainer: 'Fatima Begum', skillCategory: 'embroidery', lastActive: '2025-02-18T10:30:00Z' },
  { id: 'u7', name: 'Abdul Karim', email: 'abdul@aarong.com', role: 'instructor', center: 'Dhaka HQ', group: 'Weaving', status: 'active', skillCategory: null, lastActive: '2025-02-22T08:45:00Z' },
  { id: 'u8', name: 'Rahim Uddin', email: 'rahim.u@aarong.com', role: 'instructor', center: 'Chittagong', group: 'Dyeing', status: 'active', skillCategory: null, lastActive: '2025-02-21T17:00:00Z' },
  { id: 'u9', name: 'Tasnim Akter', email: 'tasnim@aarong.com', role: 'learner', center: 'Dhaka HQ', group: 'Weaving A', status: 'active', trainer: 'Abdul Karim', skillCategory: 'weaving', lastActive: '2025-02-22T07:00:00Z' },
  { id: 'u10', name: 'Mofizul Islam', email: 'mofizul@aarong.com', role: 'learner', center: 'Chittagong', group: 'Dyeing C', status: 'inactive', trainer: 'Rahim Uddin', skillCategory: 'dyeing', lastActive: '2025-01-28T09:00:00Z' },
]

/** Unique values for filter dropdowns */
export const FILTER_OPTIONS = {
  roles: ['learner', 'instructor', 'admin', 'hr'] as const,
  centers: ['Dhaka HQ', 'Chittagong', 'Field Center 1'] as const,
  groups: ['Weaving A', 'Weaving B', 'Embroidery A', 'Embroidery B', 'Dyeing C', 'Weaving', 'Embroidery', 'Dyeing'] as const,
  statuses: ['active', 'inactive', 'locked'] as const,
  trainers: ['Abdul Karim', 'Nadia Islam', 'Rahim Uddin', 'Fatima Begum'] as const,
  skillCategories: ['weaving', 'embroidery', 'dyeing', 'general'] as const,
}
