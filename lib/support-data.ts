import type { RoleType } from './dashboard-nav'
export type SupportGroupId = 'login_access' | 'course_content' | 'device_network' | 'reporting_data' | 'other'

export const SUPPORT_GROUPS: { id: SupportGroupId; label: string }[] = [
  { id: 'login_access', label: 'Login & account access' },
  { id: 'course_content', label: 'Course / content not loading' },
  { id: 'device_network', label: 'Device / network problem' },
  { id: 'reporting_data', label: 'Reporting / data mismatch' },
  { id: 'other', label: 'Other' },
]

export type SupportTicketStatus = 'open' | 'in_progress' | 'resolved'

export const SUPPORT_TICKET_STATUSES: { id: SupportTicketStatus; label: string }[] = [
  { id: 'open', label: 'Open' },
  { id: 'in_progress', label: 'In progress' },
  { id: 'resolved', label: 'Resolved' },
]

export type SupportTicketPriority = 'low' | 'medium' | 'high'

export const SUPPORT_PRIORITIES: { id: SupportTicketPriority; label: string }[] = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
]

export type SupportTicket = {
  id: string
  groupId: SupportGroupId
  branch: string
  requesterName: string
  requesterRole?: string
  contactPhone?: string
  problemSummary: string
  problemDetails: string
  status: SupportTicketStatus
  priority: SupportTicketPriority
  createdAt: string
  updatedAt: string
  createdByRole: RoleType
}

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 's1',
    groupId: 'login_access',
    branch: 'Mirpur Training Center',
    requesterName: 'Rahim Uddin',
    requesterRole: 'Center In‑charge',
    contactPhone: '017XXXXXXXX',
    problemSummary: 'Learners cannot login after password reset',
    problemDetails:
      'Several learners reported that after resetting their password, the login page shows “invalid credentials”. Happens mostly from mobile browser.',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2025-02-20T09:30:00Z',
    updatedAt: '2025-02-20T10:15:00Z',
    createdByRole: 'learner',
  },
  {
    id: 's2',
    groupId: 'course_content',
    branch: 'Uttara Outlet',
    requesterName: 'Fatima Begum',
    requesterRole: 'Artisan',
    contactPhone: '018XXXXXXXX',
    problemSummary: 'Wrong SOP version in “Quality & SOP” course',
    problemDetails:
      'Video is still showing old SOP steps for finishing section. On the floor we are following new printed SOP.',
    status: 'open',
    priority: 'medium',
    createdAt: '2025-02-18T14:00:00Z',
    updatedAt: '2025-02-18T14:00:00Z',
    createdByRole: 'learner',
  },
  {
    id: 's3',
    groupId: 'reporting_data',
    branch: 'Production Unit ‑ Narayanganj',
    requesterName: 'Karim Ali',
    requesterRole: 'Production Supervisor',
    contactPhone: '019XXXXXXXX',
    problemSummary: 'Assessment not unlocking next module',
    problemDetails:
      'After scoring 90% in the “Color Matching” quiz, next module is still locked for multiple learners in same batch.',
    status: 'resolved',
    priority: 'high',
    createdAt: '2025-02-15T11:15:00Z',
    updatedAt: '2025-02-16T09:45:00Z',
    createdByRole: 'admin',
  },
]

