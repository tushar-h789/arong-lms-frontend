'use client'

import React, { useState } from 'react'
import { MOCK_SYSTEM_TEMPLATES, TEMPLATE_VARIABLES } from '@/lib/email-sms-templates-data'
import { Eye, Send } from 'lucide-react'

export function EmailSMSMessageTemplates() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = selectedId ? MOCK_SYSTEM_TEMPLATES.find((t) => t.id === selectedId) : null

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Email / SMS / Message Templates</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          System notifications: assignment, due reminder, overdue, certificate. Variables: name, course, dueDate, center. Short Bangla-friendly templates for WhatsApp/SMS.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Templates</h2>
          <ul className="space-y-2">
            {MOCK_SYSTEM_TEMPLATES.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(t.id)}
                  className={`w-full rounded border px-3 py-2 text-left text-sm ${selectedId === t.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <span className="font-medium text-gray-900">{t.name}</span>
                  <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{t.channel}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Edit & preview</h2>
          {selected ? (
            <>
              <textarea rows={4} defaultValue={selected.body} className="w-full rounded border border-gray-300 px-3 py-2 text-sm" placeholder="Use variables: {TEMPLATE_VARIABLES.join(', ')}" />
              <p className="mt-2 text-xs text-gray-500">Variables: {TEMPLATE_VARIABLES.join(', ')}</p>
              <div className="mt-3 flex gap-2">
                <button type="button" className="inline-flex items-center gap-1.5 rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"><Eye className="size-4" /> Preview</button>
                <button type="button" className="inline-flex items-center gap-1.5 rounded border border-primary bg-primary/10 px-3 py-1.5 text-sm text-primary hover:bg-primary/20"><Send className="size-4" /> Test send</button>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">Select a template to edit.</p>
          )}
        </section>
      </div>
    </div>
  )
}
