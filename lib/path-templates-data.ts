/**
 * Path Templates — one-click creation of paths Aarong uses repeatedly.
 * Auto step structure + placeholder content. HR can rollout quickly.
 */

export type PathTemplateRow = {
  id: string
  name: string
  description: string
  durationLabel: string
  defaultSteps: { title: string; stepType: 'course' | 'assessment' | 'live_session' | 'practical_checklist' }[]
  usedCount: number
  lastUsedAt: string
}

export const PATH_TEMPLATES: PathTemplateRow[] = [
  {
    id: 'pt1',
    name: 'New Artisan Onboarding (7 days)',
    description: 'Orientation, safety, tools, quality basics, hands-on assessment. Standard 7-day rollout.',
    durationLabel: '7 days',
    defaultSteps: [
      { title: 'Day 1: Orientation & Welcome', stepType: 'course' },
      { title: 'Day 2: Safety Essentials', stepType: 'course' },
      { title: 'Day 3: Tool & Equipment Basics', stepType: 'course' },
      { title: 'Day 4: Quality Standards Intro', stepType: 'course' },
      { title: 'Day 5: Live Practice Session', stepType: 'live_session' },
      { title: 'Day 6: Practical Checklist (Field)', stepType: 'practical_checklist' },
      { title: 'Day 7: Assessment & Sign-off', stepType: 'assessment' },
    ],
    usedCount: 18,
    lastUsedAt: '2025-02-20T10:00:00Z',
  },
  {
    id: 'pt2',
    name: 'Quality SOP Refresher (Monthly)',
    description: 'Monthly refresh of quality SOP. Short modules + quiz.',
    durationLabel: 'Monthly',
    defaultSteps: [
      { title: 'SOP Overview (Video)', stepType: 'course' },
      { title: 'Checklist Review', stepType: 'course' },
      { title: 'Refresher Quiz', stepType: 'assessment' },
    ],
    usedCount: 12,
    lastUsedAt: '2025-02-15T09:00:00Z',
  },
  {
    id: 'pt3',
    name: 'Safety & Compliance Mandatory',
    description: 'Mandatory safety and compliance path. Fire safety, data privacy, labor standards.',
    durationLabel: '~2 weeks',
    defaultSteps: [
      { title: 'Workplace Safety Essentials', stepType: 'course' },
      { title: 'Fire Safety Certification', stepType: 'course' },
      { title: 'Fire Drill (Live)', stepType: 'live_session' },
      { title: 'Data Privacy Basics', stepType: 'course' },
      { title: 'Compliance Assessment', stepType: 'assessment' },
    ],
    usedCount: 8,
    lastUsedAt: '2025-02-10T14:00:00Z',
  },
  {
    id: 'pt4',
    name: 'Skill Ladder Level 1 → Level 2',
    description: 'Upgrade path from Level 1 to Level 2. Craft-specific modules + trainer verification.',
    durationLabel: '4–6 weeks',
    defaultSteps: [
      { title: 'Level 2 Overview', stepType: 'course' },
      { title: 'Advanced Techniques (Video)', stepType: 'course' },
      { title: 'Guided Practice (Live)', stepType: 'live_session' },
      { title: 'Practical Checklist (Field)', stepType: 'practical_checklist' },
      { title: 'Skill Check Assessment', stepType: 'assessment' },
    ],
    usedCount: 6,
    lastUsedAt: '2025-02-18T11:00:00Z',
  },
]
