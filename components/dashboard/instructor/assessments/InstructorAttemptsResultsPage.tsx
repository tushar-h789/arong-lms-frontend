'use client'

import React, { useState } from 'react'
import {
  getInstructorCoursesForAttempts,
  getAttemptsResultsByCourse,
  type AttemptResultRow,
  type LowScoreLearnerRow,
  type TopMissedQuestionRow,
} from '@/lib/instructor-assessments-data'
import { AssessmentsTabs } from './AssessmentsTabs'
import { Download, AlertTriangle, HelpCircle, CheckCircle2, XCircle } from 'lucide-react'

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

export default function InstructorAttemptsResultsPage() {
  const courses = getInstructorCoursesForAttempts()
  const [courseId, setCourseId] = useState(courses[0]?.id ?? '')
  const { passFailList, lowScoreLearners, topMissedQuestions } = getAttemptsResultsByCourse(courseId)

  const handleExport = () => {
    // Placeholder: in real app would generate CSV/Excel
    window.alert('Export will download results (CSV/Excel). Connect to API when ready.')
  }

  return (
    <div className="min-w-0 space-y-4 overflow-x-hidden">
      <AssessmentsTabs />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Attempts & Results</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            View pass/fail by course, identify low-score learners, and see top missed questions. Export for reporting.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Download className="size-4" />
          Export results
        </button>
      </div>

      {/* Course scope */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 shadow-sm">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Course</label>
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Pass/Fail list */}
      <section className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <h2 className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
          Pass / Fail list
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Learner</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Score</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Result</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Attempt</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {passFailList.map((row) => (
                <tr key={row.attemptId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">{row.learnerName}</td>
                  <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">{row.score}%</td>
                  <td className="px-3 py-2">
                    {row.passFail === 'pass' ? (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="size-3.5" /> Pass
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 text-xs font-medium text-red-700 dark:text-red-400">
                        <XCircle className="size-3.5" /> Fail
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">#{row.attemptNumber}</td>
                  <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">{formatDate(row.completedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {passFailList.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No attempts for this course yet.</div>
        )}
      </section>

      {/* Low-score learners */}
      <section className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <h2 className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
          <AlertTriangle className="size-4 text-amber-500" />
          Low-score learners (need attention)
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Learner</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Best score</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Attempts</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Last attempt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {lowScoreLearners.map((row) => (
                <tr key={row.learnerId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">{row.learnerName}</td>
                  <td className="px-3 py-2 text-sm text-amber-600 dark:text-amber-400">{row.bestScore}%</td>
                  <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">{row.attemptCount}</td>
                  <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">{formatDate(row.lastAttemptAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {lowScoreLearners.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">No low-score learners in this course.</div>
        )}
      </section>

      {/* Top missed questions snapshot */}
      <section className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <h2 className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
          <HelpCircle className="size-4 text-gray-500 dark:text-gray-400" />
          Top missed questions
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Question</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Total attempts</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Missed</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Miss rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {topMissedQuestions.map((row) => (
                <tr key={row.questionId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">{row.questionTitle}</td>
                  <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">{row.totalAttempts}</td>
                  <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">{row.missCount}</td>
                  <td className="px-3 py-2">
                    <span className={row.missRatePercent >= 40 ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-gray-600 dark:text-gray-400'}>
                      {row.missRatePercent}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {topMissedQuestions.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">No attempt data for questions yet.</div>
        )}
      </section>
    </div>
  )
}
