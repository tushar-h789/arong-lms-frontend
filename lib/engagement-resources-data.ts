/**
 * Mock data for Engagement & Resource Utilization report.
 * Video/PDF/Materials usage — to see which format works best for artisans.
 * Replace with real API calls later.
 */

export type EngagementRow = {
  id: string
  userName: string
  department: string
  logins: number
  activeDays: number
  timeSpent: string
  forumPosts: number
  forumReplies: number
  engagementScore: number
}

/** Active users (daily/weekly/monthly) */
export type ActiveUsers = {
  daily: number
  weekly: number
  monthly: number
}

/** Time spent per user or per course */
export type TimeSpentRow = {
  id: string
  name: string
  timeSpent: string
  type: 'user' | 'course'
  department?: string
}

/** Repeat logins — users with multiple logins */
export type RepeatLoginRow = {
  id: string
  userName: string
  email: string
  department: string
  loginCount: number
  lastLogin: string
}

/** Engagement by center/location */
export type EngagementByCenterRow = {
  id: string
  center: string
  location: string
  activeUsers: number
  totalTimeSpent: string
  avgLoginsPerUser: number
}

/** Dropout risk — inactive 14/30 days */
export type DropoutRiskRow = {
  id: string
  userName: string
  email: string
  department: string
  center: string
  daysInactive: number
  lastActivity: string
}

export type VideoRow = {
  id: string
  title: string
  courseName: string
  views: number
  watchCompletionPercent: number
  avgTimeSpent: string
}

export type PdfRow = {
  id: string
  title: string
  courseName: string
  opens: number
  opensRank: 'most' | 'least' | 'mid'
}

export type DeviceUsageRow = {
  device: string
  percent: number
}

export type LowUtilizationRow = {
  id: string
  title: string
  type: 'video' | 'pdf' | 'document'
  courseName: string
  views: number
  completionPercent: number
  revampCandidate: boolean
}

