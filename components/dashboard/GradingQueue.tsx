'use client'

import React, { useState, useMemo } from 'react'
import {
  MOCK_GRADING_ROWS,
  PRESET_FEEDBACK_COMMENTS,
  GRADING_STATUS_LABELS,
  type GradingStatus,
} from '@/lib/grading-queue-data'
import { Filter, MessageSquare, Check, RotateCcw } from 'lucide-react'

export function GradingQueue() {
  const [courseFilter, setCourseFilter] = useState('')
  const [centerFilter, setCenterFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<GradingStatus | ''>('')
  const [reviewId, setReviewId] = useState<string | null>(null)
  const [scoreDraft, setScoreDraft] = useState<Record<string, number>>({})
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({})

  const filtered = useMemo(() => {
    return MOCK_GRADING_ROWS.filter((r) => {
      if (courseFilter && !r.courseName.toLowerCase().includes(courseFilter.toLowerCase())) return false
      if (centerFilter && !r.centerName.toLowerCase().includes(centerFilter.toLowerCase())) return false
      if (statusFilter && r.status !== statusFilter) return false
      return true
    })
  }, [courseFilter, centerFilter, statusFilter])

  const pendingCount = filtered.filter((r) => r.status === 'pending').length
  const reviewRow = reviewId ? filtered.find((r) => r.id === reviewId) : null

  const handleMarkGraded = (id: string) => {
    const score = scoreDraft[id]
    const comment = commentDraft[id]
    // In real app: API call then update local state
    setReviewId(null)
  }

  return (
    <div className="min-w-0 space-y-4 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Grading Queue (Manual Review)</h1>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          Grade short answer or trainer-reviewed parts. Filter by course/path, center/group, pending/graded. Preset feedback comments for artisans.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 shadow-sm">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
          <Filter className="size-4" />
          Filters
        </h2>
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="sr-only">Course / Path</label>
            <input
              type="text"
              placeholder="Course or path"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-48 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="sr-only">Center / Group</label>
            <input
              type="text"
              placeholder="Center or group"
              value={centerFilter}
              onChange={(e) => setCenterFilter(e.target.value)}
              className="w-48 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="sr-only">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as GradingStatus | '')}
              className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="graded">Graded</option>
              <option value="recheck">Recheck</option>
            </select>
          </div>
          {pendingCount > 0 && (
            <span className="flex items-center rounded bg-amber-100 dark:bg-amber-900/40 px-2 py-1 text-xs font-medium text-amber-800 dark:text-amber-300">
              {pendingCount} pending
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Learner / Course</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Center / Group</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Question</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Answer</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Score</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-3 py-2">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{r.learnerName}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{r.courseName}{r.pathName ? ` · ${r.pathName}` : ''}</p>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">{r.centerName} / {r.groupName}</td>
                  <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{r.questionTitle}</td>
                  <td className="max-w-[200px] px-3 py-2">
                    <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{r.answerText}</p>
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                    {r.score != null ? `${r.score}/${r.maxScore}` : '—'}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex rounded px-1.5 py-0.5 text-xs font-medium ${
                        r.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300' : r.status === 'graded' ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {GRADING_STATUS_LABELS[r.status]}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    {r.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => setReviewId(r.id)}
                        className="rounded border border-primary px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
                      >
                        Review
                      </button>
                    )}
                    {r.status === 'graded' && (
                      <button
                        type="button"
                        onClick={() => setReviewId(r.id)}
                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No submissions match your filters.</div>
        )}
      </div>

      {/* Review modal / panel */}
      {reviewRow && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <MessageSquare className="size-4" />
            Review & grade
          </h3>
          <div className="space-y-3 text-sm">
            <p><span className="font-medium text-gray-500 dark:text-gray-400">Learner:</span> <span className="text-gray-900 dark:text-gray-100">{reviewRow.learnerName}</span></p>
            <p><span className="font-medium text-gray-500 dark:text-gray-400">Course:</span> <span className="text-gray-900 dark:text-gray-100">{reviewRow.courseName}{reviewRow.pathName ? ` · ${reviewRow.pathName}` : ''}</span></p>
            <p><span className="font-medium text-gray-500 dark:text-gray-400">Question:</span> <span className="text-gray-900 dark:text-gray-100">{reviewRow.questionTitle}</span></p>
            <div className="rounded bg-gray-50 dark:bg-gray-700/50 p-3">
              <span className="text-gray-500 dark:text-gray-400">Answer:</span>
              <p className="mt-1 text-gray-900 dark:text-gray-100">{reviewRow.answerText}</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-medium text-gray-700 dark:text-gray-300">Score</label>
              <input
                type="number"
                min={0}
                max={reviewRow.maxScore}
                value={scoreDraft[reviewRow.id] ?? ''}
                onChange={(e) => setScoreDraft((prev) => ({ ...prev, [reviewRow.id]: Number(e.target.value) }))}
                className="w-20 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-gray-900 dark:text-gray-100"
              />
              <span className="text-gray-500 dark:text-gray-400">/ {reviewRow.maxScore}</span>
            </div>
            <div>
              <label className="mb-1 block font-medium text-gray-700 dark:text-gray-300">Feedback comment (preset or custom)</label>
              <select
                value=""
                onChange={(e) => e.target.value && setCommentDraft((prev) => ({ ...prev, [reviewRow.id]: e.target.value }))}
                className="mb-2 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100"
              >
                <option value="">Choose preset...</option>
                {PRESET_FEEDBACK_COMMENTS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <textarea
                placeholder="Or write custom feedback"
                value={commentDraft[reviewRow.id] ?? ''}
                onChange={(e) => setCommentDraft((prev) => ({ ...prev, [reviewRow.id]: e.target.value }))}
                rows={2}
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleMarkGraded(reviewRow.id)}
                className="inline-flex items-center gap-1 rounded-lg border border-transparent bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90"
              >
                <Check className="size-4" />
                Mark graded
              </button>
              <button
                type="button"
                onClick={() => setReviewId(null)}
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg border border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 text-sm font-medium text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50"
              >
                <RotateCcw className="size-4" />
                Send for recheck
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
