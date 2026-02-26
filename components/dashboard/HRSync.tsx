'use client'

import React, { useState } from 'react'
import { DEFAULT_FIELD_MAPPINGS, MOCK_SYNC_LOGS } from '@/lib/hr-sync-data'
import { RefreshCw, Download } from 'lucide-react'

export function HRSync() {
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'manual'>('daily')
  const [newJoinersAuto, setNewJoinersAuto] = useState(true)
  const [leaversDeactivate, setLeaversDeactivate] = useState(true)

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">HR Sync (User / Org Data)</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Sync users, dept, center from HR. Field mapping, frequency, new joiners/leavers rules. Center/location/group mapping for assignment and reporting.
        </p>
      </div>

      {/* Field mapping */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Field mapping (HR → LMS)</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">HR field</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">LMS field</th>
            </tr>
          </thead>
          <tbody>
            {DEFAULT_FIELD_MAPPINGS.map((m, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="px-3 py-2 text-gray-900">{m.hrField}</td>
                <td className="px-3 py-2 text-gray-600">{m.lmsField}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Sync frequency */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Sync frequency</h2>
        <div className="flex flex-wrap gap-2">
          {(['daily', 'weekly', 'manual'] as const).map((f) => (
            <label key={f} className={`flex cursor-pointer items-center rounded-lg border px-3 py-2 text-sm ${frequency === f ? 'border-primary bg-primary/5' : 'border-gray-300 hover:bg-gray-50'}`}>
              <input type="radio" name="frequency" checked={frequency === f} onChange={() => setFrequency(f)} className="sr-only" />
              {f === 'daily' ? 'Daily' : f === 'weekly' ? 'Weekly' : 'Manual'}
            </label>
          ))}
        </div>
      </section>

      {/* Rules */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Rules</h2>
        <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={newJoinersAuto} onChange={(e) => setNewJoinersAuto(e.target.checked)} className="rounded text-primary" /> New joiners: auto-create users</label>
        <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={leaversDeactivate} onChange={(e) => setLeaversDeactivate(e.target.checked)} className="rounded text-primary" /> Leavers: deactivate users</label>
      </section>

      {/* Sync logs */}
      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900"><RefreshCw className="size-4" /> Sync logs</h2>
          <button type="button" className="inline-flex items-center gap-1.5 rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"><Download className="size-4" /> Download failed rows</button>
        </div>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Run at</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Success</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Failed</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_SYNC_LOGS.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-900">{new Date(log.runAt).toLocaleString()}</td>
                <td className="px-3 py-2 text-right text-green-600">{log.successCount}</td>
                <td className="px-3 py-2 text-right text-red-600">{log.failCount}</td>
                <td className="px-3 py-2"><span className={`rounded px-1.5 py-0.5 text-xs ${log.status === 'success' ? 'bg-green-100 text-green-800' : log.status === 'partial' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>{log.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
