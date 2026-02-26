'use client'

import React, { useState } from 'react'
import {
  LEADERBOARD_TYPES,
  TIME_WINDOWS,
  CRAFT_FILTERS,
  MOCK_TOP_ENTRIES,
  type LeaderboardType,
  type TimeWindow,
  type CraftFilter,
} from '@/lib/leaderboards-data'
import { Trophy, Eye, EyeOff } from 'lucide-react'

export function Leaderboards() {
  const [type, setType] = useState<LeaderboardType>('center')
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('monthly')
  const [craftFilter, setCraftFilter] = useState<CraftFilter>('all')
  const [hideNames, setHideNames] = useState(true)
  const [topNOnly, setTopNOnly] = useState(10)

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leaderboards (Center / Department Ranking)</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Friendly competition, handled sensitively. Top performers highlight only — no public lowest performers list.
        </p>
      </div>

      {/* Leaderboard type */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Leaderboard type</h2>
        <div className="flex flex-wrap gap-2">
          {LEADERBOARD_TYPES.map((t) => (
            <label
              key={t.id}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${type === t.id ? 'border-primary bg-primary/5 text-primary' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              <input type="radio" name="lbType" checked={type === t.id} onChange={() => setType(t.id)} className="sr-only" />
              {t.id === 'center' && <span className="text-xs text-amber-600">Recommended</span>}
              {t.label}
            </label>
          ))}
        </div>
      </section>

      {/* Time window */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Time window</h2>
        <div className="flex flex-wrap gap-2">
          {TIME_WINDOWS.map((w) => (
            <label key={w.id} className={`flex cursor-pointer items-center rounded-lg border px-3 py-2 text-sm ${timeWindow === w.id ? 'border-primary bg-primary/5' : 'border-gray-300 hover:bg-gray-50'}`}>
              <input type="radio" name="timeWindow" checked={timeWindow === w.id} onChange={() => setTimeWindow(w.id)} className="sr-only" />
              {w.label}
            </label>
          ))}
        </div>
      </section>

      {/* Filters: craft */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Filters</h2>
        <label className="mb-2 block text-xs text-gray-500">Craft type</label>
        <select value={craftFilter} onChange={(e) => setCraftFilter(e.target.value as CraftFilter)} className="rounded border border-gray-300 px-3 py-2 text-sm">
          {CRAFT_FILTERS.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </section>

      {/* Display controls */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Display controls</h2>
        <div className="space-y-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" checked={hideNames} onChange={(e) => setHideNames(e.target.checked)} className="rounded text-primary" />
            <EyeOff className="size-4 text-gray-500" />
            Hide individual names (anonymized option)
          </label>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Show top</label>
            <input type="number" min={1} max={50} value={topNOnly} onChange={(e) => setTopNOnly(Number(e.target.value))} className="w-16 rounded border border-gray-300 px-2 py-1 text-sm" />
            <span className="text-sm text-gray-500">only</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-amber-700">Do not show lowest performers publicly. Top performers highlight only.</p>
      </section>

      {/* Preview: top performers only */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><Trophy className="size-4" /> Top performers (preview)</h2>
        <ul className="space-y-2">
          {MOCK_TOP_ENTRIES.map((e) => (
            <li key={e.rank} className="flex items-center justify-between rounded border border-gray-100 px-3 py-2">
              <span className="font-medium text-gray-900">#{e.rank}</span>
              <span className="text-gray-700">{e.isAnonymized ? 'Anonymous' : e.label}</span>
              <span className="text-primary font-medium">{e.points} pts</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
