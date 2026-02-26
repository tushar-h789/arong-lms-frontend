'use client'

import React, { useState } from 'react'
import { LANGUAGE_VARIANTS, type LanguageVariantRow } from '@/lib/localization-data'
import { Search, Languages, FileText, Eye, Plus } from 'lucide-react'

export function Localization() {
  const [search, setSearch] = useState('')
  const filtered = LANGUAGE_VARIANTS.filter((row) =>
    row.courseTitle.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Localization / Language Management</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Same course in multiple languages + simple visual version. Language variants, subtitles/transcript upload, Visual-first version tag.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <input
          type="search"
          placeholder="Search by course title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-10 pr-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((row) => (
          <LocalizationCard key={row.id} row={row} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          No courses with language variants match your search.
        </div>
      )}
    </div>
  )
}

function LocalizationCard({ row }: { row: LanguageVariantRow }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">{row.courseTitle}</h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Primary: {row.primaryLanguage === 'bn' ? 'Bengali' : row.primaryLanguage} · Updated {new Date(row.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-primary px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10"
        >
          <Plus className="size-4" />
          Add variant
        </button>
      </div>
      <ul className="mt-4 space-y-2">
        {row.variants.map((v) => (
          <li
            key={v.lang}
            className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-100 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50 px-4 py-3"
          >
            <Languages className="size-4 text-gray-400 dark:text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-gray-100">{v.label}</span>
            {v.hasSubtitles && (
              <span className="rounded bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 text-xs text-blue-800 dark:text-blue-300">Subtitles</span>
            )}
            {v.hasTranscript && (
              <span className="rounded bg-slate-100 dark:bg-slate-600/50 px-2 py-0.5 text-xs text-slate-700 dark:text-slate-300">Transcript</span>
            )}
            {v.visualFirst && (
              <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                <Eye className="size-3" />
                Visual-first version
              </span>
            )}
            <button type="button" className="ml-auto text-sm text-primary hover:underline">
              Edit / upload subtitles
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
