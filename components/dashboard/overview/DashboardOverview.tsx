'use client'

import React from 'react'
import Link from 'next/link'
import { StatCard } from './StatCard'
import { AssignedVsCompletedChart } from './AssignedVsCompletedChart'
import { ExpiringCertificatesCard } from './ExpiringCertificatesCard'
import { SystemHealthCard } from './SystemHealthCard'
import { OVERVIEW } from '@/lib/dashboard-overview-data'
import CategoryBreakdownCard from './CategoryBreakdownCard'
import { BookOpen, Send, ClipboardList, BarChart3, MessageSquare, Settings, ChevronRight } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'Courses', href: '/dashboard/admin/courses', icon: BookOpen },
  { label: 'Assignments', href: '/dashboard/admin/assignments', icon: Send },
  { label: 'Assessments', href: '/dashboard/admin/assessments/question-bank', icon: ClipboardList },
  { label: 'Reports', href: '/dashboard/admin/reports/overview', icon: BarChart3 },
  { label: 'Communication', href: '/dashboard/admin/communication/announcements', icon: MessageSquare },
  { label: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
]

export function DashboardOverview() {
  const d = OVERVIEW

  return (
    <div className="min-w-0 space-y-8 overflow-x-hidden">
      {/* Header + welcome */}
      <div className="min-w-0 rounded-2xl border border-gray-200/80 dark:border-gray-600/80 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 shadow-sm">
        <h1 className="break-words text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
          One-glance system and training health for Aarong LMS
        </p>

        {/* Quick access */}
        <div className="mt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Quick access</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_LINKS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary"
              >
                <Icon className="size-4 shrink-0 text-gray-500 dark:text-gray-400" />
                {label}
                <ChevronRight className="size-3.5 shrink-0 text-gray-400 dark:text-gray-500" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Top row: Total Users | Active Users | Compliance % | Pending Grading */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Key metrics</p>
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={d.totalUsers.toLocaleString()}
            trend={{ value: 5.2, label: 'From last month' }}
            trendUp={true}
            sparklineData={d.totalUsersTrend}
          />
          <StatCard
            title="Active Users"
            value={d.activeUsers.toLocaleString()}
            trend={{ value: 12.1, label: 'From last month' }}
            trendUp={true}
            sparklineData={d.activeUsersTrend}
          />
          <StatCard
            title="Compliance completion"
            value={`${d.compliancePercent}%`}
            progressPercent={d.compliancePercent}
          />
          <StatCard
            title="Pending Grading"
            value={d.pendingGradingCount}
            actionLabel="View pending"
            actionHref="/dashboard/admin/grading"
          />
        </div>
      </div>

      {/* Middle: Assigned vs Completed 70% | Completion by Status 30% — same row height */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Training progress</p>
        <div className="grid min-w-0 gap-6 lg:grid-cols-1 xl:grid-cols-[8fr_4fr] xl:gap-8 xl:items-stretch">
          <div className="min-w-0 xl:h-full">
            <AssignedVsCompletedChart data={d.assignedVsCompleted} />
          </div>
          <div className="min-w-0 xl:h-full">
            <CategoryBreakdownCard data={d.categoryBreakdown} />
          </div>
        </div>
      </div>

      {/* Bottom: Expiring Certificates | System Health */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Attention & system</p>
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
          <ExpiringCertificatesCard count={d.expiringCertificatesNext30Days} />
          <SystemHealthCard
            status={d.systemHealth}
            alerts={d.systemAlerts.map((a) => ({ id: a.id, message: a.message, type: a.type }))}
          />
        </div>
      </div>
    </div>
  )
}
