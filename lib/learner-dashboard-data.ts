/**
 * Mock data for Learner (Student) dashboard — Aarong-friendly.
 * Replace with real API calls later.
 */

export const BADGE_SET = [
  { id: 'on-time-learner', label: 'On-time Learner', labelBn: 'সময়মতো শেখা', icon: '⏱️', tagline: 'You finished before the due date!', taglineBn: 'আপনি নির্ধারিত তারিখের আগেই শেষ করেছেন!' },
  { id: 'consistency', label: 'Consistency', labelBn: 'নিয়মিততা', icon: '🔥', tagline: 'Learning streak unlocked!', taglineBn: 'শেখার ধারা আনলক হয়েছে!' },
  { id: 'safety-ready', label: 'Safety Ready', labelBn: 'নিরাপত্তা প্রস্তুত', icon: '🛡️', tagline: 'Safety course completed!', taglineBn: 'নিরাপত্তা কোর্স সম্পন্ন!' },
  { id: 'quality-first', label: 'Quality First', labelBn: 'গুণগত মান প্রথম', icon: '✨', tagline: 'Quality SOP path completed!', taglineBn: 'কোয়ালিটি এসওপি পাথ সম্পন্ন!' },
  { id: 'skill-level-1', label: 'Skill Level 1', labelBn: 'স্কিল লেভেল ১', icon: '📌', tagline: 'First craft path completed!', taglineBn: 'প্রথম ক্রাফট পাথ সম্পন্ন!' },
  { id: 'perfect-score', label: 'Perfect Score', labelBn: 'পারফেক্ট স্কোর', icon: '💯', tagline: 'You aced the quiz!', taglineBn: 'কুইজে পুরো নম্বর পেয়েছেন!' },
  { id: 'attendance-star', label: 'Attendance Star', labelBn: 'অ্যাটেনডেন্স স্টার', icon: '⭐', tagline: 'Great attendance at live sessions!', taglineBn: 'লাইভ সেশনে দারুণ উপস্থিতি!' },
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
    titleBn: 'কর্মক্ষেত্র নিরাপত্তা বুনিয়াদ',
    progress: 65,
    nextItem: 'Module 4: Fire Safety',
    nextItemBn: 'মডিউল ৪: অগ্নি নিরাপত্তা',
    href: '/dashboard/learner/course/c1',
  },

  /** Due soon — 2–4 items, compact */
  dueSoon: [
    { id: '1', title: 'Workplace Safety Essentials', titleBn: 'কর্মক্ষেত্র নিরাপত্তা বুনিয়াদ', dueDate: 'Feb 22', dueDateBn: '২২ ফেব্রু', dueDateRaw: '2025-02-22', href: '/dashboard/learner/course/c1' },
    { id: '2', title: 'Data Privacy Basics', titleBn: 'ডেটা গোপনীয়তা বুনিয়াদ', dueDate: 'Feb 25', dueDateBn: '২৫ ফেব্রু', dueDateRaw: '2025-02-25', href: '/dashboard/learner/course/c2' },
  ],

  /** My Progress — this week & overall */
  myProgress: {
    lessonsThisWeek: 3,
    completionPercent: 42,
    timeSpentMinutes: 85,
  },

  /** Latest 1–2 announcements */
  announcements: [
    { id: '1', title: 'New course: Quality SOP path added', titleBn: 'নতুন কোর্স: কোয়ালিটি এসওপি পাথ যুক্ত হয়েছে', time: 'Today', timeBn: 'আজ', href: '#' },
    { id: '2', title: 'Weekly live session this Friday', titleBn: 'এই শুক্রবার সাপ্তাহিক লাইভ সেশন', time: '2 hours ago', timeBn: '২ ঘণ্টা আগে', href: '#' },
  ],

  /** Earned badge IDs (top 3 shown) + locked teaser */
  badgesEarned: ['safety-ready', 'quality-first'] as BadgeId[],
  /** One locked badge teaser */
  lockedBadgeTeaser: {
    badgeId: 'on-time-learner' as BadgeId,
    message: "Complete 1 more lesson to unlock the 'On-time Learner' badge",
    messageBn: "আরও ১টি লেসন সম্পন্ন করলে 'সময়মতো শেখা' ব্যাজ আনলক হবে",
  },

  /** Streak — soft tone */
  streak: {
    currentDays: 3,
    nextMilestoneDays: 4,
    nextMilestoneBadgeLabel: 'Consistency',
    nextMilestoneBadgeLabelBn: 'নিয়মিততা',
  },

  /** Certificates */
  certificates: {
    total: 2,
    latest: { id: 'cert1', name: 'Safety Fundamentals', nameBn: 'নিরাপত্তা বুনিয়াদ', downloadHref: '#' },
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
