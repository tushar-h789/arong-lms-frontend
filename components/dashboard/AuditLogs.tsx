'use client'

import React, { useState, useMemo } from 'react'
import { MOCK_AUDIT_LOGS, CRITICAL_ACTIONS, type AuditAction } from '@/lib/audit-logs-data'
import { FileText, Download, Filter } from 'lucide-react'

const ACTION_LABELS: Record<AuditAction, string> = {
  role_change: 'Role change',
  delete_course: 'Delete course',
  archive_course: 'Archive course',
  security_setting: 'Security setting',
  bulk_import: 'Bulk import',
  login: 'Login',
  edit_course: 'Edit course',
}

export function AuditLogs() {
  const [userFilter, setUserFilter] = useState('')
  const [actionFilter, setActionFilter] = useState<AuditAction | ''>('')
  const [entityFilter, setEntityFilter] = useState('')
  const [criticalOnly, setCriticalOnly] = useState(false)

  const filtered = useMemo(() => {
    return MOCK_AUDIT_LOGS.filter((e) => {
      if (userFilter && !e.userName.toLowerCase().includes(userFilter.toLowerCase())) return false
      if (actionFilter && e.action !== actionFilter) return false
      if (entityFilter && e.entityType !== entityFilter) return false
      if (criticalOnly && !e.critical) return false
      return true
    })
  }, [userFilter, actionFilter, entityFilter, criticalOnly])

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Who did what when. Filters, export CSV/PDF. Critical actions highlighted. Compliance and governance.
        </p>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><Filter className="size-4" /> Filters</h2>
        <div className="flex flex-wrap gap-3">
          <input type="text" placeholder="User" value={userFilter} onChange={(e) => setUserFilter(e.target.value)} className="w-40 rounded border border-gray-300 px-3 py-1.5 text-sm" />
          <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value as AuditAction | '')} className="rounded border border-gray-300 px-3 py-1.5 text-sm">
            <option value="">All actions</option>
            {(Object.keys(ACTION_LABELS) as AuditAction[]).map((a) => (
              <option key={a} value={a}>{ACTION_LABELS[a]}</option>
            ))}
          </select>
          <select value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)} className="rounded border border-gray-300 px-3 py-1.5 text-sm">
            <option value="">All entities</option>
            <option value="course">Course</option>
            <option value="user">User</option>
            <option value="role">Role</option>
            <option value="settings">Settings</option>
          </select>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={criticalOnly} onChange={(e) => setCriticalOnly(e.target.checked)} className="rounded text-primary" /> Critical only</label>
        </div>
        <p className="mt-2 text-xs text-gray-500">Critical: role change, delete/archive course, security setting change, bulk import.</p>
      </section>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900">Log entries</h2>
          <div className="flex gap-2">
            <button type="button" className="inline-flex items-center gap-1.5 rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"><Download className="size-4" /> Export CSV</button>
            <button type="button" className="inline-flex items-center gap-1.5 rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">Export PDF</button>
          </div>
        </div>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">User</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Action</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Entity</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Details</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">At</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className={`hover:bg-gray-50 ${e.critical ? 'bg-amber-50/50' : ''}`}>
                <td className="px-3 py-2 font-medium text-gray-900">{e.userName}</td>
                <td className="px-3 py-2">
                  <span className={e.critical ? 'font-medium text-amber-800' : 'text-gray-700'}>{ACTION_LABELS[e.action]}</span>
                  {e.critical && <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">Critical</span>}
                </td>
                <td className="px-3 py-2 text-gray-600">{e.entityType} {e.entityId}</td>
                <td className="px-3 py-2 text-gray-600">{e.details}</td>
                <td className="px-3 py-2 text-gray-500">{new Date(e.at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="px-4 py-8 text-center text-sm text-gray-500">No matching logs.</div>}
      </section>
    </div>
  )
}
