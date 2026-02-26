/**
 * Course Player — data shapes and mock course for learner lesson view.
 * Replace with API later.
 */

export type LessonType = 'video' | 'sop' | 'text' | 'pdf'

export interface LessonBase {
  id: string
  type: LessonType
  title: string
  completed?: boolean
}

export interface VideoLesson extends LessonBase {
  type: 'video'
  videoUrl?: string // optional for mock; use placeholder
  posterUrl?: string
  keyPoints: string[]
  minWatchPercent?: number // enable "Mark complete" after this % (e.g. 80)
  durationSeconds?: number
}

export interface SopStep {
  imageUrl: string
  instruction: string
}

export interface SopLesson extends LessonBase {
  type: 'sop'
  steps: SopStep[]
}

export interface TextLesson extends LessonBase {
  type: 'text'
  content: string
  keyPoints: string[]
}

export interface PdfLesson extends LessonBase {
  type: 'pdf'
  fileUrl: string
  fileName: string
}

export type Lesson = VideoLesson | SopLesson | TextLesson | PdfLesson

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

export interface CourseResource {
  id: string
  title: string
  type: 'pdf' | 'image'
  url: string
  isJobAid?: boolean
}

export interface CoursePlayerData {
  id: string
  title: string
  shortTitle: string
  totalLessons: number
  completedLessons: number
  modules: Module[]
  resources: CourseResource[]
}

/** Flat list of all lessons with module ref for nav */
export function getFlatLessons(course: CoursePlayerData): { lesson: Lesson; module: Module; index: number; globalIndex: number }[] {
  let globalIndex = 0
  const out: { lesson: Lesson; module: Module; index: number; globalIndex: number }[] = []
  for (const module of course.modules) {
    module.lessons.forEach((lesson, index) => {
      out.push({ lesson, module, index, globalIndex })
      globalIndex++
    })
  }
  return out
}

export function getLessonAt(course: CoursePlayerData, globalIndex: number): { lesson: Lesson; module: Module } | null {
  const flat = getFlatLessons(course)
  const item = flat[globalIndex]
  return item ? { lesson: item.lesson, module: item.module } : null
}

/** Mock course for Workplace Safety (c1) */
export const MOCK_COURSE_C1: CoursePlayerData = {
  id: 'c1',
  title: 'Workplace Safety Essentials',
  shortTitle: 'Safety Essentials',
  totalLessons: 7,
  completedLessons: 4,
  modules: [
    {
      id: 'm1',
      title: 'Introduction',
      lessons: [
        {
          id: 'm1-l1',
          type: 'video',
          title: 'Welcome & overview',
          completed: true,
          keyPoints: ['Safety is everyone\'s responsibility.', 'Report hazards to your supervisor.'],
          minWatchPercent: 80,
          durationSeconds: 120,
        },
        {
          id: 'm1-l2',
          type: 'text',
          title: 'Key policies',
          completed: true,
          content: 'Always wear PPE in marked areas. Keep exits clear. Know your emergency assembly point.',
          keyPoints: ['PPE required in marked zones.', 'Exits must stay clear.'],
        },
      ],
    },
    {
      id: 'm2',
      title: 'Fire Safety',
      lessons: [
        {
          id: 'm2-l1',
          type: 'sop',
          title: 'Using a fire extinguisher',
          completed: true,
          steps: [
            { imageUrl: '/placeholder-sop-1.svg', instruction: 'Pull the pin and hold upright.' },
            { imageUrl: '/placeholder-sop-2.svg', instruction: 'Aim at the base of the fire.' },
            { imageUrl: '/placeholder-sop-3.svg', instruction: 'Squeeze the lever and sweep.' },
          ],
        },
        {
          id: 'm2-l2',
          type: 'video',
          title: 'Evacuation drill',
          completed: true,
          keyPoints: ['Follow exit signs.', 'Assemble at the designated point.'],
          minWatchPercent: 90,
          durationSeconds: 180,
        },
        {
          id: 'm2-l3',
          type: 'sop',
          title: 'Daily fire check',
          completed: false,
          steps: [
            { imageUrl: '/placeholder-sop-1.svg', instruction: 'Check extinguisher is in place and seal intact.' },
            { imageUrl: '/placeholder-sop-2.svg', instruction: 'Ensure exit path is clear.' },
          ],
        },
      ],
    },
    {
      id: 'm3',
      title: 'Module 4: Fire Safety',
      lessons: [
        {
          id: 'm3-l1',
          type: 'video',
          title: 'Fire Safety in practice',
          completed: false,
          keyPoints: ['Prevention first.', 'Know your role in an emergency.'],
          minWatchPercent: 80,
          durationSeconds: 150,
        },
        {
          id: 'm3-l2',
          type: 'pdf',
          title: 'Fire safety checklist',
          completed: false,
          fileUrl: '#',
          fileName: 'fire-safety-checklist.pdf',
        },
      ],
    },
  ],
  resources: [
    { id: 'r1', title: 'Safety Job Aid', type: 'pdf', url: '#', isJobAid: true },
    { id: 'r2', title: 'Fire extinguisher checklist', type: 'pdf', url: '#', isJobAid: true },
    { id: 'r3', title: 'PPE guide', type: 'pdf', url: '#' },
  ],
}

const COURSES: Record<string, CoursePlayerData> = {
  c1: MOCK_COURSE_C1,
}

export function getCoursePlayerData(courseId: string): CoursePlayerData | null {
  return COURSES[courseId] ?? null
}
