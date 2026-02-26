'use client'

import React, { useState } from 'react'
import { DEFAULT_POINTS_RULES, MOCK_LEDGER, type PointsRule } from '@/lib/points-data'
import { Coins } from 'lucide-react'

export function PointsRules() {
  const [rules, setRules] = useState<PointsRule[]>(DEFAULT_POINTS_RULES)
  const [dailyCap, setDailyCap] = useState(100)
  const [noDuplicateRewatch, setNoDuplicateRewatch] = useState(true)
  const [ledgerUserFilter, setLedgerUserFilter] = useState('')

  const updateRulePoints = (id: string, points: number) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, points } : r)))
  }

  const ledgerFiltered = ledgerUserFilter
    ? MOCK_LEDGER.filter((e) => e.userName.toLowerCase().includes(ledgerUserFilter.toLowerCase()))
    : MOCK_LEDGER

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Points (Points Rules)</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Small rewards for habits. On-time & attendance get extra weight. Daily cap and no duplicate points for rewatch. Few but meaningful.
        </p>
      </div>

      {/* Points earn rules */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Coins className="size-4" />
          Points earn rules
        </h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Action</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Points</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Enabled</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-900">{r.label}</td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    value={r.points}
                    onChange={(e) => updateRulePoints(r.id, Number(e.target.value))}
                    className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={r.enabled}
                      onChange={(e) => setRules((prev) => prev.map((x) => (x.id === r.id ? { ...x, enabled: e.target.checked } : x)))}
                      className="rounded text-primary"
                    />
                    On
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-gray-500">Give extra weight to On-time completion and Attendance bonus to increase completion.</p>
      </section>

      {/* Points limits */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Points limits</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Daily cap (abuse prevent)</label>
            <input
              type="number"
              min={0}
              value={dailyCap}
              onChange={(e) => setDailyCap(Number(e.target.value))}
              className="w-24 rounded border border-gray-300 px-3 py-2 text-sm"
            />
            <span className="text-sm text-gray-500">points per user per day</span>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={noDuplicateRewatch}
              onChange={(e) => setNoDuplicateRewatch(e.target.checked)}
              className="rounded text-primary"
            />
            Duplicate points rules: no points for same course rewatch
          </label>
        </div>
      </section>

      {/* Points ledger (admin) */}
      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <h2 className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900">Points ledger (user-wise history)</h2>
        <div className="p-3">
          <input
            type="text"
            placeholder="Search by user name"
            value={ledgerUserFilter}
            onChange={(e) => setLedgerUserFilter(e.target.value)}
            className="w-full max-w-xs rounded border border-gray-300 px-3 py-1.5 text-sm"
          />
        </div>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">User</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Action</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Points</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Date</th>
            </tr>
          </thead>
          <tbody>
            {ledgerFiltered.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-900">{e.userName}</td>
                <td className="px-3 py-2 text-gray-600">{e.action}</td>
                <td className="px-3 py-2 text-gray-600">+{e.points}</td>
                <td className="px-3 py-2 text-gray-500">{new Date(e.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {ledgerFiltered.length === 0 && <div className="px-4 py-8 text-center text-sm text-gray-500">No ledger entries.</div>}
      </section>
    </div>
  )
}
