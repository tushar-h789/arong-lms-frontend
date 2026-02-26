'use client'

import React, { useState } from 'react'
import { MOCK_LIVE_SESSIONS, PLATFORMS } from '@/lib/live-sessions-data'
import { Video, Plus, Calendar, Users, FileText, Film, Link2 } from 'lucide-react'

export function LiveSessions() {
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="min-w-0 space-y-4 overflow-x-hidden">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Sessions (Class & Attendance)</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Schedule live class (Meet/Zoom/Teams), set audience, mark attendance. Handout PDF and recording link. Skill training often needs live demo + Q&A.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Create session
        </button>
      </div>

      {/* Session list */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">Session</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">When</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">Audience</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">Attendance</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">Materials</th>
              <th className="px-3 py-2 text-right text-xs font-semibold uppercase text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {MOCK_LIVE_SESSIONS.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Video className="size-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{s.title}</span>
                  </div>
                  <a href={s.meetLink} target="_blank" rel="noreferrer" className="mt-0.5 flex items-center gap-1 text-xs text-primary hover:underline">
                    <Link2 className="size-3" /> {PLATFORMS.find((p) => p.id === s.platform)?.label} link
                  </a>
                </td>
                <td className="px-3 py-2 text-sm text-gray-600">
                  {new Date(s.startAt).toLocaleString()} · {s.durationMinutes} min
                </td>
                <td className="px-3 py-2 text-sm text-gray-600">{s.targetLabel}</td>
                <td className="px-3 py-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><Users className="size-4" /> {s.attendanceMarked}/{s.attendanceTotal}</span>
                </td>
                <td className="px-3 py-2 text-sm text-gray-600">
                  {s.handoutPdfUrl && <span className="inline-flex items-center gap-1"><FileText className="size-3" /> Handout</span>}
                  {s.recordingUrl && <span className="ml-2 inline-flex items-center gap-1"><Film className="size-3" /> Recording</span>}
                </td>
                <td className="px-3 py-2 text-right">
                  <button type="button" className="rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">Mark attendance</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {MOCK_LIVE_SESSIONS.length === 0 && <div className="px-4 py-8 text-center text-sm text-gray-500">No live sessions yet.</div>}
      </div>

      {/* Create session */}
      {createOpen && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900"><Video className="size-4" /> Create session</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
              <input type="text" placeholder="Session title" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Platform & link</label>
              <select className="mb-2 w-full rounded border border-gray-300 px-3 py-2 text-sm">
                {PLATFORMS.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
              <input type="url" placeholder="Meet / Zoom / Teams link" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Date & time</label>
              <input type="datetime-local" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Duration (minutes)</label>
              <input type="number" min={1} placeholder="60" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Target audience</label>
              <select className="w-full rounded border border-gray-300 px-3 py-2 text-sm">
                <option value="course">By course</option>
                <option value="center">By center</option>
                <option value="group">By group</option>
              </select>
              <input type="text" placeholder="Select course / center / group" className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Session materials</label>
              <input type="text" placeholder="Handout PDF URL" className="mb-2 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
              <input type="text" placeholder="Recording link (optional, add after session)" className="w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => setCreateOpen(false)} className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
            <button type="button" className="rounded border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">Create session</button>
          </div>
        </div>
      )}
    </div>
  )
}
