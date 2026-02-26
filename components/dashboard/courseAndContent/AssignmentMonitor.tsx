'use client'

import React, { useState, useMemo } from 'react'
import {
  ASSIGNMENT_MONITOR_ROWS,
  ASSIGNMENT_STATUS_LABELS,
  CENTERS,
  GROUPS,
  TRAINERS,
  CRAFTS,
  getDaysSince,
  isInactive,
  isDueSoon,
  type AssignmentMonitorRow,
  type AssignmentStatus,
} from '@/lib/assignment-monitor-data'
import {
  Download,
  FileText,
  AlertTriangle,
  UserX,
  Bell,
  Calendar,
  RefreshCw,
  MoreVertical,
} from 'lucide-react'

export function AssignmentMonitor() {
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | 'all'>('all')
  const [centerFilter, setCenterFilter] = useState('')
  const [groupFilter, setGroupFilter] = useState('')
  const [trainerFilter, setTrainerFilter] = useState('')
  const [craftFilter, setCraftFilter] = useState('')
  const [contentFilter, setContentFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [datePreset, setDatePreset] = useState<'none' | 'due_soon' | 'overdue'>('none')
  const [activityFilter, setActivityFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [inactiveDays, setInactiveDays] = useState<14 | 30>(14)
  const [inactiveDaysForFilter, setInactiveDaysForFilter] = useState<14 | 30>(14)
  const [quickActionRow, setQuickActionRow] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const list = ASSIGNMENT_MONITOR_ROWS.filter((row) => {
      if (statusFilter !== 'all' && row.status !== statusFilter) return false
      if (centerFilter && row.center !== centerFilter) return false
      if (groupFilter && row.group !== groupFilter) return false
      if (trainerFilter && row.trainer !== trainerFilter) return false
      if (craftFilter && row.craft !== craftFilter) return false
      if (contentFilter && row.contentId !== contentFilter) return false
      if (datePreset === 'overdue') {
        if (row.status !== 'overdue') return false
      } else if (datePreset === 'due_soon') {
        if (!isDueSoon(row)) return false
      } else {
        if (dateFrom && row.dueDate < dateFrom) return false
        if (dateTo && row.dueDate > dateTo + 'T23:59:59.999Z') return false
      }
      if (activityFilter === 'active' && isInactive(row, inactiveDaysForFilter)) return false
      if (activityFilter === 'inactive' && !isInactive(row, inactiveDaysForFilter)) return false
      return true
    })
    return list
  }, [statusFilter, centerFilter, groupFilter, trainerFilter, craftFilter, contentFilter, dateFrom, dateTo, datePreset, activityFilter, inactiveDaysForFilter])

  const overdueList = useMemo(() => filtered.filter((r) => r.status === 'overdue'), [filtered])
  const inactiveList = useMemo(
    () => ASSIGNMENT_MONITOR_ROWS.filter((r) => isInactive(r, inactiveDays)),
    [inactiveDays]
  )

  const contentOptions = useMemo(() => {
    const set = new Map<string, string>()
    ASSIGNMENT_MONITOR_ROWS.forEach((r) => set.set(r.contentId, r.contentName))
    return Array.from(set.entries())
  }, [])

  const handleExport = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      const headers = ['User', 'Center', 'Group', 'Trainer', 'Craft', 'Content', 'Due date', 'Status', 'Progress %']
      const rows = filtered.map((r) => [r.userName, r.center, r.group, r.trainer, r.craft, r.contentName, r.dueDate.slice(0, 10), r.status, r.progressPercent].join(','))
      const csv = [headers.join(','), ...rows].join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `assignment-monitor-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      window.alert('PDF export can be wired to a server or client PDF library.')
    }
  }

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Assignment Monitor (Operational Tracking)</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track who is completed / overdue / in progress. Drilldown by center and group, export, overdue priority, inactive users, quick actions.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleExport('csv')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Download className="size-4" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => handleExport('pdf')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FileText className="size-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Overdue priority list */}
      {overdueList.length > 0 && (
        <section className="rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-900/20 p-4">
          <h2 className="flex items-center gap-2 font-semibold text-red-900 dark:text-red-200">
            <AlertTriangle className="size-5" />
            Overdue priority list (most critical)
          </h2>
          <p className="mt-1 text-sm text-red-800 dark:text-red-300">{overdueList.length} assignment(s) overdue.</p>
          <ul className="mt-3 space-y-2">
            {overdueList.slice(0, 10).map((row) => (
              <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white dark:bg-gray-800 px-3 py-2 text-sm">
                <span className="font-medium text-gray-900 dark:text-gray-100">{row.userName}</span>
                <span className="text-gray-600 dark:text-gray-400">{row.contentName}</span>
                <span className="text-gray-500 dark:text-gray-400">Due {row.dueDate.slice(0, 10)} · {row.progressPercent}%</span>
                <span className="text-gray-500 dark:text-gray-400">{row.center} → {row.group}</span>
              </li>
            ))}
            {overdueList.length > 10 && <li className="text-sm text-red-700 dark:text-red-400">+{overdueList.length - 10} more</li>}
          </ul>
        </section>
      )}

      {/* Inactive users */}
      <section className="rounded-xl border border-amber-200 dark:border-amber-700/50 bg-amber-50/30 dark:bg-amber-900/20 p-4">
        <h2 className="font-semibold text-amber-900 dark:text-amber-200">Inactive users (no activity)</h2>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => setInactiveDays(14)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${inactiveDays === 14 ? 'border-amber-600 dark:border-amber-500 bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200' : 'border-amber-200 dark:border-amber-700 bg-white dark:bg-gray-800 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/30'}`}
          >
            14 days
          </button>
          <button
            type="button"
            onClick={() => setInactiveDays(30)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${inactiveDays === 30 ? 'border-amber-600 dark:border-amber-500 bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200' : 'border-amber-200 dark:border-amber-700 bg-white dark:bg-gray-800 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/30'}`}
          >
            30 days
          </button>
        </div>
        {inactiveList.length > 0 ? (
          <ul className="mt-3 space-y-1.5 text-sm text-amber-900 dark:text-amber-200">
            {inactiveList.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center gap-2">
                <UserX className="size-4" />
                {row.userName} — {row.contentName} · Last activity {getDaysSince(row.lastActivityAt || row.assignedAt)} days ago
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">No users inactive for {inactiveDays}+ days.</p>
        )}
      </section>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${statusFilter === 'all' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
        >
          All
        </button>
        {(Object.entries(ASSIGNMENT_STATUS_LABELS) as [AssignmentStatus, string][]).map(([status, label]) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${statusFilter === status ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Filters: Center/Location, Craft, Trainer, Course/Path, Due range (due soon / overdue), Activity status */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Must-have filters · Center/Location, Craft, Trainer, Course/Path, Due date range, Activity status</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FilterSelect label="Center / Location" value={centerFilter} options={['', ...CENTERS]} onChange={setCenterFilter} />
          <FilterSelect label="Group" value={groupFilter} options={['', ...GROUPS]} onChange={setGroupFilter} />
          <FilterSelect label="Trainer / Facilitator" value={trainerFilter} options={['', ...TRAINERS]} onChange={setTrainerFilter} />
          <FilterSelect label="Craft type" value={craftFilter} options={['', ...CRAFTS]} onChange={setCraftFilter} />
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Course / Path</label>
            <select
              value={contentFilter}
              onChange={(e) => setContentFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All</option>
              {contentOptions.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Due date range</label>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setDatePreset('none')} className={`rounded border px-2 py-1.5 text-xs font-medium ${datePreset === 'none' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Custom</button>
              <button type="button" onClick={() => setDatePreset('due_soon')} className={`rounded border px-2 py-1.5 text-xs font-medium ${datePreset === 'due_soon' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Due soon</button>
              <button type="button" onClick={() => setDatePreset('overdue')} className={`rounded border px-2 py-1.5 text-xs font-medium ${datePreset === 'overdue' ? 'border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Overdue</button>
            </div>
            {datePreset === 'none' && (
              <div className="mt-2 flex gap-2">
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100" placeholder="From" />
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100" placeholder="To" />
              </div>
            )}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Activity status</label>
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {activityFilter !== 'all' && (
              <div className="mt-1 flex gap-1">
                <button type="button" onClick={() => setInactiveDaysForFilter(14)} className={`rounded px-2 py-0.5 text-xs ${inactiveDaysForFilter === 14 ? 'bg-gray-200 dark:bg-gray-600 font-medium text-gray-900 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>14d</button>
                <button type="button" onClick={() => setInactiveDaysForFilter(30)} className={`rounded px-2 py-0.5 text-xs ${inactiveDaysForFilter === 30 ? 'bg-gray-200 dark:bg-gray-600 font-medium text-gray-900 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>30d</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table with quick actions */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Center</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Group</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Trainer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Craft</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Course / Path</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Due date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Progress</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filtered.map((row) => (
                <AssignmentRow
                  key={row.id}
                  row={row}
                  quickActionOpen={quickActionRow === row.id}
                  onToggleQuickAction={() => setQuickActionRow(quickActionRow === row.id ? null : row.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400">No assignments match your filters.</div>
        )}
      </div>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: readonly string[]
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {options.map((o) => (
          <option key={o || '_'} value={o}>{o || 'All'}</option>
        ))}
      </select>
    </div>
  )
}

function AssignmentRow({
  row,
  quickActionOpen,
  onToggleQuickAction,
}: {
  row: AssignmentMonitorRow
  quickActionOpen: boolean
  onToggleQuickAction: () => void
}) {
  const statusClass =
    row.status === 'completed' ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300' :
      row.status === 'overdue' ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300' :
        row.status === 'in_progress' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="px-4 py-3">
        <div>
          <span className="font-medium text-gray-900 dark:text-gray-100">{row.userName}</span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">{row.userEmail}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.center}</td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.group}</td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.trainer}</td>
      <td className="px-4 py-3 text-sm capitalize text-gray-600 dark:text-gray-400">{row.craft}</td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
        <span className="capitalize text-gray-500 dark:text-gray-400">{row.contentType}</span>: {row.contentName}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.dueDate.slice(0, 10)}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass}`}>
          {ASSIGNMENT_STATUS_LABELS[row.status]}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.progressPercent}%</td>
      <td className="relative px-4 py-3 text-right">
        <div className="relative flex justify-end">
          <button
            type="button"
            onClick={onToggleQuickAction}
            className="rounded p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
            aria-expanded={quickActionOpen}
          >
            <MoreVertical className="size-4" />
          </button>
          {quickActionOpen && (
            <>
              <div className="fixed inset-0 z-10" aria-hidden onClick={onToggleQuickAction} />
              <div className="absolute right-0 top-full z-20 mt-1 w-52 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 py-1 shadow-lg">
                <button type="button" className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Bell className="size-4" />
                  Send reminder
                </button>
                <button type="button" className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Calendar className="size-4" />
                  Extend due date
                </button>
                <button type="button" className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <RefreshCw className="size-4" />
                  Reassign
                </button>
                <button type="button" className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <UserX className="size-4" />
                  Deactivate from assignment
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
