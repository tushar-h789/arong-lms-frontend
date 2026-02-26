'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ROLE_TEMPLATES,
  PERMISSION_MATRIX,
  SCOPE_RULES,
  PERMISSION_AUDIT_LOG,
  type RoleId,
} from '@/lib/rbac-data'
import { Shield, Users, FileCheck, Eye } from 'lucide-react'

export function RolesPermissionsRBAC() {
  const [selectedRole, setSelectedRole] = useState<RoleId>('admin')
  const permissions = PERMISSION_MATRIX[selectedRole] ?? []

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="wrap-break-word text-2xl font-bold text-gray-900 dark:text-gray-100">
          Roles & Permissions (RBAC)
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Who can see/do what — role templates, permission matrix, assign roles, scope rules, audit
        </p>
      </div>

      {/* Role templates */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
          <Shield className="size-4 text-primary" />
          Role templates
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Admin, HR, Instructor, Learner, Manager, Auditor, IT, Organization</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {ROLE_TEMPLATES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRole(r.id)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${selectedRole === r.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            >
              {r.name}
            </button>
          ))}
        </div>
        {ROLE_TEMPLATES.find((r) => r.id === selectedRole) && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {ROLE_TEMPLATES.find((r) => r.id === selectedRole)!.description}
          </p>
        )}
      </div>

      {/* Permission matrix (page + action) */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <FileCheck className="size-4 text-primary" />
            Permission matrix (Page + Action level)
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Selected role: {selectedRole}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Page</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">View</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Create</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Edit</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Delete</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Export</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
              {permissions.map((row) => (
                <tr key={row.page} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{row.page}</td>
                  <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">{row.view ? 'Yes' : '—'}</td>
                  <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">{row.create ? 'Yes' : '—'}</td>
                  <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">{row.edit ? 'Yes' : '—'}</td>
                  <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">{row.delete ? 'Yes' : '—'}</td>
                  <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">{row.export ? 'Yes' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign roles to users/groups */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
          <Users className="size-4 text-primary" />
          Assign roles to users / groups
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Assign or change user role from Users list or here.</p>
        <div className="mt-4">
          <Link
            href="/dashboard/admin/users"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Open Users list to assign roles
          </Link>
        </div>
      </div>

      {/* Scope rules */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
          <Eye className="size-4 text-primary" />
          Scope rules
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manager only sees own team; Instructor only own courses; Auditor read-only + export.</p>
        <ul className="mt-4 space-y-2">
          {SCOPE_RULES.map((s) => (
            <li key={s.role} className="flex justify-between gap-4 rounded-lg border border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 text-sm">
              <span className="font-medium text-gray-900 dark:text-gray-100">{s.role}</span>
              <span className="text-gray-600 dark:text-gray-400">{s.rule}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Audit permission changes */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Audit permission changes</h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Who changed role/permissions and when</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Admin user</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Action</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Role / Target</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
              {PERMISSION_AUDIT_LOG.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{r.adminUser}</td>
                  <td className="px-4 py-3 text-sm capitalize text-gray-900 dark:text-gray-200">{r.action.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{r.roleName ?? r.targetUser ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{new Date(r.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-600 px-4 py-3">
          <Link href="/dashboard/admin/access/audit-logs" className="text-sm font-medium text-primary hover:underline">
            View full Audit Logs
          </Link>
        </div>
      </div>
    </div>
  )
}
