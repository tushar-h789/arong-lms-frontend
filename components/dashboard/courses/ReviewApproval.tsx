'use client'

import React, { useState } from 'react'
import {
  REVIEW_ITEMS,
  REVIEW_STATUS_LABELS,
  REVIEWER_TEAM_LABELS,
  type ReviewItemRow,
  type ReviewStatus,
} from '@/lib/review-approval-data'
import { Search, Send, Lock, MessageSquare, CheckCircle, FileText } from 'lucide-react'

export function ReviewApproval() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | ''>('')
  const filtered = REVIEW_ITEMS.filter((item) => {
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter && item.status !== statusFilter) return false
    return true
  })

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Content Review & Approval</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Draft → Review → Approved → Published. Assign reviewers (HR/Compliance/Quality). Change request comments. Publish locked until approved.
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 dark:border-amber-700/50 bg-amber-50/50 dark:bg-amber-900/20 p-4">
        <div className="flex items-center gap-2">
          <Lock className="size-5 text-amber-600 dark:text-amber-400" />
          <span className="font-medium text-amber-900 dark:text-amber-200">Publish lock</span>
        </div>
        <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">SOP/Compliance content cannot be published until approved. Prevents wrong information from going live.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="search"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-10 pr-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ReviewStatus | '')}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">All statuses</option>
          {(Object.entries(REVIEW_STATUS_LABELS) as [ReviewStatus, string][]).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Item</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Reviewer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Change requests</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
            {filtered.map((item) => (
              <ReviewRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400">No items match your filters.</div>
        )}
      </div>
    </div>
  )
}

function ReviewRow({ item }: { item: ReviewItemRow }) {
  const statusConfig: Record<ReviewStatus, { className: string }> = {
    draft: { className: 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300' },
    review: { className: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300' },
    approved: { className: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300' },
    published: { className: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300' },
  }
  const sc = statusConfig[item.status]

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-gray-400 dark:text-gray-500" />
          <div>
            <span className="font-medium text-gray-900 dark:text-gray-100">{item.title}</span>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 capitalize">{item.type}</span>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${sc.className}`}>
          {REVIEW_STATUS_LABELS[item.status]}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
        {item.reviewerAssign || '—'} {item.reviewerTeam && `(${REVIEWER_TEAM_LABELS[item.reviewerTeam]})`}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
        {item.changeRequestComments ? (
          <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400">
            <MessageSquare className="size-4" />
            {item.changeRequestComments.slice(0, 40)}…
          </span>
        ) : (
          '—'
        )}
      </td>
      <td className="px-4 py-3 text-right">
        {item.status === 'draft' && (
          <button type="button" className="rounded-lg border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10">
            Submit for review
          </button>
        )}
        {item.status === 'review' && (
          <button type="button" className="inline-flex items-center gap-1 rounded-lg border border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 text-sm font-medium text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50">
            <CheckCircle className="size-4" />
            Approve
          </button>
        )}
        {item.status === 'approved' && (
          <button type="button" className="rounded-lg border border-transparent bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90">
            Publish
          </button>
        )}
      </td>
    </tr>
  )
}
