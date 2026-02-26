'use client'

import React, { useState } from 'react'
import { MOCK_NOTIFICATIONS, NOTIFICATION_TYPE_LABELS, type NotificationType, type NotificationItem } from '@/lib/notifications-center-data'
import { Calendar, Video, Megaphone, Check } from 'lucide-react'

export function NotificationsCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS)
  const [typeFilter, setTypeFilter] = useState<NotificationType | ''>('')

  const filtered = typeFilter
    ? notifications.filter((n) => n.type === typeFilter)
    : notifications
  const unreadCount = notifications.filter((n) => !n.read).length

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }
  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const Icon = ({ type }: { type: NotificationType }) => {
    if (type === 'due_reminder') return <Calendar className="size-4 text-amber-500" />
    if (type === 'live_session') return <Video className="size-4 text-primary" />
    return <Megaphone className="size-4 text-gray-500" />
  }

  return (
    <div className="min-w-0 space-y-4 overflow-x-hidden">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications Center (Learner-facing)</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Due reminders, live session reminders, and announcement alerts in one place. Read/unread status. Critical for users who rarely open the app.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Check className="size-4" />
            Mark all read
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTypeFilter('')}
          className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${!typeFilter ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 hover:bg-gray-50'}`}
        >
          All
        </button>
        {(['due_reminder', 'live_session', 'announcement'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTypeFilter(t)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${typeFilter === t ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 hover:bg-gray-50'}`}
          >
            {NOTIFICATION_TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <ul className="divide-y divide-gray-200">
          {filtered.map((n) => (
            <li
              key={n.id}
              className={`flex gap-3 px-4 py-3 ${!n.read ? 'bg-primary/5' : ''} hover:bg-gray-50`}
            >
              <div className="flex shrink-0 items-center justify-center rounded-full bg-gray-100 p-2">
                <Icon type={n.type} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <span className={`font-medium ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</span>
                  {!n.read && (
                    <button
                      type="button"
                      onClick={() => markRead(n.id)}
                      className="shrink-0 text-xs font-medium text-primary hover:underline"
                    >
                      Mark read
                    </button>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-gray-600">{n.body}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <span>{NOTIFICATION_TYPE_LABELS[n.type]}</span>
                  <span>{new Date(n.createdAt).toLocaleString()}</span>
                  {n.linkUrl && (
                    <a href={n.linkUrl} className="text-primary hover:underline">
                      Open link
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-gray-500">No notifications.</div>
        )}
      </div>
    </div>
  )
}
