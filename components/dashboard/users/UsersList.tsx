'use client'

import React, { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import {
  USERS,
  FILTER_OPTIONS,
  type UserRow,
  type UserStatus,
} from '@/lib/users-data'
import {
  Search,
  Plus,
  Upload,
  Download,
  MoreVertical,
  Key,
  Unlock,
  Activity,
  CheckSquare,
  Square,
  X,
} from 'lucide-react'

export function UsersList() {
  const [users, setUsers] = useState<UserRow[]>(USERS)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    role: '',
    center: '',
    group: '',
    status: '',
    trainer: '',
    skillCategory: '',
  })
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkAction, setBulkAction] = useState<'activate' | 'deactivate' | 'assign_group' | 'assign_role' | 'reset_password' | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase()
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false
      if (filters.role && u.role !== filters.role) return false
      if (filters.center && u.center !== filters.center) return false
      if (filters.group && u.group !== filters.group) return false
      if (filters.status && u.status !== filters.status) return false
      if (filters.trainer && u.trainer !== filters.trainer) return false
      if (filters.skillCategory && u.skillCategory !== filters.skillCategory) return false
      return true
    })
  }, [users, search, filters])

  const handleCreateUser = (newUser: Omit<UserRow, 'id'>) => {
    const id = `u${Date.now()}`
    setUsers((prev) => [...prev, { ...newUser, id }])
    setCreateModalOpen(false)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map((u) => u.id)))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const clearBulk = () => {
    setSelectedIds(new Set())
    setBulkAction(null)
  }

  const hasSelection = selectedIds.size > 0

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="wrap-break-word text-2xl font-bold text-gray-900 dark:text-gray-100">
            Users
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            All users in one place — search, filter, quick actions
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Upload className="size-4" />
            Bulk import (CSV)
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Download className="size-4" />
            Export
          </button>
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/90"
          >
            <Plus className="size-4" />
            Create user
          </button>
        </div>
      </div>

      {/* Create user modal — portaled to body so overlay covers full screen (header + sidebar) */}
      {createModalOpen && <CreateUserModalPortal onClose={() => setCreateModalOpen(false)} onCreate={handleCreateUser} />}

      {/* Search + filters */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="search"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-10 pr-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium ${showFilters || Object.values(filters).some(Boolean)
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
          >
            Filters {Object.values(filters).filter(Boolean).length > 0 && `(${Object.values(filters).filter(Boolean).length})`}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-3 border-t border-gray-200 dark:border-gray-600 pt-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <FilterSelect
              label="Role"
              value={filters.role}
              options={['', ...FILTER_OPTIONS.roles]}
              onChange={(v) => setFilters((f) => ({ ...f, role: v }))}
            />
            <FilterSelect
              label="Center / Location"
              value={filters.center}
              options={['', ...FILTER_OPTIONS.centers]}
              onChange={(v) => setFilters((f) => ({ ...f, center: v }))}
            />
            <FilterSelect
              label="Group / Team"
              value={filters.group}
              options={['', ...FILTER_OPTIONS.groups]}
              onChange={(v) => setFilters((f) => ({ ...f, group: v }))}
            />
            <FilterSelect
              label="Status"
              value={filters.status}
              options={['', ...FILTER_OPTIONS.statuses]}
              onChange={(v) => setFilters((f) => ({ ...f, status: v }))}
            />
            <FilterSelect
              label="Trainer"
              value={filters.trainer}
              options={['', ...FILTER_OPTIONS.trainers]}
              onChange={(v) => setFilters((f) => ({ ...f, trainer: v }))}
            />
            <FilterSelect
              label="Skill category"
              value={filters.skillCategory}
              options={['', ...FILTER_OPTIONS.skillCategories]}
              onChange={(v) => setFilters((f) => ({ ...f, skillCategory: v }))}
            />
          </div>
        )}
      </div>

      {/* Bulk action bar */}
      {hasSelection && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-primary/30 dark:border-primary/40 bg-primary/5 dark:bg-primary/10 px-4 py-3">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {selectedIds.size} selected
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setBulkAction('activate')}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Activate
            </button>
            <button
              type="button"
              onClick={() => setBulkAction('deactivate')}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Deactivate
            </button>
            <button
              type="button"
              onClick={() => setBulkAction('assign_group')}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Assign group / center
            </button>
            <button
              type="button"
              onClick={() => setBulkAction('assign_role')}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Assign role
            </button>
            <button
              type="button"
              onClick={() => setBulkAction('reset_password')}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Reset password
            </button>
          </div>
          <button
            type="button"
            onClick={clearBulk}
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
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Center
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Group
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Trainer
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Skill
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Last active
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
              {filtered.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  selected={selectedIds.has(user.id)}
                  onToggleSelect={() => toggleSelect(user.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
            No users match your filters.
          </div>
        )}
      </div>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: readonly string[]
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {options.map((o) => (
          <option key={o || '_'} value={o}>
            {o || 'All'}
          </option>
        ))}
      </select>
    </div>
  )
}

