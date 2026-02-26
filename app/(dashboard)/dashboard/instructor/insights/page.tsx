import React from 'react'
import { COURSES } from '@/lib/courses-data'
import { getInsightsCourseOptions } from '@/lib/instructor-learner-insights-data'
import CourseLearnerInsights from '@/components/dashboard/instructor/insights/CourseLearnerInsights'
import InsightsPageClient from './InsightsPageClient'

type Props = {
  searchParams: Promise<{ course?: string }>
}

export default async function InsightsPage({ searchParams }: Props) {
  const params = await searchParams
  const courseId = params.course ?? ''
  const course = courseId ? COURSES.find((c) => c.id === courseId) : null
  const courseTitle = course?.title ?? ''

  if (!courseId || !course) {
    return (
      <div className="min-w-0 space-y-6 overflow-x-hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Learner Insights
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select a course to view completion, drop-off, at-risk learners, and item analysis.
          </p>
        </div>
        <InsightsPageClient />
      </div>
    )
  }

  return (
    <CourseLearnerInsights courseId={courseId} courseTitle={courseTitle} />
  )
}
