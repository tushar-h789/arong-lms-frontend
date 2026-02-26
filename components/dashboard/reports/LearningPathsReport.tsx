'use client'

import React, { useState } from 'react'
import {
  LEARNING_PATHS,
  type PathSummary,
  type StepProgression,
  type BottleneckStep,
  type PathPerformanceByCenter,
} from '@/lib/learning-paths-data'
import { Route, ListOrdered, AlertCircle, MapPin } from 'lucide-react'

export function LearningPathsReport() {
  const [selectedPathId, setSelectedPathId] = useState<string | null>(
    LEARNING_PATHS.pathSummary[0]?.id ?? null
  )

  const stepProgressionFiltered = selectedPathId
    ? LEARNING_PATHS.stepProgression.filter((s) => s.pathId === selectedPathId)
    : LEARNING_PATHS.stepProgression

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="wrap-break-word text-2xl font-bold text-gray-900 dark:text-gray-100">
          Learning Path Progress
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Onboarding + skill ladder — new artisan and skill upgrade track
        </p>
      </div>

      {/* Path completion % */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <Route className="size-4 text-primary" />
            Path completion %
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Path
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Enrolled
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Completed
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Completion %
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
              {LEARNING_PATHS.pathSummary.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${selectedPathId === row.id ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                >
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPathId(row.id)}
                      className="text-left font-medium text-gray-900 dark:text-gray-100 hover:text-primary"
                    >
                      {row.pathName}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {row.pathType.replace('_', ' ')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.totalEnrolled}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{row.completed}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        row.completionPercent >= 75
                          ? 'font-medium text-green-600 dark:text-green-400'
                          : row.completionPercent < 60
                            ? 'font-medium text-red-600 dark:text-red-400'
                            : ''
                      }
                    >
                      {row.completionPercent}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step-by-step progression */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <ListOrdered className="size-4 text-primary" />
            Step-by-step progression
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {selectedPathId ? 'Filtered by selected path' : 'All paths'}
          </p>
        </div>
        <StepProgressionTable rows={stepProgressionFiltered} />
      </div>

      {/* Bottleneck step */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <AlertCircle className="size-4 text-amber-600 dark:text-amber-400" />
            Bottleneck step
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Steps with lowest completion or highest drop-off
          </p>
        </div>
        <BottleneckTable rows={LEARNING_PATHS.bottleneckSteps} />
      </div>

      {/* Path performance by center/trainer */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <MapPin className="size-4 text-primary" />
            Path performance by center / trainer
          </h3>
        </div>
        <PathPerformanceTable rows={LEARNING_PATHS.pathPerformanceByCenter} />
      </div>
    </div>
  )
}

const thClasses = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'
const colClasses = 'px-4 py-3 text-sm text-gray-900 dark:text-gray-100'

function StepProgressionTable({ rows }: { rows: StepProgression[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>Path</th>
          <th className={thClasses}>Step</th>
          <th className={thClasses}>Order</th>
          <th className={thClasses}>Enrolled</th>
          <th className={thClasses}>Completed</th>
          <th className={thClasses}>%</th>
          <th className={thClasses}>Avg days</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className={colClasses}>{row.pathName}</td>
            <td className={colClasses}>
              <span className="font-medium text-gray-900 dark:text-gray-100">{row.stepName}</span>
            </td>
            <td className={colClasses}>{row.stepOrder}</td>
            <td className={colClasses}>{row.enrolled}</td>
            <td className={colClasses}>{row.completed}</td>
            <td className={colClasses}>
              <span
                className={
                  row.completionPercent < 85 ? 'font-medium text-amber-600 dark:text-amber-400' : ''
                }
              >
                {row.completionPercent}%
              </span>
            </td>
            <td className={colClasses}>{row.avgDaysToComplete}d</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function BottleneckTable({ rows }: { rows: BottleneckStep[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>Path</th>
          <th className={thClasses}>Step</th>
          <th className={thClasses}>Completion %</th>
          <th className={thClasses}>Drop-off</th>
          <th className={thClasses}>Bottleneck</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className={colClasses}>{row.pathName}</td>
            <td className={colClasses}>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {row.stepOrder}. {row.stepName}
              </span>
            </td>
            <td className={colClasses}>
              <span
                className={
                  row.isBottleneck ? 'font-medium text-amber-600 dark:text-amber-400' : ''
                }
              >
                {row.completionPercent}%
              </span>
            </td>
            <td className={colClasses}>
              <span className="text-red-600 dark:text-red-400">{row.dropOffCount}</span>
            </td>
            <td className={colClasses}>
              {row.isBottleneck ? (
                <span className="inline-flex rounded-full bg-amber-100 dark:bg-amber-900/40 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-300">
                  Yes
                </span>
              ) : (
                <span className="text-gray-400 dark:text-gray-500">—</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function PathPerformanceTable({ rows }: { rows: PathPerformanceByCenter[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>Path</th>
          <th className={thClasses}>Center</th>
          <th className={thClasses}>Trainer</th>
          <th className={thClasses}>Enrolled</th>
          <th className={thClasses}>Completed</th>
          <th className={thClasses}>Completion %</th>
          <th className={thClasses}>Avg days</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className={colClasses}>{row.pathName}</td>
            <td className={colClasses}>{row.center}</td>
            <td className={colClasses}>{row.trainer ?? '—'}</td>
            <td className={colClasses}>{row.enrolled}</td>
            <td className={colClasses}>{row.completed}</td>
            <td className={colClasses}>
              <span
                className={
                  row.completionPercent >= 75
                    ? 'font-medium text-green-600 dark:text-green-400'
                    : row.completionPercent < 60
                      ? 'font-medium text-red-600 dark:text-red-400'
                      : ''
                }
              >
                {row.completionPercent}%
              </span>
            </td>
            <td className={colClasses}>{row.avgDaysToComplete}d</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
