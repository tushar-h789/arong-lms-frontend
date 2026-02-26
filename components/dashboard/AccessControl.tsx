'use client'

import React from 'react'
import Link from 'next/link'
import { MOCK_ROLE_TEMPLATES } from '@/lib/access-control-data'
import { Shield, Users, Eye } from 'lucide-react'

export function AccessControl() {
  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Access Control (RBAC shortcut)</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Role-based restrictions at a glance. Role templates, data scope (e.g. manager → team only), read-only roles (auditor).
        </p>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><Shield className="size-4" /> Role templates quick view</h2>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Role</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Data scope</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Read-only</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ROLE_TEMPLATES.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-900">{r.name}</td>
                <td className="px-3 py-2 text-gray-600">{r.dataScope}</td>
                <td className="px-3 py-2">{r.readOnly ? <span className="flex items-center gap-1 text-gray-600"><Eye className="size-4" /> Yes</span> : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link href="/dashboard/admin/roles" className="mt-3 inline-block text-sm text-primary hover:underline">Manage roles (full module)</Link>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Data scope rules</h2>
        <p className="text-sm text-gray-600">Manager → team only. Auditor → all (read). Configure in Roles module.</p>
      </section>
    </div>
  )
}
