'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { COHORTS } from '@/lib/cohorts-data'
import { PATHS } from '@/lib/paths-data'
import { COURSES } from '@/lib/courses-data'
import { Plus, Upload, Target } from 'lucide-react'

export function BatchCohortAssignments() {
  const [createOpen, setCreateOpen] = useState(false)

  const activePaths = PATHS.filter((p) => p.status === 'active')
  const activeCourses = COURSES.filter((c) => c.status === 'published')

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Batch / Cohort Assignments</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Run training by batch (village/center). Create cohort, add members from group or CSV, assign path/course, track progress and attendance.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Create cohort
        </button>
      </div>

      {createOpen && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Create cohort (e.g. Embroidery Batch – Feb)</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Cohort name</label>
              <input type="text" className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400" placeholder="Embroidery Batch – Feb" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Add members</label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Import from group or paste CSV (name, email).</p>
              <div className="mt-2 flex gap-2">
                <select className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                  <option value="">Select group</option>
                  <option value="Weaving A">Weaving A</option>
                  <option value="Embroidery B">Embroidery B</option>
                </select>
                <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <Upload className="size-4" />
                  Import CSV
                </button>
              </div>
              <textarea className="mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400" rows={3} placeholder="Or paste CSV: name, email" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Assign path / course to cohort</label>
              <select className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                <option value="">Select path or course</option>
                <optgroup label="Paths">
                  {activePaths.map((p) => (
                    <option key={p.id} value={`path-${p.id}`}>{p.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Courses">
                  {activeCourses.map((c) => (
                    <option key={c.id} value={`course-${c.id}`}>{c.title}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setCreateOpen(false)} className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">Cancel</button>
              <button type="button" className="rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">Create & assign</button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-600 px-4 py-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Cohorts · Progress dashboard & attendance</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Select a cohort to see members, assign path/course, progress and trainer notes.</p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-600">
          {COHORTS.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-100">{c.name}</span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{c.centerOrVillage} · {c.memberCount} members</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Target className="size-4" />
                {c.pathName}
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{c.completionPercent}% complete</span>
                <Link href={`/dashboard/admin/cohorts?cohort=${c.id}`} className="text-sm font-medium text-primary hover:underline">
                  Open progress & notes
                </Link>
              </div>
            </li>
          ))}
        </ul>
        {COHORTS.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400">No cohorts yet. Create one to assign training by batch.</div>
        )}
      </div>
    </div>
  )
}
