'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  TEMPLATES,
  TEMPLATE_TYPE_LABELS,
  type TemplateRow,
  type TemplateType,
} from '@/lib/course-templates-data'
import { BookOpen, Layers, FileQuestion, Plus, ChevronRight } from 'lucide-react'

export function CourseTemplates() {
  const [filter, setFilter] = useState<TemplateType | 'all'>('all')
  const filtered = filter === 'all' ? TEMPLATES : TEMPLATES.filter((t) => t.templateType === filter)

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Course Templates</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Repeatable patterns for Safety, SOP, Skill — auto module structure + placeholder lessons + standard quiz. ~50% less time to create new courses.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            filter === 'all' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          All
        </button>
        {(Object.entries(TEMPLATE_TYPE_LABELS) as [TemplateType, string][]).map(([type, label]) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilter(type)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              filter === type ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  )
}

function TemplateCard({ template }: { template: TemplateRow }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {TEMPLATE_TYPE_LABELS[template.templateType]}
          </span>
          <h2 className="mt-2 font-semibold text-gray-900 dark:text-gray-100">{template.name}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{template.description}</p>
        </div>
      </div>
      <ul className="mt-4 space-y-2 border-t border-gray-100 dark:border-gray-600 pt-4">
        <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Layers className="size-4 text-gray-400 dark:text-gray-500" />
          {template.defaultModules.length} modules (auto structure)
        </li>
        <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <BookOpen className="size-4 text-gray-400 dark:text-gray-500" />
          {template.placeholderLessonCount} placeholder lessons
        </li>
        <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <FileQuestion className="size-4 text-gray-400 dark:text-gray-500" />
          {template.quizTemplateAttached ? `Quiz template: ${template.quizTemplateId}` : 'No quiz'}
        </li>
      </ul>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Used {template.usedCount} times · Last: {new Date(template.lastUsedAt).toLocaleDateString()}
      </p>
      <Link
        href={`/dashboard/admin/courses/new?template=${template.id}`}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-primary bg-primary/5 dark:bg-primary/10 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 dark:hover:bg-primary/20"
      >
        <Plus className="size-4" />
        Use template to create course
      </Link>
    </div>
  )
}
