'use client'

import React, { useState, useMemo } from 'react'
import {
  COURSE_COMPLETION,
  type CourseSummaryRow,
} from '@/lib/course-completion-data'
import {
  Download,
  BarChart3,
  ChevronDown,
  ChevronRight,
  GitCompare,
} from 'lucide-react'

type Tab = 'summary' | 'detailed'

export function CourseCompletionReport() {
  const [tab, setTab] = useState<Tab>('summary')
  const [courseFilter, setCourseFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [compareMode, setCompareMode] = useState(false)
  const [compareCourses, setCompareCourses] = useState<string[]>([])
  const [expandedModule, setExpandedModule] = useState<string | null>(null)
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState('c1')

  const filteredSummary = useMemo(() => {
    let rows = COURSE_COMPLETION.summary
    if (courseFilter) rows = rows.filter((r) => r.id === courseFilter)
    return rows
  }, [courseFilter])

  const selectedDetail = useMemo(
    () => COURSE_COMPLETION.details.find((d) => d.courseId === selectedCourseForDetail),
    [selectedCourseForDetail]
  )

  const dropOffData = useMemo(
    () =>
      selectedDetail
        ? (() => {
            const flat: { step: string; reached: number; completed: number; dropped: number }[] = []
            selectedDetail.modules.forEach((mod) => {
              mod.lessons.forEach((l) => {
                flat.push({
                  step: `${mod.name}: ${l.name}`,
                  reached: l.reached,
                  completed: l.completed,
                  dropped: l.dropOff,
                })
              })
            })
            return flat
          })()
        : COURSE_COMPLETION.dropOffByLesson,
    [selectedDetail]
  )

  const toggleCompare = (courseId: string) => {
    setCompareCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : prev.length < 3
          ? [...prev, courseId]
          : prev
    )
  }

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="break-words text-2xl font-bold text-gray-900 dark:text-gray-100">
            Course Completion
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Which courses are completed, where learners drop off
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCompareMode(!compareMode)}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
              compareMode
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <GitCompare className="size-4" />
            Compare courses
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Download className="size-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4">
        <div>
          <label htmlFor="course-filter" className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            Course
          </label>
          <select
            id="course-filter"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {COURSE_COMPLETION.courses.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date-from" className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            Date from
          </label>
          <input
            id="date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="date-to" className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            Date to
          </label>
          <input
            id="date-to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="dept-filter" className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            Department
          </label>
          <select
            id="dept-filter"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {COURSE_COMPLETION.departments.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="location-filter" className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            Location
          </label>
          <select
            id="location-filter"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {COURSE_COMPLETION.locations.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="border-b border-gray-200 dark:border-gray-600">
        <nav className="-mb-px flex gap-6">
          <button
            type="button"
            onClick={() => setTab('summary')}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${
              tab === 'summary'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Summary
          </button>
          <button
            type="button"
            onClick={() => setTab('detailed')}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${
              tab === 'detailed'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Detailed (module/lesson)
          </button>
        </nav>
      </div>

      {tab === 'summary' && (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
            <SummaryTable
              rows={filteredSummary}
              compareMode={compareMode}
              compareCourses={compareCourses}
              onToggleCompare={toggleCompare}
            />
          </div>
        </div>
      )}

      {tab === 'detailed' && (
        <div className="space-y-6">
          {/* Course selector for detailed view */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select course
            </label>
            <select
              value={selectedCourseForDetail}
              onChange={(e) => setSelectedCourseForDetail(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {COURSE_COMPLETION.details.map((d) => (
                <option key={d.courseId} value={d.courseId}>
                  {d.courseName}
                </option>
              ))}
            </select>
          </div>

          {/* Drop-off chart */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 shadow-sm">
            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
              <BarChart3 className="size-4" />
              Drop-off by lesson / module
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Where learners are getting stuck
            </p>
            <div className="mt-4">
              <DropOffChart data={dropOffData} />
            </div>
          </div>

          {/* Detailed module/lesson table */}
          {selectedDetail && (
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Module / Lesson
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Reached
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Completed
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Drop-off
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
                  {selectedDetail.modules.map((mod) => (
                    <React.Fragment key={mod.id}>
                      <tr
                        className="cursor-pointer bg-gray-50/80 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() =>
                          setExpandedModule(expandedModule === mod.id ? null : mod.id)
                        }
                      >
                        <td className="px-4 py-3">
                          {expandedModule === mod.id ? (
                            <ChevronDown className="mr-2 inline size-4 text-gray-500 dark:text-gray-400" />
                          ) : (
                            <ChevronRight className="mr-2 inline size-4 text-gray-500 dark:text-gray-400" />
                          )}
                          <span className="font-medium text-gray-900 dark:text-gray-100">{mod.name}</span>
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(Module)</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">—</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">—</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">—</td>
                      </tr>
                      {expandedModule === mod.id &&
                        mod.lessons.map((lesson) => (
                          <tr key={lesson.id} className="bg-white dark:bg-gray-800">
                            <td className="px-4 py-2 pl-12">
                              <span className="text-sm text-gray-700 dark:text-gray-300">{lesson.name}</span>
                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(Lesson)</span>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                              {lesson.reached}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                              {lesson.completed}
                            </td>
                            <td className="px-4 py-2">
                              <span
                                className={
                                  lesson.dropOffPercent >= 10
                                    ? 'font-medium text-red-600 dark:text-red-400'
                                    : 'text-gray-600 dark:text-gray-400'
                                }
                              >
                                {lesson.dropOff} ({lesson.dropOffPercent}%)
                              </span>
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const thClasses = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'
const colClasses = 'px-4 py-3 text-sm text-gray-900 dark:text-gray-100'

function SummaryTable({
  rows,
  compareMode,
  compareCourses,
  onToggleCompare,
}: {
  rows: CourseSummaryRow[]
  compareMode: boolean
  compareCourses: string[]
  onToggleCompare: (id: string) => void
}) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          {compareMode && (
            <th className={thClasses} scope="col">
              <span className="sr-only">Compare</span>
            </th>
          )}
          <th className={thClasses}>Course</th>
          <th className={thClasses}>Enrolled</th>
          <th className={thClasses}>Completed</th>
          <th className={thClasses}>In progress</th>
          <th className={thClasses}>Not started</th>
          <th className={thClasses}>Dropout %</th>
          <th className={thClasses}>Avg progress</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            {compareMode && (
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={compareCourses.includes(row.id)}
                  onChange={() => onToggleCompare(row.id)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
              </td>
            )}
            <td className={colClasses}>
              <span className="font-medium text-gray-900 dark:text-gray-100">{row.name}</span>
            </td>
            <td className={colClasses}>{row.enrolled}</td>
            <td className={colClasses}>{row.completed}</td>
            <td className={colClasses}>{row.inProgress}</td>
            <td className={colClasses}>{row.notStarted}</td>
            <td className={colClasses}>
              <span
                className={
                  row.dropoutPercent >= 15 ? 'font-medium text-red-600 dark:text-red-400' : ''
                }
              >
                {row.dropoutPercent}%
              </span>
            </td>
            <td className={colClasses}>
              <span className="tabular-nums">{row.avgProgress}%</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function DropOffChart({
  data,
}: {
  data: { step: string; reached: number; completed: number; dropped: number }[]
}) {
  const maxReached = Math.max(...data.map((d) => d.reached), 1)
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-4">
          <span className="w-40 shrink-0 truncate text-sm text-gray-600 dark:text-gray-400">{d.step}</span>
          <div className="relative min-w-0 flex-1">
            <div className="flex h-8 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
              <div
                className="bg-primary/80 transition-all"
                style={{
                  width: `${(d.completed / maxReached) * 100}%`,
                }}
              />
              {d.dropped > 0 && (
                <div
                  className="bg-red-400/80"
                  style={{
                    width: `${(d.dropped / maxReached) * 100}%`,
                  }}
                />
              )}
            </div>
          </div>
          <span className="w-20 shrink-0 text-right text-xs tabular-nums text-gray-500 dark:text-gray-400">
            {d.reached} → {d.completed}
            {d.dropped > 0 && (
              <span className="ml-1 text-red-600 dark:text-red-400">-{d.dropped}</span>
            )}
          </span>
        </div>
      ))}
    </div>
  )
}
