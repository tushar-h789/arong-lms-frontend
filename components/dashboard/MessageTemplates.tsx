'use client'

import React, { useState } from 'react'
import {
  MOCK_MESSAGE_TEMPLATES,
  PLACEHOLDERS,
  PLACEHOLDER_LABELS,
} from '@/lib/message-templates-data'
import { FileText, Plus } from 'lucide-react'

export function MessageTemplates() {
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="min-w-0 space-y-4 overflow-x-hidden">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Message Templates (Admin / Trainer)</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Reuse the same messages (e.g. simple Bangla). Placeholders: name, center, course. Speeds up operational work.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90"
        >
          <Plus className="size-4" />
          New template
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <ul className="divide-y divide-gray-200">
          {MOCK_MESSAGE_TEMPLATES.map((t) => (
            <li key={t.id} className="flex flex-col gap-2 px-4 py-3 hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-gray-400" />
                  <span className="font-medium text-gray-900">{t.name}</span>
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{t.channel}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{t.body}</p>
                <div className="mt-1 flex flex-wrap gap-1 text-xs text-gray-500">
                  {t.placeholders.map((p) => (
                    <span key={p} className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">{p}</span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <button type="button" className="rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">Edit</button>
                <button type="button" className="rounded border border-primary px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10">Use</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* New template */}
      {createOpen && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">New template</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Template name</label>
              <input type="text" placeholder="e.g. Class today" className="w-full max-w-md rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Body (use placeholders)</label>
              <textarea rows={3} placeholder="Hi {name}, your class is at {center}..." className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
              <p className="mt-1 text-xs text-gray-500">Available: {PLACEHOLDERS.join(', ')}</p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Placeholder reference</label>
              <ul className="flex flex-wrap gap-2 text-xs">
                {PLACEHOLDERS.map((p) => (
                  <li key={p} className="rounded bg-gray-100 px-2 py-1">
                    <code>{p}</code> — {PLACEHOLDER_LABELS[p]}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Channel</label>
              <select className="rounded border border-gray-300 px-3 py-2 text-sm">
                <option value="in_app">In-app</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setCreateOpen(false)} className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
              <button type="button" className="rounded border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">Save template</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
