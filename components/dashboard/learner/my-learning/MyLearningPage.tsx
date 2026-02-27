'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Play,
  ChevronRight,
  Calendar,
  BookOpen,
  Route,
  FileCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowDownUp,
  Sparkles,
  Download,
  HelpCircle,
  Award,
} from 'lucide-react'
import {
  MY_LEARNING_ITEMS,
  getMyLearningSummary,
  sortMyLearningItems,
  getContinueItem,
  getDueSoonItems,
  getRestItems,
  type MyLearningItem,
  type LearningStatus,
  type SortOption,
} from '@/lib/my-learning-data'
import { useLanguage } from '@/components/layout/dashboard/LanguageContext'

const STATUS_TABS_EN: { key: LearningStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'overdue', label: 'Overdue' },
]

const STATUS_TABS_BN: { key: LearningStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'সব' },
  { key: 'assigned', label: 'নির্ধারিত' },
  { key: 'in_progress', label: 'চলমান' },
  { key: 'completed', label: 'সম্পন্ন' },
  { key: 'overdue', label: 'সময় অতিক্রান্ত' },
]

const SORT_OPTIONS_EN: { value: SortOption; label: string }[] = [
  { value: 'due_date', label: 'Due date' },
  { value: 'recently_opened', label: 'Recently opened' },
  { value: 'progress', label: 'Progress %' },
  { value: 'type', label: 'Path / Course' },
]

const SORT_OPTIONS_BN: { value: SortOption; label: string }[] = [
  { value: 'due_date', label: 'জমা দেওয়ার তারিখ' },
  { value: 'recently_opened', label: 'সম্প্রতি খোলা' },
  { value: 'progress', label: 'অগ্রগতি %' },
  { value: 'type', label: 'পাথ / কোর্স' },
]

function filterByStatus(items: MyLearningItem[], status: LearningStatus | 'all'): MyLearningItem[] {
  if (status === 'all') return items
  return items.filter((i) => i.status === status)
}

function getTabCount(items: MyLearningItem[], key: LearningStatus | 'all'): number {
  if (key === 'all') return items.length
  return items.filter((i) => i.status === key).length
}

type Lang = 'en' | 'bn'

