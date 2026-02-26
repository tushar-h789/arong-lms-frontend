'use client'

import React, { useState } from 'react'
import { Upload, Map, AlertTriangle, History, Download, RotateCcw } from 'lucide-react'

const MOCK_HISTORY = [
  { id: '1', date: '2025-02-22T10:00:00Z', createdBy: 'Admin', success: 45, fail: 5 },
  { id: '2', date: '2025-02-20T09:00:00Z', createdBy: 'HR', success: 120, fail: 0 },
]

export function BulkOperationsImport() {
  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div>
        <h1 className="wrap-break-word text-2xl font-bold text-gray-900 dark:text-gray-100">
          Bulk Operations (Import Center)
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          CSV import — history, validation, error fixing, rollback
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
          <Upload className="size-4 text-primary" />
          Upload CSV
        </h3>
        <div className="mt-4">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-6 py-8 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Upload className="size-8 text-gray-400 dark:text-gray-500" />
            <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">Drop file or click to upload</span>
            <input type="file" accept=".csv" className="hidden" />
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
          <Map className="size-4 text-primary" />
          Field mapping (CSV column → system fields)
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Map CSV columns to Name, Email, Center, Group, etc.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div><label className="text-xs text-gray-500 dark:text-gray-400">CSV: Name</label><select className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"><option>Column A</option></select></div>
          <div><label className="text-xs text-gray-500 dark:text-gray-400">CSV: Email</label><select className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"><option>Column B</option></select></div>
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 dark:border-amber-700/50 bg-amber-50 dark:bg-amber-900/20 p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold text-amber-900 dark:text-amber-200">
          <AlertTriangle className="size-4" />
          Validation preview (errors / warnings)
        </h3>
        <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">Fix errors before running import. Download error rows CSV.</p>
        <div className="mt-4 flex gap-2">
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
            <Download className="size-4" /> Download error rows CSV
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
            <History className="size-4 text-primary" />
            Import run history
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Date, created_by, success/fail counts. Optional rollback.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead><tr><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Date</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Created by</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Success</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Fail</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Action</th></tr></thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
              {MOCK_HISTORY.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{new Date(r.date).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{r.createdBy}</td>
                  <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">{r.success}</td>
                  <td className="px-4 py-3 text-sm text-red-600 dark:text-red-400">{r.fail}</td>
                  <td className="px-4 py-3"><button type="button" className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:underline"><RotateCcw className="size-4" /> Rollback</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
