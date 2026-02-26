'use client'

import React from 'react'
import { MOCK_AMS_LOGS } from '@/lib/ams-integration-data'
import { Workflow, Download, RefreshCw } from 'lucide-react'

export function AMSIntegration() {
  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AMS Integration (Approval / Workflow)</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Approval Management System. Training request → LMS assignment, completion status → AMS update. Audit trail and process automation.
        </p>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">API credentials & webhooks</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">API base URL</label>
            <input type="url" placeholder="https://ams.example.com/api" className="w-full max-w-md rounded border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">API key / credentials</label>
            <input type="password" placeholder="••••••••" className="w-full max-w-md rounded border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Webhook URL (AMS → LMS)</label>
            <input type="url" placeholder="https://lms.example.com/webhooks/ams" className="w-full max-w-md rounded border border-gray-300 px-3 py-2 text-sm" />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Mapping</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center justify-between rounded border border-gray-100 px-3 py-2"><span>Training request (AMS)</span><span className="text-gray-500">→</span><span>LMS assignment</span></li>
          <li className="flex items-center justify-between rounded border border-gray-100 px-3 py-2"><span>Completion status (LMS)</span><span className="text-gray-500">→</span><span>AMS update</span></li>
        </ul>
      </section>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900">Logs</h2>
          <div className="flex gap-2">
            <button type="button" className="inline-flex items-center gap-1.5 rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"><RefreshCw className="size-4" /> Retry failed sync</button>
            <button type="button" className="inline-flex items-center gap-1.5 rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"><Download className="size-4" /> Export</button>
          </div>
        </div>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Direction</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Action</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Status</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">At</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_AMS_LOGS.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-600">{log.direction === 'in' ? 'In' : 'Out'}</td>
                <td className="px-3 py-2 text-gray-900">{log.action}</td>
                <td className="px-3 py-2">{log.status === 'success' ? <span className="text-green-600">Success</span> : <span className="text-red-600">Failed</span>}</td>
                <td className="px-3 py-2 text-gray-500">{new Date(log.at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
