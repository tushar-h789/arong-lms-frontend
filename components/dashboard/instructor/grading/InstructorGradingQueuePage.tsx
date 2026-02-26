'use client'

import React, { useState, useMemo } from 'react'
import {
  getGradingSummary,
  getInstructorGradingQueue,
  getInstructorCoursesForGrading,
  ASSESSMENT_TYPE_OPTIONS,
  GRADING_STATUS_OPTIONS,
  GRADING_STATUS_LABELS,
  PRESET_FEEDBACK_COMMENTS,
  PRESET_COMMENT_CHIPS,
  RUBRIC_CRITERIA,
  CENTERS,
  GROUPS,
  type InstructorGradingRow,
  type GradingQueueStatus,
  type AssessmentTypeFilter,
} from '@/lib/instructor-grading-data'
import {
  ClipboardList,
  CheckCircle2,
  RotateCcw,
  AlertTriangle,
  Filter,
  Check,
  X,
  ExternalLink,
  Image as ImageIcon,
} from 'lucide-react'

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function InstructorGradingQueuePage() {
  const courses = getInstructorCoursesForGrading()
  const [courseId, setCourseId] = useState('')
  const [assessmentType, setAssessmentType] = useState<AssessmentTypeFilter>('all')
  const [statusFilter, setStatusFilter] = useState<GradingQueueStatus | ''>('')
  const [centerFilter, setCenterFilter] = useState('')
  const [groupFilter, setGroupFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [reviewId, setReviewId] = useState<string | null>(null)
  const [scoreDraft, setScoreDraft] = useState<Record<string, number>>({})
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({})
  const [rubricDraft, setRubricDraft] = useState<Record<string, Record<string, boolean>>>({})
  const [recheckReason, setRecheckReason] = useState('')
  const [confirmGradedOpen, setConfirmGradedOpen] = useState(false)
  const [recheckPanelOpen, setRecheckPanelOpen] = useState(false)
  const [autoAdvanceNext, setAutoAdvanceNext] = useState(true)
  const [showFilters, setShowFilters] = useState(true)

  const summary = useMemo(
    () =>
      getGradingSummary({
        courseId: courseId || undefined,
        centerName: centerFilter || undefined,
        groupName: groupFilter || undefined,
      }),
    [courseId, centerFilter, groupFilter]
  )

  const queue = useMemo(
    () =>
      getInstructorGradingQueue({
        courseId: courseId || undefined,
        assessmentType,
        status: statusFilter,
        centerName: centerFilter || undefined,
        groupName: groupFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      }),
    [courseId, assessmentType, statusFilter, centerFilter, groupFilter, dateFrom, dateTo]
  )

  const reviewRow = reviewId ? queue.find((r) => r.id === reviewId) : null
  const pendingAfterCurrent = reviewId ? queue.filter((r) => r.status === 'pending' && r.id !== reviewId) : []
  const nextPendingId = pendingAfterCurrent[0]?.id ?? null

  const handleConfirmMarkGraded = (submissionId: string) => {
    void submissionId // In real app: use scoreDraft[submissionId], commentDraft[submissionId]; API call + audit log
    setConfirmGradedOpen(false)
    setReviewId(null)
    if (autoAdvanceNext && nextPendingId) setReviewId(nextPendingId)
  }

  const handleRecheckSubmit = (submissionId: string) => {
    if (!recheckReason.trim()) return
    void submissionId // In real app: API call, status → recheck_requested, reason in audit
    setRecheckPanelOpen(false)
    setRecheckReason('')
    setReviewId(null)
    if (autoAdvanceNext && nextPendingId) setReviewId(nextPendingId)
  }

  const setRubricCriterion = (rowId: string, criterionId: string, value: boolean) => {
    setRubricDraft((prev) => ({
      ...prev,
      [rowId]: { ...(prev[rowId] ?? {}), [criterionId]: value },
    }))
  }

  return (
    <div className="min-w-0 space-y-4 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Grading Queue</h1>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          Review pending submissions for your courses. Short answer and practical checklist verification. One-click review, rubric/comment, mark graded or request recheck.
        </p>
      </div>

      {/* Top summary */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Pending"
          value={summary.pending}
          icon={ClipboardList}
          className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20"
        />
        <SummaryCard
          label="Graded today"
          value={summary.gradedToday}
          icon={CheckCircle2}
          className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/20"
        />
        <SummaryCard
          label="Recheck requested"
          value={summary.recheckRequested}
          icon={RotateCcw}
          className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20"
        />
        <SummaryCard
          label="Overdue grading"
          value={summary.overdue}
          icon={AlertTriangle}
          className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20"
        />
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 shadow-sm">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex w-full items-center justify-between gap-2 text-left"
        >
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
            <Filter className="size-4" />
            Filters
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">{showFilters ? 'Hide' : 'Show'}</span>
        </button>
        {showFilters && (
          <div className="mt-3 grid gap-3 border-t border-gray-200 dark:border-gray-600 pt-3 sm:grid-cols-2 lg:grid-cols-6">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Course (own)</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">All courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Assessment type</label>
              <select
                value={assessmentType}
                onChange={(e) => setAssessmentType(e.target.value as AssessmentTypeFilter)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {ASSESSMENT_TYPE_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as GradingQueueStatus | '')}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {GRADING_STATUS_OPTIONS.map((o) => (
                  <option key={o.id || '_'} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Center</label>
              <select
                value={centerFilter}
                onChange={(e) => setCenterFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">All</option>
                {CENTERS.filter((c) => c !== 'All Centers').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Group</label>
              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">All</option>
                {GROUPS.filter((g) => g !== 'All Groups').map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">From (submission)</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Queue table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Learner</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Center / Group</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Course / Quiz</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Submitted</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Attempt #</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {queue.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">{r.learnerName}</td>
                  <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                    {r.centerName} / {r.groupName}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{r.courseName}</span>
                    <span className="text-gray-500 dark:text-gray-400"> · {r.quizName}</span>
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">{formatDateTime(r.submittedAt)}</td>
                  <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">#{r.attemptNumber}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex rounded px-1.5 py-0.5 text-xs font-medium ${
                        r.status === 'pending'
                          ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                          : r.status === 'in_review'
                            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300'
                            : r.status === 'graded'
                              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                              : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {GRADING_STATUS_LABELS[r.status]}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => setReviewId(r.id)}
                      className="rounded border border-primary px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {queue.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No submissions match your filters.</div>
        )}
      </div>

      {/* Auto-advance option */}
      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <input
          type="checkbox"
          checked={autoAdvanceNext}
          onChange={(e) => setAutoAdvanceNext(e.target.checked)}
          className="rounded text-primary"
        />
        Auto-open next pending after grading (one-click flow)
      </label>

      {/* Review side panel */}
      {reviewRow && (
        <ReviewSidePanel
          row={reviewRow}
          scoreDraft={scoreDraft[reviewRow.id]}
          commentDraft={commentDraft[reviewRow.id]}
          rubricDraft={rubricDraft[reviewRow.id]}
          onScoreChange={(v) => setScoreDraft((prev) => ({ ...prev, [reviewRow.id]: v }))}
          onCommentChange={(v) => setCommentDraft((prev) => ({ ...prev, [reviewRow.id]: v }))}
          onRubricChange={(criterionId, value) => setRubricCriterion(reviewRow.id, criterionId, value)}
          onMarkGraded={() => setConfirmGradedOpen(true)}
          onRecheckClick={() => setRecheckPanelOpen(true)}
          onClose={() => {
            setReviewId(null)
            setRecheckPanelOpen(false)
            setRecheckReason('')
          }}
          recheckPanelOpen={recheckPanelOpen}
          recheckReason={recheckReason}
          onRecheckReasonChange={setRecheckReason}
          onRecheckSubmit={() => handleRecheckSubmit(reviewRow.id)}
          onRecheckCancel={() => setRecheckPanelOpen(false)}
        />
      )}

      {/* Confirm finalize grade modal */}
      {confirmGradedOpen && reviewRow && (
        <ConfirmGradedModal
          onConfirm={() => handleConfirmMarkGraded(reviewRow.id)}
          onCancel={() => setConfirmGradedOpen(false)}
        />
      )}
    </div>
  )
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string
  value: number
  icon: React.ElementType
  className?: string
}) {
  return (
    <div className={`rounded-xl border p-4 ${className ?? 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'}`}>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">{value}</p>
        <Icon className="size-8 text-gray-400 dark:text-gray-500" />
      </div>
      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  )
}

function ConfirmGradedModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-graded-title">
      <div className="fixed inset-0 bg-black/50" aria-hidden onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 shadow-xl">
        <h3 id="confirm-graded-title" className="font-semibold text-gray-900 dark:text-gray-100">
          Finalize grade?
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          গ্রেড ফাইনাল করবেন? (Grade will be saved and learner will see feedback.)
        </p>
        <div className="mt-4 flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Yes, finalize
          </button>
        </div>
      </div>
    </div>
  )
}

function ReviewSidePanel({
  row,
  scoreDraft,
  commentDraft,
  rubricDraft,
  onScoreChange,
  onCommentChange,
  onRubricChange,
  onMarkGraded,
  onRecheckClick,
  onClose,
  recheckPanelOpen,
  recheckReason,
  onRecheckReasonChange,
  onRecheckSubmit,
  onRecheckCancel,
}: {
  row: InstructorGradingRow
  scoreDraft: number | undefined
  commentDraft: string | undefined
  rubricDraft: Record<string, boolean> | undefined
  onScoreChange: (v: number) => void
  onCommentChange: (v: string) => void
  onRubricChange: (criterionId: string, value: boolean) => void
  onMarkGraded: () => void
  onRecheckClick: () => void
  onClose: () => void
  recheckPanelOpen: boolean
  recheckReason: string
  onRecheckReasonChange: (v: string) => void
  onRecheckSubmit: () => void
  onRecheckCancel: () => void
}) {
  const score = scoreDraft ?? row.score ?? ''
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" aria-hidden onClick={onClose} />
      <aside
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl"
        aria-label="Review submission"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 dark:border-gray-600 px-4 py-3">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Review & grade</h2>
          <button type="button" onClick={onClose} className="rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Close">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
          {/* Learner + course + submission context */}
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Submission context</h3>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3 space-y-1.5">
              <p><span className="text-gray-500 dark:text-gray-400">Learner:</span> <span className="font-medium text-gray-900 dark:text-gray-100">{row.learnerName}</span></p>
              <p><span className="text-gray-500 dark:text-gray-400">Center / Group:</span> <span className="text-gray-900 dark:text-gray-100">{row.centerName} / {row.groupName}</span></p>
              <p><span className="text-gray-500 dark:text-gray-400">Course / Quiz:</span> <span className="text-gray-900 dark:text-gray-100">{row.courseName} · {row.quizName}</span></p>
              <p><span className="text-gray-500 dark:text-gray-400">Submitted:</span> <span className="text-gray-900 dark:text-gray-100">{formatDateTime(row.submittedAt)}</span></p>
              <p><span className="text-gray-500 dark:text-gray-400">Attempt:</span> <span className="text-gray-900 dark:text-gray-100">#{row.attemptNumber}</span></p>
              <p><span className="text-gray-500 dark:text-gray-400">Type:</span> <span className="text-gray-900 dark:text-gray-100">{row.assessmentType === 'short_answer' ? 'Short Answer' : 'Practical checklist verification'}</span></p>
            </div>
          </section>

          {/* Answer / proof */}
          {row.assessmentType === 'short_answer' && row.answerText && (
            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Answer</h3>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
                <p className="text-gray-900 dark:text-gray-100">{row.answerText}</p>
              </div>
            </section>
          )}

          {row.assessmentType === 'practical_checklist' && (
            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Checklist</h3>
              <ul className="space-y-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
                {row.checklistItems?.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    {item.verified ? <CheckCircle2 className="size-4 text-emerald-600 shrink-0" /> : <span className="size-4 rounded border border-amber-500 shrink-0" />}
                    <span>{item.label}</span>
                    {item.note && <span className="text-xs text-amber-600">({item.note})</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(row.proofImageUrls?.length ?? 0) > 0 && (
            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Uploaded proof (photo)</h3>
              <div className="flex flex-wrap gap-2">
                {row.proofImageUrls?.map((url, i) => (
                  <div key={i} className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                    <ImageIcon className="size-10 text-gray-400 dark:text-gray-500" aria-hidden />
                  </div>
                ))}
              </div>
            </section>
          )}

          {row.relatedLessonLink && (
            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Related lesson</h3>
              <a
                href={row.relatedLessonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:underline"
              >
                <ExternalLink className="size-4" />
                {row.relatedLessonLabel ?? 'Open lesson'}
              </a>
            </section>
          )}

          {/* Rubric / criteria */}
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Rubric / criteria</h3>
            <div className="space-y-2">
              {RUBRIC_CRITERIA.map((c) => (
                <label key={c.id} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rubricDraft?.[c.id] ?? false}
                    onChange={(e) => onRubricChange(c.id, e.target.checked)}
                    className="rounded text-primary"
                  />
                  <span className="text-gray-900 dark:text-gray-100">{c.label}</span>
                </label>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <label className="font-medium text-gray-700 dark:text-gray-300">Score</label>
              <input
                type="number"
                min={0}
                max={row.maxScore}
                value={score}
                onChange={(e) => onScoreChange(Number(e.target.value))}
                className="w-20 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-gray-900 dark:text-gray-100"
              />
              <span className="text-gray-500 dark:text-gray-400">/ {row.maxScore}</span>
            </div>
          </section>

          {/* Comments: Bangla-friendly chips + custom */}
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Comments</h3>
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Quick chips (Bangla-friendly) or custom:</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {PRESET_COMMENT_CHIPS.map((chip) => (
                <button
                  key={chip.text}
                  type="button"
                  onClick={() => onCommentChange(commentDraft === chip.text ? '' : chip.text)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    commentDraft === chip.text
                      ? 'bg-primary text-white'
                      : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
            <select
              value=""
              onChange={(e) => e.target.value && onCommentChange(e.target.value)}
              className="mb-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
            >
              <option value="">English presets...</option>
              {PRESET_FEEDBACK_COMMENTS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <textarea
              placeholder="Custom comment (optional)"
              value={commentDraft ?? ''}
              onChange={(e) => onCommentChange(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </section>

          {/* Recheck: reason required */}
          {recheckPanelOpen && (
            <section className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20 p-3">
              <h3 className="mb-2 text-sm font-semibold text-amber-800 dark:text-amber-200">Request recheck / Reopen grading</h3>
              <p className="mb-2 text-xs text-amber-700 dark:text-amber-300">Reason note required (audit trail).</p>
              <textarea
                placeholder="Reason for recheck..."
                value={recheckReason}
                onChange={(e) => onRecheckReasonChange(e.target.value)}
                rows={2}
                className="mb-2 w-full rounded-lg border border-amber-300 dark:border-amber-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button type="button" onClick={onRecheckSubmit} disabled={!recheckReason.trim()} className="rounded-lg border border-amber-600 bg-amber-100 dark:bg-amber-900/40 px-3 py-1.5 text-sm font-medium text-amber-800 dark:text-amber-200 disabled:opacity-50">
                  Submit recheck
                </button>
                <button type="button" onClick={onRecheckCancel} className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
                  Cancel
                </button>
              </div>
            </section>
          )}

          {/* Actions */}
          <section className="border-t border-gray-200 dark:border-gray-600 pt-4 flex flex-wrap gap-2">
            <button type="button" onClick={onMarkGraded} className="inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
              <Check className="size-4" />
              Mark as graded
            </button>
            <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Cancel
            </button>
            {!recheckPanelOpen && (
              <button type="button" onClick={onRecheckClick} className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/30 px-4 py-2 text-sm font-medium text-amber-800 dark:text-amber-300">
                <RotateCcw className="size-4" />
                Request recheck
              </button>
            )}
          </section>
        </div>
        <p className="shrink-0 border-t border-gray-200 dark:border-gray-600 px-4 py-2 text-xs text-gray-400 dark:text-gray-500">
          All grading actions are logged (who graded, when) for audit. Optional: use Ctrl+Enter to submit grade.
        </p>
      </aside>
    </>
  )
}
