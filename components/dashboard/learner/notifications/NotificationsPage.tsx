'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { Calendar, Megaphone, Video, ChevronRight } from 'lucide-react'
import {
  getLearnerNotifications,
  formatNotificationTime,
  type NotificationTab,
  type NotificationItemDisplay,
} from '@/lib/notifications-center-data'

const TABS: { key: NotificationTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'reminders', label: 'Reminders' },
  { key: 'announcements', label: 'Announcements' },
  { key: 'live', label: 'Live' },
]

function TypeIcon({ type }: { type: NotificationItemDisplay['type'] }) {
  const cls = 'size-5 shrink-0'
  if (type === 'due_reminder') return <Calendar className={cls} />
  if (type === 'live_session') return <Video className={cls} />
  return <Megaphone className={cls} />
}

function NotifCard({ item }: { item: NotificationItemDisplay }) {
  const message = item.oneLine ?? item.body
  const href = item.linkUrl ?? '#'
  const isExternal = href.startsWith('http')

  const content = (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-800 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 gap-3">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${item.read ? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400' : 'bg-primary/15 text-primary'
            }`}
        >
          <TypeIcon type={item.type} />
        </div>
        <div className="min-w-0">
          <p className={`text-sm ${item.read ? 'text-gray-600 dark:text-gray-400' : 'font-medium text-gray-900 dark:text-gray-100'}`}>
            {message}
          </p>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {formatNotificationTime(item.createdAt)}
          </p>
        </div>
      </div>
      {item.actionLabel && (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
          {item.actionLabel}
          <ChevronRight className="size-4" />
        </span>
      )}
    </div>
  )

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    )
  }
  return <Link href={href}>{content}</Link>
}

export default function NotificationsPage() {
  const [tab, setTab] = useState<NotificationTab>('all')
  const list = useMemo(() => getLearnerNotifications(tab), [tab])

  return (
    <div className="w-full space-y-6">
      <header>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">
          Notifications
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Reminders and announcements — one place.
        </p>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${tab === key
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
            No notifications.
          </div>
        ) : (
          list.map((item) => <NotifCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  )
}
