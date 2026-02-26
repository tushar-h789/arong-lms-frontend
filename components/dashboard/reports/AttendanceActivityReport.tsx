'use client'

import React, { useState } from 'react'
import {
  ATTENDANCE_ACTIVITY,
  type ActivityLogRow,
  type AttendanceRow,
  type AttendanceRateRow,
  type NoShowRow,
} from '@/lib/attendance-activity-data'
import { Download, LogIn, BookOpen, CheckCircle, Video, MapPin, UserX } from 'lucide-react'

type Tab = 'activity' | 'virtual' | 'physical' | 'attendance-rate' | 'noshow'

export function AttendanceActivityReport() {
  const [tab, setTab] = useState<Tab>('activity')

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="break-words text-2xl font-bold text-gray-900 dark:text-gray-100">
            Attendance & Activity
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Field Reality Check — live/physical class attendance + platform usage
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
        <nav className="-mb-px flex flex-wrap gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => setTab('activity')}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${tab === 'activity'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            Activity Log
          </button>
          <button
            type="button"
            onClick={() => setTab('virtual')}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${tab === 'virtual'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            Virtual (Meet/Zoom/Teams)
          </button>
          <button
            type="button"
            onClick={() => setTab('physical')}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${tab === 'physical'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            Physical Attendance
          </button>
          <button
            type="button"
            onClick={() => setTab('attendance-rate')}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${tab === 'attendance-rate'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            Rate by Center/Group/Trainer
          </button>
          <button
            type="button"
            onClick={() => setTab('noshow')}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${tab === 'noshow'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            No-Show List
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="overflow-x-auto">
          {tab === 'activity' && (
            <ActivityLogTable rows={ATTENDANCE_ACTIVITY.activityLog} />
          )}
          {tab === 'virtual' && (
            <AttendanceTable
              rows={ATTENDANCE_ACTIVITY.virtualAttendance}
              type="virtual"
            />
          )}
          {tab === 'physical' && (
            <AttendanceTable
              rows={ATTENDANCE_ACTIVITY.physicalAttendance}
              type="physical"
            />
          )}
          {tab === 'attendance-rate' && (
            <AttendanceRateTable rows={ATTENDANCE_ACTIVITY.attendanceRate} />
          )}
          {tab === 'noshow' && (
            <NoShowTable rows={ATTENDANCE_ACTIVITY.noShowList} />
          )}
        </div>
      </div>
    </div>
  )
}

const thClasses = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'
const colClasses = 'px-4 py-3 text-sm text-gray-900 dark:text-gray-100'

function getActivityIcon(action: ActivityLogRow['action']) {
  switch (action) {
    case 'login':
      return <LogIn className="size-4" />
    case 'course_start':
      return <BookOpen className="size-4" />
    case 'completion':
      return <CheckCircle className="size-4" />
  }
}

function ActivityLogTable({ rows }: { rows: ActivityLogRow[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>User</th>
          <th className={thClasses}>Action</th>
          <th className={thClasses}>Details</th>
          <th className={thClasses}>Timestamp</th>
          <th className={thClasses}>IP</th>
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
            <td className={colClasses}>
              <span className="inline-flex items-center gap-1.5 capitalize text-gray-700 dark:text-gray-300">
                {getActivityIcon(row.action)}
                {row.action.replace('_', ' ')}
              </span>
            </td>
            <td className={colClasses}>{row.details}</td>
            <td className={colClasses}>{row.timestamp}</td>
            <td className={colClasses}>{row.ip ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function AttendanceTable({
  rows,
  type,
}: {
  rows: AttendanceRow[]
  type: 'virtual' | 'physical'
}) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>User</th>
          <th className={thClasses}>Department</th>
          <th className={thClasses}>Session</th>
          <th className={thClasses}>Date</th>
          {type === 'virtual' && <th className={thClasses}>Platform</th>}
          {type === 'physical' && <th className={thClasses}>Entry</th>}
          <th className={thClasses}>Status</th>
          <th className={thClasses}>Check-in</th>
          <th className={thClasses}>Duration</th>
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
            <td className={colClasses}>{row.sessionName}</td>
            <td className={colClasses}>{row.sessionDate}</td>
            {type === 'virtual' && (
              <td className={colClasses}>
                <span className="inline-flex items-center gap-1.5 capitalize">
                  <Video className="size-4 text-gray-400 dark:text-gray-500" />
                  {row.platform ?? '—'}
                </span>
              </td>
            )}
            {type === 'physical' && (
              <td className={colClasses}>
                {row.isManualEntry ? (
                  <span className="inline-flex items-center gap-1 rounded bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                    <MapPin className="size-3" />
                    Manual entry
                  </span>
                ) : (
                  '—'
                )}
              </td>
            )}
            <td className={colClasses}>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${row.status === 'present'
                  ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300'
                  : row.status === 'late'
                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                    : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300'
                  }`}
              >
                {row.status}
              </span>
            </td>
            <td className={colClasses}>{row.checkIn ?? '—'}</td>
            <td className={colClasses}>{row.duration ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function AttendanceRateTable({ rows }: { rows: AttendanceRateRow[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>Center</th>
          <th className={thClasses}>Group</th>
          <th className={thClasses}>Trainer</th>
          <th className={thClasses}>Session Date</th>
          <th className={thClasses}>Expected</th>
          <th className={thClasses}>Present</th>
          <th className={thClasses}>Attendance Rate</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className={colClasses}>
              <span className="font-medium text-gray-900 dark:text-gray-100">{row.center}</span>
            </td>
            <td className={colClasses}>{row.group}</td>
            <td className={colClasses}>{row.trainer}</td>
            <td className={colClasses}>{row.sessionDate}</td>
            <td className={colClasses}>{row.totalExpected}</td>
            <td className={colClasses}>{row.totalPresent}</td>
            <td className={colClasses}>
              <span
                className={
                  row.attendanceRate >= 85
                    ? 'font-medium text-green-600 dark:text-green-400'
                    : row.attendanceRate < 75
                      ? 'font-medium text-red-600 dark:text-red-400'
                      : ''
                }
              >
                {row.attendanceRate}%
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function NoShowTable({ rows }: { rows: NoShowRow[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>User</th>
          <th className={thClasses}>Department</th>
          <th className={thClasses}>Session</th>
          <th className={thClasses}>Date</th>
          <th className={thClasses}>Type</th>
          <th className={thClasses}>Platform</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className={colClasses}>
              <div className="flex items-center gap-2">
                <UserX className="size-4 text-red-500 dark:text-red-400 shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{row.userName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{row.email}</p>
                </div>
              </div>
            </td>
            <td className={colClasses}>{row.department}</td>
            <td className={colClasses}>{row.sessionName}</td>
            <td className={colClasses}>{row.sessionDate}</td>
            <td className={colClasses}>
              <span
                className={`inline-flex capitalize rounded-full px-2.5 py-0.5 text-xs font-medium ${row.sessionType === 'virtual'
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}
              >
                {row.sessionType}
              </span>
            </td>
            <td className={colClasses}>{row.platform ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
