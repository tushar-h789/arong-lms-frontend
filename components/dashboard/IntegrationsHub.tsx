'use client'

import React from 'react'
import Link from 'next/link'
import { MOCK_INTEGRATIONS } from '@/lib/integrations-hub-data'
import { Plug, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

export function IntegrationsHub() {
  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Integrations Hub</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          All integrations in one place. Status, test connection, last sync, next run. See what is broken at a glance.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Integration</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Status</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Last run</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Next scheduled</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_INTEGRATIONS.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-900">{row.name}</td>
                <td className="px-3 py-2">
                  {row.status === 'connected' && <span className="flex items-center gap-1 text-green-600"><CheckCircle className="size-4" /> Connected</span>}
                  {row.status === 'disconnected' && <span className="flex items-center gap-1 text-gray-500"><XCircle className="size-4" /> Disconnected</span>}
                  {row.status === 'error' && <span className="flex items-center gap-1 text-amber-600"><AlertCircle className="size-4" /> Error</span>}
                </td>
                <td className="px-3 py-2 text-gray-600">{row.lastRun ? new Date(row.lastRun).toLocaleString() : '—'}</td>
                <td className="px-3 py-2 text-gray-600">{row.nextRun ? new Date(row.nextRun).toLocaleString() : '—'}</td>
                <td className="px-3 py-2 text-right">
                  <button type="button" className="rounded border border-gray-300 px-2 py-1 text-xs font-medium hover:bg-gray-50">Test connection</button>
                  {row.configUrl && <Link href={row.configUrl} className="ml-1 text-xs text-primary hover:underline">Configure</Link>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
