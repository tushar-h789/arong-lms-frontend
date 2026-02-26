'use client'

import React from 'react'
import { AlertCircle, CheckCircle, Info } from 'lucide-react'

type Health = 'green' | 'amber' | 'red'
type AlertType = 'success' | 'info' | 'warning' | 'error'

type Alert = { id: string; message: string; type: AlertType }

const healthConfig = {
  green: {
    label: 'Healthy',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-700/50',
    dot: 'bg-green-500',
    icon: CheckCircle,
    iconClass: 'text-green-600 dark:text-green-400',
  },
  amber: {
    label: 'Degraded',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-700/50',
    dot: 'bg-amber-500',
    icon: AlertCircle,
    iconClass: 'text-amber-600 dark:text-amber-400',
  },
  red: {
    label: 'Issues',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-700/50',
    dot: 'bg-red-500',
    icon: AlertCircle,
    iconClass: 'text-red-600 dark:text-red-400',
  },
} as const

const alertIcons: Record<AlertType, typeof Info> = {
  success: CheckCircle,
  info: Info,
  warning: AlertCircle,
  error: AlertCircle,
}

export function SystemHealthCard({ status, alerts }: { status: Health; alerts: Alert[] }) {
  const config = healthConfig[status]
  const Icon = config.icon

  return (
    <div className={`min-w-0 rounded-xl border ${config.border} ${config.bg} p-5 shadow-sm`}>
      <div className="flex min-w-0 items-center gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.dot} bg-opacity-20 ${config.iconClass}`}>
          <Icon className="size-5" />
        </span>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">System Health</h3>
          <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className={`inline-block h-2 w-2 rounded-full ${config.dot}`} />
            {config.label}
          </p>
        </div>
      </div>
      {alerts.length > 0 && (
        <ul className="mt-4 space-y-2">
          {alerts.slice(0, 3).map((a) => {
            const AlertIcon = alertIcons[a.type]
            return (
              <li key={a.id} className="flex min-w-0 items-start gap-2 text-sm">
                <AlertIcon className="mt-0.5 size-4 shrink-0 text-gray-400 dark:text-gray-500" />
                <span className="min-w-0 break-words text-gray-700 dark:text-gray-300">{a.message}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
