'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  ListOrdered,
  Users,
  ClipboardCheck,
  Plus,
  Download,
  ChevronRight,
  Check,
  X,
  AlertTriangle,
  Building2,
  Filter,
  Send,
  FileText,
  ExternalLink,
} from 'lucide-react'
import {
  getPromotionOverview,
  getPositions,
  getPositionById,
  getEligibleCandidates,
  getUnderReviewQueue,
  ELIGIBILITY_STATUS_LABELS,
  POSITION_LEVELS,
  POSITION_STATUS_OPTIONS,
  CRAFT_OPTIONS,
  PROMOTION_CENTERS,
  PROMOTION_GROUPS,
  type EligibilityStatus,
  type CraftFilter,
  type PositionLevel,
  type PositionStatus,
} from '@/lib/promotion-eligibility-data'

const CARD_BASE =
  'rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm'
const INPUT_BASE =
  'rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

type TabId = 'overview' | 'positions' | 'candidates' | 'reviews'

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'positions', label: 'Positions & Rules', icon: ListOrdered },
  { id: 'candidates', label: 'Eligible Candidates', icon: Users },
  { id: 'reviews', label: 'Reviews & Decisions', icon: ClipboardCheck },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function KPICard({
  title,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  title: string
  value: string | number
  hint?: string
  icon: React.ElementType
  accent?: 'green' | 'amber' | 'blue'
}) {
  const accentClass =
    accent === 'green'
      ? 'text-green-600 dark:text-green-400'
      : accent === 'amber'
        ? 'text-amber-600 dark:text-amber-400'
        : accent === 'blue'
          ? 'text-primary'
          : 'text-gray-700 dark:text-gray-300'
  return (
    <div className={CARD_BASE + ' p-5 transition-shadow hover:shadow-md'}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{title}</p>
          <p className={`mt-1 text-2xl font-bold ${accentClass}`}>{value}</p>
          {hint != null && (
            <p className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-300">{hint}</p>
          )}
        </div>
        <div className="rounded-lg bg-gray-100 dark:bg-gray-700 p-2.5">
          <Icon className={`size-5 ${accentClass}`} />
        </div>
      </div>
    </div>
  )
}

