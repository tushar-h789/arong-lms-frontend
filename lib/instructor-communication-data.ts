/**
 * Instructor Communication (Course scope) — Announcements, Q&A/Help Desk, Live Sessions.
 * One page, 3 tabs. Aarong: short announcement, Help Desk style Q&A, live demo + attendance.
 */

import { COURSES } from '@/lib/courses-data'
import { CENTERS, GROUPS } from '@/lib/assignment-monitor-data'

// —— Tab 1: Course Announcements ——
export type CourseAnnouncementAudience = 'all_enrolled' | 'center' | 'group'

export type CourseAnnouncementRow = {
  id: string
  courseId: string
  /** Short one-line + clear action */
  title: string
  body: string
  audienceType: CourseAnnouncementAudience
  audienceCenter?: string
  audienceGroup?: string
  audienceLabel: string
  attachments: { type: 'image' | 'pdf'; name: string; url: string }[]
  scheduledAt: string | null
  publishedAt: string | null
  isPinned: boolean
  createdBy: string
  createdAt: string
}

export const COURSE_ANNOUNCEMENT_AUDIENCE_OPTIONS: { value: CourseAnnouncementAudience; label: string }[] = [
  { value: 'all_enrolled', label: 'All enrolled' },
  { value: 'center', label: 'Specific center' },
  { value: 'group', label: 'Specific group' },
]

export const COURSE_ANNOUNCEMENT_ATTACHMENT_TYPES: { value: 'image' | 'pdf'; label: string }[] = [
  { value: 'image', label: 'Image poster' },
  { value: 'pdf', label: 'PDF checklist / job aid' },
]

// —— Tab 2: Q&A / Forum Moderation ——
export type QAThreadTag = 'SOP' | 'Quality' | 'Safety' | 'Tech'

export type QAThreadStatus = 'open' | 'answered' | 'resolved' | 'locked'

export type QAReplyRow = {
  id: string
  body: string
  attachmentType: 'text' | 'image' | 'voice'
  attachmentUrl?: string
  repliedBy: string
  repliedAt: string
  isPinnedAsBest: boolean
}

export type CourseQAThreadRow = {
  id: string
  courseId: string
  question: string
  body: string
  askedBy: string
  askedAt: string
  tag: QAThreadTag
  status: QAThreadStatus
  isLocked: boolean
  replies: QAReplyRow[]
}

export const QA_TAGS: { value: QAThreadTag; label: string }[] = [
  { value: 'SOP', label: 'SOP' },
  { value: 'Quality', label: 'Quality' },
  { value: 'Safety', label: 'Safety' },
  { value: 'Tech', label: 'Tech' },
]

export const QA_STATUSES: { value: QAThreadStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'answered', label: 'Answered' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'locked', label: 'Locked' },
]

// —— Tab 3: Live Session Schedule ——
export type CourseLiveSessionRow = {
  id: string
  courseId: string
  title: string
  topic: string
  meetLink: string
  platform: 'meet' | 'zoom' | 'teams'
  startAt: string
  durationMinutes: number
  targetType: 'all_learners' | 'center' | 'group'
  targetCenter?: string
  targetGroup?: string
  targetLabel: string
  status: 'scheduled' | 'live' | 'ended'
  attendanceMarked: number
  attendanceTotal: number
  recordingUrl: string | null
  handoutPdfUrl: string | null
  createdBy: string
  createdAt: string
}

export const LIVE_SESSION_PLATFORMS: { value: 'meet' | 'zoom' | 'teams'; label: string }[] = [
  { value: 'meet', label: 'Google Meet' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'teams', label: 'Microsoft Teams' },
]

export const LIVE_SESSION_TARGET_OPTIONS: { value: 'all_learners' | 'center' | 'group'; label: string }[] = [
  { value: 'all_learners', label: 'All learners' },
  { value: 'center', label: 'Specific center' },
  { value: 'group', label: 'Specific group' },
]

