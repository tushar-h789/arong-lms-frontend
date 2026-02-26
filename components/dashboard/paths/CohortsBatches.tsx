'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  COHORTS,
  COHORT_MEMBERS,
  COHORT_NOTES,
  type CohortRow,
  type CohortMemberRow,
  type CohortNoteRow,
} from '@/lib/cohorts-data'
import {
  Search,
  Plus,
  Users,
  Target,
  MessageSquare,
  UserCheck,
  MapPin,
} from 'lucide-react'

export function CohortsBatches() {
  const [search, setSearch] = useState('')
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null)
  const filtered = COHORTS.filter(
    (c) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.centerOrVillage.toLowerCase().includes(search.toLowerCase())
  )
  const selectedCohort = selectedCohortId ? COHORTS.find((c) => c.id === selectedCohortId) : null
  const members = selectedCohortId ? COHORT_MEMBERS.filter((m) => m.cohortId === selectedCohortId) : []
  const notes = selectedCohortId ? COHORT_NOTES.filter((n) => n.cohortId === selectedCohortId) : []

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Cohorts / Batches</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Run training by batch (village/center). Create cohort, add members, track progress, attendance and trainer notes.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Create cohort
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <input
          type="search"
          placeholder="Search by cohort name or center..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-10 pr-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
            <div className="border-b border-gray-200 dark:border-gray-600 px-4 py-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Cohorts</h3>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-600">
              {filtered.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedCohortId(c.id)}
                    className={`flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors ${
                      selectedCohortId === c.id ? 'bg-primary/10 dark:bg-primary/20 text-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100">{c.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{c.centerOrVillage} · {c.memberCount} members</span>
                  </button>
                </li>
              ))}
            </ul>
            {filtered.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No cohorts match.</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedCohort ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{selectedCohort.name}</h3>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <MapPin className="size-4" />
                    {selectedCohort.centerOrVillage}
                  </span>
                  <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Target className="size-4" />
                    {selectedCohort.pathName}
                  </span>
                  <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Users className="size-4" />
                    {selectedCohort.completionPercent}% complete · {selectedCohort.trainerName}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
                <div className="border-b border-gray-200 dark:border-gray-600 px-4 py-3">
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                    <Users className="size-4" />
                    Cohort members
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700/50">
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Member</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Progress</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Attendance</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m) => (
                        <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100">{m.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">{m.progressPercent}%</td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">{m.attendancePercent}%</td>
                          <td className="px-4 py-2">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                m.status === 'completed' ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300' : m.status === 'active' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {members.length === 0 && (
                  <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">No members in this cohort yet.</div>
                )}
              </div>

              <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
                <div className="border-b border-gray-200 dark:border-gray-600 px-4 py-3">
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                    <MessageSquare className="size-4" />
                    Cohort attendance + trainer notes
                  </h3>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                  {notes.map((n) => (
                    <li key={n.id} className="px-4 py-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{n.date}</span>
                        <span className={`rounded px-1.5 py-0.5 ${n.type === 'attendance' ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'}`}>
                          {n.type === 'attendance' ? 'Attendance' : 'Trainer note'}
                        </span>
                        <span>{n.author}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{n.content}</p>
                    </li>
                  ))}
                </ul>
                {notes.length === 0 && (
                  <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">No attendance or trainer notes yet.</div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-600 px-4 py-3">
                  <button type="button" className="text-sm font-medium text-primary hover:underline">
                    Add attendance / trainer note
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 py-16 text-center">
              <UserCheck className="size-12 text-gray-300 dark:text-gray-500" />
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Select a cohort to view members, progress and notes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
