'use client'

import React from 'react'
import { Shield, Key, Smartphone, AlertCircle, Unlock, Monitor } from 'lucide-react'

export function SecurityLoginControls() {
  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="wrap-break-word text-2xl font-bold text-gray-900 dark:text-gray-100">
          Security & Login Controls
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Account safety + misuse control — password/OTP policy, 2FA, locked accounts, session
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <Key className="size-4 text-primary" />
            Password policy / OTP policy
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Min length, expiry, OTP validity</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><label className="text-xs text-gray-500 dark:text-gray-400">Min password length</label><input type="number" defaultValue={8} className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" /></div>
            <div><label className="text-xs text-gray-500 dark:text-gray-400">OTP validity (minutes)</label><input type="number" defaultValue={10} className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" /></div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <Smartphone className="size-4 text-primary" />
            2FA policy (Admin / HR)
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Require 2FA for admin and HR roles</p>
          <div className="mt-4 flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" className="rounded border-gray-300 dark:border-gray-500 text-primary focus:ring-primary" /> Admin</label>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" className="rounded border-gray-300 dark:border-gray-500 text-primary focus:ring-primary" /> HR</label>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <AlertCircle className="size-4 text-primary" />
            Failed login attempts report
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Recent failed logins</p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead><tr><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">User</th><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Time</th><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">IP</th></tr></thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600"><tr><td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200">—</td><td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">No recent failures</td><td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200">—</td></tr></tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <Unlock className="size-4 text-primary" />
            Locked accounts list + unlock
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">For support team — unlock from here</p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead><tr><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">User</th><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Locked at</th><th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Action</th></tr></thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600"><tr><td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200">sadia@aarong.com</td><td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">2025-02-18</td><td className="px-4 py-2"><button type="button" className="text-sm text-primary hover:underline">Unlock</button></td></tr></tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <Monitor className="size-4 text-primary" />
            Session management (optional)
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">View/revoke active sessions</p>
        </div>
      </div>
    </div>
  )
}