function LearningItemCard({
  item,
  isSuggested,
  isPinnedContinue,
  lang,
}: {
  item: MyLearningItem
  isSuggested?: boolean
  isPinnedContinue?: boolean
  lang: Lang
}) {
  const isAssigned = item.status === 'assigned'
  const isInProgress = item.status === 'in_progress'
  const isCompleted = item.status === 'completed'
  const isOverdue = item.status === 'overdue'

  const isBn = lang === 'bn'
  const startLabel = isBn ? 'শুরু করুন' : 'Start'
  const continueLabel = isBn ? 'চালিয়ে যান' : 'Continue'
  const certLabel = isBn ? 'সার্টিফিকেট' : 'Certificate'
  const viewLabel = isBn ? 'দেখুন' : 'View'

  const buttonLabel = isAssigned
    ? startLabel
    : isInProgress
      ? continueLabel
      : isCompleted && item.certificateHref
        ? certLabel
        : viewLabel
  const buttonHref = isCompleted && item.certificateHref ? item.certificateHref : item.href

  const accentBorder =
    isOverdue
      ? 'border-l-4 border-l-rose-400 dark:border-l-rose-500'
      : isInProgress
        ? 'border-l-4 border-l-primary'
        : isCompleted
          ? 'border-l-4 border-l-emerald-400 dark:border-l-emerald-500'
          : 'border-l-4 border-l-amber-400 dark:border-l-amber-500'

  const continueHere = isBn ? 'এখান থেকে চালিয়ে যান' : 'Continue here'
  const upNext = isBn ? 'পরবর্তী' : 'Up next'
  const pathCourse = item.type === 'path' ? (isBn ? 'পাথ' : 'Path') : (isBn ? 'কোর্স' : 'Course')
  const downloadable = isBn ? 'ডাউনলোডযোগ্য' : 'Downloadable'
  const overdueChip = isBn ? 'সময় অতিক্রান্ত' : 'Overdue'
  const duePrefix = isBn ? 'জমা' : 'Due'

  return (
    <div
      className={`group rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500 ${accentBorder}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {isPinnedContinue && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 dark:bg-primary/25 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <Play className="size-3" />
                {continueHere}
              </span>
            )}
            {isSuggested && !isPinnedContinue && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 dark:bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
                <Sparkles className="size-3" />
                {upNext}
              </span>
            )}
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${item.type === 'path'
                ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
                : 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                }`}
            >
              {item.type === 'path' ? (
                <Route className="size-3" />
              ) : (
                <BookOpen className="size-3" />
              )}
              {pathCourse}
            </span>
            {item.downloadable && (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400"
                title={isBn ? 'অফলাইনে ডাউনলোড করা যাবে' : 'Downloadable for offline'}
              >
                <Download className="size-3" /> {downloadable}
              </span>
            )}
            {isOverdue && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                <AlertCircle className="size-3" /> {overdueChip}
              </span>
            )}
          </div>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
            <span className="text-gray-400 dark:text-gray-500">→</span>
            {item.nextStep}
          </p>
          {item.dueDate && (
            <p
              className={`mt-1 flex items-center gap-1.5 text-xs ${isOverdue
                ? 'text-rose-600 dark:text-rose-400 font-medium'
                : 'text-gray-500 dark:text-gray-400'
                }`}
            >
              <Calendar className="size-3.5 shrink-0" />
              {duePrefix} {item.dueDate}
            </p>
          )}
          {!isAssigned && (
            <div className="mt-3 flex items-center gap-2">
              <div className="h-2 w-full max-w-[200px] overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-300"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 tabular-nums">
                {item.progress}%
              </span>
            </div>
          )}

        </div>
        <Link
          href={buttonHref}
          className={`shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-primary-hover hover:shadow-md active:scale-[0.98] ${isInProgress ? 'ring-2 ring-primary/30' : ''
            }`}
        >
          {buttonLabel === startLabel || buttonLabel === continueLabel ? (
            <Play className="size-4" />
          ) : buttonLabel === certLabel ? (
            <FileCheck className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
          {buttonLabel}
        </Link>
      </div>
      {item.badgeTeaser && (
        <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
          <Award className="size-3.5 shrink-0" />
          {item.badgeTeaser.message}
        </p>
      )}
    </div>
  )
}

const DUE_SOON_MAX = 3

export default function MyLearningPage() {
  const { language } = useLanguage()
  const lang: Lang = language
  const [activeTab, setActiveTab] = useState<LearningStatus | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortOption>('due_date')

  const statusTabs = lang === 'bn' ? STATUS_TABS_BN : STATUS_TABS_EN
  const sortOptions = lang === 'bn' ? SORT_OPTIONS_BN : SORT_OPTIONS_EN

  const summary = useMemo(() => getMyLearningSummary(MY_LEARNING_ITEMS), [])
  const continueItem = useMemo(() => getContinueItem(MY_LEARNING_ITEMS), [])
  const dueSoonItems = useMemo(
    () =>
      getDueSoonItems(MY_LEARNING_ITEMS, DUE_SOON_MAX).filter(
        (i) => i.id !== continueItem?.id
      ),
    [continueItem?.id]
  )
  const restItems = useMemo(
    () => getRestItems(MY_LEARNING_ITEMS, continueItem, dueSoonItems),
    [continueItem, dueSoonItems]
  )
  const filteredRest = useMemo(
    () =>
      sortMyLearningItems(filterByStatus(restItems, activeTab), sortBy),
    [restItems, activeTab, sortBy]
  )
  const tabCountsRest = useMemo(
    () => ({
      all: restItems.length,
      assigned: getTabCount(restItems, 'assigned'),
      in_progress: getTabCount(restItems, 'in_progress'),
      completed: getTabCount(restItems, 'completed'),
      overdue: getTabCount(restItems, 'overdue'),
    }),
    [restItems]
  )
  const suggestedIdRest = useMemo(() => {
    const dueSoonRest = restItems.filter(
      (i) =>
        i.dueDateRaw &&
        i.status !== 'completed' &&
        new Date(i.dueDateRaw) >= new Date()
    )
    const byDue = [...dueSoonRest].sort((a, b) =>
      (a.dueDateRaw || '').localeCompare(b.dueDateRaw || '')
    )
    if (byDue[0]) return byDue[0].id
    const inProgress = restItems.filter((i) => i.status === 'in_progress')
    return inProgress[0]?.id ?? null
  }, [restItems])

  const isBn = lang === 'bn'
  const pageTitle = isBn ? 'আমার শেখা' : 'My Learning'
  const pageDesc = isBn ? 'যেখান থেকে থেমেছিলেন সেখান থেকে শুরু করুন — এক ক্লিকে শুরু বা চালিয়ে যান।' : 'Pick up where you left off — start or continue in one click.'
  const helpLink = isBn ? 'ভিডিও চালু হচ্ছে না? লগইন সমস্যা? সাহায্য নিন' : 'Video not playing? Login issue? Get help'
  const dueSoonCard = isBn ? 'শীঘ্রই জমা (৭ দিন)' : 'Due soon (7 days)'
  const inProgressCard = isBn ? 'চলমান' : 'In progress'
  const completedCard = isBn ? 'সম্পন্ন' : 'Completed'
  const overdueCard = isBn ? 'সময় অতিক্রান্ত' : 'Overdue'
  const continueHeading = isBn ? 'যেখান থেকে থেমেছিলেন সেখান থেকে চালিয়ে যান' : 'Continue where you left off'
  const dueSoonHeading = isBn ? 'শীঘ্রই জমা' : 'Due soon'
  const allLearningHeading = isBn ? 'সব শেখা' : 'All learning'
  const sortByLabel = isBn ? 'সাজান' : 'Sort by'
  const emptyTitle = isBn ? 'এখনও কিছু নেই' : 'Nothing here yet'
  const emptyDesc = isBn ? 'অন্য ট্যাব দেখুন অথবা নতুন ট্রেনিং দেওয়া হলে আবার চেক করুন।' : 'Try another tab or check back when new trainings are assigned.'

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {pageTitle}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {pageDesc}
          </p>
        </div>
        <Link
          href="/help"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary"
        >
          <HelpCircle className="size-4" />
          {helpLink}
        </Link>
      </header>

      {/* Summary cards */}
      <section
        className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4"
        aria-label={isBn ? 'সারসংক্ষেপ' : 'Summary'}
      >
        <div className="rounded-xl border border-amber-200/60 dark:border-amber-800/50 bg-amber-50/70 dark:bg-amber-900/20 p-4 transition-shadow hover:shadow-md">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-200/80 dark:bg-amber-800/50">
              <Clock className="size-4 text-amber-700 dark:text-amber-300" />
            </span>
            <span className="text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
              {summary.dueSoon}
            </span>
          </div>
          <p className="mt-1 text-xs font-medium text-amber-800/80 dark:text-amber-200/80">
            {dueSoonCard}
          </p>
        </div>
        <div className="rounded-xl border border-sky-200/60 dark:border-sky-800/50 bg-sky-50/70 dark:bg-sky-900/20 p-4 transition-shadow hover:shadow-md">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-200/80 dark:bg-sky-800/50">
              <Play className="size-4 text-sky-700 dark:text-sky-300" />
            </span>
            <span className="text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
              {summary.inProgress}
            </span>
          </div>
          <p className="mt-1 text-xs font-medium text-sky-800/80 dark:text-sky-200/80">
            {inProgressCard}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200/60 dark:border-emerald-800/50 bg-emerald-50/70 dark:bg-emerald-900/20 p-4 transition-shadow hover:shadow-md">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-200/80 dark:bg-emerald-800/50">
              <CheckCircle2 className="size-4 text-emerald-700 dark:text-emerald-300" />
            </span>
            <span className="text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
              {summary.completed}
            </span>
          </div>
          <p className="mt-1 text-xs font-medium text-emerald-800/80 dark:text-emerald-200/80">
            {completedCard}
          </p>
        </div>
        <div className="rounded-xl border border-rose-200/50 dark:border-rose-800/50 bg-rose-50/50 dark:bg-rose-900/15 p-4 transition-shadow hover:shadow-md">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-200/70 dark:bg-rose-800/50">
              <AlertCircle className="size-4 text-rose-700 dark:text-rose-300" />
            </span>
            <span className="text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
              {summary.overdue}
            </span>
          </div>
          <p className="mt-1 text-xs font-medium text-rose-700/80 dark:text-rose-300/80">
            {overdueCard}
          </p>
        </div>
      </section>

      {/* Section 1: Continue Where You Left Off (top pinned) */}
      {continueItem && (
        <section aria-labelledby="continue-heading">
          <h2 id="continue-heading" className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {continueHeading}
          </h2>
          <LearningItemCard
            item={continueItem}
            isPinnedContinue
            lang={lang}
          />
        </section>
      )}

      {/* Section 2: Due Soon (2–3 items) */}
      {dueSoonItems.length > 0 && (
        <section aria-labelledby="due-soon-heading">
          <h2 id="due-soon-heading" className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {dueSoonHeading}
          </h2>
          <div className="space-y-3">
            {dueSoonItems.map((item) => (
              <LearningItemCard key={item.id} item={item} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {/* Section 3: All Assigned (rest) — tabs + sort */}
      <section aria-labelledby="all-heading">
        <h2 id="all-heading" className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {allLearningHeading}
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="flex flex-wrap gap-1 rounded-xl bg-gray-100 dark:bg-gray-800/80 p-1.5"
            role="tablist"
          >
            {statusTabs.map((tab) => {
              const count = tabCountsRest[tab.key]
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-700/50'
                    }`}
                >
                  {tab.label}
                  <span className={`ml-1.5 tabular-nums ${isActive ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}>
                    ({count})
                  </span>
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-2">
            <ArrowDownUp className="size-4 text-gray-400 dark:text-gray-500" />
            <label htmlFor="sort-my-learning" className="sr-only">{sortByLabel}</label>
            <select
              id="sort-my-learning"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-gray-900"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {filteredRest.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 p-10 text-center">
              <BookOpen className="mx-auto size-12 text-gray-300 dark:text-gray-600" />
              <p className="mt-3 font-medium text-gray-600 dark:text-gray-400">{emptyTitle}</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                {emptyDesc}
              </p>
            </div>
          ) : (
            filteredRest.map((item) => (
              <LearningItemCard
                key={item.id}
                item={item}
                isSuggested={item.id === suggestedIdRest && activeTab === 'all'}
                lang={lang}
              />
            ))
          )}
        </div>
      </section>
    </div>
  )
}