function UserTableRow({
  user,
  selected,
  onToggleSelect,
}: {
  user: UserRow
  selected: boolean
  onToggleSelect: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={onToggleSelect}
          className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {selected ? (
            <CheckSquare className="size-5 text-primary" />
          ) : (
            <Square className="size-5" />
          )}
        </button>
      </td>
      <td className="px-4 py-3">
        <Link
          href={`/dashboard/admin/users/${user.id}`}
          className="flex items-center gap-3"
        >
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary"
            aria-hidden
          >
            {initials}
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100 hover:text-primary hover:underline">
              {user.name}
            </span>
            <span className="block text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
          </div>
        </Link>
      </td>
      <td className="px-4 py-3 text-sm capitalize text-gray-600 dark:text-gray-300">{user.role}</td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{user.center}</td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{user.group}</td>
      <td className="px-4 py-3">
        <StatusBadge status={user.status} />
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{user.trainer ?? '—'}</td>
      <td className="px-4 py-3 text-sm capitalize text-gray-600 dark:text-gray-300">
        {user.skillCategory ?? '—'}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
        {user.lastActive ? formatRelative(user.lastActive) : '—'}
      </td>
      <td className="relative px-4 py-3 text-right">
        <div className="flex justify-end gap-1">
          {user.status === 'locked' ? (
            <button
              type="button"
              className="rounded p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              title="Unlock user"
            >
              <Unlock className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              className="rounded p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
              title="Reset password"
            >
              <Key className="size-4" />
            </button>
          )}
          <Link
            href={`/dashboard/admin/users/${user.id}/activity`}
            className="rounded p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
            title="View activity summary"
          >
            <Activity className="size-4" />
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
                <div
                  className="fixed inset-0 z-10"
                  aria-hidden
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 py-1 shadow-lg">
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Reset password
                  </button>
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    {user.status === 'locked' ? 'Unlock user' : 'Lock user'}
                  </button>
                  <Link
                    href={`/dashboard/admin/users/${user.id}/activity`}
                    className="block px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    View activity summary
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  )
}

function StatusBadge({ status }: { status: UserStatus }) {
  const config: Record<UserStatus, { label: string; className: string }> = {
    active: { label: 'Active', className: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300' },
    inactive: { label: 'Inactive', className: 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300' },
    locked: { label: 'Locked', className: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300' },
  }
  const c = config[status]
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${c.className}`}>
      {c.label}
    </span>
  )
}

function formatRelative(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return d.toLocaleDateString()
}

/** Portals CreateUserModal to document.body so overlay covers full screen (header + sidebar) with blur + dark */
function CreateUserModalPortal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (user: Omit<UserRow, 'id'>) => void
}) {
  if (typeof document === 'undefined') return null
  return createPortal(
    <CreateUserModal onClose={onClose} onCreate={onCreate} />,
    document.body
  )
}

function CreateUserModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (user: Omit<UserRow, 'id'>) => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<string>('learner')
  const [center, setCenter] = useState('')
  const [group, setGroup] = useState('')
  const [status, setStatus] = useState<UserStatus>('active')
  const [trainer, setTrainer] = useState('')
  const [skillCategory, setSkillCategory] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreate({
      name: name.trim(),
      email: email.trim(),
      role,
      center: center || FILTER_OPTIONS.centers[0],
      group: group || FILTER_OPTIONS.groups[0],
      status,
      trainer: trainer || undefined,
      skillCategory: (skillCategory || null) as UserRow['skillCategory'],
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Full-screen overlay: dark + blur so header/sidebar also dim */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-user-title"
        className="relative z-10 w-full max-w-xl rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 px-6 py-4">
          <h2 id="create-user-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Create user
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
            <label htmlFor="create-name" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              id="create-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Full name"
            />
          </div>
          <div>
            <label htmlFor="create-email" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="create-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="user@aarong.com"
            />
          </div>
          <div className="grid min-w-0 grid-cols-2 gap-4">
            <div className="min-w-0">
              <label htmlFor="create-role" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                id="create-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full min-w-0 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {FILTER_OPTIONS.roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="min-w-0">
              <label htmlFor="create-status" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                id="create-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as UserStatus)}
                className="w-full min-w-0 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {FILTER_OPTIONS.statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid min-w-0 grid-cols-2 gap-4">
            <div className="min-w-0">
              <label htmlFor="create-center" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Center / Location
              </label>
              <select
                id="create-center"
                value={center}
                onChange={(e) => setCenter(e.target.value)}
                className="w-full min-w-0 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select</option>
                {FILTER_OPTIONS.centers.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="min-w-0">
              <label htmlFor="create-group" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Group / Team
              </label>
              <select
                id="create-group"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full min-w-0 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select</option>
                {FILTER_OPTIONS.groups.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid min-w-0 grid-cols-2 gap-4">
            <div className="min-w-0">
              <label htmlFor="create-trainer" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Trainer (optional)
              </label>
              <select
                id="create-trainer"
                value={trainer}
                onChange={(e) => setTrainer(e.target.value)}
                className="w-full min-w-0 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">None</option>
                {FILTER_OPTIONS.trainers.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="min-w-0">
              <label htmlFor="create-skill" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Skill category
              </label>
              <select
                id="create-skill"
                value={skillCategory}
                onChange={(e) => setSkillCategory(e.target.value)}
                className="w-full min-w-0 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">None</option>
                {FILTER_OPTIONS.skillCategories.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
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
              Create user
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
