'use client'

import React from 'react'
import {
  MOCK_COMPLETION_BEFORE_AFTER,
  MOCK_ENGAGEMENT,
  MOCK_CENTER_UPLIFT,
  MOCK_BADGE_DISTRIBUTION,
} from '@/lib/gamification-analytics-data'
import { BarChart3, TrendingUp, Building2, Award } from 'lucide-react'

export function GamificationAnalytics() {
  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gamification Analytics (Impact Tracking)</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          See if gamification is working. Completion before/after, engagement uplift, center-wise, badge distribution. Avoid leaving it as just a feature.
        </p>
      </div>

      {/* Completion before/after badges */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><BarChart3 className="size-4" /> Completion rate before / after badges</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Metric</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Before</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">After</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Uplift</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_COMPLETION_BEFORE_AFTER.map((m) => (
              <tr key={m.id} className="border-t border-gray-100">
                <td className="px-3 py-2 font-medium text-gray-900">{m.label}</td>
                <td className="px-3 py-2 text-right text-gray-600">{m.before}{m.unit}</td>
                <td className="px-3 py-2 text-right text-gray-900">{m.after}{m.unit}</td>
                <td className="px-3 py-2 text-right text-green-600">+{m.upliftPercent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Engagement uplift */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><TrendingUp className="size-4" /> Engagement uplift (active users)</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {MOCK_ENGAGEMENT.map((e) => (
            <div key={e.label} className="rounded border border-gray-200 p-3">
              <p className="text-xs text-gray-500">{e.label}</p>
              <p className="text-xl font-semibold text-gray-900">{e.value}</p>
              <p className="text-xs text-green-600">+{e.change}% vs prior period</p>
            </div>
          ))}
        </div>
      </section>

      {/* Center-wise uplift */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><Building2 className="size-4" /> Center-wise uplift</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Center</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Before %</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">After %</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Uplift</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CENTER_UPLIFT.map((c) => (
              <tr key={c.center} className="border-t border-gray-100">
                <td className="px-3 py-2 font-medium text-gray-900">{c.center}</td>
                <td className="px-3 py-2 text-right text-gray-600">{c.before}%</td>
                <td className="px-3 py-2 text-right text-gray-900">{c.after}%</td>
                <td className="px-3 py-2 text-right text-green-600">+{c.uplift}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Badge earn distribution */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><Award className="size-4" /> Badge earn distribution (too easy / too hard)</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Badge</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Earned</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Eligible</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">%</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_BADGE_DISTRIBUTION.map((b) => (
              <tr key={b.badge} className="border-t border-gray-100">
                <td className="px-3 py-2 font-medium text-gray-900">{b.badge}</td>
                <td className="px-3 py-2 text-right text-gray-600">{b.earned}</td>
                <td className="px-3 py-2 text-right text-gray-600">{b.totalEligible}</td>
                <td className="px-3 py-2 text-right text-gray-900">{b.percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-gray-500">Use this to detect badges that are too easy (very high %) or too hard (very low %).</p>
      </section>
    </div>
  )
}
