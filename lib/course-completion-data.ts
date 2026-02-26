/**
 * Mock data for Course Completion report.
 * Replace with real API calls later.
 */

export type CourseSummaryRow = {
  id: string
  name: string
  enrolled: number
  completed: number
  inProgress: number
  notStarted: number
  dropoutPercent: number
  avgProgress: number
}

export type ModuleLessonRow = {
  id: string
  name: string
  type: 'module' | 'lesson'
  reached: number
  completed: number
  dropOff: number
  dropOffPercent: number
}

export type CourseDetail = {
  courseId: string
  courseName: string
  modules: {
    id: string
    name: string
    lessons: ModuleLessonRow[]
  }[]
}

export const COURSE_COMPLETION = {
  courses: [
    { value: '', label: 'All courses' },
    { value: 'c1', label: 'Workplace Safety Essentials' },
    { value: 'c2', label: 'Data Privacy Basics' },
    { value: 'c3', label: 'Fire Safety Fundamentals' },
  ],
  departments: [
    { value: '', label: 'All departments' },
    { value: 'hr', label: 'HR' },
    { value: 'operations', label: 'Operations' },
    { value: 'it', label: 'IT' },
  ],
  locations: [
    { value: '', label: 'All locations' },
    { value: 'dhaka', label: 'Dhaka HQ' },
    { value: 'ctg', label: 'Chittagong' },
    { value: 'remote', label: 'Remote' },
  ],
  summary: [
    { id: 'c1', name: 'Workplace Safety Essentials', enrolled: 245, completed: 178, inProgress: 42, notStarted: 25, dropoutPercent: 12, avgProgress: 82 },
    { id: 'c2', name: 'Data Privacy Basics', enrolled: 189, completed: 102, inProgress: 53, notStarted: 34, dropoutPercent: 23, avgProgress: 61 },
    { id: 'c3', name: 'Fire Safety Fundamentals', enrolled: 156, completed: 134, inProgress: 18, notStarted: 4, dropoutPercent: 5, avgProgress: 89 },
  ] as CourseSummaryRow[],
  dropOffByLesson: [
    { step: 'Intro', reached: 245, completed: 230, dropped: 15 },
    { step: 'Module 1', reached: 230, completed: 210, dropped: 20 },
    { step: 'Module 2', reached: 210, completed: 195, dropped: 15 },
    { step: 'Module 3', reached: 195, completed: 185, dropped: 10 },
    { step: 'Module 4: Fire Safety', reached: 185, completed: 160, dropped: 25 },
    { step: 'Assessment', reached: 160, completed: 145, dropped: 15 },
    { step: 'Complete', reached: 145, completed: 145, dropped: 0 },
  ],
  details: [
    {
      courseId: 'c1',
      courseName: 'Workplace Safety Essentials',
      modules: [
        {
          id: 'm1',
          name: 'Module 1: Introduction',
          lessons: [
            { id: 'l1', name: 'Overview', type: 'lesson', reached: 245, completed: 240, dropOff: 5, dropOffPercent: 2 },
            { id: 'l2', name: 'Policy Review', type: 'lesson', reached: 240, completed: 225, dropOff: 15, dropOffPercent: 6 },
          ],
        },
        {
          id: 'm2',
          name: 'Module 2: Hazards',
          lessons: [
            { id: 'l3', name: 'Chemical Hazards', type: 'lesson', reached: 225, completed: 210, dropOff: 15, dropOffPercent: 7 },
            { id: 'l4', name: 'Physical Hazards', type: 'lesson', reached: 210, completed: 198, dropOff: 12, dropOffPercent: 6 },
          ],
        },
        {
          id: 'm3',
          name: 'Module 4: Fire Safety',
          lessons: [
            { id: 'l5', name: 'Fire Safety', type: 'lesson', reached: 198, completed: 175, dropOff: 23, dropOffPercent: 12 },
            { id: 'l6', name: 'Evacuation', type: 'lesson', reached: 175, completed: 168, dropOff: 7, dropOffPercent: 4 },
          ],
        },
      ],
    },
    {
      courseId: 'c2',
      courseName: 'Data Privacy Basics',
      modules: [
        {
          id: 'm4',
          name: 'Module 1: GDPR',
          lessons: [
            { id: 'l7', name: 'Key Principles', type: 'lesson', reached: 189, completed: 170, dropOff: 19, dropOffPercent: 10 },
            { id: 'l8', name: 'Rights', type: 'lesson', reached: 170, completed: 145, dropOff: 25, dropOffPercent: 15 },
          ],
        },
        {
          id: 'm5',
          name: 'Module 2: Handling Data',
          lessons: [
            { id: 'l9', name: 'Storage', type: 'lesson', reached: 145, completed: 120, dropOff: 25, dropOffPercent: 17 },
          ],
        },
      ],
    },
  ] as CourseDetail[],
}
