'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Users,
  Target,
  Award,
  AlertTriangle,
  BarChart3,
  TrendingDown,
  FileQuestion,
  AlertCircle,
  Megaphone,
  Calendar,
  Download,
  Flag,
  Send,
  BookOpen,
  ChevronRight,
} from 'lucide-react'
import {
  getCourseInsightsSummary,
  getLessonCompletionList,
  getTopDropOffPoints,
  getDropOffByCenter,
  getItemAnalysisSnapshot,
  getAtRiskLearners,
  LEARNER_INSIGHTS_FILTER_DEFAULTS,
  BATCH_OPTIONS,
  type LearnerInsightsFilters,
  type AtRiskLearnerRow,
  type AtRiskReason,
} from '@/lib/instructor-learner-insights-data'
import type { CraftFilter } from '@/lib/instructor-my-courses-data'

const CARD_BASE =
  'rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 shadow-sm'

function KPICard({
  title,
  value,
  sub,
  hint,
  icon: Icon,
  accent,
}: {
  title: string
  value: string | number
  sub?: string
  hint?: string
  icon: React.ElementType
  accent?: 'amber' | 'green' | 'blue'
}) {
  const accentClass =
    accent === 'amber'
      ? 'text-amber-600 dark:text-amber-400'
      : accent === 'green'
        ? 'text-green-600 dark:text-green-400'
        : accent === 'blue'
          ? 'text-primary'
          : 'text-gray-600 dark:text-gray-400'
  return (
    <div className={CARD_BASE + ' transition-shadow hover:shadow-md'}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className={`mt-1 text-2xl font-bold ${accentClass}`}>{value}</p>
          {sub != null && (
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{sub}</p>
          )}
          {hint != null && (
            <p className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-300">{hint}</p>
          )}
        </div>
        <div className={`rounded-lg p-2.5 ${accent === 'amber' ? 'bg-amber-50 dark:bg-amber-900/20' : accent === 'green' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
          <Icon className={`size-5 ${accentClass}`} />
        </div>
      </div>
    </div>
  )
}

const AT_RISK_LABELS: Record<AtRiskReason, string> = {
  inactive_14_days: 'Inactive 14+ days',
  overdue: 'Overdue',
  failed_quiz_twice: 'Failed quiz 2×',
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export default function CourseLearnerInsights({
  courseId,
  courseTitle,
}: {
  courseId: string
  courseTitle: string
}) {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [center, setCenter] = useState('')
  const [group, setGroup] = useState('')
  const [craft, setCraft] = useState<CraftFilter | ''>('')
  const [batch, setBatch] = useState('')
  const [selectedAtRisk, setSelectedAtRisk] = useState<Set<string>>(new Set())
  const [actionReminderSent, setActionReminderSent] = useState(false)
  const [actionFlagLessonId, setActionFlagLessonId] = useState<string | null>(null)

  const filters: LearnerInsightsFilters = useMemo(
    () => ({
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      center: center || undefined,
      group: group || undefined,
      craft: craft || undefined,
      batch: batch || undefined,
    }),
    [dateFrom, dateTo, center, group, craft, batch]
  )

  const summary = useMemo(
    () => getCourseInsightsSummary(courseId, filters),
    [courseId, filters]
  )
  const lessonCompletion = useMemo(
    () => getLessonCompletionList(courseId, filters),
    [courseId, filters]
  )
  const topDropOff = useMemo(() => getTopDropOffPoints(courseId, 3), [courseId])
  const dropOffByCenter = useMemo(
    () => getDropOffByCenter(courseId, filters),
    [courseId, filters]
  )
  const itemAnalysis = useMemo(() => getItemAnalysisSnapshot(courseId), [courseId])
  const atRisk = useMemo(
    () => getAtRiskLearners(courseId, filters),
    [courseId, filters]
  )

  const lowestLessons = lessonCompletion.filter((l) => l.isLowest)
  const top10Lessons = lessonCompletion.slice(0, 10)

  const toggleAtRisk = (userId: string) => {
    setSelectedAtRisk((prev) => {
      const next = new Set(prev)
      if (next.has(userId)) next.delete(userId)
      else next.add(userId)
      return next
    })
  }
  const selectAllAtRisk = () => {
    if (selectedAtRisk.size === atRisk.length) setSelectedAtRisk(new Set())
    else setSelectedAtRisk(new Set(atRisk.map((r) => r.userId)))
  }
  const handleSendReminder = () => {
    // In real app: call API to send reminder to selectedAtRisk
    setActionReminderSent(true)
    setTimeout(() => setActionReminderSent(false), 3000)
  }
  const handleFlagLesson = (lessonId: string) => {
    setActionFlagLessonId(lessonId)
    setTimeout(() => setActionFlagLessonId(null), 2000)
  }

  const completionHint = summary.completionPercent >= 70 ? 'On track' : summary.completionPercent >= 40 ? 'Needs attention' : 'Focus here'
  const dropOffHint = summary.dropOffAlert.dropOffPercent > 15 ? 'Worth reviewing this lesson' : 'Looking good'

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Learner Insights
          </h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <BookOpen className="size-4" />
            {courseTitle}
          </p>
          <p className="mt-2 max-w-xl text-sm text-gray-600 dark:text-gray-300">
            See where the course is working, who’s falling behind, and which lessons need a second look — so you can improve training effectiveness.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/dashboard/instructor/communication?course=${courseId}`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            <Megaphone className="size-4" />
            Post announcement
          </Link>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Calendar className="size-4" />
            Schedule live session
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Download className="size-4" />
            Export learner list (low completion)
          </button>
        </div>
      </header>

      {/* Filters */}
      <section className={CARD_BASE}>
        <h2 className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Refine by center, date & more
        </h2>
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">Narrow results by center, group, craft, or date range.</p>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Date from
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Date to
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Center
            </label>
            <select
              value={center}
              onChange={(e) => setCenter(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {LEARNER_INSIGHTS_FILTER_DEFAULTS.centers.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Group
            </label>
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {LEARNER_INSIGHTS_FILTER_DEFAULTS.groups.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Craft
            </label>
            <select
              value={craft}
              onChange={(e) => setCraft((e.target.value || '') as CraftFilter | '')}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {LEARNER_INSIGHTS_FILTER_DEFAULTS.crafts.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Batch / Cohort
            </label>
            <select
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {BATCH_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* A) Top Summary — 4 KPI cards */}
      <section>
        <h2 className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
          At a glance
        </h2>
        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">One look to see if this course is healthy.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Enrolled learners"
            value={summary.enrolled}
            hint={summary.enrolled > 0 ? 'Total in this course' : 'No enrollments yet'}
            icon={Users}
          />
          <KPICard
            title="Completion %"
            value={`${summary.completionPercent}%`}
            sub="Overall"
            hint={completionHint}
            icon={Target}
            accent="green"
          />
          <KPICard
            title="Avg score"
            value={summary.avgScore != null ? `${summary.avgScore}%` : '—'}
            sub="Quiz"
            hint={summary.avgScore != null && summary.avgScore >= 70 ? 'Learners are getting it' : undefined}
            icon={Award}
          />
          <KPICard
            title="Drop-off alert"
            value={summary.dropOffAlert.lessonTitle}
            sub={`${summary.dropOffAlert.dropOffPercent}% drop here`}
            hint={dropOffHint}
            icon={AlertTriangle}
            accent="amber"
          />
        </div>
      </section>

      {/* B) Module / Lesson Completion */}
      <section className={CARD_BASE}>
        <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <BarChart3 className="size-4" />
          Module / Lesson completion
        </h2>
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">Spot which steps or SOP lessons are confusing — fix those first.</p>
        {lowestLessons.length > 0 && (
          <div className="mb-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
            <span className="font-medium">Lowest completion:</span>{' '}
            {lowestLessons.map((l) => (
              <span key={l.id}>
                {l.moduleName} → {l.title} ({l.dropOffPercent}% drop-off)
                <button
                  type="button"
                  onClick={() => handleFlagLesson(l.id)}
                  className="ml-2 inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 hover:underline"
                >
                  <Flag className="size-3" />
                  {actionFlagLessonId === l.id ? 'Flagged' : 'Flag for update'}
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Top 10 lessons (completion %)
          </p>
          {top10Lessons.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 px-6 py-8 text-center">
              <BarChart3 className="mx-auto size-10 text-gray-400 dark:text-gray-500" />
              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">No lesson data yet</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Completion by lesson will appear once learners progress. Check back after some activity.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {top10Lessons.map((l) => (
                <li
                  key={l.id}
                  className={`flex items-center justify-between gap-4 rounded-lg border px-3 py-2 text-sm ${l.isLowest ? 'border-amber-300 bg-amber-50/50 dark:border-amber-600 dark:bg-amber-900/10' : 'border-gray-200 dark:border-gray-600'}`}
                >
                  <span className="min-w-0 truncate text-gray-700 dark:text-gray-300">
                    {l.moduleName}: {l.title}
                  </span>
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${l.completionPercent}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-medium text-gray-900 dark:text-gray-100">
                      {l.completionPercent}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* C) Drop-off points */}
      <section className={CARD_BASE}>
        <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <TrendingDown className="size-4" />
          Where learners stop most
        </h2>
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">Long video? Unclear step? Use this to decide what to simplify.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              Where learners stop most (Top 3)
            </p>
            {topDropOff.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No data</p>
            ) : (
              <ul className="space-y-2">
                {topDropOff.map((d, i) => (
                  <li
                    key={d.lessonId}
                    className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {i + 1}. {d.lessonTitle}
                    </span>
                    <span className="text-amber-600 dark:text-amber-400">
                      {d.dropOffPercent}% drop
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              Drop-off by center
            </p>
            {dropOffByCenter.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No data</p>
            ) : (
              <ul className="space-y-2">
                {dropOffByCenter.map((c) => (
                  <li
                    key={c.center}
                    className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm"
                  >
                    <span>{c.center}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {c.completionRate}% completion
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* D) Item analysis snapshot */}
      <section className={CARD_BASE}>
        <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <FileQuestion className="size-4" />
          Item analysis snapshot
        </h2>
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">Questions or topics learners miss — adjust lessons or wording.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              Top 5 most missed questions
            </p>
            {itemAnalysis.topMissedQuestions.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 px-4 py-6 text-center">
                <FileQuestion className="mx-auto size-8 text-gray-400 dark:text-gray-500" />
                <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">No quiz data yet</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Most missed questions will show here once learners take quizzes.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {itemAnalysis.topMissedQuestions.map((q) => (
                  <li
                    key={q.questionId}
                    className="rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm"
                  >
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {q.questionText}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {q.topicTag} · {q.missRatePercent}% miss rate
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              Weak topics
            </p>
            {itemAnalysis.weakTopics.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No data</p>
            ) : (
              <ul className="space-y-2">
                {itemAnalysis.weakTopics.map((t) => (
                  <li
                    key={t.tag}
                    className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm"
                  >
                    <span>{t.tag}</span>
                    <span className="text-amber-600 dark:text-amber-400">
                      {t.missRatePercent}% avg miss
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="mt-3 border-t border-gray-100 dark:border-gray-600 pt-3">
          <Link
            href="/dashboard/instructor/assessments?tab=item-analysis"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Open full item analysis
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* E) At-risk learners */}
      <section className={CARD_BASE}>
        <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <AlertCircle className="size-4" />
          At-risk learners
        </h2>
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
          Inactive 14+ days, overdue, or failed quiz twice. Select and send a reminder or suggest remedial — this list is gold for re-engaging.
        </p>
        {atRisk.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-green-50 dark:bg-green-900/10 px-6 py-8 text-center">
            <AlertCircle className="mx-auto size-10 text-green-500 dark:text-green-400" />
            <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">No at-risk learners right now</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Everyone in scope is on track. If you change filters, check again.</p>
          </div>
        ) : (
          <>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={selectAllAtRisk}
                className="text-xs font-medium text-primary hover:underline"
              >
                {selectedAtRisk.size === atRisk.length ? 'Deselect all' : 'Select all'}
              </button>
              <button
                type="button"
                onClick={handleSendReminder}
                disabled={selectedAtRisk.size === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
              >
                <Send className="size-3.5" />
                Send reminder ({selectedAtRisk.size})
              </button>
              {actionReminderSent && (
                <span className="text-xs text-green-600 dark:text-green-400">
                  Reminder sent.
                </span>
              )}
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="w-8 px-3 py-2 text-left">
                      <input
                        type="checkbox"
                        checked={selectedAtRisk.size === atRisk.length && atRisk.length > 0}
                        onChange={selectAllAtRisk}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                      Learner
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                      Center / Group
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                      Progress
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                      Last activity
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                      Due
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {atRisk.map((r) => (
                    <tr
                      key={r.userId}
                      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selectedAtRisk.has(r.userId)}
                          onChange={() => toggleAtRisk(r.userId)}
                          className="rounded border-gray-300 dark:border-gray-600"
                        />
                      </td>
                      <td className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">
                        {r.userName}
                      </td>
                      <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                        {r.center} / {r.group}
                      </td>
                      <td className="px-3 py-2">{r.progressPercent}%</td>
                      <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                        {formatDate(r.lastActivityAt)}
                      </td>
                      <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                        {formatDate(r.dueDate)}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1">
                          {r.reasons.map((reason) => (
                            <span
                              key={reason}
                              className="inline-flex rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                            >
                              {AT_RISK_LABELS[reason]}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