// —— Mock data (course-scoped) ——
const MOCK_COURSE_ANNOUNCEMENTS: CourseAnnouncementRow[] = [
  {
    id: 'ca1',
    courseId: 'c1',
    title: 'New SOP update — Fire extinguisher use',
    body: 'Review the update and follow the checklist by end of this week.',
    audienceType: 'all_enrolled',
    audienceLabel: 'All enrolled',
    attachments: [{ type: 'pdf', name: 'Fire-extinguisher-checklist.pdf', url: '/posters/fire-checklist.pdf' }],
    scheduledAt: null,
    publishedAt: '2025-02-22T08:00:00Z',
    isPinned: true,
    createdBy: 'Nadia Islam',
    createdAt: '2025-02-21T14:00:00Z',
  },
  {
    id: 'ca2',
    courseId: 'c1',
    title: 'Safety Week: PPE mandatory',
    body: 'Wear PPE at all times in the production area. See the poster.',
    audienceType: 'center',
    audienceCenter: 'Dhaka HQ',
    audienceLabel: 'Dhaka HQ',
    attachments: [{ type: 'image', name: 'PPE poster', url: '/posters/ppe.jpg' }],
    scheduledAt: null,
    publishedAt: '2025-02-20T09:00:00Z',
    isPinned: false,
    createdBy: 'Nadia Islam',
    createdAt: '2025-02-19T16:00:00Z',
  },
  {
    id: 'ca3',
    courseId: 'c2',
    title: 'Dyeing step-2 correction — applies to all centers',
    body: 'Step 2 temperature range has been updated. See the attached PDF.',
    audienceType: 'all_enrolled',
    audienceLabel: 'All enrolled',
    attachments: [{ type: 'pdf', name: 'Dyeing-SOP-v2.pdf', url: '/pdfs/dyeing-sop-v2.pdf' }],
    scheduledAt: null,
    publishedAt: '2025-02-18T10:00:00Z',
    isPinned: true,
    createdBy: 'Rahim Uddin',
    createdAt: '2025-02-17T12:00:00Z',
  },
]

const MOCK_COURSE_QA: CourseQAThreadRow[] = [
  {
    id: 'cq1',
    courseId: 'c1',
    question: 'What is the correct sequence for using the fire extinguisher?',
    body: 'The course says pull the pin — how far should we stand from the fire?',
    askedBy: 'Rahim Ahmed',
    askedAt: '2025-02-23T10:00:00Z',
    tag: 'Safety',
    status: 'open',
    isLocked: false,
    replies: [],
  },
  {
    id: 'cq2',
    courseId: 'c1',
    question: 'Distance from dyeing section to emergency exit?',
    body: 'Which way is the nearest exit?',
    askedBy: 'Fatima Khan',
    askedAt: '2025-02-22T14:00:00Z',
    tag: 'Safety',
    status: 'answered',
    isLocked: false,
    replies: [
      {
        id: 'cr1',
        body: 'From the dyeing section, 20 metres to the left, blue signboard.',
        attachmentType: 'image',
        attachmentUrl: '/qa/exit-map.jpg',
        repliedBy: 'Nadia Islam',
        repliedAt: '2025-02-22T15:30:00Z',
        isPinnedAsBest: true,
      },
    ],
  },
  {
    id: 'cq3',
    courseId: 'c2',
    question: 'Dyeing step 3 — correct temperature range (SOP)?',
    body: 'What temperature in Celsius should we keep for step 3?',
    askedBy: 'Karim Hossain',
    askedAt: '2025-02-21T09:00:00Z',
    tag: 'SOP',
    status: 'resolved',
    isLocked: false,
    replies: [
      {
        id: 'cr2',
        body: '40–45°C. Exact range is on the SOP poster.',
        attachmentType: 'text',
        repliedBy: 'Rahim Uddin',
        repliedAt: '2025-02-21T10:00:00Z',
        isPinnedAsBest: true,
      },
    ],
  },
  {
    id: 'cq4',
    courseId: 'c2',
    question: 'Quality check — how many before handoff?',
    body: 'How many checkpoints before handoff from Weaving?',
    askedBy: 'Tasnim Akter',
    askedAt: '2025-02-20T11:00:00Z',
    tag: 'Quality',
    status: 'open',
    isLocked: false,
    replies: [],
  },
]

