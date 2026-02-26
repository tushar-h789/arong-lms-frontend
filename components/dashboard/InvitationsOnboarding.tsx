'use client'

import React, { useState } from 'react'
import { MessageCircle, Send, ListTodo, RefreshCw, Route } from 'lucide-react'

const MOCK_INVITES = [
  { id: '1', phone: '+880 1712 XXX XXX', sentAt: '2025-02-22T10:00:00Z', status: 'sent', acceptedAt: null },
  { id: '2', phone: '+880 1811 XXX XXX', sentAt: '2025-02-20T09:00:00Z', status: 'accepted', acceptedAt: '2025-02-21T14:00:00Z' },
  { id: '3', phone: '+880 1911 XXX XXX', sentAt: '2025-02-15T11:00:00Z', status: 'expired', acceptedAt: null },
]

export function InvitationsOnboarding() {
  const [inviteMethod, setInviteMethod] = useState<'sms' | 'whatsapp'>('sms')

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="wrap-break-word text-2xl font-bold text-gray-900 dark:text-gray-100">
          Invitations & Onboarding
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Quick onboarding for new artisans/staff — SMS/WhatsApp invite, pending list, default path
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
          <MessageCircle className="size-4 text-primary" />
          Invite via SMS / WhatsApp
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Link or OTP — for users in rural areas</p>
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex gap-2">
            <button type="button" onClick={() => setInviteMethod('sms')} className={`rounded-lg border px-4 py-2 text-sm font-medium ${inviteMethod === 'sms' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>SMS</button>
            <button type="button" onClick={() => setInviteMethod('whatsapp')} className={`rounded-lg border px-4 py-2 text-sm font-medium ${inviteMethod === 'whatsapp' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>WhatsApp</button>
          </div>
          <input type="text" placeholder="Phone number(s) or upload list" className="min-w-[200px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400" />
          <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
            <Send className="size-4" /> Send invite
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <ListTodo className="size-4 text-primary" />
            Pending invites (sent / accepted / expired)
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Resend invite from here</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead><tr><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Phone</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Sent</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Action</th></tr></thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
              {MOCK_INVITES.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{r.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{new Date(r.sentAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm capitalize text-gray-600 dark:text-gray-400">{r.status}</td>
                  <td className="px-4 py-3">
                    {r.status === 'sent' && <button type="button" className="inline-flex items-center gap-1 text-sm text-primary hover:underline"><RefreshCw className="size-4" /> Resend</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
          <Route className="size-4 text-primary" />
          Default onboarding path assign
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">e.g. Safety + Basic SOP — new invitees get this path by default</p>
        <div className="mt-4">
          <select className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
            <option>Safety + Basic SOP</option>
            <option>New Artisan Onboarding</option>
          </select>
        </div>
      </div>
    </div>
  )
}
