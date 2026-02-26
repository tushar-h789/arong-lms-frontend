'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ASSESSMENTS_REPORT,
  type AssessmentResultRow,
  type AttemptRow,
  type PassFailBreakdownRow,
} from '@/lib/assessments-report-data'
import { Download, BarChart2 } from 'lucide-react'

type Tab = 'results' | 'attempts' | 'passfail'

export function AssessmentsReport() {
  const [tab, setTab] = useState<Tab>('results')

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="break-words text-2xl font-bold text-gray-900 dark:text-gray-100">
            Assessments
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Scores, pass/fail, attempts — assessment analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/admin/reports/item-analysis"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <BarChart2 className="size-4" />
            Open Item Analysis
          </Link>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Download className="size-4" />
            Export
          </button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="border-b border-gray-200 dark:border-gray-600">
        <nav className="-mb-px flex gap-6">
          <button
            type="button"
            onClick={() => setTab('results')}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${
              tab === 'results'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Assessment Results
          </button>
          <button
            type="button"
            onClick={() => setTab('attempts')}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${
              tab === 'attempts'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Attempts
          </button>
          <button
            type="button"
            onClick={() => setTab('passfail')}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${
              tab === 'passfail'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Pass/Fail Breakdown
          </button>
        </nav>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="overflow-x-auto">
          {tab === 'results' && (
            <ResultsTable rows={ASSESSMENTS_REPORT.results} />
          )}
          {tab === 'attempts' && (
            <AttemptsTable rows={ASSESSMENTS_REPORT.attempts} />
          )}
          {tab === 'passfail' && (
            <PassFailTable rows={ASSESSMENTS_REPORT.passFailBreakdown} />
          )}
        </div>
      </div>
    </div>
  )
}

const thClasses = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'
const colClasses = 'px-4 py-3 text-sm text-gray-900 dark:text-gray-100'

function ResultsTable({ rows }: { rows: AssessmentResultRow[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>Learner</th>
          <th className={thClasses}>Assessment</th>
          <th className={thClasses}>Course</th>
          <th className={thClasses}>Score</th>
          <th className={thClasses}>Pass status</th>
          <th className={thClasses}>Attempts</th>
          <th className={thClasses}>Time taken</th>
          <th className={thClasses}>Completion time</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className={colClasses}>
              <span className="font-medium text-gray-900 dark:text-gray-100">{row.learnerName}</span>
            </td>
            <td className={colClasses}>{row.assessmentName}</td>
            <td className={colClasses}>{row.courseName}</td>
            <td className={colClasses}>{row.score}%</td>
            <td className={colClasses}>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                  row.passStatus === 'pass'
                    ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300'
                }`}
              >
                {row.passStatus}
              </span>
            </td>
            <td className={colClasses}>{row.attempts}</td>
            <td className={colClasses}>{row.timeTaken}</td>
            <td className={colClasses}>{row.completionTime}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function AttemptsTable({ rows }: { rows: AttemptRow[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>Learner</th>
          <th className={thClasses}>Assessment</th>
          <th className={thClasses}>Attempt #</th>
          <th className={thClasses}>Score</th>
          <th className={thClasses}>Pass status</th>
          <th className={thClasses}>Time taken</th>
          <th className={thClasses}>Completed at</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className={colClasses}>
              <span className="font-medium text-gray-900 dark:text-gray-100">{row.learnerName}</span>
            </td>
            <td className={colClasses}>{row.assessmentName}</td>
            <td className={colClasses}>{row.attemptNumber}</td>
            <td className={colClasses}>{row.score}%</td>
            <td className={colClasses}>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                  row.passStatus === 'pass'
                    ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300'
                }`}
              >
                {row.passStatus}
              </span>
            </td>
            <td className={colClasses}>{row.timeTaken}</td>
            <td className={colClasses}>{row.completedAt}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function PassFailTable({ rows }: { rows: PassFailBreakdownRow[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>Assessment</th>
          <th className={thClasses}>Course</th>
          <th className={thClasses}>Total attempts</th>
          <th className={thClasses}>Passed</th>
          <th className={thClasses}>Failed</th>
          <th className={thClasses}>Pass rate</th>
          <th className={thClasses}>Avg score</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.assessmentId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className={colClasses}>
              <span className="font-medium text-gray-900 dark:text-gray-100">{row.assessmentName}</span>
            </td>
            <td className={colClasses}>{row.courseName}</td>
            <td className={colClasses}>{row.totalAttempts}</td>
            <td className={colClasses}>
              <span className="text-green-600 dark:text-green-400">{row.passed}</span>
            </td>
            <td className={colClasses}>
              <span className="text-red-600 dark:text-red-400">{row.failed}</span>
            </td>
            <td className={colClasses}>
              <span
                className={
                  row.passRate >= 80 ? 'font-medium text-green-600 dark:text-green-400' : row.passRate < 70 ? 'font-medium text-red-600 dark:text-red-400' : ''
                }
              >
                {row.passRate}%
              </span>
            </td>
            <td className={colClasses}>{row.avgScore}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
