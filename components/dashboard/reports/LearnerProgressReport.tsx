'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  LEARNER_PROGRESS,
  type IndividualProgressRow,
  type GroupProgressRow,
} from '@/lib/learner-progress-report-data'
import {
  ChevronDown,
  ChevronRight,
  Download,
  MoreVertical,
  Send,
  User,
} from 'lucide-react'

type Tab = 'individual' | 'group'

export function LearnerProgressReport() {
  const [tab, setTab] = useState<Tab>('individual')
  const [expandedDept, setExpandedDept] = useState<string | null>(null)
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
  const [openActionRow, setOpenActionRow] = useState<string | null>(null)

  const toggleDept = (id: string) => {
    setExpandedDept((prev) => (prev === id ? null : id))
    setExpandedGroup(null)
  }

  const toggleGroup = (id: string) => {
    setExpandedGroup((prev) => (prev === id ? null : id))
  }

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="break-words text-2xl font-bold text-gray-900 dark:text-gray-100">
            Learner Progress
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Individual and group progress — drill down by department
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Download className="size-4" />
          Export
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="border-b border-gray-200 dark:border-gray-600">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setTab('individual')}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${
              tab === 'individual'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Individual
          </button>
          <button
            type="button"
            onClick={() => setTab('group')}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${
              tab === 'group'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Group / Department
          </button>
        </nav>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="overflow-x-auto">
          {tab === 'individual' ? (
            <IndividualTable
              rows={LEARNER_PROGRESS.individual}
              openActionRow={openActionRow}
              setOpenActionRow={setOpenActionRow}
              onLinkClick={() => {}}
            />
          ) : (
            <GroupTable
              rows={LEARNER_PROGRESS.group}
              expandedDept={expandedDept}
              expandedGroup={expandedGroup}
              onToggleDept={toggleDept}
              onToggleGroup={toggleGroup}
              openActionRow={openActionRow}
              setOpenActionRow={setOpenActionRow}
            />
          )}
        </div>
      </div>
    </div>
  )
}

const colClasses = 'px-4 py-3 text-sm text-gray-900 dark:text-gray-200'
const thClasses = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'