const MOCK_COURSE_LIVE_SESSIONS: CourseLiveSessionRow[] = [
  {
    id: 'cs1',
    courseId: 'c1',
    title: 'Fire Safety Live Demo',
    topic: 'Extinguisher use + evacuation drill',
    meetLink: 'https://meet.google.com/aaa-bbbb-ccc',
    platform: 'meet',
    startAt: '2025-03-01T10:00:00Z',
    durationMinutes: 60,
    targetType: 'all_learners',
    targetLabel: 'All learners',
    status: 'scheduled',
    attendanceMarked: 0,
    attendanceTotal: 28,
    recordingUrl: null,
    handoutPdfUrl: '/handouts/fire-safety-demo.pdf',
    createdBy: 'Nadia Islam',
    createdAt: '2025-02-22T08:00:00Z',
  },
  {
    id: 'cs2',
    courseId: 'c2',
    title: 'Dyeing SOP Live',
    topic: 'Step-by-step demo + Q&A',
    meetLink: 'https://zoom.us/j/123456789',
    platform: 'zoom',
    startAt: '2025-02-28T14:00:00Z',
    durationMinutes: 45,
    targetType: 'center',
    targetCenter: 'Chittagong',
    targetLabel: 'Chittagong',
    status: 'scheduled',
    attendanceMarked: 0,
    attendanceTotal: 12,
    recordingUrl: null,
    handoutPdfUrl: null,
    createdBy: 'Rahim Uddin',
    createdAt: '2025-02-20T12:00:00Z',
  },
  {
    id: 'cs3',
    courseId: 'c1',
    title: 'Evacuation Practice',
    topic: 'Route walkthrough',
    meetLink: 'https://teams.microsoft.com/l/meetup/xxx',
    platform: 'teams',
    startAt: '2025-02-20T09:00:00Z',
    durationMinutes: 30,
    targetType: 'group',
    targetGroup: 'Weaving A',
    targetLabel: 'Weaving A',
    status: 'ended',
    attendanceMarked: 18,
    attendanceTotal: 20,
    recordingUrl: 'https://drive.google.com/rec/fire-evac',
    handoutPdfUrl: null,
    createdBy: 'Nadia Islam',
    createdAt: '2025-02-18T10:00:00Z',
  },
]

// —— Getters (filter by courseId) ——
export function getCourseAnnouncements(courseId: string): CourseAnnouncementRow[] {
  return MOCK_COURSE_ANNOUNCEMENTS.filter((a) => a.courseId === courseId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function getCourseQAThreads(courseId: string, options?: { unansweredOnly?: boolean }): CourseQAThreadRow[] {
  let list = MOCK_COURSE_QA.filter((q) => q.courseId === courseId)
  if (options?.unansweredOnly) list = list.filter((q) => q.status === 'open' && q.replies.length === 0)
  return list.sort((a, b) => new Date(b.askedAt).getTime() - new Date(a.askedAt).getTime())
}

export function getCourseLiveSessions(courseId: string): CourseLiveSessionRow[] {
  return MOCK_COURSE_LIVE_SESSIONS.filter((s) => s.courseId === courseId).sort(
    (a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime()
  )
}

// —— Course selector + filter options ——
export function getCommunicationCourseOptions(): { value: string; label: string }[] {
  const list = COURSES.filter((c) => c.status === 'published').map((c) => ({
    value: c.id,
    label: c.title,
  }))
  return [{ value: '', label: 'Select a course' }, ...list]
}

export const COMMUNICATION_CENTERS = CENTERS
export const COMMUNICATION_GROUPS = GROUPS
