'use client'

import React from 'react'
import {
  RECOGNITION_RULES,
  REWARD_TYPES,
  MOCK_WINNERS,
} from '@/lib/rewards-recognition-data'
import { Award, Download } from 'lucide-react'

export function RewardsRecognition() {
  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rewards & Recognition (Recommended)</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Recognition for badge/points achievers (Aarong culture). Monthly top centers, best improvement. Non-cash, certificate, recognition post. Export for HR.
        </p>
      </div>

      {/* Recognition rules */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Recognition rules</h2>
        <ul className="space-y-2">
          {RECOGNITION_RULES.map((r) => (
            <li key={r.id} className="flex items-center justify-between rounded border border-gray-200 p-3">
              <span className="font-medium text-gray-900">{r.label}</span>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked className="rounded text-primary" />
                Enabled
              </label>
            </li>
          ))}
        </ul>
      </section>

      {/* Reward mapping */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Reward mapping (non-cash / certificate / recognition post)</h2>
        <div className="flex flex-wrap gap-2">
          {REWARD_TYPES.map((t) => (
            <span key={t.id} className="rounded bg-gray-100 px-3 py-1.5 text-sm text-gray-700">{t.label}</span>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">Map each recognition rule to one or more reward types. Recognition is a strong motivator for rural artisans.</p>
      </section>

      {/* Winner list + export */}
      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900"><Award className="size-4" /> Winner list</h2>
          <button type="button" className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="size-4" />
            Export winner list (HR)
          </button>
        </div>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Period</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Rule</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Winner</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Reward</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_WINNERS.map((w, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-900">{w.period}</td>
                <td className="px-3 py-2 text-gray-600">{w.rule}</td>
                <td className="px-3 py-2 font-medium text-gray-900">{w.center}</td>
                <td className="px-3 py-2 text-gray-600">{w.reward}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
