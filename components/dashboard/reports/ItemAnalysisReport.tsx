'use client'

import React, { useState } from 'react'
import {
  ITEM_ANALYSIS,
  type QuestionRow,
  type TopicBreakdownRow,
} from '@/lib/item-analysis-data'
import { Download, Flag, MoreVertical } from 'lucide-react'

export function ItemAnalysisReport() {
  const [assessmentFilter, setAssessmentFilter] = useState('')
  const [needsReview, setNeedsReview] = useState<Record<string, boolean>>({})
  const [openActionRow, setOpenActionRow] = useState<string | null>(null)

  const toggleNeedsReview = (questionId: string) => {
    setNeedsReview((prev) => ({ ...prev, [questionId]: !prev[questionId] }))
    setOpenActionRow(null)
  }

  const getNeedsReview = (q: QuestionRow) => needsReview[q.id] ?? q.needsReview ?? false

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="break-words text-2xl font-bold text-gray-900 dark:text-gray-100">
            Item Analysis
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Question analytics — where learners struggle, topic gaps
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Download className="size-4" />
          Export
        </button>
      </div>

      {/* Assessment filter */}
      <div>
        <label htmlFor="assessment-filter" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Assessment
        </label>
        <select
          id="assessment-filter"
          value={assessmentFilter}
          onChange={(e) => setAssessmentFilter(e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {ITEM_ANALYSIS.assessments.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      {/* Question table */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Question table
        </h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Question
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Topic
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Correct %
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Most missed
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Difficulty
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Attempts
                  </th>
                  <th className="px-4 py-3" scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
                {ITEM_ANALYSIS.questions.map((q) => (
                  <QuestionRow
                    key={q.id}
                    row={q}
                    needsReview={getNeedsReview(q)}
                    onToggleNeedsReview={() => toggleNeedsReview(q.id)}
                    isActionOpen={openActionRow === q.id}
                    onActionToggle={() =>
                      setOpenActionRow(openActionRow === q.id ? null : q.id)
                    }
                    onActionClose={() => setOpenActionRow(null)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Topic breakdown */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Topic breakdown — strength / weakness
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEM_ANALYSIS.topicBreakdown.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </div>
    </div>
  )
}

const colClasses = 'px-4 py-3 text-sm text-gray-900 dark:text-gray-100'

function QuestionRow({
  row,
  needsReview,
  onToggleNeedsReview,
  isActionOpen,
  onActionToggle,
  onActionClose,
}: {
  row: QuestionRow
  needsReview: boolean
  onToggleNeedsReview: () => void
  isActionOpen: boolean
  onActionToggle: () => void
  onActionClose: () => void
}) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="max-w-xs px-4 py-3">
        <span className="line-clamp-2 text-sm text-gray-900 dark:text-gray-100">{row.questionText}</span>
      </td>
      <td className={colClasses}>{row.topic}</td>
      <td className={colClasses}>
        <span
          className={
            row.correctPercent >= 70
              ? 'font-medium text-green-600 dark:text-green-400'
              : row.correctPercent < 50
                ? 'font-medium text-red-600 dark:text-red-400'
                : ''
          }
        >
          {row.correctPercent}%
        </span>
      </td>
      <td className={colClasses}>
        {row.mostMissed ? (
          <span className="inline-flex rounded-full bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-300">
            Most missed
          </span>
        ) : (
          <span className="text-gray-400 dark:text-gray-500">—</span>
        )}
      </td>
      <td className={colClasses}>
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            row.difficulty === 'easy'
              ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300'
              : row.difficulty === 'medium'
                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300'
          }`}
        >
          {row.difficulty}
        </span>
      </td>
      <td className={colClasses}>{row.attempts}</td>
      <td className="relative px-4 py-3">
        <div className="flex items-center gap-2">
          {needsReview && (
            <span className="inline-flex items-center gap-1 rounded bg-amber-50 dark:bg-amber-900/30 px-2 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
              <Flag className="size-3" />
              Needs review
            </span>
          )}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onActionToggle()
              }}
              className="rounded p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Actions"
            >
              <MoreVertical className="size-4" />
            </button>
            {isActionOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  aria-hidden
                  onClick={(e) => {
                    e.stopPropagation()
                    onActionClose()
                  }}
                />
                <div
                  className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 py-1 shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onToggleNeedsReview()
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Flag className="size-4" />
                    {needsReview ? 'Remove needs review' : 'Mark needs review'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  )
}

function TopicCard({ topic }: { topic: TopicBreakdownRow }) {
  return (
    <div
      className={`rounded-xl border p-4 shadow-sm ${
        topic.strength
          ? 'border-green-200 dark:border-green-700/50 bg-green-50/50 dark:bg-green-900/20'
          : 'border-amber-200 dark:border-amber-700/50 bg-amber-50/50 dark:bg-amber-900/20'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{topic.topic}</h3>
          <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
            {topic.avgCorrect}%
          </p>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {topic.questionCount} questions · {topic.attemptedCount} attempted
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            topic.strength
              ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300'
              : 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
          }`}
        >
          {topic.strength ? 'Strength' : 'Weakness'}
        </span>
      </div>
    </div>
  )
}
