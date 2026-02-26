/**
 * Help Desk / Q&A — artisans ask, trainer/support answers. Simpler than forum, practical for Aarong.
 * Categories: Course help, SOP clarification, Tech help. Reply: text, voice note, image. Status: open/answered/resolved. FAQ pin.
 */

export type QuestionCategory = 'course_help' | 'sop_clarification' | 'tech_help'

export type TicketStatus = 'open' | 'answered' | 'resolved'

export type ReplyAttachmentType = 'text' | 'voice' | 'image'

export type HelpDeskTicket = {
  id: string
  category: QuestionCategory
  subject: string
  body: string
  askedBy: string
  askedAt: string
  status: TicketStatus
  replies: {
    id: string
    body: string
    attachmentType: ReplyAttachmentType
    attachmentUrl?: string
    repliedBy: string
    repliedAt: string
    isPinnedAsFaq: boolean
  }[]
  courseName?: string
}

export const QUESTION_CATEGORIES: { id: QuestionCategory; label: string }[] = [
  { id: 'course_help', label: 'Course help' },
  { id: 'sop_clarification', label: 'SOP clarification' },
  { id: 'tech_help', label: 'Tech help (login / video play)' },
]

export const TICKET_STATUSES: { id: TicketStatus; label: string }[] = [
  { id: 'open', label: 'Open' },
  { id: 'answered', label: 'Answered' },
  { id: 'resolved', label: 'Resolved' },
]

export const MOCK_TICKETS: HelpDeskTicket[] = [
  {
    id: 't1',
    category: 'sop_clarification',
    subject: 'Dyeing step 3 — temperature range?',
    body: 'What is the correct temperature range for step 3 in the dyeing SOP?',
    askedBy: 'Rahim Uddin',
    askedAt: '2025-02-20T09:00:00Z',
    status: 'answered',
    courseName: 'Quality & SOP',
    replies: [
      {
        id: 'r1',
        body: 'Step 3 should be between 40–45°C. See the SOP poster for the exact range.',
        attachmentType: 'image',
        attachmentUrl: '/sop/dyeing-step3.jpg',
        repliedBy: 'Nadia Islam',
        repliedAt: '2025-02-20T10:30:00Z',
        isPinnedAsFaq: true,
      },
    ],
  },
  {
    id: 't2',
    category: 'tech_help',
    subject: 'Video not playing on my phone',
    body: 'The training video does not play when I open the course. Only sound.',
    askedBy: 'Fatima Begum',
    askedAt: '2025-02-19T14:00:00Z',
    status: 'resolved',
    replies: [
      {
        id: 'r2',
        body: 'Try enabling "Allow autoplay" in your browser settings, or download the video for offline viewing.',
        attachmentType: 'text',
        repliedBy: 'Support',
        repliedAt: '2025-02-19T15:00:00Z',
        isPinnedAsFaq: false,
      },
    ],
  },
]
