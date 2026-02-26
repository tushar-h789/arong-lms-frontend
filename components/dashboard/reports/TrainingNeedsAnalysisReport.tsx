'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  Lightbulb,
  ChevronRight,
  ChevronDown,
  Download,
  Send,
  AlertTriangle,
  Users,
  Target,
  Sparkles,
  TrendingUp,
  Info,
  Zap,
} from 'lucide-react'
import {
  getTNAOverview,
  getTNACenterGaps,
  getTNAGroupGaps,
  getTNAPersonGaps,
  getTNASkillTopicGaps,
  getTNARecommendations,
  TNA_CENTERS,
  GAP_LEVEL_LABELS,
  type GapLevel,
  type CenterGapRow,
  type GroupGapRow,
  type SkillTopicGapRow,
  type TNARecommendation,
} from '@/lib/tna-data'

const CARD_BASE =
  'rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm'

type TabId = 'overview' | 'by_center' | 'by_skill' | 'recommendations'

const TABS: { id: TabId; label: string; description: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'At a glance', description: 'Priority gaps & where to focus', icon: LayoutDashboard },
  { id: 'by_center', label: 'By center', description: 'Drill down by location & group', icon: Building2 },
  { id: 'by_skill', label: 'By skill', description: 'Who needs what training', icon: BookOpen },
  { id: 'recommendations', label: 'Take action', description: 'Assign training from gaps', icon: Lightbulb },
]

const GAP_COLORS: Record<GapLevel, string> = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  low: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
}

const GAP_MEANING: Record<GapLevel, string> = {
  high: 'Needs training soon',
  medium: 'Could use a refresher',
  low: 'On track',
}

