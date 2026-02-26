/**
 * Discussions / Forums — course-based discussion, moderation (pin/lock/remove, report), topic tags. Top posts / most helpful. Community learning.
 */

export type DiscussionStatus = 'open' | 'pinned' | 'locked' | 'removed'

export type TopicTag = 'craft' | 'sop' | 'safety' | 'general'

export type DiscussionPost = {
  id: string
  courseId: string
  courseName: string
  title: string
  body: string
  authorName: string
  authorId: string
  createdAt: string
  status: DiscussionStatus
  tags: TopicTag[]
  replyCount: number
  helpfulCount: number
  isReported: boolean
  reportReason?: string
}

export const TOPIC_TAGS: { id: TopicTag; label: string }[] = [
  { id: 'craft', label: 'Craft' },
  { id: 'sop', label: 'SOP' },
  { id: 'safety', label: 'Safety' },
  { id: 'general', label: 'General' },
]

export const MOCK_DISCUSSION_POSTS: DiscussionPost[] = [
  {
    id: 'd1',
    courseId: 'c1',
    courseName: 'Weaving Basics',
    title: 'Best way to check thread tension?',
    body: 'What method do you use to check thread tension before starting?',
    authorName: 'Abdul Karim',
    authorId: 'u1',
    createdAt: '2025-02-18T11:00:00Z',
    status: 'pinned',
    tags: ['craft', 'sop'],
    replyCount: 12,
    helpfulCount: 8,
    isReported: false,
  },
  {
    id: 'd2',
    courseId: 'c1',
    courseName: 'Weaving Basics',
    title: 'Safety checklist before machine start',
    body: 'Sharing our center checklist. Add yours below.',
    authorName: 'Nadia Islam',
    authorId: 'u2',
    createdAt: '2025-02-17T09:00:00Z',
    status: 'open',
    tags: ['safety', 'sop'],
    replyCount: 5,
    helpfulCount: 6,
    isReported: false,
  },
]
