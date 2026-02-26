/**
 * Instructor My Courses — list with search, filters, sort, quick actions.
 * Replace with API later.
 */

import { COURSES, type CourseRow, type CourseStatus } from '@/lib/courses-data'
import { COURSE_ANALYTICS } from '@/lib/course-analytics-data'
import { ASSIGNMENT_MONITOR_ROWS } from '@/lib/assignment-monitor-data'

export type CraftFilter = 'weaving' | 'embroidery' | 'dyeing' | 'finishing'

const GROUP_TO_CRAFT: Record<string, CraftFilter> = {
  'Weaving A': 'weaving',
  'Weaving B': 'weaving',
  'Embroidery A': 'embroidery',
  'Embroidery B': 'embroidery',
  'Dyeing C': 'dyeing',
}

function getCraftsForCourse(course: CourseRow): CraftFilter[] {
  const crafts = new Set<CraftFilter>()
  course.visibilityGroups.forEach((g) => {
    const c = GROUP_TO_CRAFT[g]
    if (c) crafts.add(c)
  })
  if (crafts.size === 0) return ['weaving']
  return Array.from(crafts)
}

export type InstructorCourseItem = {
  id: string
  title: string
  status: CourseStatus
  category: string
  courseType: string
  crafts: CraftFilter[]
  activeLearners: number
  completionPercent: number
  updatedAt: string
  createdAt: string
}

export type MyCoursesSort = 'recently_updated' | 'most_active' | 'lowest_completion'

const analyticsByCourseId = new Map(COURSE_ANALYTICS.map((a) => [a.courseId, a]))

function getActiveLearnersForCourse(courseId: string): number {
  return ASSIGNMENT_MONITOR_ROWS.filter(
    (r) => r.contentId === courseId && (r.status === 'in_progress' || r.status === 'assigned')
  ).length
}

export function getInstructorCourseList(
  opts: {
    search?: string
    status?: CourseStatus | 'all'
    category?: string | 'all'
    craft?: CraftFilter | 'all'
    sort?: MyCoursesSort
  } = {}
): InstructorCourseItem[] {
  const { search = '', status = 'all', category = 'all', craft = 'all', sort = 'recently_updated' } = opts
  const q = search.trim().toLowerCase()
  let list: InstructorCourseItem[] = COURSES.map((c) => {
    const analytics = analyticsByCourseId.get(c.id)
    const activeLearners = getActiveLearnersForCourse(c.id)
    const completionPercent = analytics?.completionRate ?? 0
    const updatedAt = c.createdAt
    return {
      id: c.id,
      title: c.title,
      status: c.status,
      category: c.category,
      courseType: c.courseType,
      crafts: getCraftsForCourse(c),
      activeLearners,
      completionPercent,
      updatedAt,
      createdAt: c.createdAt,
    }
  })
  if (q) list = list.filter((c) => c.title.toLowerCase().includes(q))
  if (status !== 'all') list = list.filter((c) => c.status === status)
  if (category !== 'all') list = list.filter((c) => c.category === category)
  if (craft !== 'all') list = list.filter((c) => c.crafts.includes(craft))
  if (sort === 'recently_updated') list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  if (sort === 'most_active') list.sort((a, b) => b.activeLearners - a.activeLearners)
  if (sort === 'lowest_completion') list.sort((a, b) => a.completionPercent - b.completionPercent)
  return list
}

export const CRAFT_LABELS: Record<CraftFilter, string> = {
  weaving: 'Weaving',
  embroidery: 'Embroidery',
  dyeing: 'Dyeing',
  finishing: 'Finishing',
}

export const SORT_OPTIONS: { value: MyCoursesSort; label: string }[] = [
  { value: 'recently_updated', label: 'Recently updated' },
  { value: 'most_active', label: 'Most active learners' },
  { value: 'lowest_completion', label: 'Lowest completion (attention needed)' },
]
