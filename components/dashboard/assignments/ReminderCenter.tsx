'use client'

import React, { useState } from 'react'
import {
  REMINDERS,
  REMINDER_TEMPLATES,
  CHANNEL_LABELS,
  REMINDER_STATUS_LABELS,
  type ReminderChannel,
} from '@/lib/reminder-center-data'
import { Bell, Send, FileText } from 'lucide-react'

export function ReminderCenter() {
  const [manualOpen, setManualOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [channel, setChannel] = useState<ReminderChannel>('email')

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reminder Center (Notifications & Follow-ups)</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Centralized reminders. Scheduled list, manual send (SMS/WhatsApp/Email), localized templates, delivery status. Essential for field follow-up.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setManualOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90"
        >
          <Send className="size-4" />
          Send manual reminder
        </button>
      </div>

      {/* Scheduled reminders list */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-600 px-4 py-3">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <Bell className="size-4 text-primary" />
            Scheduled reminders (what / when)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Content</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Due date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Channel</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Scheduled</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Delivery status</th>
              </tr>
            </thead>
            <tbody>
              {REMINDERS.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{r.userName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{r.contentName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{r.dueDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{CHANNEL_LABELS[r.channel]}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{r.scheduledAt.slice(0, 16).replace('T', ' ')}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      r.status === 'delivered' ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300' :
                      r.status === 'sent' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300' :
                      r.status === 'failed' ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300' : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}>
                      {REMINDER_STATUS_LABELS[r.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reminder templates (localized) */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
          <FileText className="size-4 text-primary" />
          Reminder templates (localized)
        </h3>
        <ul className="mt-4 space-y-3">
          {REMINDER_TEMPLATES.map((t) => (
            <li key={t.id} className="rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">{t.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{CHANNEL_LABELS[t.channel]}</span>
              </div>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{t.bodyBn}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.bodyEn}</p>
              <button type="button" className="mt-2 text-sm font-medium text-primary hover:underline">Use template</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Manual reminder modal placeholder */}
      {manualOpen && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Send manual reminder (SMS / WhatsApp / Email)</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Channel</label>
              <select value={channel} onChange={(e) => setChannel(e.target.value as ReminderChannel)} className="w-full max-w-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Template (optional)</label>
              <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)} className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                <option value="">None</option>
                {REMINDER_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Recipients (assignment IDs or user IDs)</label>
              <input type="text" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400" placeholder="e.g. am2, am4 or u1, u2" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setManualOpen(false)} className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">Cancel</button>
              <button type="button" className="rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
