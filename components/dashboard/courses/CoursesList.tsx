'use client'

import React, { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import {
  COURSES,
  COURSE_FILTER_OPTIONS,
  COURSE_TYPE_LABELS,
  LANGUAGE_FORMAT_LABELS,
  type CourseRow,
  type CourseStatus,
  type CourseType,
  type LanguageFormat,
} from '@/lib/courses-data'
import {
  Search,
  Plus,
  MoreVertical,
  Copy,
  Archive,
  Trash2,
  Calendar,
  Eye,
  Wifi,
  X,
  CheckSquare,
  Square,
  Pencil,
} from 'lucide-react'

export function CoursesList() {
  const [courses, setCourses] = useState<CourseRow[]>(COURSES)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    courseType: '',
    languageFormat: '',
    center: '',
    group: '',
    createdBy: '',
    dateFrom: '',
    dateTo: '',
    lowBandwidthOnly: false,
  })
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null)
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false)

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const q = search.toLowerCase()
      if (q && !c.title.toLowerCase().includes(q)) return false
      if (filters.status && c.status !== filters.status) return false
      if (filters.category && c.category !== filters.category) return false
      if (filters.courseType && c.courseType !== filters.courseType) return false
      if (filters.languageFormat && !c.languageFormat.includes(filters.languageFormat as LanguageFormat)) return false
      if (filters.center && !c.visibilityCenters.includes(filters.center)) return false
      if (filters.group && !c.visibilityGroups.includes(filters.group)) return false
      if (filters.createdBy && c.createdBy !== filters.createdBy) return false
      if (filters.dateFrom && new Date(c.createdAt) < new Date(filters.dateFrom)) return false
      if (filters.dateTo && new Date(c.createdAt) > new Date(filters.dateTo + 'T23:59:59.999Z')) return false
      if (filters.lowBandwidthOnly && !c.lowBandwidthReady) return false
      return true
    })
  }, [courses, search, filters])

  const handleCreate = (newCourse: Omit<CourseRow, 'id'>) => {
    setCourses((prev) => {
      const id = `c${Date.now()}`
      return [...prev, { ...newCourse, id }]
    })
    setCreateModalOpen(false)
  }

  const handleDuplicate = (course: CourseRow) => {
    setCourses((prev) => {
      const id = `c${Date.now()}`
      return [
        ...prev,
        {
          ...course,
          id,
          title: `${course.title} (Copy)`,
          status: 'draft' as CourseStatus,
          createdAt: new Date().toISOString(),
          scheduledStart: undefined,
          scheduledEnd: undefined,
        },
      ]
    })
  }

  const handleArchive = (id: string) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'archived' as CourseStatus } : c)))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const handleArchiveSelected = () => {
    selectedIds.forEach((id) => handleArchive(id))
    setSelectedIds(new Set())
  }

  const handleDelete = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id))
    setDeleteConfirm(null)
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const handleBulkDelete = () => {
    setCourses((prev) => prev.filter((c) => !selectedIds.has(c.id)))
    setSelectedIds(new Set())
    setBulkDeleteConfirm(false)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(filtered.map((c) => c.id)))
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const activeFilterCount = [
    filters.status,
    filters.category,
    filters.courseType,
    filters.languageFormat,
    filters.center,
    filters.group,
    filters.createdBy,
    filters.dateFrom,
    filters.dateTo,
    filters.lowBandwidthOnly,
  ].filter(Boolean).length

  const hasSelection = selectedIds.size > 0

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="wrap-break-word text-2xl font-bold text-gray-900 dark:text-gray-100">Courses</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Lifecycle control — filters, schedule, visibility, create, duplicate, archive, delete
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/admin/courses/new"
            className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/90"
          >
            <Plus className="size-4" />
            Create course (Builder)
          </Link>
        </div>
      </div>

      {createModalOpen && (
        <CreateCourseModalPortal onClose={() => setCreateModalOpen(false)} onCreate={handleCreate} />
      )}
      {deleteConfirm && (
        <DeleteConfirmModal
          title={deleteConfirm.title}
          onConfirm={() => handleDelete(deleteConfirm.id)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
      {bulkDeleteConfirm && (
        <BulkDeleteConfirmModal
          count={selectedIds.size}
          onConfirm={handleBulkDelete}
          onCancel={() => setBulkDeleteConfirm(false)}
        />
      )}

      {/* Search + filters */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="search"
              placeholder="Search by course title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-10 pr-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium ${showFilters || activeFilterCount > 0
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
          >
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-3 border-t border-gray-200 dark:border-gray-600 pt-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            <FilterSelect
              label="Status"
              value={filters.status}
              options={['', ...COURSE_FILTER_OPTIONS.statuses]}
              onChange={(v) => setFilters((f) => ({ ...f, status: v }))}
            />
            <FilterSelect
              label="Category"
              value={filters.category}
              options={['', ...COURSE_FILTER_OPTIONS.categories]}
              onChange={(v) => setFilters((f) => ({ ...f, category: v }))}
            />
            <FilterSelect
              label="Course type"
              value={filters.courseType}
              options={['', ...COURSE_FILTER_OPTIONS.courseTypes.map((t) => COURSE_TYPE_LABELS[t])]}
              valueMap={['', ...COURSE_FILTER_OPTIONS.courseTypes]}
              onChange={(v) => setFilters((f) => ({ ...f, courseType: v }))}
            />
            <FilterSelect
              label="Language / format"
              value={filters.languageFormat}
              options={['', ...COURSE_FILTER_OPTIONS.languageFormats.map((l) => LANGUAGE_FORMAT_LABELS[l])]}
              valueMap={['', ...COURSE_FILTER_OPTIONS.languageFormats]}
              onChange={(v) => setFilters((f) => ({ ...f, languageFormat: v }))}
            />
            <FilterSelect
              label="Center visibility"
              value={filters.center}
              options={['', ...COURSE_FILTER_OPTIONS.centers]}
              onChange={(v) => setFilters((f) => ({ ...f, center: v }))}
            />
            <FilterSelect
              label="Group visibility"
              value={filters.group}
              options={['', ...COURSE_FILTER_OPTIONS.groups]}
              onChange={(v) => setFilters((f) => ({ ...f, group: v }))}
            />
            <FilterSelect
              label="Created by"
              value={filters.createdBy}
              options={['', ...COURSE_FILTER_OPTIONS.createdBy]}
              onChange={(v) => setFilters((f) => ({ ...f, createdBy: v }))}
            />
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Created from</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Created to</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex items-end">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={filters.lowBandwidthOnly}
                  onChange={(e) => setFilters((f) => ({ ...f, lowBandwidthOnly: e.target.checked }))}
                  className="rounded border-gray-300 dark:border-gray-500 text-primary focus:ring-primary"
                />
                Low bandwidth ready only
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Bulk action bar */}
      {hasSelection && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-primary/30 dark:border-primary/40 bg-primary/5 dark:bg-primary/10 px-4 py-3">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedIds.size} selected</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleArchiveSelected}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <Archive className="size-3.5" />
              Archive
            </button>
            <button
              type="button"
              onClick={() => setBulkDeleteConfirm(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-red-200 dark:border-red-700 bg-white dark:bg-gray-700 px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="size-3.5" />
              Delete
            </button>
          </div>
          <button
            type="button"
            onClick={() => setSelectedIds(new Set())}
            className="ml-auto text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="w-10 px-4 py-3 text-left">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label="Toggle all"
                  >
                    {selectedIds.size === filtered.length && filtered.length > 0 ? (
                      <CheckSquare className="size-5 text-primary" />
                    ) : (
                      <Square className="size-5" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Course</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Format</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Visibility</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Schedule</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Created</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
              {filtered.map((course) => (
                <CourseTableRow
                  key={course.id}
                  course={course}
                  selected={selectedIds.has(course.id)}
                  onToggleSelect={() => toggleSelect(course.id)}
                  onDuplicate={() => handleDuplicate(course)}
                  onArchive={() => handleArchive(course.id)}
                  onDelete={() => setDeleteConfirm({ id: course.id, title: course.title })}
                />
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400">No courses match your filters.</div>
        )}
      </div>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  options,
  valueMap,
  onChange,
}: {
  label: string
  value: string
  options: readonly string[]
  valueMap?: readonly string[]
  onChange: (v: string) => void
}) {
  const opts = valueMap ?? options
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {options.map((o, i) => (
          <option key={opts[i] || '_'} value={opts[i] ?? ''}>
            {o || 'All'}
          </option>
        ))}
      </select>
    </div>
  )
}

function CourseTableRow({
  course,
  selected,
  onToggleSelect,
  onDuplicate,
  onArchive,
  onDelete,
}: {
  course: CourseRow
  selected: boolean
  onToggleSelect: () => void
  onDuplicate: () => void
  onArchive: () => void
  onDelete: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="px-4 py-3">
        <button type="button" onClick={onToggleSelect} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
          {selected ? <CheckSquare className="size-5 text-primary" /> : <Square className="size-5" />}
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1">
          <Link
            href={`/dashboard/admin/courses/${course.id}`}
            className="font-medium text-gray-900 dark:text-gray-100 hover:text-primary hover:underline"
          >
            {course.title}
          </Link>
          <div className="flex flex-wrap items-center gap-1.5">
            {course.lowBandwidthReady && (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-300"
                title="Low bandwidth ready"
              >
                <Wifi className="size-3" />
                Low bandwidth ready
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={course.status} />
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{COURSE_TYPE_LABELS[course.courseType]}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {course.languageFormat.slice(0, 3).map((lf) => (
            <span
              key={lf}
              className="rounded bg-gray-100 dark:bg-gray-600 px-1.5 py-0.5 text-xs text-gray-700 dark:text-gray-300"
            >
              {LANGUAGE_FORMAT_LABELS[lf]}
            </span>
          ))}
          {course.languageFormat.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">+{course.languageFormat.length - 3}</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex flex-wrap gap-1">
          {course.visibilityCenters.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 text-xs text-blue-800 dark:text-blue-300">
              <Eye className="size-3" />
              {course.visibilityCenters.slice(0, 2).join(', ')}
              {course.visibilityCenters.length > 2 && ` +${course.visibilityCenters.length - 2}`}
            </span>
          )}
          {course.visibilityGroups.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded bg-slate-100 dark:bg-slate-600/50 px-1.5 py-0.5 text-xs text-slate-700 dark:text-slate-300">
              {course.visibilityGroups.slice(0, 2).join(', ')}
              {course.visibilityGroups.length > 2 && ` +${course.visibilityGroups.length - 2}`}
            </span>
          )}
          {course.visibilityCenters.length === 0 && course.visibilityGroups.length === 0 && '—'}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
        {course.scheduledStart || course.scheduledEnd ? (
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3.5 text-gray-400 dark:text-gray-500" />
            {course.scheduledStart ? formatDate(course.scheduledStart) : '—'} –{' '}
            {course.scheduledEnd ? formatDate(course.scheduledEnd) : '—'}
          </span>
        ) : (
          '—'
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
        <span className="block">{course.createdBy}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(course.createdAt)}</span>
      </td>
      <td className="relative px-4 py-3 text-right">
        <div className="relative flex justify-end">
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
              <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 py-1 shadow-lg">
                <Link
                  href={`/dashboard/admin/courses/${course.id}/edit`}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setMenuOpen(false)}
                >
                  <Pencil className="size-4" />
                  Edit (Builder)
                </Link>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => { onDuplicate(); setMenuOpen(false) }}
                >
                  <Copy className="size-4" />
                  Duplicate
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => { onArchive(); setMenuOpen(false) }}
                >
                  <Archive className="size-4" />
                  Archive
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => { onDelete(); setMenuOpen(false) }}
                >
                  <Trash2 className="size-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

function StatusBadge({ status }: { status: CourseStatus }) {
  const config: Record<CourseStatus, { label: string; className: string }> = {
    draft: { label: 'Draft', className: 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300' },
    published: { label: 'Published', className: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300' },
    archived: { label: 'Archived', className: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300' },
  }
  const c = config[status]
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${c.className}`}>
      {c.label}
    </span>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function DeleteConfirmModal({
  title,
  onConfirm,
  onCancel,
}: { title: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden onClick={onCancel} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-xl"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Delete course?</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          “{title}” will be permanently deleted. This cannot be undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg border border-red-600 bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function BulkDeleteConfirmModal({
  count,
  onConfirm,
  onCancel,
}: { count: number; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden onClick={onCancel} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-xl"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Delete {count} courses?</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Selected courses will be permanently deleted. This cannot be undone.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg border border-red-600 bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete {count}
          </button>
        </div>
      </div>
    </div>
  )
}

function CreateCourseModalPortal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (course: Omit<CourseRow, 'id'>) => void
}) {
  if (typeof document === 'undefined') return null
  return createPortal(<CreateCourseModal onClose={onClose} onCreate={onCreate} />, document.body)
}

function CreateCourseModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (course: Omit<CourseRow, 'id'>) => void
}) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Safety')
  const [courseType, setCourseType] = useState<CourseType>('safety')
  const [status, setStatus] = useState<CourseStatus>('draft')
  const [lowBandwidthReady, setLowBandwidthReady] = useState(false)
  const [createdBy, setCreatedBy] = useState<string>(COURSE_FILTER_OPTIONS.createdBy[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreate({
      title: title.trim(),
      status,
      category,
      courseType,
      languageFormat: ['text'],
      lowBandwidthReady,
      visibility: ['center'],
      visibilityCenters: ['Dhaka HQ'],
      visibilityGroups: [],
      createdBy,
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-course-title"
        className="relative z-10 w-full max-w-xl rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 px-6 py-4">
          <h2 id="create-course-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Create course
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1.5 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
          <div>
            <label htmlFor="create-title" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              id="create-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Course title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="create-category" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                id="create-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {COURSE_FILTER_OPTIONS.categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="create-type" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Course type
              </label>
              <select
                id="create-type"
                value={courseType}
                onChange={(e) => setCourseType(e.target.value as CourseType)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {(Object.entries(COURSE_TYPE_LABELS) as [CourseType, string][]).map(([k, label]) => (
                  <option key={k} value={k}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="create-status" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                id="create-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as CourseStatus)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {COURSE_FILTER_OPTIONS.statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="create-createdBy" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Created by
              </label>
              <select
                id="create-createdBy"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {COURSE_FILTER_OPTIONS.createdBy.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={lowBandwidthReady}
              onChange={(e) => setLowBandwidthReady(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-500 text-primary focus:ring-primary"
            />
            Low bandwidth ready
          </label>
          <div className="flex justify-end gap-2 border-t border-gray-200 dark:border-gray-600 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              Create course
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
