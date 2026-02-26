'use client'

import React, { useState } from 'react'
import {
  MOCK_BADGES,
  BADGE_TRIGGER_TYPES,
  BADGE_VISIBILITY,
  AARONG_RECOMMENDED_BADGES,
} from '@/lib/badges-data'
import { Award, Plus, Eye, Shield, Star, Clock, Flame } from 'lucide-react'

export function Badges() {
  const [createOpen, setCreateOpen] = useState(false)
  const [previewId, setPreviewId] = useState<string | null>(null)

  const previewBadge = previewId ? MOCK_BADGES.find((b) => b.id === previewId) : null

  const RecommendedIcon = ({ name }: { name: string }) => {
    if (name.includes('Safety')) return <Shield className="size-5 text-gray-500" />
    if (name.includes('Quality')) return <Star className="size-5 text-gray-500" />
    if (name.includes('On-time')) return <Clock className="size-5 text-gray-500" />
    if (name.includes('Consistency')) return <Flame className="size-5 text-gray-500" />
    return <Award className="size-5 text-gray-500" />
  }

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Badges (Badge Rules & Management)</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Award badges for specific achievements. Rule builder, visibility. On-time completion badge is especially useful.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Create badge
        </button>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Aarong-friendly badges (recommended)</h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {AARONG_RECOMMENDED_BADGES.map((b) => (
            <li key={b.name} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <RecommendedIcon name={b.name} />
              </div>
              <div>
                <span className="font-medium text-gray-900">{b.name}</span>
                <p className="text-xs text-gray-500">{b.trigger}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Badge</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Trigger</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Visibility</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_BADGES.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Award className="size-4 text-primary" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{b.name}</span>
                      <p className="line-clamp-1 text-xs text-gray-500">{b.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-gray-600">{BADGE_TRIGGER_TYPES.find((t) => t.id === b.triggerType)?.label ?? b.triggerType}</td>
                <td className="px-3 py-2 text-gray-600">{BADGE_VISIBILITY.find((v) => v.id === b.visibility)?.label ?? b.visibility}</td>
                <td className="px-3 py-2 text-right">
                  <button type="button" onClick={() => setPreviewId(b.id)} className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50">Preview</button>
                  <button type="button" className="ml-1 rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {previewBadge && (
        <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><Eye className="size-4" /> Badge preview & test rule</h2>
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex flex-col items-center rounded-lg border border-gray-200 p-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
                <Award className="size-7 text-primary" />
              </div>
              <span className="mt-2 font-medium text-gray-900">{previewBadge.name}</span>
              <p className="mt-1 text-center text-xs text-gray-500">{previewBadge.description}</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Trigger: {BADGE_TRIGGER_TYPES.find((t) => t.id === previewBadge.triggerType)?.label}. Visibility: {BADGE_VISIBILITY.find((v) => v.id === previewBadge.visibility)?.label}.</p>
              <button type="button" className="mt-2 rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">Test rule</button>
            </div>
          </div>
          <button type="button" onClick={() => setPreviewId(null)} className="mt-2 text-sm text-gray-500 hover:underline">Close preview</button>
        </section>
      )}

      {createOpen && (
        <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Create badge</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
              <input type="text" placeholder="e.g. Safety Ready" className="w-full max-w-md rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Icon (URL or upload)</label>
              <input type="text" placeholder="/badges/icon.svg" className="w-full max-w-md rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Description (simple, clear)</label>
              <textarea rows={2} placeholder="e.g. Completed Safety course." className="w-full max-w-md rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Badge trigger (rule builder)</label>
              <select className="w-full max-w-md rounded border border-gray-300 px-3 py-2 text-sm">
                {BADGE_TRIGGER_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Badge visibility</label>
              <div className="flex flex-wrap gap-2">
                {BADGE_VISIBILITY.map((v) => (
                  <label key={v.id} className="flex cursor-pointer items-center gap-2 rounded border border-gray-300 px-3 py-2 text-sm">
                    <input type="radio" name="visibility" value={v.id} className="text-primary" />
                    {v.label}
                  </label>
                ))}
              </div>
              <input type="text" placeholder="Select center or role (if not global)" className="mt-2 w-full max-w-md rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setCreateOpen(false)} className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
              <button type="button" className="rounded border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">Save badge</button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
