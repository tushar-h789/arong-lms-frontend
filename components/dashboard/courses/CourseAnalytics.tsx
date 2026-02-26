'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  COURSE_ANALYTICS,
  type CourseAnalyticsRow,
} from '@/lib/course-analytics-data'
import { BarChart3, TrendingUp, TrendingDown, Minus, Clock, AlertCircle, Target } from 'lucide-react'

export function CourseAnalytics() {
  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Course Analytics (Content Performance)</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Which courses work, which drop — improve content. Quick view; full reports in Reports.
          </p>
        </div>
        <Link
          href="/dashboard/admin/reports/course-completion"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <BarChart3 className="size-4" />
          Full report: Course Completion
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COURSE_ANALYTICS.map((row) => (
          <AnalyticsCard key={row.courseId} row={row} />
        ))}
      </div>
    </div>
  )
}

function AnalyticsCard({ row }: { row: CourseAnalyticsRow }) {
  const TrendIcon = row.quizScoreTrend === 'up' ? TrendingUp : row.quizScoreTrend === 'down' ? TrendingDown : Minus
  const trendColor = row.quizScoreTrend === 'up' ? 'text-green-600 dark:text-green-400' : row.quizScoreTrend === 'down' ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 shadow-sm">
      <h2 className="font-semibold text-gray-900 dark:text-gray-100">{row.courseTitle}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Target className="size-4 text-gray-400 dark:text-gray-500" />
          <span>Completion</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{row.completionRate}%</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Clock className="size-4 text-gray-400 dark:text-gray-500" />
          <span>Avg time</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{row.avgTimeSpentMinutes} min</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <AlertCircle className="size-4 text-amber-500 dark:text-amber-400" />
          <span>Drop-off</span>
          <span className="font-medium text-amber-700 dark:text-amber-400">{row.dropOffRate}%</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <TrendIcon className={`size-4 ${trendColor}`} />
          <span>Quiz avg</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{row.quizAvgScore}%</span>
        </div>
      </div>
      <div className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
        Drop-off lesson: {row.dropOffLessonTitle}
      </div>
      <div className="mt-3 border-t border-gray-100 dark:border-gray-600 pt-3">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Center-wise completion</p>
        <ul className="mt-1 space-y-1">
          {row.centerWise.map((c) => (
            <li key={c.center} className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>{c.center}</span>
              <span className="font-medium text-gray-900 dark:text-gray-200">{c.completionRate}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
