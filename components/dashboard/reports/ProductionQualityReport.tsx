'use client'

import React from 'react'
import {
  PRODUCTION_QUALITY,
  type TrainingVsDefectRow,
  type ReworkReductionRow,
  type BeforeAfterRow,
} from '@/lib/production-quality-data'
import { Info, TrendingDown, ArrowRight } from 'lucide-react'

export function ProductionQualityReport() {
  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="break-words text-2xl font-bold text-gray-900 dark:text-gray-100">
          Production Quality Impact
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Tracking if work quality improves after training
        </p>
      </div>

      {/* Future phase notice */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 dark:border-amber-700/50 bg-amber-50 dark:bg-amber-900/20 px-4 py-3">
        <Info className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
            QA/production data integration required
          </p>
          <p className="mt-1 text-xs text-amber-800 dark:text-amber-300">
            This report requires QA and production data integration (future phase).
            Currently showing mock data for demonstration.
          </p>
        </div>
      </div>

      {/* Training completed vs defect rate change */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <TrendingDown className="size-4 text-primary" />
            Training completed vs defect rate change
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Negative change = improvement in defect rate
          </p>
        </div>
        <TrainingVsDefectTable rows={PRODUCTION_QUALITY.trainingVsDefect} />
      </div>

      {/* Rework reduction by center */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Rework reduction by center
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Reduction in rework units after training
          </p>
        </div>
        <ReworkReductionTable rows={PRODUCTION_QUALITY.reworkReduction} />
      </div>

      {/* Before/After training comparison */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <ArrowRight className="size-4 text-primary" />
            Before / After training comparison
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Key metrics before vs after training
          </p>
        </div>
        <BeforeAfterTable rows={PRODUCTION_QUALITY.beforeAfter} />
      </div>
    </div>
  )
}

const thClasses = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'
const colClasses = 'px-4 py-3 text-sm text-gray-900 dark:text-gray-100'

function TrainingVsDefectTable({ rows }: { rows: TrainingVsDefectRow[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>Course</th>
          <th className={thClasses}>Center</th>
          <th className={thClasses}>Training completed</th>
          <th className={thClasses}>Defect rate before</th>
          <th className={thClasses}>Defect rate after</th>
          <th className={thClasses}>Change</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className={colClasses}>
              <span className="font-medium text-gray-900 dark:text-gray-100">{row.courseName}</span>
            </td>
            <td className={colClasses}>{row.center}</td>
            <td className={colClasses}>{row.trainingCompleted}</td>
            <td className={colClasses}>{row.defectRateBefore}%</td>
            <td className={colClasses}>{row.defectRateAfter}%</td>
            <td className={colClasses}>
              <span
                className={
                  row.defectRateChange < 0
                    ? 'font-medium text-green-600 dark:text-green-400'
                    : 'font-medium text-red-600 dark:text-red-400'
                }
              >
                {row.defectRateChange > 0 ? '+' : ''}{row.defectRateChange}%
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function ReworkReductionTable({ rows }: { rows: ReworkReductionRow[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>Center</th>
          <th className={thClasses}>Location</th>
          <th className={thClasses}>Rework before</th>
          <th className={thClasses}>Rework after</th>
          <th className={thClasses}>Reduction</th>
          <th className={thClasses}>Trainees</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className={colClasses}>
              <span className="font-medium text-gray-900 dark:text-gray-100">{row.center}</span>
            </td>
            <td className={colClasses}>{row.location}</td>
            <td className={colClasses}>{row.reworkBefore}</td>
            <td className={colClasses}>{row.reworkAfter}</td>
            <td className={colClasses}>
              <span className="font-medium text-green-600 dark:text-green-400">
                {row.reductionPercent}%
              </span>
            </td>
            <td className={colClasses}>{row.traineesCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function BeforeAfterTable({ rows }: { rows: BeforeAfterRow[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>Metric</th>
          <th className={thClasses}>Center</th>
          <th className={thClasses}>Before training</th>
          <th className={thClasses}>After training</th>
          <th className={thClasses}>Improvement</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className={colClasses}>
              <span className="font-medium text-gray-900 dark:text-gray-100">{row.metric}</span>
            </td>
            <td className={colClasses}>{row.center}</td>
            <td className={colClasses}>
              {row.beforeTraining}{row.unit}
            </td>
            <td className={colClasses}>
              {row.afterTraining}{row.unit}
            </td>
            <td className={colClasses}>
              <span className="font-medium text-green-600 dark:text-green-400">
                +{row.improvement}{row.unit}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
