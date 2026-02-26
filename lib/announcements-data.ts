/**
 * Announcements (Broadcast) — quick notices to everyone or specific groups. Posters, PDFs, short video. Aarong: field/village workers, short notice/poster very effective.
 */

export type AudienceType = 'global' | 'course' | 'center' | 'craft'

export type PriorityLevel = 'normal' | 'important' | 'urgent'

export type AttachmentType = 'image' | 'pdf' | 'video'

export type DeliveryChannel = 'in_app' | 'sms_whatsapp'

export type AnnouncementRow = {
  id: string
  title: string
  body: string
  audienceType: AudienceType
  audienceId: string | null
  audienceLabel: string
  priority: PriorityLevel
  scheduledAt: string | null
  publishedAt: string | null
  attachments: { type: AttachmentType; url: string; name: string }[]
  deliveryChannels: DeliveryChannel[]
  createdBy: string
  createdAt: string
}

export const AUDIENCE_TYPES: { id: AudienceType; label: string }[] = [
  { id: 'global', label: 'Global (everyone)' },
  { id: 'course', label: 'Course-specific' },
  { id: 'center', label: 'Center / Location specific' },
  { id: 'craft', label: 'Craft group (weaving / embroidery / dyeing)' },
]

export const PRIORITY_LEVELS: { id: PriorityLevel; label: string }[] = [
  { id: 'normal', label: 'Normal' },
  { id: 'important', label: 'Important' },
  { id: 'urgent', label: 'Urgent' },
]

export const ATTACHMENT_TYPES: { id: AttachmentType; label: string }[] = [
  { id: 'image', label: 'Image (poster)' },
  { id: 'pdf', label: 'PDF (guideline)' },
  { id: 'video', label: 'Short video (optional)' },
]

export const DELIVERY_CHANNELS: { id: DeliveryChannel; label: string }[] = [
  { id: 'in_app', label: 'In-app only' },
  { id: 'sms_whatsapp', label: 'SMS / WhatsApp link (optional)' },
]

export const MOCK_ANNOUNCEMENTS: AnnouncementRow[] = [
  {
    id: 'a1',
    title: 'Safety Week Reminder',
    body: 'Wear PPE at all times in production area. Review the safety poster.',
    audienceType: 'global',
    audienceId: null,
    audienceLabel: 'Everyone',
    priority: 'important',
    scheduledAt: null,
    publishedAt: '2025-02-20T08:00:00Z',
    attachments: [{ type: 'image', url: '/posters/safety-ppe.jpg', name: 'PPE poster' }],
    deliveryChannels: ['in_app'],
    createdBy: 'Nadia Islam',
    createdAt: '2025-02-19T14:00:00Z',
  },
  {
    id: 'a2',
    title: 'Dyeing SOP Update',
    body: 'New step added to dyeing SOP. Please read the attached guideline.',
    audienceType: 'craft',
    audienceId: 'dyeing',
    audienceLabel: 'Dyeing',
    priority: 'normal',
    scheduledAt: null,
    publishedAt: '2025-02-18T10:00:00Z',
    attachments: [{ type: 'pdf', url: '/guidelines/dyeing-sop-v2.pdf', name: 'Dyeing SOP v2' }],
    deliveryChannels: ['in_app'],
    createdBy: 'Admin',
    createdAt: '2025-02-17T16:00:00Z',
  },
]