export const ENGAGEMENT_RESOURCES = {
  activeUsers: { daily: 89, weekly: 312, monthly: 892 } as ActiveUsers,
  timeSpentPerUser: [
    { id: 'tu1', name: 'Fatima Khan', timeSpent: '18h 30m', type: 'user' as const, department: 'HR' },
    { id: 'tu2', name: 'Imran Rahman', timeSpent: '15h 00m', type: 'user' as const, department: 'IT' },
    { id: 'tu3', name: 'Rahim Ahmed', timeSpent: '12h 45m', type: 'user' as const, department: 'HR' },
    { id: 'tu4', name: 'Nadia Islam', timeSpent: '9h 20m', type: 'user' as const, department: 'Operations' },
  ] as TimeSpentRow[],
  timeSpentPerCourse: [
    { id: 'tc1', name: 'Workplace Safety Essentials', timeSpent: '245h 20m', type: 'course' as const },
    { id: 'tc2', name: 'Data Privacy Basics', timeSpent: '128h 45m', type: 'course' as const },
    { id: 'tc3', name: 'Fire Safety Fundamentals', timeSpent: '98h 10m', type: 'course' as const },
  ] as TimeSpentRow[],
  repeatLogins: [
    { id: 'rl1', userName: 'Fatima Khan', email: 'fatima@aarong.com', department: 'HR', loginCount: 31, lastLogin: '2025-02-22' },
    { id: 'rl2', userName: 'Imran Rahman', email: 'imran@aarong.com', department: 'IT', loginCount: 28, lastLogin: '2025-02-22' },
    { id: 'rl3', userName: 'Rahim Ahmed', email: 'rahim@aarong.com', department: 'HR', loginCount: 24, lastLogin: '2025-02-21' },
    { id: 'rl4', userName: 'Nadia Islam', email: 'nadia@aarong.com', department: 'Operations', loginCount: 19, lastLogin: '2025-02-20' },
  ] as RepeatLoginRow[],
  engagementByCenter: [
    { id: 'ec1', center: 'Dhaka HQ', location: 'Dhaka', activeUsers: 425, totalTimeSpent: '1,240h', avgLoginsPerUser: 18 },
    { id: 'ec2', center: 'Chittagong', location: 'Chittagong', activeUsers: 198, totalTimeSpent: '520h', avgLoginsPerUser: 14 },
    { id: 'ec3', center: 'Field Centers (Rural)', location: 'Multiple', activeUsers: 269, totalTimeSpent: '380h', avgLoginsPerUser: 8 },
  ] as EngagementByCenterRow[],
  dropoutRisk: [
    { id: 'dr1', userName: 'Karim Hossain', email: 'karim@aarong.com', department: 'Operations', center: 'Dhaka HQ', daysInactive: 14, lastActivity: '2025-02-08' },
    { id: 'dr2', userName: 'Sadia Akter', email: 'sadia@aarong.com', department: 'Finance', center: 'Dhaka HQ', daysInactive: 21, lastActivity: '2025-02-01' },
    { id: 'dr3', userName: 'Abdul Rahman', email: 'abdul@aarong.com', department: 'Field', center: 'Rural - North', daysInactive: 30, lastActivity: '2025-01-23' },
    { id: 'dr4', userName: 'Mina Begum', email: 'mina@aarong.com', department: 'Field', center: 'Rural - South', daysInactive: 45, lastActivity: '2025-01-08' },
  ] as DropoutRiskRow[],
  engagement: [
    { id: 'e1', userName: 'Rahim Ahmed', department: 'HR', logins: 24, activeDays: 18, timeSpent: '12h 45m', forumPosts: 5, forumReplies: 12, engagementScore: 85 },
    { id: 'e2', userName: 'Fatima Khan', department: 'HR', logins: 31, activeDays: 22, timeSpent: '18h 30m', forumPosts: 8, forumReplies: 20, engagementScore: 92 },
    { id: 'e3', userName: 'Karim Hossain', department: 'Operations', logins: 8, activeDays: 5, timeSpent: '4h 15m', forumPosts: 0, forumReplies: 1, engagementScore: 32 },
    { id: 'e4', userName: 'Nadia Islam', department: 'Operations', logins: 19, activeDays: 14, timeSpent: '9h 20m', forumPosts: 2, forumReplies: 6, engagementScore: 68 },
    { id: 'e5', userName: 'Imran Rahman', department: 'IT', logins: 28, activeDays: 20, timeSpent: '15h 00m', forumPosts: 3, forumReplies: 10, engagementScore: 88 },
    { id: 'e6', userName: 'Sadia Akter', department: 'Finance', logins: 6, activeDays: 4, timeSpent: '2h 45m', forumPosts: 0, forumReplies: 0, engagementScore: 25 },
  ] as EngagementRow[],
  mostWatchedVideos: [
    { id: 'v1', title: 'Safety Intro Video', courseName: 'Workplace Safety Essentials', views: 245, watchCompletionPercent: 82, avgTimeSpent: '8m 30s' },
    { id: 'v2', title: 'Hazard Identification Video', courseName: 'Workplace Safety Essentials', views: 210, watchCompletionPercent: 78, avgTimeSpent: '10m 45s' },
    { id: 'v3', title: 'Fire Safety Demo', courseName: 'Fire Safety Fundamentals', views: 189, watchCompletionPercent: 88, avgTimeSpent: '12m 00s' },
    { id: 'v4', title: 'Short Steps: Evacuation', courseName: 'Fire Safety Fundamentals', views: 165, watchCompletionPercent: 92, avgTimeSpent: '3m 20s' },
  ] as VideoRow[],
  pdfsMostLeast: [
    { id: 'p1', title: 'Privacy Policy PDF', courseName: 'Data Privacy Basics', opens: 142, opensRank: 'most' as const },
    { id: 'p2', title: 'GDPR Overview PDF', courseName: 'Data Privacy Basics', opens: 98, opensRank: 'mid' as const },
    { id: 'p3', title: 'Safety Manual PDF', courseName: 'Workplace Safety', opens: 45, opensRank: 'least' as const },
    { id: 'p4', title: 'Terms of Service PDF', courseName: 'General', opens: 12, opensRank: 'least' as const },
  ] as PdfRow[],
  deviceUsage: [
    { device: 'Mobile', percent: 72 },
    { device: 'Desktop', percent: 22 },
    { device: 'Tablet', percent: 6 },
  ] as DeviceUsageRow[],
  lowUtilization: [
    { id: 'l1', title: 'Terms of Service PDF', type: 'pdf' as const, courseName: 'General', views: 12, completionPercent: 25, revampCandidate: true },
    { id: 'l2', title: 'Long Safety Manual', type: 'pdf' as const, courseName: 'Workplace Safety', views: 45, completionPercent: 32, revampCandidate: true },
    { id: 'l3', title: 'Technical Overview Video', type: 'video' as const, courseName: 'IT Basics', views: 28, completionPercent: 40, revampCandidate: true },
    { id: 'l4', title: 'Evacuation Procedures Doc', type: 'document' as const, courseName: 'Fire Safety', views: 102, completionPercent: 65, revampCandidate: false },
  ] as LowUtilizationRow[],
}
