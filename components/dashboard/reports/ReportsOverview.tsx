'use client'

import React from 'react'
import Link from 'next/link'
import { StatCard } from '@/components/dashboard/overview/StatCard'
import { REPORTS_OVERVIEW } from '@/lib/reports-overview-data'
import { AlertCircle, AlertTriangle, ArrowRight } from 'lucide-react'

export function ReportsOverview() {
  const { kpis, topAlerts, quickLinks } = REPORTS_OVERVIEW

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="break-words text-2xl font-bold text-gray-900 dark:text-gray-100">Reports Overview</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Executive snapshot — all reports at a glance
        </p>
      </div>

      {/* KPI cards */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Key metrics
        </h2>
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Overall completion %"
            value={`${kpis.overallCompletionPercent}%`}
            progressPercent={kpis.overallCompletionPercent}
          />
          <StatCard
            title="Overdue count"
            value={kpis.overdueCount}
            actionLabel="View details"
            actionHref="/dashboard/admin/reports/learner-progress"
          />
          <StatCard
            title="Compliance %"
            value={`${kpis.compliancePercent}%`}
            progressPercent={kpis.compliancePercent}
          />
          <StatCard
            title="Avg assessment score"
            value={kpis.avgAssessmentScore}
          />
        </div>
      </div>

      {/* Top alerts */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Top alerts
        </h2>
        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
          <ul className="divide-y divide-gray-100 dark:divide-gray-600">
            {topAlerts.map((alert) => {
              const Icon = alert.type === 'error' ? AlertCircle : AlertTriangle
              return (
                <li key={alert.id}>
                  <Link
                    href={alert.href}
                    className="flex items-start gap-4 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{alert.title}</p>
                      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{alert.message}</p>
                    </div>
                    <ArrowRight className="mt-1 size-4 shrink-0 text-gray-400 dark:text-gray-500" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Quick links
        </h2>
        <div className="grid min-w-0 gap-4 sm:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              <p className="font-semibold text-gray-900 dark:text-gray-100">{link.label}</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{link.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open
                <ArrowRight className="size-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
