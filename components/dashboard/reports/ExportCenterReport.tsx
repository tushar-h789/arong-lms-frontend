'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  EXPORT_JOBS,
  type ExportJob,
  type ExportStatus,
} from '@/lib/export-center-data'
import { Download, Clock, CheckCircle, XCircle, Loader2, RotateCcw } from 'lucide-react'

const STATUS_FILTERS: { value: ExportStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'queued', label: 'Queued' },
  { value: 'running', label: 'Running' },
  { value: 'ready', label: 'Ready' },
  { value: 'failed', label: 'Failed' },
]

export function ExportCenterReport() {
  const [statusFilter, setStatusFilter] = useState<ExportStatus | 'all'>('all')

  const jobs = statusFilter === 'all'
    ? EXPORT_JOBS
    : EXPORT_JOBS.filter((j) => j.status === statusFilter)

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="wrap-break-word text-2xl font-bold text-gray-900 dark:text-gray-100">
          Export Center
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          All reports in one place — status, download, re-run
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="border-b border-gray-200 dark:border-gray-600">
        <nav className="-mb-px flex flex-wrap gap-1" aria-label="Status tabs">
          {STATUS_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatusFilter(value)}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${statusFilter === value
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Export jobs table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Export job status
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Queued / Running / Ready / Failed — download links + expiry
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Report
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Filters
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Download / Expiry
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
              {jobs.map((job) => (
                <ExportJobRow key={job.id} job={job} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ExportJobRow({ job }: { job: ExportJob }) {
  const [isReRunning, setIsReRunning] = useState(false)

  const handleReRun = () => {
    setIsReRunning(true)
    setTimeout(() => setIsReRunning(false), 1500)
  }

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="px-4 py-3">
        <Link
          href={job.reportHref}
          className="font-medium text-primary hover:underline"
        >
          {job.reportName}
        </Link>
        <span className="ml-1.5 text-xs text-gray-400 dark:text-gray-500">.{job.format}</span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-[200px] truncate" title={job.filters}>
        {job.filters}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={job.status} errorMessage={job.errorMessage} />
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
        {formatDate(job.createdAt)}
      </td>
      <td className="px-4 py-3">
        {job.status === 'ready' && job.downloadUrl && job.expiresAt ? (
          <div className="space-y-0.5">
            <a
              href={job.downloadUrl}
              download
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <Download className="size-4" />
              Download
            </a>
            <p className="text-xs text-gray-500 dark:text-gray-400" title={formatDateTime(job.expiresAt)}>
              Expires {formatRelative(job.expiresAt)}
            </p>
          </div>
        ) : job.status === 'failed' && job.errorMessage ? (
          <p className="max-w-[180px] text-xs text-red-600 dark:text-red-400" title={job.errorMessage}>
            {job.errorMessage}
          </p>
        ) : (
          <span className="text-gray-400 dark:text-gray-500">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={handleReRun}
          disabled={isReRunning || job.status === 'running' || job.status === 'queued'}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isReRunning ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <RotateCcw className="size-3.5" />
          )}
          Re-run
        </button>
      </td>
    </tr>
  )
}

function StatusBadge({ status, errorMessage }: { status: ExportStatus; errorMessage?: string }) {
  const config: Record<ExportStatus, { label: string; className: string; icon: React.ReactNode }> = {
    queued: {
      label: 'Queued',
      className: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
      icon: <Clock className="size-3.5" />,
    },
    running: {
      label: 'Running',
      className: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300',
      icon: <Loader2 className="size-3.5 animate-spin" />,
    },
    ready: {
      label: 'Ready',
      className: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300',
      icon: <CheckCircle className="size-3.5" />,
    },
    failed: {
      label: 'Failed',
      className: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300',
      icon: <XCircle className="size-3.5" />,
    },
  }
  const c = config[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${c.className}`}
      title={status === 'failed' ? errorMessage : undefined}
    >
      {c.icon}
      {c.label}
    </span>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatRelative(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = d.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (24 * 60 * 60 * 1000))
  if (diffDays <= 0) return 'soon'
  if (diffDays === 1) return 'in 1 day'
  return `in ${diffDays} days`
}