export default function PromotionEligibilityPage() {
  const [tab, setTab] = useState<TabId>('overview')

  const overview = useMemo(() => getPromotionOverview(), [])

  // Tab 2: Positions
  const [posCraft, setPosCraft] = useState<CraftFilter | ''>('')
  const [posLevel, setPosLevel] = useState<PositionLevel | ''>('')
  const [posStatus, setPosStatus] = useState<PositionStatus | ''>('')
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null)
  const positions = useMemo(
    () => getPositions({ craft: posCraft || undefined, level: posLevel || undefined, status: posStatus || undefined }),
    [posCraft, posLevel, posStatus]
  )
  const selectedPosition = selectedPositionId ? getPositionById(selectedPositionId) : null
  const allPositionsForFilter = useMemo(() => getPositions({}), [])

  // Tab 3: Candidates
  const [candCraft, setCandCraft] = useState('')
  const [candPositionId, setCandPositionId] = useState('')
  const [candCenter, setCandCenter] = useState('')
  const [candGroup, setCandGroup] = useState('')
  const [candStatus, setCandStatus] = useState<EligibilityStatus | ''>('')
  const [candDateFrom, setCandDateFrom] = useState('')
  const [candDateTo, setCandDateTo] = useState('')
  const candidates = useMemo(
    () =>
      getEligibleCandidates({
        craft: candCraft || undefined,
        positionId: candPositionId || undefined,
        center: candCenter || undefined,
        group: candGroup || undefined,
        status: candStatus || undefined,
        dateFrom: candDateFrom || undefined,
        dateTo: candDateTo || undefined,
      }),
    [candCraft, candPositionId, candCenter, candGroup, candStatus, candDateFrom, candDateTo]
  )
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<Set<string>>(new Set())

  // Tab 4: Reviews
  const reviewQueue = useMemo(() => getUnderReviewQueue(), [])
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [hrNotes, setHrNotes] = useState('')
  const selectedReview = selectedReviewId ? reviewQueue.find((r) => r.candidateId === selectedReviewId) : null

  const toggleCandidate = (id: string) => {
    setSelectedCandidateIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  const selectAllCandidates = () => {
    if (selectedCandidateIds.size === candidates.length) setSelectedCandidateIds(new Set())
    else setSelectedCandidateIds(new Set(candidates.map((c) => c.id)))
  }

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Promotion & Eligibility
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          See who’s ready to grow — manage ladder, eligibility, and approvals in one place.
        </p>
        <p className="mt-2 max-w-xl text-sm text-gray-600 dark:text-gray-300">
          Define positions and rules once; the system calculates who’s eligible. Start from <strong>Eligible Candidates</strong> to review and approve.
        </p>
      </header>

      <nav className="border-b border-gray-200 dark:border-gray-700">
        <div className="-mb-px flex gap-1">
          {TABS.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${tab === t.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
              >
                <Icon className="size-4" />
                {t.label}
                {t.id === 'reviews' && reviewQueue.length > 0 && (
                  <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                    {reviewQueue.length}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Tab 1: Overview */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">Promotion health at a glance. Spot bottlenecks and take action.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard title="Eligible candidates" value={overview.eligibleCount} hint="Ready for review" icon={Users} accent="blue" />
            <KPICard title="Under review" value={overview.underReviewCount} hint="Awaiting decision" icon={ClipboardCheck} accent="amber" />
            <KPICard title="Approved this month" value={overview.approvedThisMonth} hint="Promoted" icon={Check} accent="green" />
            <KPICard title="Rejected this month" value={overview.rejectedThisMonth} hint="With reason" icon={X} />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className={CARD_BASE + ' p-5'}>
              <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Building2 className="size-4" /> Top centers with eligible learners
              </h2>
              <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">Where promotion pipeline is strongest.</p>
              {overview.topCentersWithEligible.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No data</p>
              ) : (
                <ul className="space-y-2">
                  {overview.topCentersWithEligible.map((c) => (
                    <li key={c.center} className="flex justify-between text-sm">
                      <span>{c.center}</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{c.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className={CARD_BASE + ' p-5'}>
              <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <AlertTriangle className="size-4" /> Compliance blocks
              </h2>
              <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">Learners whose eligibility is blocked — fix these to unblock.</p>
              {overview.complianceBlocks.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">None</p>
              ) : (
                <ul className="space-y-2">
                  {overview.complianceBlocks.map((b) => (
                    <li key={b.reason} className="flex justify-between text-sm">
                      <span className="text-amber-700 dark:text-amber-400">{b.reason}</span>
                      <span className="font-medium">{b.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTab('candidates')}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              View Eligible List
              <ChevronRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setTab('positions')}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Plus className="size-4" /> Create Position Rule
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Download className="size-4" /> Export Eligible Candidates
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Positions & Rules */}
      {tab === 'positions' && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className={CARD_BASE + ' p-4'}>
            <h2 className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">Position list</h2>
            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">Build the ladder once; the system calculates who’s eligible.</p>
            <div className="mb-3 flex flex-wrap gap-2">
              <select value={posCraft} onChange={(e) => setPosCraft(e.target.value as CraftFilter | '')} className={INPUT_BASE}>
                <option value="">All crafts</option>
                {CRAFT_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select value={posLevel} onChange={(e) => setPosLevel(e.target.value as PositionLevel | '')} className={INPUT_BASE}>
                <option value="">All levels</option>
                {POSITION_LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <select value={posStatus} onChange={(e) => setPosStatus(e.target.value as PositionStatus | '')} className={INPUT_BASE}>
                {POSITION_STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <ul className="space-y-1">
              {positions.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedPositionId(p.id)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${selectedPositionId === p.id ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            {selectedPosition ? (
              <div className={CARD_BASE + ' p-5'}>
                <h2 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">{selectedPosition.name}</h2>
                <div className="grid gap-3 text-sm">
                  <p><span className="text-gray-500 dark:text-gray-400">Level:</span> {selectedPosition.level}</p>
                  <p><span className="text-gray-500 dark:text-gray-400">Craft:</span> {selectedPosition.craft}</p>
                  <p><span className="text-gray-500 dark:text-gray-400">Center visibility:</span> {selectedPosition.centerVisibility.length === 0 ? 'All' : selectedPosition.centerVisibility.join(', ')}</p>
                </div>
                <h3 className="mt-4 mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Eligibility rules</h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>Required path(s): {selectedPosition.rule.requiredPathIds.length ? selectedPosition.rule.requiredPathIds.join(', ') : 'None'}</li>
                  <li>Required course(s): {selectedPosition.rule.requiredCourseIds.length ? selectedPosition.rule.requiredCourseIds.join(', ') : 'None'}</li>
                  <li>Minimum quiz score: {selectedPosition.rule.minQuizScorePercent}%</li>
                  <li>Practical verification: {selectedPosition.rule.practicalVerificationRequired ? 'Yes' : 'No'}</li>
                  <li>Attendance minimum: {selectedPosition.rule.attendanceMinPercent}%</li>
                  <li>Compliance training: {selectedPosition.rule.complianceTrainingRequired ? 'Yes' : 'No'}</li>
                  <li>Certificate validity: {selectedPosition.rule.certificateValidityDays ?? 'N/A'} days</li>
                </ul>
                <div className="mt-4 flex gap-2">
                  <button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">Save rule</button>
                  <button type="button" className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">Duplicate rule</button>
                  <button type="button" className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">Preview eligibility</button>
                </div>
              </div>
            ) : (
              <div className={CARD_BASE + ' flex min-h-[220px] flex-col items-center justify-center border-dashed p-6 text-center'}>
                <ListOrdered className="size-10 text-gray-400 dark:text-gray-500" />
                <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Select a position</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Choose from the list to view and edit eligibility rules.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Eligible Candidates */}
      {tab === 'candidates' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">Your main workspace — filter by center or craft, then review or bulk action.</p>
          <div className={`${CARD_BASE} p-4`}>
            <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Filter className="size-4" /> Filters
            </h2>
            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">Narrow by craft, position, center, group, status, or date.</p>
            <div className="flex flex-wrap gap-3">
              <select value={candCraft} onChange={(e) => setCandCraft(e.target.value)} className={INPUT_BASE}>
                <option value="">All crafts</option>
                {CRAFT_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select value={candPositionId} onChange={(e) => setCandPositionId(e.target.value)} className={INPUT_BASE}>
                <option value="">All positions</option>
                {allPositionsForFilter.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <select value={candCenter} onChange={(e) => setCandCenter(e.target.value)} className={INPUT_BASE}>
                <option value="">All centers</option>
                {PROMOTION_CENTERS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select value={candGroup} onChange={(e) => setCandGroup(e.target.value)} className={INPUT_BASE}>
                <option value="">All groups</option>
                {PROMOTION_GROUPS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <select value={candStatus} onChange={(e) => setCandStatus(e.target.value as EligibilityStatus | '')} className={INPUT_BASE}>
                <option value="">All statuses</option>
                {(Object.entries(ELIGIBILITY_STATUS_LABELS) as [EligibilityStatus, string][]).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <input type="date" value={candDateFrom} onChange={(e) => setCandDateFrom(e.target.value)} className={INPUT_BASE} placeholder="From" />
              <input type="date" value={candDateTo} onChange={(e) => setCandDateTo(e.target.value)} className={INPUT_BASE} placeholder="To" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
              <Download className="size-4 inline mr-1" /> Export list
            </button>
            <button type="button" disabled={selectedCandidateIds.size === 0} className="inline-flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm disabled:opacity-50">
              <Send className="size-4" /> Send reminder ({selectedCandidateIds.size})
            </button>
            <button type="button" disabled={selectedCandidateIds.size === 0} className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm disabled:opacity-50">
              Assign missing training
            </button>
          </div>
          <div className={`${CARD_BASE} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="w-8 px-4 py-3 text-left">
                      <input type="checkbox" checked={selectedCandidateIds.size === candidates.length && candidates.length > 0} onChange={selectAllCandidates} className="rounded border-gray-300" />
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Learner</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Center / Group</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Current → Target</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Missing requirements</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Evidence</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {candidates.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selectedCandidateIds.has(c.id)} onChange={() => toggleCandidate(c.id)} className="rounded border-gray-300" />
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/dashboard/admin/users/${c.userId}`}
                          className="font-medium text-primary hover:underline inline-flex items-center gap-1"
                          title="View user profile"
                        >
                          {c.userName}
                          <ExternalLink className="size-3.5 shrink-0 opacity-70" />
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{c.center} / {c.group}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{c.currentPositionName} → {c.targetPositionName}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${c.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' :
                          c.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' :
                            c.status === 'under_review' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' :
                              c.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                          {ELIGIBILITY_STATUS_LABELS[c.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                        {c.missingRequirements.length ? c.missingRequirements.join('; ') : '—'}
                      </td>
                      <td className="px-4 py-3">{c.evidenceScorePercent != null ? `${c.evidenceScorePercent}%` : '—'}</td>
                      <td className="px-4 py-3 text-right">
                        {c.status === 'eligible' || c.status === 'under_review' ? (
                          <button type="button" onClick={() => { setTab('reviews'); setSelectedReviewId(c.id); }} className="text-primary hover:underline font-medium">
                            Review
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {candidates.length === 0 && (
              <div className="px-6 py-12 text-center">
                <Users className="mx-auto size-12 text-gray-400 dark:text-gray-500" />
                <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">No candidates match your filters</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Try changing craft, center, or status — or add more positions so learners can become eligible.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Reviews & Decisions */}
      {tab === 'reviews' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className={CARD_BASE + ' p-4'}>
            <h2 className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">Review queue</h2>
            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">Evidence checklist makes decisions fair and fast. Reject reason is required.</p>
            <ul className="space-y-2">
              {reviewQueue.map((r) => (
                <li key={r.candidateId}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedReviewId(r.candidateId)}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedReviewId(r.candidateId)}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors cursor-pointer ${selectedReviewId === r.candidateId
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                  >
                    <Link
                      href={`/dashboard/admin/users/${r.userId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-medium text-primary hover:underline"
                      title="View user profile"
                    >
                      {r.userName}
                    </Link>
                    <span className="ml-2 text-gray-500 dark:text-gray-400">→ {r.targetPositionName}</span>
                    {r.pendingDays > 0 && (
                      <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                        {r.pendingDays}d pending
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {reviewQueue.length === 0 && (
              <div className="py-10 text-center">
                <ClipboardCheck className="mx-auto size-10 text-gray-400 dark:text-gray-500" />
                <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">No items under review</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">When someone is marked for review, they’ll show up here. Check Eligible Candidates to start a review.</p>
              </div>
            )}
          </div>
          <div className={CARD_BASE + ' p-5'}>
            {selectedReview ? (
              <>
                <h2 className="mb-4">
                  <Link
                    href={`/dashboard/admin/users/${selectedReview.userId}`}
                    className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
                    title="View user profile"
                  >
                    {selectedReview.userName}
                    <ExternalLink className="size-3.5 shrink-0 opacity-70" />
                  </Link>
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedReview.center} / {selectedReview.group} → {selectedReview.targetPositionName}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Under review since {formatDate(selectedReview.underReviewSince)} · {selectedReview.pendingDays} days pending</p>
                <h3 className="mt-4 mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Evidence checklist</h3>
                <ul className="space-y-2">
                  {selectedReview.evidenceChecklist.map((e) => (
                    <li key={e.id} className="flex items-center gap-2 text-sm">
                      {e.met ? <Check className="size-4 text-green-600" /> : <X className="size-4 text-red-500" />}
                      <span>{e.label}</span>
                      {e.detail != null && <span className="text-gray-500 dark:text-gray-400">({e.detail})</span>}
                    </li>
                  ))}
                </ul>
                {selectedReview.attachments.length > 0 && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    <FileText className="size-4 inline mr-1" /> Attachments: {selectedReview.attachments.map((a) => a.name).join(', ')}
                  </p>
                )}
                <div className="mt-4">
                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">HR notes</label>
                  <textarea
                    rows={2}
                    value={hrNotes}
                    onChange={(e) => setHrNotes(e.target.value)}
                    placeholder="Internal notes"
                    className={INPUT_BASE + ' w-full'}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                    <Check className="size-4 inline mr-1" /> Approve promotion
                  </button>
                  <div className="flex flex-1 min-w-0 items-center gap-2">
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Reject reason (mandatory)"
                      className={INPUT_BASE + ' flex-1 min-w-0'}
                    />
                    <button type="button" className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-800 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20">
                      <X className="size-4 inline mr-1" /> Reject
                    </button>
                  </div>
                </div>
                <button type="button" className="mt-2 text-sm text-gray-500 hover:underline">Request recheck / return to trainer</button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ClipboardCheck className="size-10 text-gray-400 dark:text-gray-500" />
                <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Select a review from the queue</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Click a row on the left to see evidence and approve or reject.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
