'use client'

import React from 'react'
import {
  MOCK_UPTIME,
  MOCK_EXPORT_FAILURES,
  MOCK_INTEGRATION_FAILURES,
  MOCK_STORAGE,
} from '@/lib/system-logs-health-data'
import { Activity, FileWarning, Plug, HardDrive } from 'lucide-react'

export function SystemLogsHealth() {
  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Logs / Health</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          System status, errors, uptime overview. See where system issues are at a glance.
        </p>
      </div>

      {/* Uptime / downtime summary */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><Activity className="size-4" /> Uptime / downtime summary</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded border border-gray-200 p-3">
            <p className="text-xs text-gray-500">{MOCK_UPTIME.period}</p>
            <p className="text-2xl font-semibold text-green-600">{MOCK_UPTIME.uptimePercent}%</p>
            <p className="text-xs text-gray-500">Uptime</p>
          </div>
          <div className="rounded border border-gray-200 p-3">
            <p className="text-xs text-gray-500">Downtime</p>
            <p className="text-2xl font-semibold text-gray-900">{MOCK_UPTIME.downtimeMinutes} min</p>
          </div>
          <div className="rounded border border-gray-200 p-3">
            <p className="text-xs text-gray-500">Incidents</p>
            <p className="text-2xl font-semibold text-gray-900">{MOCK_UPTIME.incidents}</p>
          </div>
        </div>
      </section>

      {/* Export job failures */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><FileWarning className="size-4" /> Export job failures</h2>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Job type</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Failed at</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Reason</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_EXPORT_FAILURES.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-900">{f.jobType}</td>
                <td className="px-3 py-2 text-gray-600">{new Date(f.failedAt).toLocaleString()}</td>
                <td className="px-3 py-2 text-red-600">{f.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {MOCK_EXPORT_FAILURES.length === 0 && <p className="py-4 text-center text-sm text-gray-500">No export failures.</p>}
      </section>

      {/* Integration failures */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><Plug className="size-4" /> Integration failures</h2>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Integration</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Failed at</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Reason</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_INTEGRATION_FAILURES.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-900">{f.integration}</td>
                <td className="px-3 py-2 text-gray-600">{new Date(f.failedAt).toLocaleString()}</td>
                <td className="px-3 py-2 text-red-600">{f.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Storage usage (assets) */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><HardDrive className="size-4" /> Storage usage (assets)</h2>
        <div className="flex items-center gap-4">
          <div className="h-4 flex-1 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full rounded-full bg-primary" style={{ width: `${MOCK_STORAGE.percentUsed}%` }} />
          </div>
          <span className="text-sm font-medium text-gray-700">{MOCK_STORAGE.assetsUsedMB} MB / {MOCK_STORAGE.assetsLimitMB} MB ({MOCK_STORAGE.percentUsed}%)</span>
        </div>
      </section>
    </div>
  )
}