function IndividualTable({
  rows,
  openActionRow,
  setOpenActionRow,
  onLinkClick,
}: {
  rows: IndividualProgressRow[]
  openActionRow: string | null
  setOpenActionRow: (id: string | null) => void
  onLinkClick: () => void
}) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>Name</th>
          <th className={thClasses}>Department</th>
          <th className={thClasses}>Assigned</th>
          <th className={thClasses}>In progress</th>
          <th className={thClasses}>Completed</th>
          <th className={thClasses}>Overdue</th>
          <th className={thClasses}>Avg score</th>
          <th className={thClasses}>Time spent</th>
          <th className={thClasses} scope="col">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className={colClasses}>
              <Link
                href={`/dashboard/admin/users/${row.id}`}
                onClick={onLinkClick}
                className="font-medium text-primary hover:text-primary-hover"
              >
                {row.name}
              </Link>
            </td>
            <td className={colClasses}>{row.department}</td>
            <td className={colClasses}>{row.assigned}</td>
            <td className={colClasses}>{row.inProgress}</td>
            <td className={colClasses}>{row.completed}</td>
            <td className={colClasses}>
              <span className={row.overdue > 0 ? 'font-medium text-red-600 dark:text-red-400' : ''}>
                {row.overdue}
              </span>
            </td>
            <td className={colClasses}>
              {row.avgScore != null ? `${row.avgScore}%` : '—'}
            </td>
            <td className={colClasses}>{row.timeSpent}</td>
            <td className="relative px-4 py-3">
              <ActionDropdown
                userId={row.id}
                userName={row.name}
                isOpen={openActionRow === row.id}
                onToggle={() =>
                  setOpenActionRow(openActionRow === row.id ? null : row.id)
                }
                onClose={() => setOpenActionRow(null)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function GroupTable({
  rows,
  expandedDept,
  expandedGroup,
  onToggleDept,
  onToggleGroup,
  openActionRow,
  setOpenActionRow,
}: {
  rows: GroupProgressRow[]
  expandedDept: string | null
  expandedGroup: string | null
  onToggleDept: (id: string) => void
  onToggleGroup: (id: string) => void
  openActionRow: string | null
  setOpenActionRow: (id: string | null) => void
}) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses} style={{ width: 1 }} />
          <th className={thClasses}>Name</th>
          <th className={thClasses}>Assigned</th>
          <th className={thClasses}>In progress</th>
          <th className={thClasses}>Completed</th>
          <th className={thClasses}>Overdue</th>
          <th className={thClasses}>Avg score</th>
          <th className={thClasses}>Time spent</th>
          <th className={thClasses} scope="col">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.flatMap((dept) => [
          <tr
            key={dept.id}
            className="cursor-pointer bg-gray-50/50 dark:bg-gray-700/30 hover:bg-gray-100/80 dark:hover:bg-gray-700/50"
            onClick={() => onToggleDept(dept.id)}
          >
            <td className="px-4 py-3">
              {expandedDept === dept.id ? (
                <ChevronDown className="size-4 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronRight className="size-4 text-gray-500 dark:text-gray-400" />
              )}
            </td>
            <td className={colClasses}>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{dept.name}</span>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(Department)</span>
            </td>
            <td className={colClasses}>{dept.assigned}</td>
            <td className={colClasses}>{dept.inProgress}</td>
            <td className={colClasses}>{dept.completed}</td>
            <td className={colClasses}>
              <span className={dept.overdue > 0 ? 'font-medium text-red-600 dark:text-red-400' : ''}>
                {dept.overdue}
              </span>
            </td>
            <td className={colClasses}>{dept.avgScore}%</td>
            <td className={colClasses}>{dept.timeSpent}</td>
            <td className="px-4 py-3" />
          </tr>,
          ...(expandedDept === dept.id && dept.children
            ? dept.children.flatMap((group) => [
                <tr
                  key={group.id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleGroup(group.id)
                  }}
                >
                  <td className="px-4 py-2 pl-8">
                    {expandedGroup === group.id ? (
                      <ChevronDown className="size-4 text-gray-400 dark:text-gray-500" />
                    ) : (
                      <ChevronRight className="size-4 text-gray-400 dark:text-gray-500" />
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{group.name}</span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(Group)</span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200">{group.assigned}</td>
                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200">{group.inProgress}</td>
                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200">{group.completed}</td>
                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200">
                    <span className={group.overdue > 0 ? 'font-medium text-red-600 dark:text-red-400' : ''}>
                      {group.overdue}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200">{group.avgScore}%</td>
                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200">{group.timeSpent}</td>
                  <td
                    className="px-4 py-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ActionDropdown
                      userId={group.id}
                      userName={group.name}
                      isOpen={openActionRow === group.id}
                      onToggle={() =>
                        setOpenActionRow(
                          openActionRow === group.id ? null : group.id
                        )
                      }
                      onClose={() => setOpenActionRow(null)}
                    />
                  </td>
                </tr>,
                ...(expandedGroup === group.id
                  ? LEARNER_PROGRESS.individual
                      .filter((u) => u.department === dept.department)
                      .slice(0, 2)
                      .map((user) => (
                        <tr key={`${group.id}-${user.id}`} className="bg-gray-50/30 dark:bg-gray-700/20">
                          <td className="px-4 py-2 pl-12" />
                          <td className="px-4 py-2">
                            <Link
                              href={`/dashboard/admin/users/${user.id}`}
                              className="text-sm font-medium text-primary hover:text-primary-hover"
                            >
                              {user.name}
                            </Link>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                            {user.assigned}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                            {user.inProgress}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                            {user.completed}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                            {user.overdue}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                            {user.avgScore != null ? `${user.avgScore}%` : '—'}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                            {user.timeSpent}
                          </td>
                          <td
                            className="px-4 py-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ActionDropdown
                              userId={user.id}
                              userName={user.name}
                              isOpen={openActionRow === user.id}
                              onToggle={() =>
                                setOpenActionRow(
                                  openActionRow === user.id ? null : user.id
                                )
                              }
                              onClose={() => setOpenActionRow(null)}
                            />
                          </td>
                        </tr>
                      ))
                  : []),
              ])
            : []),
        ])}
      </tbody>
    </table>
  )
}

function ActionDropdown({
  userId,
  userName,
  isOpen,
  onToggle,
  onClose,
}: {
  userId: string
  userName: string
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        className="rounded p-1.5 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-600 dark:hover:text-gray-200"
        aria-label="Actions"
      >
        <MoreVertical className="size-4" />
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            aria-hidden
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          />
          <div
            className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 py-1 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href={`/dashboard/admin/users/${userId}`}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={onClose}
            >
              <User className="size-4" />
              View user detail
            </Link>
            <button
              type="button"
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => {
                onClose()
              }}
            >
              <Send className="size-4" />
              Send reminder
            </button>
          </div>
        </>
      )}
    </div>
  )
}
