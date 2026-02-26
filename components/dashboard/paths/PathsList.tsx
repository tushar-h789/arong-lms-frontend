'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  PATHS,
  PATH_TYPE_LABELS,
  TARGET_CRAFT_LABELS,
  PATH_STATUS_LABELS,
  type PathRow,
  type PathStatus,
  type PathType,
  type TargetCraft,
} from '@/lib/paths-data'
import { Search, Plus, MoreVertical, Pencil, Archive, Users, AlertCircle, Target } from 'lucide-react'

export function PathsList() {
  const [paths, setPaths] = useState<PathRow[]>(PATHS)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    status: '' as PathStatus | '',
    pathType: '' as PathType | '',
    targetCraft: '' as TargetCraft | '',
    category: '',
    targetRole: '',
    center: '',
    createdBy: '',
  })
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return paths.filter((p) => {
      const q = search.toLowerCase()
      if (q && !p.name.toLowerCase().includes(q)) return false
      if (filters.status && p.status !== filters.status) return false
      if (filters.pathType && p.pathType !== filters.pathType) return false
      if (filters.targetCraft && p.targetCraft !== filters.targetCraft) return false
      if (filters.category && p.category !== filters.category) return false
      if (filters.targetRole && p.targetRole !== filters.targetRole) return false
      if (filters.center && !p.centerGroup.includes(filters.center)) return false
      if (filters.createdBy && p.createdBy !== filters.createdBy) return false
      return true
    })
  }, [paths, search, filters])

  const handleArchive = (id: string) => {
    setPaths((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'archived' as PathStatus } : p)))
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Paths (List)</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            All paths in one place — create, manage, assign, track. Progress snapshot, filters, path type & level.
          </p>
        </div>
        <Link
          href="/dashboard/admin/paths/new"
          className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Create path
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="search"
              placeholder="Search by path name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-10 pr-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium ${showFilters || activeFilterCount > 0 ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
          >
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-3 border-t border-gray-200 dark:border-gray-600 pt-4 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect
              label="Status"
              value={filters.status}
              options={['', 'draft', 'active', 'archived']}
              labels={['All', ...Object.values(PATH_STATUS_LABELS)]}
              onChange={(v) => setFilters((f) => ({ ...f, status: v as PathStatus | '' }))}
            />
            <FilterSelect
              label="Path type"
              value={filters.pathType}
              options={['', ...(Object.keys(PATH_TYPE_LABELS) as PathType[])]}
              labels={['All', ...Object.values(PATH_TYPE_LABELS)]}
              onChange={(v) => setFilters((f) => ({ ...f, pathType: v as PathType | '' }))}
            />
            <FilterSelect
              label="Target craft"
              value={filters.targetCraft}
              options={['', ...(Object.keys(TARGET_CRAFT_LABELS) as TargetCraft[])]}
              labels={['All', ...Object.values(TARGET_CRAFT_LABELS)]}
              onChange={(v) => setFilters((f) => ({ ...f, targetCraft: v as TargetCraft | '' }))}
            />
            <FilterSelect
              label="Category"
              value={filters.category}
              options={['', 'Onboarding', 'Skill', 'Safety', 'Quality']}
              onChange={(v) => setFilters((f) => ({ ...f, category: v }))}
            />
            <FilterSelect
              label="Target role"
              value={filters.targetRole}
              options={['', 'artisan', 'staff', 'trainer']}
              onChange={(v) => setFilters((f) => ({ ...f, targetRole: v }))}
            />
            <FilterSelect
              label="Center / group"
              value={filters.center}
              options={['', 'Dhaka HQ', 'Chittagong', 'Field Center 1', 'Weaving A']}
              onChange={(v) => setFilters((f) => ({ ...f, center: v }))}
            />
            <FilterSelect
              label="Created by"
              value={filters.createdBy}
              options={['', 'Nadia Islam', 'Abdul Karim', 'Admin User', 'Fatima Begum']}
              onChange={(v) => setFilters((f) => ({ ...f, createdBy: v }))}
            />
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Path</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Type / Craft / Level</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Progress snapshot</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Created</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filtered.map((path) => (
                <PathRowComponent key={path.id} path={path} onArchive={() => handleArchive(path.id)} />
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400">No paths match your filters.</div>
        )}
      </div>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  options,
  labels,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  labels?: string[]
  onChange: (v: string) => void
}) {
  const display = labels ?? options
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {options.map((o, i) => (
          <option key={o || '_'} value={o}>
            {display[i] || 'All'}
          </option>
        ))}
      </select>
    </div>
  )
}

function PathRowComponent({ path, onArchive }: { path: PathRow; onArchive: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const statusClass =
    path.status === 'active' ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300' : path.status === 'draft' ? 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="px-4 py-3">
        <Link href={`/dashboard/admin/paths/${path.id}/edit`} className="font-medium text-gray-900 dark:text-gray-100 hover:text-primary hover:underline">
          {path.name}
        </Link>
        <span className={`ml-2 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusClass}`}>
          {PATH_STATUS_LABELS[path.status]}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 text-xs text-blue-800 dark:text-blue-300">{PATH_TYPE_LABELS[path.pathType]}</span>
          <span className="rounded bg-slate-100 dark:bg-slate-600/50 px-2 py-0.5 text-xs text-slate-700 dark:text-slate-300">{TARGET_CRAFT_LABELS[path.targetCraft]}</span>
          <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Level {path.level}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1 text-gray-700 dark:text-gray-300" title="Completion %">
            <Target className="size-4 text-gray-400 dark:text-gray-500" />
            {path.completionPercent}%
          </span>
          <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400" title="Overdue">
            <AlertCircle className="size-4" />
            {path.overdueCount} overdue
          </span>
          <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400" title="Active learners">
            <Users className="size-4" />
            {path.activeLearners} active
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
        {path.createdBy}
        <span className="block text-xs text-gray-500 dark:text-gray-400">{new Date(path.createdAt).toLocaleDateString()}</span>
      </td>
      <td className="relative px-4 py-3 text-right">
        <div className="relative flex justify-end">
          <Link
            href={`/dashboard/admin/paths/${path.id}/edit`}
            className="rounded p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
            title="Edit (Builder)"
          >
            <Pencil className="size-4" />
          </Link>
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
              aria-expanded={menuOpen}
            >
              <MoreVertical className="size-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" aria-hidden onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 py-1 shadow-lg">
                  <Link
                    href={`/dashboard/admin/paths/${path.id}/edit`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Pencil className="size-4" />
                    Edit (Builder)
                  </Link>
                  {path.status !== 'archived' && (
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => { onArchive(); setMenuOpen(false) }}
                    >
                      <Archive className="size-4" />
                      Archive
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  )
}
