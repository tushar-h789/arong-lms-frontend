'use client'

import React from 'react'
import { Shield, Users, BookOpen, Eye, MapPin } from 'lucide-react'

export function AccessPolicies() {
  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="wrap-break-word text-2xl font-bold text-gray-900 dark:text-gray-100">
          Access Policies (Data Scope Rules)
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Data access scope beyond role — Manager/Instructor/Auditor scope, center-based
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <Users className="size-4 text-primary" />
            Manager scope
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Own dept/group only — manager sees only their own team</p>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Scope</label>
            <select className="mt-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
              <option>Own department only</option>
              <option>Own group only</option>
              <option>Own department + groups</option>
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <BookOpen className="size-4 text-primary" />
            Instructor scope
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Own courses only</p>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Scope</label>
            <select className="mt-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
              <option>Assigned courses only</option>
              <option>All courses (read)</option>
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <Eye className="size-4 text-primary" />
            Auditor scope
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Read-only + export only</p>
          <div className="mt-4 flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" defaultChecked className="rounded border-gray-300 dark:border-gray-500 text-primary focus:ring-primary" /> Read-only access</label>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" defaultChecked className="rounded border-gray-300 dark:border-gray-500 text-primary focus:ring-primary" /> Export allowed</label>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <MapPin className="size-4 text-primary" />
            Center-based restrictions (optional)
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Same role can have different access by center/region</p>
          <div className="mt-4">
            <select className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100" multiple>
              <option>Dhaka HQ</option>
              <option>Chittagong</option>
              <option>Field Center 1</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Select centers this policy applies to (optional)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
