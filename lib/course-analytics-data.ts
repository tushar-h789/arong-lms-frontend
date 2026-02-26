/**
 * Course Analytics (Content Performance) — quick view from Course & Content.
 * Completion rate by module/lesson, drop-off, avg time, quiz score trend, center-wise.
 */

export type CourseAnalyticsRow = {
  courseId: string
  courseTitle: string
  completionRate: number
  dropOffLessonId: string
  dropOffLessonTitle: string
  dropOffRate: number
  avgTimeSpentMinutes: number
  quizScoreTrend: 'up' | 'down' | 'stable'
  quizAvgScore: number
  centerWise: { center: string; completionRate: number }[]
}

export const COURSE_ANALYTICS: CourseAnalyticsRow[] = [
  {
    courseId: 'c1',
    courseTitle: 'Fire Safety at Workplace',
    completionRate: 78,
    dropOffLessonId: 'les-3',
    dropOffLessonTitle: 'Emergency response',
    dropOffRate: 22,
    avgTimeSpentMinutes: 42,
    quizScoreTrend: 'up',
    quizAvgScore: 82,
    centerWise: [
      { center: 'Dhaka HQ', completionRate: 85 },
      { center: 'Chittagong', completionRate: 72 },
      { center: 'Field Center 1', completionRate: 71 },
    ],
  },
  {
    courseId: 'c2',
    courseTitle: 'Standard Operating Procedure: Dyeing',
    completionRate: 65,
    dropOffLessonId: 'les-2',
    dropOffLessonTitle: 'Step-by-step procedure',
    dropOffRate: 35,
    avgTimeSpentMinutes: 38,
    quizScoreTrend: 'stable',
    quizAvgScore: 75,
    centerWise: [
      { center: 'Chittagong', completionRate: 70 },
      { center: 'Dhaka HQ', completionRate: 62 },
    ],
  },
]
