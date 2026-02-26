'use client'

import React, { useState, useMemo } from 'react'
import {
  COMPLIANCE_CERTIFICATES,
  type ComplianceDashboardRow,
  type NonCompliantRow,
  type CertificateIssueRow,
  type RecertTriggerRow,
} from '@/lib/compliance-certificates-data'
import { Download, RotateCcw, FileText } from 'lucide-react'

type Tab = 'dashboard' | 'noncompliant' | 'certificates' | 'recert'
type ExpiryRange = '30' | '60' | '90'

export function ComplianceCertificatesReport() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [expiryDays, setExpiryDays] = useState<ExpiryRange>('30')
  const [exportOpen, setExportOpen] = useState(false)

  const filteredCertificates = useMemo(() => {
    const max = Number(expiryDays)
    return COMPLIANCE_CERTIFICATES.certificateIssue.filter((e) => e.daysToExpiry <= max)
  }, [expiryDays])

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="break-words text-2xl font-bold text-gray-900 dark:text-gray-100">
            Compliance & Certifications
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Staff + field training compliance — audit-ready for Aarong
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setExportOpen((o) => !o)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Download className="size-4" />
              Export audit proof pack
            </button>
            {exportOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  aria-hidden
                  onClick={() => setExportOpen(false)}
                />
                <div className="absolute right-0 top-full z-20 mt-1 min-w-[140px] rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 py-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => setExportOpen(false)}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <FileText className="size-4" />
                    PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setExportOpen(false)}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Download className="size-4" />
                    CSV
                  </button>
                </div>
              </>
            )}
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-hover"
          >
            <RotateCcw className="size-4" />
            Re-certification trigger
          </button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="border-b border-gray-200 dark:border-gray-600">
        <nav className="-mb-px flex flex-wrap gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => setTab('dashboard')}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${tab === 'dashboard'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            Compliance Dashboard
          </button>
          <button
            type="button"
            onClick={() => setTab('noncompliant')}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${tab === 'noncompliant'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            Non-Compliant List
          </button>
          <button
            type="button"
            onClick={() => setTab('certificates')}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${tab === 'certificates'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            Certificate Issue + Expiry
          </button>
          <button
            type="button"
            onClick={() => setTab('recert')}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${tab === 'recert'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            Re-cert Trigger Report
          </button>
        </nav>
      </div>

      {/* Expiry alerts - for certificates tab */}
      {tab === 'certificates' && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Expiry alerts:</span>
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-0.5">
            {(['30', '60', '90'] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setExpiryDays(d)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${expiryDays === d ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
              >
                {d} days
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="overflow-x-auto">
          {tab === 'dashboard' && (
            <ComplianceDashboard rows={COMPLIANCE_CERTIFICATES.completionDashboard} />
          )}
          {tab === 'noncompliant' && (
            <NonCompliantTable rows={COMPLIANCE_CERTIFICATES.nonCompliant} />
          )}
          {tab === 'certificates' && (
            <CertificateIssueTable rows={filteredCertificates} expiryDays={expiryDays} />
          )}
          {tab === 'recert' && (
            <RecertTriggerTable rows={COMPLIANCE_CERTIFICATES.recertTrigger} />
          )}
        </div>
      </div>
    </div>
  )
}

const thClasses = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'
const colClasses = 'px-4 py-3 text-sm text-gray-900 dark:text-gray-100'

function ComplianceDashboard({ rows }: { rows: ComplianceDashboardRow[] }) {
  return (
    <div className="p-4">
      <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Compliance completion by category (Gender / Safeguarding / Values / Safety)
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map((row) => (
          <div
            key={row.id}
            className={`rounded-xl border p-4 ${row.status === 'compliant'
              ? 'border-green-200 dark:border-green-700/50 bg-green-50/50 dark:bg-green-900/20'
              : row.status === 'at_risk'
                ? 'border-amber-200 dark:border-amber-700/50 bg-amber-50/50 dark:bg-amber-900/20'
                : 'border-red-200 dark:border-red-700/50 bg-red-50/50 dark:bg-red-900/20'
              }`}
          >
            <p className="font-semibold text-gray-900 dark:text-gray-100">{row.categoryLabel}</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
              {row.percentComplete}%
            </p>
            <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
              {row.completed} / {row.totalRequired} completed
            </p>
            <span
              className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${row.status === 'compliant'
                ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300'
                : row.status === 'at_risk'
                  ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                  : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300'
                }`}
            >
              {row.status === 'compliant' ? 'Compliant' : row.status === 'at_risk' ? 'At risk' : 'Non-compliant'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function NonCompliantTable({ rows }: { rows: NonCompliantRow[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>Who</th>
          <th className={thClasses}>Department</th>
          <th className={thClasses}>Missing what</th>
          <th className={thClasses}>Overdue</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className={colClasses}>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{row.learnerName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{row.email}</p>
              </div>
            </td>
            <td className={colClasses}>{row.department}</td>
            <td className={colClasses}>
              <span className="text-gray-700 dark:text-gray-300">{row.missingItems.join(', ')}</span>
            </td>
            <td className={colClasses}>
              <span className="font-medium text-red-600 dark:text-red-400">{row.overdueDays} days</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function CertificateIssueTable({
  rows,
  expiryDays,
}: {
  rows: CertificateIssueRow[]
  expiryDays: string
}) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>Learner</th>
          <th className={thClasses}>Certificate</th>
          <th className={thClasses}>Course</th>
          <th className={thClasses}>Department</th>
          <th className={thClasses}>Issued</th>
          <th className={thClasses}>Expiry</th>
          <th className={thClasses}>Days to expiry</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.length === 0 ? (
          <tr>
            <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No certificates expiring in next {expiryDays} days
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className={colClasses}>
                <span className="font-medium text-gray-900 dark:text-gray-100">{row.learnerName}</span>
              </td>
              <td className={colClasses}>{row.certificateName}</td>
              <td className={colClasses}>{row.courseName}</td>
              <td className={colClasses}>{row.department}</td>
              <td className={colClasses}>{row.issuedDate}</td>
              <td className={colClasses}>{row.expiryDate}</td>
              <td className={colClasses}>
                <span
                  className={
                    row.daysToExpiry <= 7
                      ? 'font-medium text-red-600 dark:text-red-400'
                      : row.daysToExpiry <= 30
                        ? 'font-medium text-amber-600 dark:text-amber-400'
                        : ''
                  }
                >
                  {row.daysToExpiry} days
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}

function RecertTriggerTable({ rows }: { rows: RecertTriggerRow[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className={thClasses}>Learner</th>
          <th className={thClasses}>Department</th>
          <th className={thClasses}>Certificate</th>
          <th className={thClasses}>Course</th>
          <th className={thClasses}>Expiry date</th>
          <th className={thClasses}>Days</th>
          <th className={thClasses}>Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className={colClasses}>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{row.learnerName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{row.email}</p>
              </div>
            </td>
            <td className={colClasses}>{row.department}</td>
            <td className={colClasses}>{row.certificateName}</td>
            <td className={colClasses}>{row.courseName}</td>
            <td className={colClasses}>{row.expiryDate}</td>
            <td className={colClasses}>
              <span
                className={
                  row.daysToExpiry < 0
                    ? 'font-medium text-red-600 dark:text-red-400'
                    : 'font-medium text-amber-600 dark:text-amber-400'
                }
              >
                {row.daysToExpiry < 0 ? `${Math.abs(row.daysToExpiry)} overdue` : row.daysToExpiry}
              </span>
            </td>
            <td className={colClasses}>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${row.status === 'expired' ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                  }`}
              >
                {row.status === 'expired' ? 'Expired' : 'Expiring soon'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
