/**
 * Types and constants for Course Builder (Create/Edit).
 * Aarong-use-case: Artisan/Staff/Trainer, skill category, micro-lessons, SOP-style, localized content, job-aid, attendance, version note.
 */

import type { CourseType } from './courses-data'

// —— Tab A: Overview ——
export type AudienceType = 'artisan' | 'staff' | 'trainer'
export type SkillCategory = 'weaving' | 'embroidery' | 'dyeing' | 'finishing'
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

export type OverviewForm = {
  title: string
  shortDescriptionBn: string
  thumbnailUrl: string
  tags: CourseType[]
  audienceType: AudienceType
  skillCategory: SkillCategory
  difficultyLevel: DifficultyLevel
  estimatedMinutes: number | ''
}

export const AUDIENCE_OPTIONS: { value: AudienceType; label: string }[] = [
  { value: 'artisan', label: 'Artisan' },
  { value: 'staff', label: 'Staff' },
  { value: 'trainer', label: 'Trainer' },
]

export const SKILL_CATEGORY_OPTIONS: { value: SkillCategory; label: string }[] = [
  { value: 'weaving', label: 'Weaving' },
  { value: 'embroidery', label: 'Embroidery' },
  { value: 'dyeing', label: 'Dyeing' },
  { value: 'finishing', label: 'Finishing' },
]

export const DIFFICULTY_OPTIONS: { value: DifficultyLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

// —— Tab B: Curriculum ——
export type CurriculumLesson = {
  id: string
  title: string
  order: number
  required: boolean
  isMicroLesson: boolean
  durationMinutes: number // 1–3 for micro-lessons
}

export type CurriculumModule = {
  id: string
  title: string
  order: number
  lessons: CurriculumLesson[]
}

export type CurriculumForm = {
  modules: CurriculumModule[]
}

// —— Tab C: Lesson Editor (per-lesson) ——
export type LessonAsset = {
  id: string
  type: 'video' | 'pdf' | 'ppt' | 'image'
  url: string
  name?: string
}

export type LessonContentForm = {
  assets: LessonAsset[]
  resourceLinks: { url: string; label: string }[]
  notesKeyPoints: string
  stepByStepImageUrls: string[] // SOP-style step images
  voiceOverUrl: string // Localized audio
  jobAidPdfUrl: string // Checklist/to-do 1-page PDF
}

// —— Tab D: Assessments ——
export type AssessmentsForm = {
  quizId: string
  passMarks: number
  maxAttempts: number
  feedbackRules: string
  practicalChecklistEvaluation: boolean // Trainer tick-box
}

// —— Tab E: Rules ——
export type RulesForm = {
  completionCriteria: string
  prerequisiteCourseIds: string[]
  retakePolicy: string
  attendanceRequired: boolean // Physical/live class mandatory
  minimumWatchPercent: number // Video must be fully watched
}

// —— Tab F: Publish ——
export type PublishForm = {
  scheduleStart: string
  scheduleEnd: string
  publishPermissions: string
  versionNote: string // What changed — so old learners are not confused when SOP changes
}

// —— Full builder state ——
export type CourseBuilderState = {
  overview: OverviewForm
  curriculum: CurriculumForm
  lessonContents: Record<string, LessonContentForm> // lessonId -> content
  assessments: AssessmentsForm
  rules: RulesForm
  publish: PublishForm
}

export const defaultOverview: OverviewForm = {
  title: '',
  shortDescriptionBn: '',
  thumbnailUrl: '',
  tags: [],
  audienceType: 'artisan',
  skillCategory: 'weaving',
  difficultyLevel: 'beginner',
  estimatedMinutes: '',
}

export const defaultCurriculum: CurriculumForm = {
  modules: [],
}

export const defaultLessonContent: LessonContentForm = {
  assets: [],
  resourceLinks: [],
  notesKeyPoints: '',
  stepByStepImageUrls: [],
  voiceOverUrl: '',
  jobAidPdfUrl: '',
}

export const defaultAssessments: AssessmentsForm = {
  quizId: '',
  passMarks: 70,
  maxAttempts: 3,
  feedbackRules: '',
  practicalChecklistEvaluation: false,
}

export const defaultRules: RulesForm = {
  completionCriteria: '',
  prerequisiteCourseIds: [],
  retakePolicy: '',
  attendanceRequired: false,
  minimumWatchPercent: 0,
}

export const defaultPublish: PublishForm = {
  scheduleStart: '',
  scheduleEnd: '',
  publishPermissions: '',
  versionNote: '',
}

export function createDefaultBuilderState(): CourseBuilderState {
  return {
    overview: { ...defaultOverview },
    curriculum: { ...defaultCurriculum },
    lessonContents: {},
    assessments: { ...defaultAssessments },
    rules: { ...defaultRules },
    publish: { ...defaultPublish },
  }
}
