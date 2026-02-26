'use client'

import React, { useMemo, useState } from 'react'
import { Download, AlertCircle } from 'lucide-react'
import {
  getCertificatesSummary,
  getLearnerCertificates,
  type LearnerCertificate,
  type CertificateFilter,
  type CertificateExpiryStatus,
} from '@/lib/learner-certificates-data'

const FILTERS: { key: CertificateFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'valid', label: 'Valid' },
  { key: 'expiring', label: 'Expiring' },
  { key: 'expired', label: 'Expired' },
]

function ExpiryBadge({ status }: { status: CertificateExpiryStatus | null }) {
  if (!status) return null
  if (status === 'valid')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
        <span className="size-1.5 rounded-full bg-emerald-500" /> Valid
      </span>
    )
  if (status === 'expiring_30')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
        <span className="size-1.5 rounded-full bg-amber-500" /> Expiring in 30 days
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
      <span className="size-1.5 rounded-full bg-rose-500" /> Expired
    </span>
  )
}

function CertCard({ cert }: { cert: LearnerCertificate }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-800 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{cert.title}asdf</h3>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          Issued {cert.issuedDate}
          {cert.expiryDate && ` · Expires ${cert.expiryDate}`}
        </p>
        <div className="mt-2">
          <ExpiryBadge status={cert.expiryStatus} />
        </div>
      </div>
      <a
        href={cert.downloadUrl}
        download
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
      >
        <Download className="size-4" />
        Download
      </a>
    </div>
  )
}

export default function CertificatesPage() {
  const summary = useMemo(() => getCertificatesSummary(), [])
  const [filter, setFilter] = useState<CertificateFilter>('all')
  const list = useMemo(() => getLearnerCertificates(filter), [filter])

  return (
    <div className="w-full space-y-6 ">
      <header>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">
          My Certificates
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Proof of completion — download when needed.
        </p>
      </header>

      {/* Summary */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-600 dark:bg-gray-800">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Your total certificates: <span className="font-bold tabular-nums">{summary.total}</span>
        </p>
        {summary.expiringSoon > 0 && (
          <p className="flex items-center gap-1.5 text-sm font-medium text-amber-700 dark:text-amber-400">
            <AlertCircle className="size-4" />
            Expiring soon: <span className="font-bold tabular-nums">{summary.expiringSoon}</span>
          </p>
        )}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${filter === key
              ? 'border-primary bg-primary text-white'
              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {list.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 py-12 text-center text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-400">
            No certificates in this filter.
          </div>
        ) : (
          list.map((cert) => <CertCard key={cert.id} cert={cert} />)
        )}
      </div>
    </div>
  )
}
