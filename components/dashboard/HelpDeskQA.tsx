'use client'

import React, { useState } from 'react'
import {
  MOCK_TICKETS,
  QUESTION_CATEGORIES,
  TICKET_STATUSES,
  type QuestionCategory,
  type TicketStatus,
} from '@/lib/help-desk-data'
import { HelpCircle, Plus, MessageSquare, Mic, Image as ImageIcon, Pin } from 'lucide-react'

export function HelpDeskQA() {
  const [categoryFilter, setCategoryFilter] = useState<QuestionCategory | ''>('')
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('')
  const [askOpen, setAskOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = MOCK_TICKETS.filter((t) => {
    if (categoryFilter && t.category !== categoryFilter) return false
    if (statusFilter && t.status !== statusFilter) return false
    return true
  })
  const selected = selectedId ? filtered.find((t) => t.id === selectedId) : null

  return (
    <div className="min-w-0 space-y-4 overflow-x-hidden">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help Desk / Q&A</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Artisans ask questions; trainer or support team replies. Text, voice note, or image. FAQ pin for best answers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAskOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Ask a question
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as QuestionCategory | '')}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="">All categories</option>
          {QUESTION_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TicketStatus | '')}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="">All statuses</option>
          {TICKET_STATUSES.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Ticket list */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <ul className="divide-y divide-gray-200">
            {filtered.map((t) => (
              <li
                key={t.id}
                className={`cursor-pointer px-4 py-3 hover:bg-gray-50 ${selectedId === t.id ? 'bg-primary/5' : ''}`}
                onClick={() => setSelectedId(t.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-gray-900">{t.subject}</span>
                  <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs ${t.status === 'resolved' ? 'bg-green-100 text-green-800' : t.status === 'answered' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'}`}>
                    {t.status}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-sm text-gray-500">{QUESTION_CATEGORIES.find((c) => c.id === t.category)?.label} · {t.askedBy}</p>
                {t.replies.some((r) => r.isPinnedAsFaq) && (
                  <span className="mt-1 inline-flex items-center gap-1 text-xs text-primary"><Pin className="size-3" /> FAQ</span>
                )}
              </li>
            ))}
          </ul>
          {filtered.length === 0 && <div className="px-4 py-8 text-center text-sm text-gray-500">No questions match filters.</div>}
        </div>

        {/* Detail + reply */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          {selected ? (
            <>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900">{selected.subject}</h3>
                <p className="mt-1 text-sm text-gray-600">{selected.body}</p>
                <p className="mt-1 text-xs text-gray-500">{selected.askedBy} · {new Date(selected.askedAt).toLocaleString()}{selected.courseName ? ` · ${selected.courseName}` : ''}</p>
              </div>
              <div className="space-y-3">
                <span className="text-sm font-medium text-gray-700">Replies</span>
                {selected.replies.map((r) => (
                  <div key={r.id} className={`rounded border p-3 ${r.isPinnedAsFaq ? 'border-primary bg-primary/5' : 'border-gray-200 bg-gray-50'}`}>
                    {r.isPinnedAsFaq && <span className="inline-flex items-center gap-1 text-xs font-medium text-primary"><Pin className="size-3" /> Pinned as FAQ</span>}
                    <p className="mt-1 text-sm text-gray-900">{r.body}</p>
                    {r.attachmentType === 'image' && <span className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500"><ImageIcon className="size-3" /> Image attached</span>}
                    {r.attachmentType === 'voice' && <span className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500"><Mic className="size-3" /> Voice note</span>}
                    <p className="mt-2 text-xs text-gray-500">{r.repliedBy} · {new Date(r.repliedAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-gray-200 pt-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Reply (text, voice note, or image)</label>
                <textarea rows={2} placeholder="Type your reply..." className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
                <div className="mt-2 flex flex-wrap gap-2">
                  <button type="button" className="inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50"><Mic className="size-3" /> Voice note</button>
                  <button type="button" className="inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50"><ImageIcon className="size-3" /> Image</button>
                  <button type="button" className="rounded border border-primary bg-primary px-3 py-1 text-xs font-medium text-white hover:bg-primary/90">Send reply</button>
                </div>
                <div className="mt-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded text-primary" />
                    Pin as FAQ (best answer)
                  </label>
                </div>
                <select className="mt-2 rounded border border-gray-300 px-2 py-1 text-sm">
                  {TICKET_STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">Select a question to view and reply.</p>
          )}
        </div>
      </div>

      {/* Ask a question — simple form */}
      {askOpen && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900"><HelpCircle className="size-4" /> Ask a question</h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
              <select className="w-full max-w-xs rounded border border-gray-300 px-3 py-2 text-sm">
                {QUESTION_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Subject</label>
              <input type="text" placeholder="Short subject" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Your question</label>
              <textarea rows={3} placeholder="Describe your question..." className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setAskOpen(false)} className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
              <button type="button" className="rounded border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">Submit question</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
