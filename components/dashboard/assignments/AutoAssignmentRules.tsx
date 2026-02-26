'use client'

import React, { useState } from 'react'
import {
  AUTO_ASSIGNMENT_RULES,
  type AutoAssignmentRuleRow,
} from '@/lib/auto-assignment-rules-data'
import { Plus, Shield, Calendar } from 'lucide-react'

export function AutoAssignmentRules() {
  const [addOpen, setAddOpen] = useState(false)

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Assignment Rules / Auto-Assignment</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            When new user joins, auto assign training. Rule builder: If Role=X and Craft=Y then assign path/course. Effective date and versioning. Reduces HR workload.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Add rule
        </button>
      </div>

      <div className="rounded-xl border border-amber-200 dark:border-amber-700/50 bg-amber-50/30 dark:bg-amber-900/20 p-4">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>Onboarding automated:</strong> Rules run when a new user is created. Example: If Role=Artisan AND Craft=Embroidery → assign &quot;Embroidery L1 Path&quot;. If Compliance required → assign &quot;Safety & Values&quot;.
        </p>
      </div>

      <div className="space-y-4">
        {AUTO_ASSIGNMENT_RULES.map((rule) => (
          <RuleCard key={rule.id} rule={rule} />
        ))}
      </div>

      {addOpen && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Rule builder</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">If conditions match, assign path/course. Effective date + versioning.</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Rule name</label>
              <input type="text" className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400" placeholder="e.g. Artisan Embroidery L1" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Conditions (If...)</label>
              <div className="flex flex-wrap gap-2">
                <select className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                  <option value="role">Role</option>
                  <option value="craft">Craft</option>
                  <option value="center">Center</option>
                  <option value="compliance_required">Compliance required</option>
                </select>
                <span className="py-2 text-gray-500 dark:text-gray-400">=</span>
                <select className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                  <option value="artisan">Artisan</option>
                  <option value="embroidery">Embroidery</option>
                  <option value="true">Yes</option>
                </select>
                <button type="button" className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">And</button>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Then assign</label>
              <select className="w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                <option value="">Select path or course</option>
                <option value="p1">Embroidery L1 Path</option>
                <option value="c1">Safety & Values</option>
              </select>
            </div>
            <div className="flex gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Effective from</label>
                <input type="date" className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Effective to (optional)</label>
                <input type="date" className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100" />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setAddOpen(false)} className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">Cancel</button>
              <button type="button" className="rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">Save rule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function RuleCard({ rule }: { rule: AutoAssignmentRuleRow }) {
  const conditionStr = rule.conditions.map((c) => `${c.field}=${Array.isArray(c.value) ? c.value.join(',') : c.value}`).join(' AND ')
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-primary" />
            <span className="font-semibold text-gray-900 dark:text-gray-100">{rule.name}</span>
            {rule.active && <span className="rounded-full bg-green-100 dark:bg-green-900/40 px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">Active</span>}
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">If {conditionStr} → assign {rule.assignContentName}</p>
          <p className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="size-3" />
            Effective {rule.effectiveFrom}
            {rule.effectiveTo && ` – ${rule.effectiveTo}`} · v{rule.version}
          </p>
        </div>
        <button type="button" className="text-sm text-primary hover:underline">Edit</button>
      </div>
    </div>
  )
}
