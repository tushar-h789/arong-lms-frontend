'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Users,
  BarChart3,
  PenLine,
  ChevronRight,
  ListTodo,
  MessageSquare,
  Calendar,
  Video,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  UserX,
  ExternalLink,
  ClipboardCheck,
} from 'lucide-react'
import {
  getInstructorKPIs,
  getInstructorToDo,
  getCourseHealthTable,
  getUnansweredQuestions,
  getUpcomingLiveSessionsThisWeek,
  getAtRiskLearners,
  type ToDoItem,
  type CourseHealthRow,
} from '@/lib/instructor-overview-data'

const CARD_BASE =
  'rounded-2xl border border-gray-200/80 bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.06)] transition-all duration-200 dark:border-gray-600 dark:bg-gray-800'

function KPICard({
  title,
  value,
  sub,
  href,
  actionLabel,
  icon: Icon,
}: {
  title: string
  value: string | number
  sub?: string
  href: string
  actionLabel: string
  icon: React.ElementType
}) {
  return (
    <div className={`${CARD_BASE} p-5 hover:shadow-md dark:hover:shadow-lg`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Icon className="size-5" />
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">{value}</p>
            <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{title}</p>
            {sub != null && sub !== '' && (
              <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{sub}</p>
            )}
          </div>
        </div>
      </div>
      <Link
        href={href}
        className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
      >
        {actionLabel}
        <ChevronRight className="size-4" />
      </Link>
    </div>
  )
}

function ToDoCard({ item }: { item: ToDoItem }) {
  const icon =
    item.type === 'grading' ? PenLine : item.type === 'qa' ? MessageSquare : item.type === 'live' ? Video : Calendar
  const Icon = icon
  return (
    <div className={`${CARD_BASE} flex flex-col gap-3 p-5 hover:shadow-md dark:hover:shadow-lg sm:flex-row sm:items-center sm:justify-between`}>
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {item.label}
            {item.count != null && item.count > 0 && (
              <span className="ml-1.5 font-bold tabular-nums text-primary">({item.count})</span>
            )}
          </p>
        </div>
      </div>
      <Link
        href={item.href}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
      >
        {item.actionLabel}
      </Link>
    </div>
  )
}

function CourseHealthTable({ rows }: { rows: CourseHealthRow[] }) {
  return (
    <div className={`overflow-hidden ${CARD_BASE}`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/50">
              <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Course</th>
              <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Active</th>
              <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Completion %</th>
              <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Drop-off lesson</th>
              <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Avg score</th>
              <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Alerts</th>
              <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.courseId}
                className="border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{row.courseName}</td>
                <td className="px-4 py-3 tabular-nums text-gray-600 dark:text-gray-400">{row.activeLearners}</td>
                <td className="px-4 py-3 tabular-nums text-gray-600 dark:text-gray-400">{row.completionPercent}%</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{row.dropOffLesson ?? '—'}</td>
                <td className="px-4 py-3 tabular-nums text-gray-600 dark:text-gray-400">{row.avgScore}%</td>
                <td className="px-4 py-3">
                  {row.alert === 'red' && (
                    <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400" title="Needs attention">
                      <AlertCircle className="size-4" />
                    </span>
                  )}
                  {row.alert === 'amber' && (
                    <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400" title="Watch">
                      <AlertTriangle className="size-4" />
                    </span>
                  )}
                  {row.alert === null && '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/dashboard/instructor/my-courses?course=${row.courseId}`}
                      className="text-primary hover:underline"
                    >
                      Open
                    </Link>
                    <Link
                      href={`/dashboard/instructor/communication?course=${row.courseId}`}
                      className="text-gray-600 hover:underline dark:text-gray-400"
                    >
                      Announce
                    </Link>
                    <Link
                      href={`/dashboard/instructor/insights?course=${row.courseId}`}
                      className="text-gray-600 hover:underline dark:text-gray-400"
                    >
                      Insights
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function InstructorOverview() {
  const kpis = useMemo(() => getInstructorKPIs(), [])
  const toDoList = useMemo(() => getInstructorToDo(), [])
  const courseHealth = useMemo(() => getCourseHealthTable(), [])
  const unansweredQa = useMemo(() => getUnansweredQuestions(5), [])
  const upcomingLive = useMemo(() => getUpcomingLiveSessionsThisWeek(), [])
  const atRisk = useMemo(() => getAtRiskLearners(5), [])

  return (
    <div className="w-full space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
          Instructor Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Today&apos;s tasks, course health & grading — at a glance.
        </p>
      </header>

      {/* 1) Quick KPIs */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="My Courses"
          value={`${kpis.myCoursesActive} / ${kpis.myCoursesDraft}`}
          sub="Active / Draft"
          href="/dashboard/instructor/my-courses"
          actionLabel="View all courses"
          icon={BookOpen}
        />
        <KPICard
          title="Active Learners (This week)"
          value={kpis.activeLearnersThisWeek}
          href="/dashboard/instructor/insights"
          actionLabel="View learners"
          icon={Users}
        />
        <KPICard
          title="Avg Score"
          value={`${kpis.avgScoreLast7}%`}
          sub="Last 7 days (30d: 74%)"
          href="/dashboard/instructor/assessments"
          actionLabel="View assessment results"
          icon={BarChart3}
        />
        <KPICard
          title="Pending Grading"
          value={kpis.pendingGrading}
          href="/dashboard/instructor/grading"
          actionLabel="Go to grading queue"
          icon={PenLine}
        />
      </section>

      {/* 2) To-Do */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          <ListTodo className="size-4" />
          To-Do
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {toDoList.map((item) => (
            <ToDoCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* 3) Course Health Table */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          <Sparkles className="size-4" />
          Course Health
        </h2>
        <CourseHealthTable rows={courseHealth} />
      </section>

      {/* 4) Questions Inbox (Unanswered Q&A) — square-style cards */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          <HelpCircle className="size-4" />
          Questions Inbox (Unanswered)
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {unansweredQa.length === 0 ? (
            <p className={`col-span-full ${CARD_BASE} py-10 text-center text-sm text-gray-500 dark:text-gray-400`}>
              No unanswered questions.
            </p>
          ) : (
            unansweredQa.map((q) => (
              <div
                key={q.id}
                className={`${CARD_BASE} flex min-h-[160px] flex-col p-5 hover:shadow-md dark:hover:shadow-lg`}
              >
                <p className="line-clamp-3 text-sm leading-snug font-medium text-gray-900 dark:text-gray-100">{q.question}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                    {q.tag}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{q.age}</span>
                  <span className="truncate text-xs text-gray-500 dark:text-gray-400">{q.courseName}</span>
                </div>
                <Link
                  href={q.replyHref}
                  className="mt-auto pt-4 block text-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                >
                  Reply
                </Link>
              </div>
            ))
          )}
        </div>
        {unansweredQa.length > 0 && (
          <Link
            href="/dashboard/instructor/communication"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            View all Q&A <ChevronRight className="size-4" />
          </Link>
        )}
      </section>

      {/* 5) Upcoming Live Sessions (This week) */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          <Video className="size-4" />
          Upcoming Live Sessions (This week)
        </h2>
        <div className="space-y-3">
          {upcomingLive.length === 0 ? (
            <p className={`${CARD_BASE} py-10 text-center text-sm text-gray-500 dark:text-gray-400`}>
              No upcoming sessions this week.
            </p>
          ) : (
            upcomingLive.map((s) => (
              <div
                key={s.id}
                className={`${CARD_BASE} flex flex-col gap-4 p-5 hover:shadow-md dark:hover:shadow-lg sm:flex-row sm:items-center sm:justify-between`}
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{s.title}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {s.dateTimeLabel} · {s.targetLabel}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={s.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                  >
                    Join ({s.platform}) <ExternalLink className="size-3.5" />
                  </a>
                  {s.canMarkAttendance && (
                    <Link
                      href={`/dashboard/instructor/communication?session=${s.id}&attendance=1`}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                      <ClipboardCheck className="size-3.5" /> Mark attendance
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 6) At-Risk Learners — square-style cards */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          <UserX className="size-4" />
          At-Risk Learners
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {atRisk.length === 0 ? (
            <p className={`col-span-full ${CARD_BASE} py-10 text-center text-sm text-gray-500 dark:text-gray-400`}>
              No at-risk learners.
            </p>
          ) : (
            atRisk.map((r) => (
              <div
                key={r.id}
                className={`${CARD_BASE} flex min-h-[140px] flex-col border-l-4 border-l-amber-500/80 p-5 hover:shadow-md dark:hover:shadow-lg`}
              >
                <p className="font-semibold text-gray-900 dark:text-gray-100">{r.learnerName}</p>
                <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-amber-600 dark:text-amber-400">{r.reasonLabel}</span>
                  {' · '}{r.courseOrContent}
                </p>
                <Link
                  href={r.sendReminderHref}
                  className="mt-auto pt-4 block text-center rounded-xl bg-amber-100 px-4 py-2.5 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:hover:bg-amber-900/50"
                >
                  Send reminder
                </Link>
              </div>
            ))
          )}
        </div>
        {atRisk.length > 0 && (
          <Link
            href="/dashboard/instructor/insights"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            View all <ChevronRight className="size-4" />
          </Link>
        )}
      </section>
    </div>
  )
}
