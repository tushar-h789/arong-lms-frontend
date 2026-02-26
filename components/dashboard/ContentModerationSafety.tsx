'use client'

import React, { useState } from 'react'
import {
  MOCK_REPORTED,
  MOCK_BLOCKED_USERS,
  MOCK_KEYWORD_FLAGS,
  REPORT_STATUS_LABELS,
  type ReportStatus,
} from '@/lib/content-moderation-data'
import { Shield, Flag, UserX, Key } from 'lucide-react'

export function ContentModerationSafety() {
  const [statusFilter, setStatusFilter] = useState<ReportStatus | ''>('pending')
  const [keywordInput, setKeywordInput] = useState('')

  const filtered = statusFilter
    ? MOCK_REPORTED.filter((r) => r.status === statusFilter)
    : MOCK_REPORTED

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Moderation & Safety</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Prevent inappropriate content and abuse (corporate). Reported queue, block/disable posting (permission-based), keyword flags. Safeguarding and brand risk management.
        </p>
      </div>

      {/* Reported posts queue */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
          <Flag className="size-4" />
          Reported posts queue
        </h2>
        <div className="mb-3 flex flex-wrap gap-2">
          {(['pending', 'reviewed', 'action_taken', 'dismissed'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${statusFilter === s ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              {REPORT_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <div className="overflow-hidden rounded border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Content</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Author</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Reported by</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Reason</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Status</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="max-w-[200px] px-3 py-2">
                    <span className="line-clamp-2 text-gray-900">{r.contentPreview}</span>
                    <span className="text-xs text-gray-500">{r.contentType}</span>
                  </td>
                  <td className="px-3 py-2 text-gray-600">{r.authorName}</td>
                  <td className="px-3 py-2 text-gray-600">{r.reportedBy}</td>
                  <td className="px-3 py-2 text-gray-600">{r.reason}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded px-1.5 py-0.5 text-xs ${r.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'}`}>
                      {REPORT_STATUS_LABELS[r.status]}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button type="button" className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50">Review</button>
                    <button type="button" className="ml-1 rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50">Remove</button>
                    <button type="button" className="ml-1 rounded border border-amber-200 px-2 py-1 text-xs text-amber-700 hover:bg-amber-50">Block user</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="py-6 text-center text-sm text-gray-500">No reported items.</div>}
      </section>

      {/* Block / disable user */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
          <UserX className="size-4" />
          Block / disable user from posting (permission-based)
        </h2>
        <p className="mb-3 text-sm text-gray-500">Users blocked here cannot post in discussions or help desk (or all communication, depending on permission).</p>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search user to block"
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          />
          <select className="rounded border border-gray-300 px-3 py-2 text-sm">
            <option value="posting">Block from posting only</option>
            <option value="all_communication">Block all communication</option>
          </select>
          <button type="button" className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100">Block user</button>
        </div>
        {MOCK_BLOCKED_USERS.length > 0 ? (
          <ul className="mt-4 divide-y divide-gray-200">
            {MOCK_BLOCKED_USERS.map((u) => (
              <li key={u.id} className="flex items-center justify-between py-2 text-sm">
                <span>{u.userName}</span>
                <span className="text-gray-500">{u.blockedFrom} · by {u.blockedBy}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">No users currently blocked.</p>
        )}
      </section>

      {/* Keyword flags (optional) */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
          <Key className="size-4" />
          Keyword flags (optional)
        </h2>
        <p className="mb-3 text-sm text-gray-500">Content containing these words can be flagged for review.</p>
        <div className="flex flex-wrap gap-2">
          {MOCK_KEYWORD_FLAGS.map((k) => (
            <span key={k} className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-700">{k}</span>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            placeholder="Add keyword"
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          />
          <button type="button" className="rounded border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">Add</button>
        </div>
      </section>
    </div>
  )
}
