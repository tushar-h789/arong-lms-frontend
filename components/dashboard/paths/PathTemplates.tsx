'use client'

import React from 'react'
import Link from 'next/link'
import { PATH_TEMPLATES, type PathTemplateRow } from '@/lib/path-templates-data'
import { Layers, Plus, Calendar } from 'lucide-react'

export function PathTemplates() {
  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Path Templates</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          One-click creation of paths Aarong uses repeatedly. Auto step structure + placeholder content. HR can rollout quickly.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {PATH_TEMPLATES.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  )
}

function TemplateCard({ template }: { template: PathTemplateRow }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            <Calendar className="size-3" />
            {template.durationLabel}
          </span>
          <h2 className="mt-2 font-semibold text-gray-900 dark:text-gray-100">{template.name}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{template.description}</p>
        </div>
      </div>
      <div className="mt-4 border-t border-gray-100 dark:border-gray-600 pt-4">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Auto step structure ({template.defaultSteps.length} steps)</p>
        <ul className="mt-2 space-y-1">
          {template.defaultSteps.slice(0, 4).map((s, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Layers className="size-3.5 shrink-0 text-gray-400 dark:text-gray-500" />
              {s.title}
            </li>
          ))}
          {template.defaultSteps.length > 4 && (
            <li className="text-xs text-gray-500 dark:text-gray-400">+{template.defaultSteps.length - 4} more</li>
          )}
        </ul>
      </div>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Used {template.usedCount} times · Last: {new Date(template.lastUsedAt).toLocaleDateString()}
      </p>
      <Link
        href={`/dashboard/admin/paths/new?template=${template.id}`}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-primary bg-primary/5 dark:bg-primary/10 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 dark:hover:bg-primary/20"
      >
        <Plus className="size-4" />
        Use template to create path
      </Link>
    </div>
  )
}
