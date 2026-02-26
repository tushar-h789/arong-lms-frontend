'use client'

import React from 'react'
import Link from 'next/link'

type StatCardProps = {
  title: string
  value: string | number
  trend?: { value: number; label: string } // e.g. +12% From last month
  trendUp?: boolean
  sparklineData?: number[]
  progressPercent?: number // for Compliance card
  actionLabel?: string
  actionHref?: string
}

function Sparkline({ data }: { data: number[] }) {
  if (!data?.length) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 64
  const h = 24
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w
      const y = h - ((v - min) / range) * (h - 2) - 1
      return `${x},${y}`
    })
    .join(' ')
  return (
    <svg width={w} height={h} className="shrink-0" aria-hidden>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className="text-primary opacity-70"
      />
    </svg>
  )
}

export function StatCard({
  title,
  value,
  trend,
  trendUp = true,
  sparklineData,
  progressPercent,
  actionLabel,
  actionHref,
}: StatCardProps) {
  return (
    <div className="min-w-0 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 shadow-sm transition-shadow hover:shadow-md">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{value}</span>
        {sparklineData && (
          <Sparkline data={sparklineData} />
        )}
      </div>
      {trend != null && (
        <p className={`mt-1.5 text-xs font-medium ${trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
        </p>
      )}
      {progressPercent != null && (
        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{progressPercent}% completed</p>
        </div>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
