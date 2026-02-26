/**
 * Mock data for Attendance & Activity report (Field Reality Check).
 * Replace with real API calls later.
 */

export type ActivityLogRow = {
  id: string
  userName: string
  email: string
  action: 'login' | 'course_start' | 'completion'
  details: string
  timestamp: string
  ip?: string
}

export type AttendanceRow = {
  id: string
  userName: string
  email: string
  department: string
  sessionName: string
  sessionDate: string
  status: 'present' | 'absent' | 'late'
  checkIn?: string
  duration?: string
  platform?: 'zoom' | 'teams' | 'meet' | null // null = physical / manual
  isManualEntry?: boolean
}

export type AttendanceRateRow = {
  id: string
  center: string
  group: string
  trainer: string
  totalExpected: number
  totalPresent: number
  attendanceRate: number
  sessionDate: string
}

export type NoShowRow = {
  id: string
  userName: string
  email: string
  department: string
  sessionName: string
  sessionDate: string
  sessionType: 'virtual' | 'physical'
  platform?: string
}

export const ATTENDANCE_ACTIVITY = {
  activityLog: [
    { id: 'a1', userName: 'Rahim Ahmed', email: 'rahim@aarong.com', action: 'login' as const, details: 'Logged in', timestamp: '2025-02-22 09:15:32', ip: '192.168.1.10' },
    { id: 'a2', userName: 'Fatima Khan', email: 'fatima@aarong.com', action: 'course_start' as const, details: 'Started Workplace Safety Essentials', timestamp: '2025-02-22 09:20:15' },
    { id: 'a3', userName: 'Karim Hossain', email: 'karim@aarong.com', action: 'completion' as const, details: 'Completed Module 3 - Fire Safety', timestamp: '2025-02-22 10:45:00' },
    { id: 'a4', userName: 'Nadia Islam', email: 'nadia@aarong.com', action: 'login' as const, details: 'Logged in', timestamp: '2025-02-22 08:30:00', ip: '192.168.1.25' },
    { id: 'a5', userName: 'Imran Rahman', email: 'imran@aarong.com', action: 'course_start' as const, details: 'Started Data Privacy Basics', timestamp: '2025-02-22 11:00:22' },
    { id: 'a6', userName: 'Sadia Akter', email: 'sadia@aarong.com', action: 'completion' as const, details: 'Completed Data Privacy Assessment', timestamp: '2025-02-22 14:30:10' },
  ] as ActivityLogRow[],
  virtualAttendance: [
    { id: 'v1', userName: 'Rahim Ahmed', email: 'rahim@aarong.com', department: 'HR', sessionName: 'Workplace Safety - Live Session', sessionDate: '2025-02-20', status: 'present' as const, checkIn: '09:00', duration: '1h 30m', platform: 'zoom' as const },
    { id: 'v2', userName: 'Fatima Khan', email: 'fatima@aarong.com', department: 'HR', sessionName: 'Workplace Safety - Live Session', sessionDate: '2025-02-20', status: 'present' as const, checkIn: '09:02', duration: '1h 28m', platform: 'zoom' as const },
    { id: 'v3', userName: 'Karim Hossain', email: 'karim@aarong.com', department: 'Operations', sessionName: 'Workplace Safety - Live Session', sessionDate: '2025-02-20', status: 'late' as const, checkIn: '09:25', duration: '1h 05m', platform: 'zoom' as const },
    { id: 'v4', userName: 'Nadia Islam', email: 'nadia@aarong.com', department: 'Operations', sessionName: 'Data Privacy Webinar', sessionDate: '2025-02-19', status: 'present' as const, checkIn: '14:00', duration: '1h 00m', platform: 'teams' as const },
    { id: 'v5', userName: 'Imran Rahman', email: 'imran@aarong.com', department: 'IT', sessionName: 'Data Privacy Webinar', sessionDate: '2025-02-19', status: 'absent' as const, platform: 'teams' as const },
    { id: 'v6', userName: 'Sadia Akter', email: 'sadia@aarong.com', department: 'Finance', sessionName: 'Safety Intro - Meet', sessionDate: '2025-02-18', status: 'absent' as const, platform: 'meet' as const },
  ] as AttendanceRow[],
  physicalAttendance: [
    { id: 'p1', userName: 'Rahim Ahmed', email: 'rahim@aarong.com', department: 'HR', sessionName: 'Fire Drill - Dhaka HQ', sessionDate: '2025-02-18', status: 'present' as const, checkIn: '10:00', duration: '45m', platform: null, isManualEntry: true },
    { id: 'p2', userName: 'Fatima Khan', email: 'fatima@aarong.com', department: 'HR', sessionName: 'Fire Drill - Dhaka HQ', sessionDate: '2025-02-18', status: 'present' as const, checkIn: '10:01', duration: '44m', platform: null, isManualEntry: true },
    { id: 'p3', userName: 'Karim Hossain', email: 'karim@aarong.com', department: 'Operations', sessionName: 'Fire Drill - Dhaka HQ', sessionDate: '2025-02-18', status: 'absent' as const, platform: null, isManualEntry: true },
    { id: 'p4', userName: 'Nadia Islam', email: 'nadia@aarong.com', department: 'Operations', sessionName: 'First Aid Training - Chittagong', sessionDate: '2025-02-17', status: 'present' as const, checkIn: '09:30', duration: '2h 00m', platform: null, isManualEntry: true },
  ] as AttendanceRow[],
  attendanceRate: [
    { id: 'ar1', center: 'Dhaka HQ', group: 'HR - Batch 1', trainer: 'Abdul Karim', totalExpected: 24, totalPresent: 22, attendanceRate: 92, sessionDate: '2025-02-20' },
    { id: 'ar2', center: 'Dhaka HQ', group: 'Operations - Batch 1', trainer: 'Fatima Begum', totalExpected: 42, totalPresent: 35, attendanceRate: 83, sessionDate: '2025-02-20' },
    { id: 'ar3', center: 'Chittagong', group: 'Operations - Batch 2', trainer: 'Rahim Uddin', totalExpected: 28, totalPresent: 24, attendanceRate: 86, sessionDate: '2025-02-19' },
    { id: 'ar4', center: 'Dhaka HQ', group: 'IT - Batch 1', trainer: 'Nadia Islam', totalExpected: 15, totalPresent: 14, attendanceRate: 93, sessionDate: '2025-02-19' },
  ] as AttendanceRateRow[],
  noShowList: [
    { id: 'n1', userName: 'Karim Hossain', email: 'karim@aarong.com', department: 'Operations', sessionName: 'Fire Drill - Dhaka HQ', sessionDate: '2025-02-18', sessionType: 'physical' },
    { id: 'n2', userName: 'Imran Rahman', email: 'imran@aarong.com', department: 'IT', sessionName: 'Data Privacy Webinar', sessionDate: '2025-02-19', sessionType: 'virtual', platform: 'Teams' },
    { id: 'n3', userName: 'Sadia Akter', email: 'sadia@aarong.com', department: 'Finance', sessionName: 'Safety Intro - Meet', sessionDate: '2025-02-18', sessionType: 'virtual', platform: 'Meet' },
  ] as NoShowRow[],
}
