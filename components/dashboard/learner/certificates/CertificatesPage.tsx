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
import { useLanguage } from '@/components/layout/dashboard/LanguageContext'

type Lang = 'en' | 'bn'

const FILTERS_EN: { key: CertificateFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'valid', label: 'Valid' },
  { key: 'expiring', label: 'Expiring' },
  { key: 'expired', label: 'Expired' },
]

const FILTERS_BN: { key: CertificateFilter; label: string }[] = [
  { key: 'all', label: 'সব' },
  { key: 'valid', label: 'সক্রিয়' },
  { key: 'expiring', label: 'শীঘ্রই মেয়াদ শেষ' },
  { key: 'expired', label: 'মেয়াদ শেষ' },
]

function ExpiryBadge({ status, lang }: { status: CertificateExpiryStatus | null; lang: Lang }) {
  const isBn = lang === 'bn'
  const validLabel = isBn ? 'সক্রিয়' : 'Valid'
  const expiringLabel = isBn ? '৩০ দিনের মধ্যে মেয়াদ শেষ' : 'Expiring in 30 days'
  const expiredLabel = isBn ? 'মেয়াদ শেষ' : 'Expired'
  if (!status) return null
  if (status === 'valid')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
        <span className="size-1.5 rounded-full bg-emerald-500" /> {validLabel}
      </span>
    )
  if (status === 'expiring_30')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
        <span className="size-1.5 rounded-full bg-amber-500" /> {expiringLabel}
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
      <span className="size-1.5 rounded-full bg-rose-500" /> {expiredLabel}
    </span>
  )
}

function CertCard({ cert, lang }: { cert: LearnerCertificate; lang: Lang }) {
  const isBn = lang === 'bn'
  const issuedLabel = isBn ? 'ইস্যুর তারিখ' : 'Issued'
  const expiresLabel = isBn ? 'মেয়াদ শেষ' : 'Expires'
  const downloadLabel = isBn ? 'ডাউনলোড' : 'Download'
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-800 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{cert.title}</h3>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {issuedLabel} {cert.issuedDate}
          {cert.expiryDate && ` · ${expiresLabel} ${cert.expiryDate}`}
        </p>
        <div className="mt-2">
          <ExpiryBadge status={cert.expiryStatus} lang={lang} />
        </div>
      </div>
      <a
        href={cert.downloadUrl}
        download
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
      >
        <Download className="size-4" />
        {downloadLabel}
      </a>
    </div>
  )
}

export default function CertificatesPage() {
  const { language } = useLanguage()
  const lang: Lang = language
  const summary = useMemo(() => getCertificatesSummary(), [])
  const [filter, setFilter] = useState<CertificateFilter>('all')
  const list = useMemo(() => getLearnerCertificates(filter), [filter])

  const isBn = lang === 'bn'
  const filters = isBn ? FILTERS_BN : FILTERS_EN
  const pageTitle = isBn ? 'আমার সার্টিফিকেট' : 'My Certificates'
  const pageDesc = isBn ? 'সম্পন্নতার প্রমাণ — প্রয়োজন হলে ডাউনলোড করুন।' : 'Proof of completion — download when needed.'
  const totalLabel = isBn ? 'আপনার মোট সার্টিফিকেট:' : 'Your total certificates:'
  const expiringSoonLabel = isBn ? 'শীঘ্রই মেয়াদ শেষ:' : 'Expiring soon:'
  const noCertsLabel = isBn ? 'এই ফিল্টারে কোনো সার্টিফিকেট নেই।' : 'No certificates in this filter.'

  return (
    <div className="w-full space-y-6 ">
      <header>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">
          {pageTitle}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {pageDesc}
        </p>
      </header>

      {/* Summary */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-600 dark:bg-gray-800">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {totalLabel} <span className="font-bold tabular-nums">{summary.total}</span>
        </p>
        {summary.expiringSoon > 0 && (
          <p className="flex items-center gap-1.5 text-sm font-medium text-amber-700 dark:text-amber-400">
            <AlertCircle className="size-4" />
            {expiringSoonLabel} <span className="font-bold tabular-nums">{summary.expiringSoon}</span>
          </p>
        )}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {filters.map(({ key, label }) => (
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
            {noCertsLabel}
          </div>
        ) : (
          list.map((cert) => <CertCard key={cert.id} cert={cert} lang={lang} />)
        )}
      </div>
    </div>
  )
}
