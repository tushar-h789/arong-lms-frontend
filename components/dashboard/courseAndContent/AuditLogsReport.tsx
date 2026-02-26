'use client'

import React, { useState } from 'react'
import { FileText, Download } from 'lucide-react'

const MOCK_LOGS = [
  { id: '1', adminUser: 'admin@aarong.com', action: 'role_change', target: 'rahim@aarong.com', timestamp: '2025-02-22T10:00:00Z' },
  { id: '2', adminUser: 'admin@aarong.com', action: 'reset_password', target: 'fatima@aarong.com', timestamp: '2025-02-21T14:30:00Z' },
  { id: '3', adminUser: 'hr@aarong.com', action: 'deactivate', target: 'old@aarong.com', timestamp: '2025-02-20T09:00:00Z' },
]

export function AuditLogsReport() {
  const [actionFilter, setActionFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="wrap-break-word text-2xl font-bold text-gray-900 dark:text-gray-100">
            Audit Logs (User & Access)
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Who changed what and when — compliance/audit proof, export
          </p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
          <Download className="size-4" /> Export
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
        <div className="mt-3 flex flex-wrap gap-4">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">Admin user</label>
            <input type="text" placeholder="Filter by admin" className="mt-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">Action type</label>
            <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="mt-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
              <option value="">All</option>
              <option value="role_change">Role change</option>
              <option value="deactivate">Deactivate</option>
              <option value="reset_password">Reset password</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">Date from</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="mt-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400">Date to</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="mt-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100" />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <FileText className="size-4 text-primary" />
            Audit log entries
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead><tr><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Admin user</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Action</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Target</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Time</th></tr></thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
              {MOCK_LOGS.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{r.adminUser}</td>
                  <td className="px-4 py-3 text-sm capitalize text-gray-900 dark:text-gray-200">{r.action.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{r.target}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{new Date(r.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
