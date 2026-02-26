/**
 * Course Templates — repeatable patterns for Safety, SOP, Skill.
 * Auto-generate module structure + placeholder lessons; standard quiz template attach.
 * Outcome: ~50% less time to create new courses.
 */

export type TemplateType = 'safety' | 'sop' | 'skill'

export type TemplateRow = {
  id: string
  name: string
  templateType: TemplateType
  description: string
  defaultModules: string[]
  placeholderLessonCount: number
  quizTemplateAttached: boolean
  quizTemplateId: string
  usedCount: number
  lastUsedAt: string
}

export const TEMPLATES: TemplateRow[] = [
  {
    id: 't1',
    name: 'Safety Course Template',
    templateType: 'safety',
    description: 'Intro, hazard awareness, procedures, emergency, assessment',
    defaultModules: ['Introduction', 'Hazard awareness', 'Procedures', 'Emergency response', 'Assessment'],
    placeholderLessonCount: 8,
    quizTemplateAttached: true,
    quizTemplateId: 'quiz-safety',
    usedCount: 12,
    lastUsedAt: '2025-02-20T10:00:00Z',
  },
  {
    id: 't2',
    name: 'SOP Template',
    templateType: 'sop',
    description: 'Purpose, steps, checklist, sign-off',
    defaultModules: ['Purpose & scope', 'Step-by-step procedure', 'Checklist', 'Sign-off'],
    placeholderLessonCount: 6,
    quizTemplateAttached: true,
    quizTemplateId: 'quiz-sop',
    usedCount: 24,
    lastUsedAt: '2025-02-22T14:00:00Z',
  },
  {
    id: 't3',
    name: 'Skill Training Template',
    templateType: 'skill',
    description: 'Overview, demonstration, practice, evaluation',
    defaultModules: ['Overview', 'Demonstration', 'Guided practice', 'Evaluation'],
    placeholderLessonCount: 5,
    quizTemplateAttached: true,
    quizTemplateId: 'quiz-skill',
    usedCount: 8,
    lastUsedAt: '2025-02-18T09:00:00Z',
  },
]

export const TEMPLATE_TYPE_LABELS: Record<TemplateType, string> = {
  safety: 'Safety template',
  sop: 'SOP template',
  skill: 'Skill template',
}
