'use client'

import React, { useState } from 'react'
import {
  FEEDBACK_EVALUATION,
  type CourseRatingRow,
  type QuickSurveyRow,
  type TrainerRatingRow,
  type CenterSatisfactionRow,
  type CommentTheme,
} from '@/lib/feedback-evaluation-data'
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react'

type Tab = 'course' | 'survey' | 'trainer' | 'center' | 'themes'

export function FeedbackEvaluationReport() {
  const [tab, setTab] = useState<Tab>('course')

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="break-words text-2xl font-bold text-gray-900 dark:text-gray-100">
            Training Feedback & Evaluation
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Content language/format effectiveness — whether it&apos;s working for rural/artisan learners
          </p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="border-b border-gray-200 dark:border-gray-600">
        <nav className="-mb-px flex flex-wrap gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => setTab('course')}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${tab === 'course'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            Course Rating
          </button>
          <button
            type="button"
            onClick={() => setTab('survey')}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${tab === 'survey'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            Quick Survey
          </button>
          <button
            type="button"
            onClick={() => setTab('themes')}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${tab === 'themes'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            Comment Themes
          </button>
          <button
            type="button"
            onClick={() => setTab('trainer')}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${tab === 'trainer'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            Trainer Rating
          </button>
          <button
            type="button"
            onClick={() => setTab('center')}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${tab === 'center'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            Center-wise Satisfaction
          </button>
        </nav>
      </div>

      {/* Content */}
      {tab === 'course' && (
        <div className="space-y-6">
          <CourseRatingSection rows={FEEDBACK_EVALUATION.courseRatings} />
        </div>
      )}
      {tab === 'survey' && (
        <QuickSurveySection rows={FEEDBACK_EVALUATION.quickSurvey} />
      )}
      {tab === 'themes' && (
        <CommentThemesSection themes={FEEDBACK_EVALUATION.commentThemes} />
      )}
      {tab === 'trainer' && (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
          <TrainerRatingTable rows={FEEDBACK_EVALUATION.trainerRatings} />
        </div>
      )}
      {tab === 'center' && (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
          <CenterSatisfactionTable rows={FEEDBACK_EVALUATION.centerSatisfaction} />
        </div>
      )}
    </div>
  )
}

function CourseRatingSection({ rows }: { rows: CourseRatingRow[] }) {
  return (
    <div className="space-y-6">
      {rows.map((row) => (
        <div
          key={row.id}
          className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 shadow-sm"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{row.courseName}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {row.totalResponses} responses
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Star className="size-5 fill-amber-400 text-amber-400" />
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {row.avgRating.toFixed(1)}
                </span>
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">/ 5</span>
            </div>
          </div>
          <div className="mt-4 flex items-end gap-1">
            {[1, 2, 3, 4, 5].map((r) => {
              const count = row[`rating${r}` as keyof CourseRatingRow] as number
              const pct = (count / row.totalResponses) * 100
              return (
                <div key={r} className="flex flex-1 flex-col items-center gap-1">
                  <div className="relative h-24 w-full overflow-hidden rounded-t bg-gray-100 dark:bg-gray-700">
                    <div
                      className="absolute bottom-0 w-full rounded-t bg-primary/70 transition-all"
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{r}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function QuickSurveySection({ rows }: { rows: QuickSurveyRow[] }) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        &quot;Was it easy to understand?&quot; &quot;Was the video clear?&quot; — Quick survey results
      </p>
      {rows.map((row) => (
        <div
          key={row.id}
          className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 shadow-sm"
        >
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{row.question}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {row.totalResponses} responses
          </p>
          <div className="mt-4 flex gap-4">
            <div className="flex items-center gap-2">
              <ThumbsUp className="size-5 text-green-600 dark:text-green-400" />
              <span className="font-medium text-green-700 dark:text-green-300">{row.yesPercent}% Yes</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsDown className="size-5 text-red-600 dark:text-red-400" />
              <span className="font-medium text-red-700 dark:text-red-300">{row.noPercent}% No</span>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{row.neutralPercent}% Neutral</span>
            </div>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
            <div className="flex h-full">
              <div
                className="bg-green-500"
                style={{ width: `${row.yesPercent}%` }}
              />
              <div
                className="bg-red-500"
                style={{ width: `${row.noPercent}%` }}
              />
              <div
                className="bg-gray-400 dark:bg-gray-500"
                style={{ width: `${row.neutralPercent}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function CommentThemesSection({ themes }: { themes: CommentTheme[] }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Comment themes (basic)</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Common themes from learner feedback
      </p>
      <ul className="mt-4 space-y-2">
        {themes.map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between rounded-lg border border-gray-100 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50 px-4 py-3"
          >
            <span className="text-gray-900 dark:text-gray-100">{t.theme}</span>
            <span className="rounded-full bg-primary/10 px-3 py-0.5 text-sm font-medium text-primary">
              {t.count} mentions
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const thClasses = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'
const colClasses = 'px-4 py-3 text-sm text-gray-900 dark:text-gray-100'

function TrainerRatingTable({ rows }: { rows: TrainerRatingRow[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>Trainer</th>
          <th className={thClasses}>Course</th>
          <th className={thClasses}>Center</th>
          <th className={thClasses}>Rating (1–5)</th>
          <th className={thClasses}>Responses</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className={colClasses}>
              <span className="font-medium text-gray-900 dark:text-gray-100">{row.trainerName}</span>
            </td>
            <td className={colClasses}>{row.courseName}</td>
            <td className={colClasses}>{row.center}</td>
            <td className={colClasses}>
              <span className="flex items-center gap-1">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{row.avgRating.toFixed(1)}</span>
              </span>
            </td>
            <td className={colClasses}>{row.totalResponses}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function CenterSatisfactionTable({ rows }: { rows: CenterSatisfactionRow[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>Center</th>
          <th className={thClasses}>Avg Satisfaction</th>
          <th className={thClasses}>Responses</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className={colClasses}>
              <span className="font-medium text-gray-900 dark:text-gray-100">{row.center}</span>
            </td>
            <td className={colClasses}>
              <span className="flex items-center gap-1">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{row.avgSatisfaction.toFixed(1)}</span>
                <span className="text-gray-500 dark:text-gray-400">/ 5</span>
              </span>
            </td>
            <td className={colClasses}>{row.totalResponses}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
