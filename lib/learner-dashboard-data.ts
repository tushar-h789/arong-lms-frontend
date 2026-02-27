/**
 * Mock data for Learner (Student) dashboard — Aarong-friendly.
 * Replace with real API calls later.
 */

export const BADGE_SET = [
  { id: 'on-time-learner', label: 'On-time Learner', icon: '⏱️', tagline: 'You finished before the due date!' },
  { id: 'consistency', label: 'Consistency', icon: '🔥', tagline: 'Learning streak unlocked!' },
  { id: 'safety-ready', label: 'Safety Ready', icon: '🛡️', tagline: 'Safety course completed!' },
  { id: 'quality-first', label: 'Quality First', icon: '✨', tagline: 'Quality SOP path completed!' },
  { id: 'skill-level-1', label: 'Skill Level 1', icon: '📌', tagline: 'First craft path completed!' },
  { id: 'perfect-score', label: 'Perfect Score', icon: '💯', tagline: 'You aced the quiz!' },
  { id: 'attendance-star', label: 'Attendance Star', icon: '⭐', tagline: 'Great attendance at live sessions!' },
] as const

export type BadgeId = (typeof BADGE_SET)[number]['id']

export const LEARNER_DASHBOARD = {
  learnerName: 'Karim',
  /** Today focus: lesson left today OR badge teaser this week */
  todayFocusLine: 'You have 1 lesson left today',
  todayFocusAlt: 'Complete 2 courses this week to earn a badge',
  todayFocusLineBn: 'আজকে আপনার ১টা লেসন বাকি আছে',
  todayFocusAltBn: 'এই সপ্তাহে আরও ২টা কোর্স শেষ করলে নতুন ব্যাজ পাবেন',

  continueLearning: {
    id: 'c1',
    title: 'Workplace Safety Essentials',
    progress: 65,
    nextItem: 'Module 4: Fire Safety',
    href: '/dashboard/learner/course/c1',
  },

  /** Due soon — 2–4 items, compact */
  dueSoon: [
    { id: '1', title: 'Workplace Safety Essentials', dueDate: 'Feb 22', dueDateRaw: '2025-02-22', href: '/dashboard/learner/course/c1' },
    { id: '2', title: 'Data Privacy Basics', dueDate: 'Feb 25', dueDateRaw: '2025-02-25', href: '/dashboard/learner/course/c2' },
  ],

  /** My Progress — this week & overall */
  myProgress: {
    lessonsThisWeek: 3,
    completionPercent: 42,
    timeSpentMinutes: 85,
  },

  /** Latest 1–2 announcements */
  announcements: [
    { id: '1', title: 'New course: Quality SOP path added', time: 'Today', href: '#' },
    { id: '2', title: 'Weekly live session this Friday', time: '2 hours ago', href: '#' },
  ],

  /** Earned badge IDs (top 3 shown) + locked teaser */
  badgesEarned: ['safety-ready', 'quality-first'] as BadgeId[],
  /** One locked badge teaser */
  lockedBadgeTeaser: {
    badgeId: 'on-time-learner' as BadgeId,
    message: "Complete 1 more lesson to unlock the 'On-time Learner' badge",
  },

  /** Streak — soft tone */
  streak: {
    currentDays: 3,
    nextMilestoneDays: 4,
    nextMilestoneBadgeLabel: 'Consistency',
  },

  /** Certificates */
  certificates: {
    total: 2,
    latest: { id: 'cert1', name: 'Safety Fundamentals', downloadHref: '#' },
  },

  // Legacy (keep for any other pages)
  coursesEnrolled: 5,
  coursesInProgress: 2,
  coursesCompleted: 3,
  certificatesEarned: 2,
  coursesInProgressList: [
    { id: 'c1', title: 'Workplace Safety Essentials', progress: 65, href: '/dashboard/learner/course/c1' },
    { id: 'c2', title: 'Data Privacy Basics', progress: 30, href: '/dashboard/learner/course/c2' },
  ],
  upcomingDeadlines: [
    { id: '1', title: 'Quiz: Workplace Safety', dueDate: '2025-02-22', courseTitle: 'Workplace Safety Essentials', href: '#' },
    { id: '2', title: 'Assignment: Privacy Policy', dueDate: '2025-02-25', courseTitle: 'Data Privacy Basics', href: '#' },
  ],
  recentActivity: [
    { id: '1', text: 'Completed "Module 3" in Workplace Safety Essentials', time: '2 hours ago' },
    { id: '2', text: 'Started Data Privacy Basics', time: '1 day ago' },
    { id: '3', text: 'Earned certificate: Safety Fundamentals', time: '3 days ago' },
  ],
}
