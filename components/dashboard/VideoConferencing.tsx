'use client'

import React, { useState } from 'react'
import { MOCK_PROVIDERS } from '@/lib/video-conferencing-data'
import { Video, Settings } from 'lucide-react'

export function VideoConferencing() {
  const [attendanceMode, setAttendanceMode] = useState<'manual_only' | 'auto_fetch'>('manual_only')

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Video Conferencing (Meet / Zoom / Teams)</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Live session links and attendance sync. Start with manual attendance; add auto fetch later.
        </p>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Provider connect (OAuth / API key)</h2>
        <ul className="space-y-2">
          {MOCK_PROVIDERS.map((p) => (
            <li key={p.id} className="flex items-center justify-between rounded border border-gray-200 px-3 py-2">
              <span className="font-medium text-gray-900">{p.name}</span>
              <span className={p.connected ? 'text-green-600 text-sm' : 'text-gray-500 text-sm'}>{p.connected ? 'Connected' : 'Not connected'}</span>
              <button type="button" className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50">Configure</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><Settings className="size-4" /> Default meeting settings</h2>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded text-primary" /> Waiting room</label>
        <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" className="rounded text-primary" /> Mute on entry</label>
        <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" className="rounded text-primary" /> Allow recording</label>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Attendance sync mode</h2>
        <div className="flex flex-wrap gap-2">
          <label className={`flex cursor-pointer items-center rounded-lg border px-3 py-2 text-sm ${attendanceMode === 'manual_only' ? 'border-primary bg-primary/5' : 'border-gray-300 hover:bg-gray-50'}`}>
            <input type="radio" name="attendance" checked={attendanceMode === 'manual_only'} onChange={() => setAttendanceMode('manual_only')} className="sr-only" />
            Manual only
          </label>
          <label className={`flex cursor-pointer items-center rounded-lg border px-3 py-2 text-sm ${attendanceMode === 'auto_fetch' ? 'border-primary bg-primary/5' : 'border-gray-300 hover:bg-gray-50'}`}>
            <input type="radio" name="attendance" checked={attendanceMode === 'auto_fetch'} onChange={() => setAttendanceMode('auto_fetch')} className="sr-only" />
            Auto fetch (if supported)
          </label>
        </div>
        <p className="mt-2 text-xs text-gray-500">Practical to start with manual attendance; enable sync when ready.</p>
      </section>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <h2 className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900">Session sync result (logs)</h2>
        <div className="px-4 py-6 text-center text-sm text-gray-500">No sync logs yet.</div>
      </section>
    </div>
  )
}
