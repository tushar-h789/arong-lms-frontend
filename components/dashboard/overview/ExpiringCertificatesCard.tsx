'use client'

import React from 'react'
import { Award } from 'lucide-react'
import Link from 'next/link'

export function ExpiringCertificatesCard({ count }: { count: number }) {
  return (
    <div className="min-w-0 rounded-xl border border-amber-200 dark:border-amber-700/50 bg-amber-50/50 dark:bg-amber-900/20 p-5 shadow-sm">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-800/40 text-amber-700 dark:text-amber-400">
          <Award className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Expiring Certificates</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Next 30 days: <span className="font-semibold text-amber-700 dark:text-amber-400">{count} expiring</span>
          </p>
          <Link
            href="/dashboard/admin/certificates"
            className="mt-3 inline-flex min-h-[44px] items-center rounded text-sm font-medium text-primary transition-colors hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            View list →
          </Link>
        </div>
      </div>
    </div>
  )
}