export function TrainingNeedsAnalysisReport() {
  const [tab, setTab] = useState<TabId>('overview')
  const [centerFilter, setCenterFilter] = useState('')
  const [expandedCenter, setExpandedCenter] = useState<string | null>(null)

  const overview = useMemo(() => getTNAOverview(), [])
  const centerGaps = useMemo(() => getTNACenterGaps({ center: centerFilter || undefined }), [centerFilter])
  const groupGaps = useMemo(
    () => getTNAGroupGaps({ center: expandedCenter || undefined }),
    [expandedCenter]
  )
  const personGaps = useMemo(
    () => getTNAPersonGaps({ center: expandedCenter || undefined }),
    [expandedCenter]
  )
  const skillTopicGaps = useMemo(() => getTNASkillTopicGaps(), [])
  const recommendations = useMemo(
    () => getTNARecommendations({ center: centerFilter || undefined }),
    [centerFilter]
  )

  const toggleCenter = (center: string) => {
    setExpandedCenter((prev) => (prev === center ? null : center))
  }

  const totalHigh = overview.topCentersWithGaps.reduce((s, c) => s + c.highCount, 0)
  const totalMedium = overview.topCentersWithGaps.reduce((s, c) => s + c.mediumCount, 0)

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      {/* Hero header */}
      <header className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-600 bg-gradient-to-br from-primary/5 via-white to-amber-50/50 dark:from-primary/10 dark:via-gray-800 dark:to-gray-800/80 p-6 shadow-sm">
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-primary">
              <Sparkles className="size-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">Training Needs Analysis</span>
            </div>
            <h1 className="break-words text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
              Where should training go next?
            </h1>
            <p className="mt-2 max-w-xl text-sm text-gray-600 dark:text-gray-300">
              See which <strong>centers</strong>, <strong>groups</strong>, and <strong>skills</strong> need attention — then assign the right path or course in one click.
            </p>
            {(totalHigh > 0 || totalMedium > 0) && (
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                <Zap className="size-3.5" />
                {totalHigh} high-priority · {totalMedium} medium-priority gaps right now
              </p>
            )}
          </div>
          <div className="flex flex-shrink-0 flex-wrap gap-2">
            <Link
              href="/dashboard/admin/assignments"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-primary-hover transition-all hover:shadow-lg"
            >
              <Send className="size-4" />
              Assign training from TNA
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Download className="size-4" />
              Export
            </button>
          </div>
        </div>
      </header>

      <nav className="border-b border-gray-200 dark:border-gray-700">
        <div className="-mb-px flex flex-wrap gap-1">
          {TABS.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex flex-col items-start gap-0.5 border-b-2 px-4 py-3 text-left transition-colors ${
                  tab === t.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Icon className="size-4" />
                  {t.label}
                </span>
                <span className="text-xs font-normal opacity-80">{t.description}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Tab A: Overview */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 px-4 py-3">
            <Info className="size-4 text-gray-500 dark:text-gray-400 shrink-0" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Quick take:</strong> Focus training where the numbers show the biggest need — then use <strong>Take action</strong> to assign paths or courses.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className={CARD_BASE + ' p-5 transition-shadow hover:shadow-md'}>
              <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                <Target className="size-4 text-primary" /> Skills that need attention
              </h2>
              <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                Most learners needing training in these areas. Tackle these first for maximum impact.
              </p>
              {overview.topSkillGaps.length === 0 ? (
                <p className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No gaps right now — great job keeping skills up to date.
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {overview.topSkillGaps.map((g, i) => (
                    <li key={i} className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 dark:bg-gray-700/30 px-2.5 py-2 text-sm">
                      <span className="min-w-0 truncate font-medium text-gray-900 dark:text-gray-100" title={g.skillTopicName}>
                        {i + 1}. {g.skillTopicName}
                      </span>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${GAP_COLORS[g.gapLevel]}`} title={GAP_MEANING[g.gapLevel]}>
                        {g.count} {GAP_MEANING[g.gapLevel].toLowerCase()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className={CARD_BASE + ' p-5 transition-shadow hover:shadow-md'}>
              <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                <Building2 className="size-4 text-primary" /> Centers with most gaps
              </h2>
              <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                Where to focus by location. Expand in <strong>By center</strong> to see groups and people.
              </p>
              {overview.topCentersWithGaps.length === 0 ? (
                <p className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  All centers looking good.
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {overview.topCentersWithGaps.map((c) => (
                    <li key={c.center} className="flex justify-between items-center rounded-lg bg-gray-50 dark:bg-gray-700/30 px-2.5 py-2 text-sm">
                      <span className="font-medium text-gray-900 dark:text-gray-100">{c.center}</span>
                      <span className="flex items-center gap-1.5 text-xs">
                        <span className="rounded bg-red-100 dark:bg-red-900/40 px-1.5 py-0.5 font-medium text-red-700 dark:text-red-300">{c.highCount} high</span>
                        <span className="rounded bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 font-medium text-amber-700 dark:text-amber-300">{c.mediumCount} med</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className={CARD_BASE + ' p-5 transition-shadow hover:shadow-md'}>
              <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                <AlertTriangle className="size-4 text-amber-500" /> Compliance & eligibility
              </h2>
              <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                Fix these to unblock promotion and keep everyone compliant.
              </p>
              {overview.complianceGapsSnapshot.length === 0 ? (
                <p className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-center text-sm text-green-700 dark:text-green-300">
                  No compliance blocks — you’re all set.
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {overview.complianceGapsSnapshot.map((c) => (
                    <li key={c.reason} className="flex justify-between items-center rounded-lg bg-amber-50 dark:bg-amber-900/20 px-2.5 py-2 text-sm">
                      <span className="text-amber-800 dark:text-amber-200">{c.reason}</span>
                      <span className="font-semibold text-amber-700 dark:text-amber-300">{c.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3 rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/10 p-4">
            <button
              type="button"
              onClick={() => setTab('recommendations')}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover"
            >
              <TrendingUp className="size-4" />
              See recommendations & assign training
              <ChevronRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setTab('by_center')}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Building2 className="size-4" />
              Drill down by center & group
            </button>
          </div>
        </div>
      )}

      {/* Tab B: By Center / Group */}
      {tab === 'by_center' && (
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              See which <strong>centers</strong> and <strong>groups</strong> have the most skill gaps. Click a row to expand and see groups and sample learners.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">Legend:</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${GAP_COLORS.high}`} title={GAP_MEANING.high}>High</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${GAP_COLORS.medium}`} title={GAP_MEANING.medium}>Medium</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${GAP_COLORS.low}`} title={GAP_MEANING.low}>Low</span>
              <label className="sr-only sm:not-sr-only sm:ml-2 text-xs text-gray-500">Filter:</label>
              <select
                value={centerFilter}
                onChange={(e) => setCenterFilter(e.target.value)}
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">All centers</option>
                {TNA_CENTERS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/80">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Center</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Groups</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400" title={GAP_MEANING.high}>High</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400" title={GAP_MEANING.medium}>Medium</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400" title={GAP_MEANING.low}>Low</th>
                    <th className="w-10 px-2 py-3" title="Expand to see groups & people" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-600">
                  {centerGaps.map((row) => (
                    <CenterRow
                      key={row.center}
                      row={row}
                      expanded={expandedCenter === row.center}
                      onToggle={() => toggleCenter(row.center)}
                      groupGaps={groupGaps.filter((g) => g.center === row.center)}
                      personGaps={personGaps}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab C: By Skill Topic */}
      {tab === 'by_skill' && (
        <div className="space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Find out <strong>who</strong> needs training in each skill — and <strong>which centers</strong> to target. Use this to plan batch training or refreshers.
          </p>
          <div className="space-y-4">
            {skillTopicGaps.map((row) => {
              const total = row.highCount + row.mediumCount + row.lowCount
              const highPct = total ? Math.round((row.highCount / total) * 100) : 0
              const medPct = total ? Math.round((row.mediumCount / total) * 100) : 0
              return (
                <div key={row.topicId} className={CARD_BASE + ' p-5 transition-shadow hover:shadow-md'}>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {row.topicName}
                    </h2>
                    <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">
                      {row.areaName}
                    </span>
                  </div>
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                    <span className={`rounded-full px-2.5 py-1 font-medium ${GAP_COLORS.high}`} title={GAP_MEANING.high}>
                      {row.highCount} need training soon
                    </span>
                    <span className={`rounded-full px-2.5 py-1 font-medium ${GAP_COLORS.medium}`} title={GAP_MEANING.medium}>
                      {row.mediumCount} could use refresher
                    </span>
                    <span className={`rounded-full px-2.5 py-1 font-medium ${GAP_COLORS.low}`} title={GAP_MEANING.low}>
                      {row.lowCount} on track
                    </span>
                  </div>
                  {total > 0 && (
                    <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div className="flex h-full">
                        <div className="bg-red-500 dark:bg-red-500/80" style={{ width: `${highPct}%` }} title={`${row.highCount} high`} />
                        <div className="bg-amber-400 dark:bg-amber-500/80" style={{ width: `${medPct}%` }} title={`${row.mediumCount} medium`} />
                        <div className="bg-green-500 dark:bg-green-500/80" style={{ width: `${100 - highPct - medPct}%` }} title={`${row.lowCount} low`} />
                      </div>
                    </div>
                  )}
                  <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">By center</p>
                  <div className="flex flex-wrap gap-2">
                    {row.byCenter.map((c) => (
                      <span
                        key={c.center}
                        className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium ${GAP_COLORS[c.gapLevel]}`}
                        title={`${c.count} learners — ${GAP_MEANING[c.gapLevel].toLowerCase()}`}
                      >
                        {c.center}: {c.count}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tab D: Recommendations */}
      {tab === 'recommendations' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/10 p-4">
            <p className="text-sm text-gray-700 dark:text-gray-200">
              <strong>Ready to act?</strong> Each card below suggests a path or course for a specific gap. Click <strong>Assign this path/course</strong> to send the right training to the right people — or use the button below to open Assignments and build from here.
            </p>
          </div>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} />
            ))}
          </div>
          {recommendations.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 p-10 text-center">
              <Lightbulb className="mx-auto size-10 text-gray-400 dark:text-gray-500 mb-3" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No recommendations for this filter</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Try selecting a different center, or run the TNA calculation to refresh gaps.</p>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/admin/assignments"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover"
            >
              <Send className="size-4" />
              Assign training from TNA
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function CenterRow({
  row,
  expanded,
  onToggle,
  groupGaps,
  personGaps,
}: {
  row: CenterGapRow
  expanded: boolean
  onToggle: () => void
  groupGaps: GroupGapRow[]
  personGaps: { userId: string; userName: string; center: string; group: string }[]
}) {
  return (
    <>
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{row.center}</td>
        <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">{row.groupCount}</td>
        <td className="px-4 py-3 text-right text-sm font-medium text-red-600 dark:text-red-400">{row.highGapCount}</td>
        <td className="px-4 py-3 text-right text-sm font-medium text-amber-600 dark:text-amber-400">{row.mediumGapCount}</td>
        <td className="px-4 py-3 text-right text-sm font-medium text-green-600 dark:text-green-400">{row.lowGapCount}</td>
        <td className="px-2 py-3">
          <button
            type="button"
            onClick={onToggle}
            className="rounded p-1 text-gray-500 hover:bg-gray-200 dark:hover:text-gray-400 dark:hover:bg-gray-600"
            aria-expanded={expanded}
          >
            {expanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={6} className="bg-gray-50 dark:bg-gray-800/50 px-4 py-4">
            <div className="space-y-4 pl-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Groups in {row.center}</p>
                <ul className="space-y-1.5 text-sm">
                  {groupGaps.map((g) => (
                    <li key={g.group} className="flex items-center justify-between gap-2 rounded-lg bg-white dark:bg-gray-800/80 px-3 py-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">{g.group}</span>
                      <span className="text-xs">
                        <span className="text-red-600 dark:text-red-400 font-medium">{g.highGapCount} high</span>
                        <span className="text-gray-400 mx-1">·</span>
                        <span className="text-amber-600 dark:text-amber-400 font-medium">{g.mediumGapCount} medium</span>
                        <span className="text-gray-500 dark:text-gray-400 ml-1">({g.learnerCount} learners)</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Sample learners who need training</p>
                <ul className="flex flex-wrap gap-2">
                  {personGaps.slice(0, 5).map((p) => (
                    <li key={p.userId} className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-gray-800/80 px-3 py-1.5 text-sm shadow-sm">
                      <Users className="size-3.5 text-gray-400" />
                      <span className="font-medium text-gray-700 dark:text-gray-200">{p.userName}</span>
                      <span className="text-gray-500 dark:text-gray-400">— {p.group}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

function RecommendationCard({ rec }: { rec: TNARecommendation }) {
  const peopleCount = rec.userIds.length
  return (
    <div className={CARD_BASE + ' p-5 transition-shadow hover:shadow-md border-l-4 border-l-primary/50'}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${GAP_COLORS[rec.gapLevel]}`} title={GAP_MEANING[rec.gapLevel]}>
          {GAP_LEVEL_LABELS[rec.gapLevel]} priority
        </span>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{rec.skillTopicName}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">· {rec.skillAreaName}</span>
      </div>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
        <strong>{peopleCount} {peopleCount === 1 ? 'person' : 'people'}</strong> would benefit — {rec.center}, {rec.group}
        {rec.userNames.length <= 3 ? `: ${rec.userNames.join(', ')}` : ` (e.g. ${rec.userNames.slice(0, 2).join(', ')}…)`}
      </p>
      <div className="mb-4 rounded-xl bg-gray-100 dark:bg-gray-700/50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Suggested training</p>
        <p className="font-medium text-gray-800 dark:text-gray-200">
          Path: {rec.suggestedPathName}
        </p>
        {rec.suggestedCourseNames.length > 0 && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Courses: {rec.suggestedCourseNames.join(', ')}
          </p>
        )}
      </div>
      <Link
        href="/dashboard/admin/assignments"
        className="inline-flex items-center gap-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary px-3 py-2 text-sm font-semibold hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
      >
        Assign this path/course
        <ChevronRight className="size-4" />
      </Link>
    </div>
  )
}
