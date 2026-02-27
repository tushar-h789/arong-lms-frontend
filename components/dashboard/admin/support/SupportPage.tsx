'use client'

import React, { useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, Clock, Filter, Plus, Search } from 'lucide-react'
import {
  MOCK_SUPPORT_TICKETS,
  SUPPORT_GROUPS,
  SUPPORT_PRIORITIES,
  SUPPORT_TICKET_STATUSES,
  type SupportGroupId,
  type SupportTicket,
  type SupportTicketPriority,
  type SupportTicketStatus,
} from '@/lib/support-data'
import type { RoleType } from '@/lib/dashboard-nav'

type TabId = 'new' | 'history'

const CARD_BASE =
  'rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm'

const INPUT_BASE =
  'rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/20 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

type SupportPageProps = {
  /**
   * Who is viewing this IT support workspace.
   * Admin & IT can see all requests; other roles only see their own.
   */
  viewerRole?: RoleType
}

export default function SupportPage({ viewerRole = 'admin' }: SupportPageProps) {
  const [tab, setTab] = useState<TabId>('new')

  // Form state for creating a new support ticket
  const [groupId, setGroupId] = useState<SupportGroupId>('login_access')
  const [branch, setBranch] = useState('')
  const [requesterName, setRequesterName] = useState('')
  const [requesterRole, setRequesterRole] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [priority, setPriority] = useState<SupportTicketPriority>('medium')
  const [problemSummary, setProblemSummary] = useState('')
  const [problemDetails, setProblemDetails] = useState('')

  // Ticket list (mocked in-memory) so new tickets appear immediately in history tab
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_SUPPORT_TICKETS)

  // Filters for history tab
  const [filterGroupId, setFilterGroupId] = useState<SupportGroupId | ''>('')
  const [filterStatus, setFilterStatus] = useState<SupportTicketStatus | ''>('')
  const [filterBranch, setFilterBranch] = useState('')
  const [searchText, setSearchText] = useState('')

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // Non-admin / non-IT roles only see requests they created themselves
      if (viewerRole !== 'admin' && viewerRole !== 'it' && t.createdByRole !== viewerRole) {
        return false
      }
      if (filterGroupId && t.groupId !== filterGroupId) return false
      if (filterStatus && t.status !== filterStatus) return false
      if (filterBranch && !t.branch.toLowerCase().includes(filterBranch.toLowerCase())) return false
      if (searchText) {
        const haystack = `${t.problemSummary} ${t.problemDetails} ${t.requesterName} ${t.branch}`.toLowerCase()
        if (!haystack.includes(searchText.toLowerCase())) return false
      }
      return true
    })
  }, [tickets, filterGroupId, filterStatus, filterBranch, searchText, viewerRole])

  const openCount = tickets.filter((t) => t.status === 'open').length
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length

  const resetForm = () => {
    setGroupId('login_access')
    setBranch('')
    setRequesterName('')
    setRequesterRole('')
    setContactPhone('')
    setPriority('medium')
    setProblemSummary('')
    setProblemDetails('')
  }

  const handleCreateTicket = (event: React.FormEvent) => {
    event.preventDefault()

    if (!branch.trim() || !problemSummary.trim() || !problemDetails.trim()) {
      // In a real app you might show a toast; here we just avoid adding an empty ticket
      return
    }

    const now = new Date().toISOString()
    const nextTicket: SupportTicket = {
      id: `local-${Date.now()}`,
      groupId,
      branch: branch.trim(),
      requesterName: requesterName.trim() || 'Unknown',
      requesterRole: requesterRole.trim() || undefined,
      contactPhone: contactPhone.trim() || undefined,
      problemSummary: problemSummary.trim(),
      problemDetails: problemDetails.trim(),
      status: 'open',
      priority,
      createdAt: now,
      updatedAt: now,
      createdByRole: viewerRole,
    }

    setTickets((prev) => [nextTicket, ...prev])
    resetForm()
    setTab('history')
  }

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">IT Support</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Capture IT issues from the field and route them to the right technical team.
        </p>
        <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
          From one place you can record which <strong>IT problem group</strong>, which <strong>branch</strong>,
          and the exact <strong>problem details</strong> so IT and Admin can act quickly.
        </p>
      </header>

      {/* Tabs */}
      <nav className="border-b border-gray-200 dark:border-gray-700">
        <div className="-mb-px flex gap-1">
          <button
            type="button"
            onClick={() => setTab('new')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              tab === 'new'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Plus className="size-4" />
            New IT support request
          </button>
          <button
            type="button"
            onClick={() => setTab('history')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              tab === 'history'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Clock className="size-4" />
            IT support history
            {(openCount + inProgressCount) > 0 && (
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                {openCount + inProgressCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Summary cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className={CARD_BASE + ' p-4'}>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <AlertCircle className="size-4 text-amber-500" />
            Open
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">{openCount}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            New issues waiting for triage and assignment.
          </p>
        </div>
        <div className={CARD_BASE + ' p-4'}>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <Clock className="size-4 text-primary" />
            In progress
          </div>
          <p className="mt-2 text-2xl font-bold text-primary">{inProgressCount}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Being worked on by IT / HR / Learning or Ops.
          </p>
        </div>
        <div className={CARD_BASE + ' p-4'}>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <CheckCircle2 className="size-4 text-green-600" />
            Resolved
          </div>
          <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">{resolvedCount}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Closed with a solution communicated back to the field.
          </p>
        </div>
      </section>

      {/* Tab content */}
      {tab === 'new' && (
        <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <form
            className={CARD_BASE + ' p-5 space-y-4'}
            onSubmit={handleCreateTicket}
          >
              <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Capture a new IT support issue
              </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Minimum required: group, branch, short problem summary, and detailed description. You can fill
              in contact info later if needed.
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                  Which group should handle this? <span className="text-red-500">*</span>
                </label>
                <select
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value as SupportGroupId)}
                  className={INPUT_BASE + ' w-full'}
                >
                  {SUPPORT_GROUPS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as SupportTicketPriority)}
                  className={INPUT_BASE + ' w-full'}
                >
                  {SUPPORT_PRIORITIES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                  Which branch / center / factory? <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className={INPUT_BASE + ' w-full'}
                  placeholder="e.g. Mirpur Training Center, Outlet name, Production unit"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                  Contact person (optional)
                </label>
                <input
                  type="text"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  className={INPUT_BASE + ' w-full'}
                  placeholder="Name of person raising the issue"
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                  Role / designation (optional)
                </label>
                <input
                  type="text"
                  value={requesterRole}
                  onChange={(e) => setRequesterRole(e.target.value)}
                  className={INPUT_BASE + ' w-full'}
                  placeholder="e.g. Center in‑charge, Artisan, Supervisor"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                  Phone number (optional)
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className={INPUT_BASE + ' w-full'}
                  placeholder="For follow‑up call or WhatsApp"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                Short problem title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={problemSummary}
                onChange={(e) => setProblemSummary(e.target.value)}
                className={INPUT_BASE + ' w-full'}
                placeholder="In one line: what is the problem?"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                Detailed description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                value={problemDetails}
                onChange={(e) => setProblemDetails(e.target.value)}
                className={INPUT_BASE + ' w-full resize-y'}
                placeholder="Step‑by‑step what is happening, how many learners are impacted, screens / error messages, time of day, etc."
              />
              <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                The more details you capture here, the fewer calls back and forth are needed. Think like a
                ticket: symptom, where, when, who, and any pattern you notice.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
              >
                <Plus className="size-4" />
                Save support request
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Clear form
              </button>
            </div>
          </form>

          <aside className={CARD_BASE + ' p-5 space-y-3'}>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              How to write a good support ticket
            </h3>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
              <li>Always capture exact branch / center name and which batch or cohort is affected.</li>
              <li>Note whether the issue is with login, content access, device / network, or data / reporting.</li>
              <li>Record at least one real learner name / ID so IT can reproduce.</li>
              <li>Include screenshots or error wording in English or Bangla if possible.</li>
              <li>For recurring problems, mention how often it is happening (daily, weekly, specific shift).</li>
            </ul>
          </aside>
        </section>
      )}

      {tab === 'history' && (
        <section className="space-y-4">
          <div className={CARD_BASE + ' p-4 space-y-3'}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Support request history
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Filter by group, status, branch, or quick search on title / details.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={filterGroupId}
                onChange={(e) => setFilterGroupId(e.target.value as SupportGroupId | '')}
                className={INPUT_BASE}
              >
                <option value="">All groups</option>
                {SUPPORT_GROUPS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as SupportTicketStatus | '')}
                className={INPUT_BASE}
              >
                <option value="">All statuses</option>
                {SUPPORT_TICKET_STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
                className={INPUT_BASE + ' w-48'}
                placeholder="Branch / center"
              />
              <div className="relative flex-1 min-w-[160px] max-w-xs">
                <Search className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-gray-400" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className={INPUT_BASE + ' w-full pl-8'}
                  placeholder="Search by title, details, or person"
                />
              </div>
            </div>
          </div>

          <div className={CARD_BASE + ' overflow-hidden'}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/80">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                      Created
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                      Group
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                      Branch
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                      Problem
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                      Requested by
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                      Priority
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                      Last update
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTickets.map((t) => {
                    const groupLabel = SUPPORT_GROUPS.find((g) => g.id === t.groupId)?.label ?? t.groupId
                    const statusMeta = SUPPORT_TICKET_STATUSES.find((s) => s.id === t.status)
                    const priorityMeta = SUPPORT_PRIORITIES.find((p) => p.id === t.priority)

                    const statusClass =
                      t.status === 'resolved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                        : t.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'

                    const priorityClass =
                      t.priority === 'high'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                        : t.priority === 'medium'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'

                    return (
                      <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                        <td className="px-4 py-2 align-top text-xs text-gray-600 dark:text-gray-300">
                          {formatDateTime(t.createdAt)}
                        </td>
                        <td className="px-4 py-2 align-top text-xs text-gray-700 dark:text-gray-200">
                          {groupLabel}
                        </td>
                        <td className="px-4 py-2 align-top text-xs text-gray-600 dark:text-gray-300">
                          {t.branch}
                        </td>
                        <td className="px-4 py-2 align-top">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                            {t.problemSummary}
                          </div>
                          <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            {t.problemDetails}
                          </div>
                        </td>
                        <td className="px-4 py-2 align-top text-xs text-gray-600 dark:text-gray-300">
                          {t.requesterName}
                          {t.requesterRole && (
                            <div className="text-[11px] text-gray-500 dark:text-gray-400">
                              {t.requesterRole}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2 align-top">
                          <span className={`inline-flex rounded px-1.5 py-0.5 text-xs font-medium ${statusClass}`}>
                            {statusMeta?.label ?? t.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 align-top">
                          <span className={`inline-flex rounded px-1.5 py-0.5 text-xs font-medium ${priorityClass}`}>
                            {priorityMeta?.label ?? t.priority}
                          </span>
                        </td>
                        <td className="px-4 py-2 align-top text-xs text-gray-600 dark:text-gray-300">
                          {formatDateTime(t.updatedAt)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {filteredTickets.length === 0 && (
              <div className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                No support requests match the current filters.
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

