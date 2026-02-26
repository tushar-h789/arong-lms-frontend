'use client'

import React from 'react'
import Link from 'next/link'
import { BookOpen, ChevronRight } from 'lucide-react'
import { getInsightsCourseOptions } from '@/lib/instructor-learner-insights-data'

export default function InsightsPageClient() {
  const options = getInsightsCourseOptions().filter((o) => o.value !== '')
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6">
      <p className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
        Select a course to view learner insights
      </p>
      <ul className="space-y-2">
        {options.map((c) => (
          <li key={c.value}>
            <Link
              href={`/dashboard/instructor/insights?course=${c.value}`}
              className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="size-4 text-gray-500 dark:text-gray-400" />
                {c.label}
              </span>
              <ChevronRight className="size-4 text-gray-400" />
            </Link>
          </li>
        ))}
      </ul>
      {options.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No published courses available.
        </p>
      )}
    </div>
  )
}
