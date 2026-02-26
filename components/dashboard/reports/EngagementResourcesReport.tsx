'use client'

import React, { useState } from 'react'
import {
  ENGAGEMENT_RESOURCES,
  type VideoRow,
  type PdfRow,
  type DeviceUsageRow,
  type LowUtilizationRow,
  type TimeSpentRow,
  type RepeatLoginRow,
  type EngagementByCenterRow,
  type DropoutRiskRow,
} from '@/lib/engagement-resources-data'
import { Download, Video, FileText, Smartphone, Monitor, Users, Clock, LogIn, MapPin, AlertTriangle } from 'lucide-react'

type Tab = 'engagement' | 'resources'

export function EngagementResourcesReport() {
  const [tab, setTab] = useState<Tab>('engagement')

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="break-words text-2xl font-bold text-gray-900 dark:text-gray-100">
            Engagement & Resource Utilization
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Platform usage (login/time/active users) + Video/PDF/Materials
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

      {/* Sub-tabs */}
      <div className="border-b border-gray-200 dark:border-gray-600">
        <nav className="-mb-px flex gap-6">
          <button
            type="button"
            onClick={() => setTab('engagement')}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${tab === 'engagement'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            User Engagement
          </button>
          <button
            type="button"
            onClick={() => setTab('resources')}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${tab === 'resources'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            Resource Utilization
          </button>
        </nav>
      </div>

      {tab === 'engagement' && (
        <div className="space-y-6">
          {/* Active users (daily/weekly/monthly) */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 shadow-sm">
            <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
              <Users className="size-4 text-primary" />
              Active users
            </h3>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Adoption — login/active users</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 p-4">
                <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">{ENGAGEMENT_RESOURCES.activeUsers.daily}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Daily</p>
              </div>
              <div className="rounded-lg border border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 p-4">
                <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">{ENGAGEMENT_RESOURCES.activeUsers.weekly}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Weekly</p>
              </div>
              <div className="rounded-lg border border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 p-4">
                <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">{ENGAGEMENT_RESOURCES.activeUsers.monthly}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monthly</p>
              </div>
            </div>
          </div>

          {/* Time spent per user / per course */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
              <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                  <Clock className="size-4 text-primary" />
                  Time spent per user
                </h3>
              </div>
              <TimeSpentTable rows={ENGAGEMENT_RESOURCES.timeSpentPerUser} />
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
              <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                  <Clock className="size-4 text-primary" />
                  Time spent per course
                </h3>
              </div>
              <TimeSpentTable rows={ENGAGEMENT_RESOURCES.timeSpentPerCourse} />
            </div>
          </div>

          {/* Repeat logins */}
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
            <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
              <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                <LogIn className="size-4 text-primary" />
                Repeat logins
              </h3>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Users with multiple logins</p>
            </div>
            <RepeatLoginsTable rows={ENGAGEMENT_RESOURCES.repeatLogins} />
          </div>

          {/* Engagement by center/location */}
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
            <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
              <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                <MapPin className="size-4 text-primary" />
                Engagement by center / location
              </h3>
            </div>
            <EngagementByCenterTable rows={ENGAGEMENT_RESOURCES.engagementByCenter} />
          </div>

          {/* Dropout risk list */}
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
            <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
              <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
                Dropout risk (inactive 14/30 days)
              </h3>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Users inactive 14+ or 30+ days</p>
            </div>
            <DropoutRiskTable rows={ENGAGEMENT_RESOURCES.dropoutRisk} />
          </div>
        </div>
      )}

      {tab === 'resources' && (
        <div className="space-y-6">
          {/* Most watched videos */}
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
            <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
              <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                <Video className="size-4 text-primary" />
                Most watched videos
              </h3>
            </div>
            <MostWatchedVideosTable rows={ENGAGEMENT_RESOURCES.mostWatchedVideos} />
          </div>

          {/* Most/least opened PDFs */}
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
            <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
              <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                <FileText className="size-4 text-primary" />
                Most / Least opened PDFs
              </h3>
            </div>
            <PdfTable rows={ENGAGEMENT_RESOURCES.pdfsMostLeast} />
          </div>

          {/* Resource usage by device type */}
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
            <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Resource usage by device type
              </h3>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Mobile-heavy usage expected for artisan learners
              </p>
            </div>
            <div className="p-4">
              <DeviceUsageSection rows={ENGAGEMENT_RESOURCES.deviceUsage} />
            </div>
          </div>

          {/* Low utilization resources */}
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
            <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Low utilization resources (revamp candidate)
              </h3>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Resources with low views/completion — consider revamp
              </p>
            </div>
            <LowUtilizationTable rows={ENGAGEMENT_RESOURCES.lowUtilization} />
          </div>
        </div>
      )}
    </div>
  )
}

const thClasses = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'
const colClasses = 'px-4 py-3 text-sm text-gray-900 dark:text-gray-100'

function TimeSpentTable({ rows }: { rows: TimeSpentRow[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>{rows[0]?.type === 'user' ? 'User' : 'Course'}</th>
          {rows[0]?.department != null && <th className={thClasses}>Department</th>}
          <th className={thClasses}>Time spent</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className={colClasses}>
              <span className="font-medium text-gray-900 dark:text-gray-100">{row.name}</span>
            </td>
            {row.department != null && <td className={colClasses}>{row.department}</td>}
            <td className={colClasses}>{row.timeSpent}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function RepeatLoginsTable({ rows }: { rows: RepeatLoginRow[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>User</th>
          <th className={thClasses}>Department</th>
          <th className={thClasses}>Login count</th>
          <th className={thClasses}>Last login</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className={colClasses}>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{row.userName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{row.email}</p>
              </div>
            </td>
            <td className={colClasses}>{row.department}</td>
            <td className={colClasses}>{row.loginCount}</td>
            <td className={colClasses}>{row.lastLogin}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function EngagementByCenterTable({ rows }: { rows: EngagementByCenterRow[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>Center</th>
          <th className={thClasses}>Location</th>
          <th className={thClasses}>Active users</th>
          <th className={thClasses}>Total time spent</th>
          <th className={thClasses}>Avg logins/user</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className={colClasses}>
              <span className="font-medium text-gray-900 dark:text-gray-100">{row.center}</span>
            </td>
            <td className={colClasses}>{row.location}</td>
            <td className={colClasses}>{row.activeUsers}</td>
            <td className={colClasses}>{row.totalTimeSpent}</td>
            <td className={colClasses}>{row.avgLoginsPerUser}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function DropoutRiskTable({ rows }: { rows: DropoutRiskRow[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>User</th>
          <th className={thClasses}>Department</th>
          <th className={thClasses}>Center</th>
          <th className={thClasses}>Days inactive</th>
          <th className={thClasses}>Last activity</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className={colClasses}>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{row.userName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{row.email}</p>
              </div>
            </td>
            <td className={colClasses}>{row.department}</td>
            <td className={colClasses}>{row.center}</td>
            <td className={colClasses}>
              <span
                className={
                  row.daysInactive >= 30 ? 'font-medium text-red-600 dark:text-red-400' : 'font-medium text-amber-600 dark:text-amber-400'
                }
              >
                {row.daysInactive} days
              </span>
            </td>
            <td className={colClasses}>{row.lastActivity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function MostWatchedVideosTable({ rows }: { rows: VideoRow[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>Video</th>
          <th className={thClasses}>Course</th>
          <th className={thClasses}>Views</th>
          <th className={thClasses}>Avg watch completion %</th>
          <th className={thClasses}>Avg time spent</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className={colClasses}>
              <span className="inline-flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
                <Video className="size-4 text-gray-500 dark:text-gray-400" />
                {row.title}
              </span>
            </td>
            <td className={colClasses}>{row.courseName}</td>
            <td className={colClasses}>{row.views}</td>
            <td className={colClasses}>
              <span
                className={
                  row.watchCompletionPercent >= 80
                    ? 'font-medium text-green-600 dark:text-green-400'
                    : row.watchCompletionPercent < 70
                      ? 'font-medium text-amber-600 dark:text-amber-400'
                      : ''
                }
              >
                {row.watchCompletionPercent}%
              </span>
            </td>
            <td className={colClasses}>{row.avgTimeSpent}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function PdfTable({ rows }: { rows: PdfRow[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>PDF</th>
          <th className={thClasses}>Course</th>
          <th className={thClasses}>Opens</th>
          <th className={thClasses}>Rank</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className={colClasses}>
              <span className="inline-flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
                <FileText className="size-4 text-gray-500 dark:text-gray-400" />
                {row.title}
              </span>
            </td>
            <td className={colClasses}>{row.courseName}</td>
            <td className={colClasses}>{row.opens}</td>
            <td className={colClasses}>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${row.opensRank === 'most'
                  ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300'
                  : row.opensRank === 'least'
                    ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}
              >
                {row.opensRank === 'most' ? 'Most opened' : row.opensRank === 'least' ? 'Least opened' : 'Mid'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function DeviceUsageSection({ rows }: { rows: DeviceUsageRow[] }) {
  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.device} className="flex items-center gap-4">
          <span className="flex w-24 items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {row.device === 'Mobile' ? (
              <Smartphone className="size-4 text-primary" />
            ) : row.device === 'Desktop' ? (
              <Monitor className="size-4 text-gray-500 dark:text-gray-400" />
            ) : (
              <Smartphone className="size-4 text-gray-400 dark:text-gray-500" />
            )}
            {row.device}
          </span>
          <div className="flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
            <div
              className="h-6 rounded-full bg-primary transition-all"
              style={{ width: `${row.percent}%` }}
            />
          </div>
          <span className="w-12 text-right text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">
            {row.percent}%
          </span>
        </div>
      ))}
    </div>
  )
}

function LowUtilizationTable({ rows }: { rows: LowUtilizationRow[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>Resource</th>
          <th className={thClasses}>Type</th>
          <th className={thClasses}>Course</th>
          <th className={thClasses}>Views</th>
          <th className={thClasses}>Completion %</th>
          <th className={thClasses}>Revamp candidate</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className={colClasses}>
              <span className="font-medium text-gray-900 dark:text-gray-100">{row.title}</span>
            </td>
            <td className={colClasses}>
              <span className="inline-flex items-center gap-1.5 capitalize">
                {row.type === 'video' ? (
                  <Video className="size-4 text-gray-500 dark:text-gray-400" />
                ) : (
                  <FileText className="size-4 text-gray-500 dark:text-gray-400" />
                )}
                {row.type}
              </span>
            </td>
            <td className={colClasses}>{row.courseName}</td>
            <td className={colClasses}>{row.views}</td>
            <td className={colClasses}>
              <span
                className={
                  row.completionPercent < 50 ? 'font-medium text-red-600 dark:text-red-400' : ''
                }
              >
                {row.completionPercent}%
              </span>
            </td>
            <td className={colClasses}>
              {row.revampCandidate ? (
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
