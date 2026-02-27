'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Percent,
  BookOpen,
  Loader2,
  Award,
  FileCheck,
  ChevronRight,
  Route,
  Sparkles,
  BarChart3,
  Trophy,
  Target,
  Play,
} from 'lucide-react'
import {
  getProgressSummary,
  getCourseProgressList,
  getPathProgressList,
  getScoreHistory,
  getEarnedBadgesTop3,
  getNextBadgeTeaser,
  type CourseProgressItem,
  type PathProgressItem,
  type ScoreHistoryItem,
} from '@/lib/learner-progress-data'
import { useLanguage } from '@/components/layout/dashboard/LanguageContext'

type CourseFilter = 'all' | 'in_progress' | 'completed'
type Lang = 'en' | 'bn'

const SECTION_CARD =
  'rounded-2xl border border-gray-200/80 bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.06)] dark:border-gray-700 dark:bg-gray-800/95'

function SummaryCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  accent?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-200 ${accent
        ? 'border-primary/50 bg-linear-to-br from-primary/10 to-primary/5 shadow-[0_2px_8px_rgba(245,120,32,0.12)] dark:border-primary/40 dark:from-primary/20 dark:to-primary/10'
        : 'border-gray-200/80 bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:border-gray-700 dark:bg-gray-800/95 dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]'
        }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${accent
            ? 'bg-primary/20 text-primary'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}
        >
          <Icon className="size-6" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">
            {value}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {label}
          </p>
        </div>
      </div>
    </div>
  )
}

function CourseProgressCard({ item, lang }: { item: CourseProgressItem; lang: Lang }) {
  const isCompleted = item.status === 'completed'
  const isBn = lang === 'bn'
  const lessonsLabel = isBn ? 'লেসন · শেষ কার্যকলাপ ' : ' lessons · Last activity '
  const viewLabel = isBn ? 'দেখুন' : 'View'
  const continueLabel = isBn ? 'চালিয়ে যান' : 'Continue'
  return (
    <div
      className={`flex overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 hover:shadow dark:bg-gray-800/95 ${isCompleted
        ? 'border-l-4 border-l-emerald-500 border-gray-200/80 dark:border-gray-700'
        : 'border-l-4 border-l-primary border-gray-200/80 dark:border-gray-700'
        }`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-1 items-start gap-4 sm:gap-5">
          <div
            className={`flex size-12 shrink-0 items-center justify-center rounded-xl sm:size-14 ${isCompleted
              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
              : 'bg-primary/15 text-primary dark:bg-primary/25'
              }`}
          >
            <BookOpen className="size-6 sm:size-7" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
                {item.title}
              </h3>
              <span
                className={`text-lg font-bold tabular-nums sm:text-xl ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary'
                  }`}
              >
                {item.progress}%
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium tabular-nums text-gray-600 dark:text-gray-300">
                {item.lessonsDone}/{item.lessonsTotal}
              </span>
              {lessonsLabel}
              <span>{item.lastActivityDate}</span>
            </p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700 sm:max-w-sm">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-primary'
                  }`}
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        </div>
        <Link
          href={item.href}
          className={`shrink-0 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-all ${isCompleted
            ? 'border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            : 'bg-primary text-white hover:bg-primary-hover'
            }`}
        >
          {isCompleted ? (
            <>
              {viewLabel} <ChevronRight className="size-4" />
            </>
          ) : (
            <>
              <Play className="size-4" />
              {continueLabel}
              <ChevronRight className="size-4" />
            </>
          )}
        </Link>
      </div>
    </div>
  )
}

function PathProgressCard({ item, lang }: { item: PathProgressItem; lang: Lang }) {
  const isBn = lang === 'bn'
  const stepLabel = isBn ? 'ধাপ ' : 'Step '
  const nextLabel = isBn ? ' · পরবর্তী: ' : ' · Next: '
  const openLabel = isBn ? 'খুলুন' : 'Open'
  return (
    <div className={`overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.06)] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:border-gray-700 dark:bg-gray-800/95 dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.25)]`}>
      <div className="flex items-center gap-5 p-6">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
          <Route className="size-6 text-gray-600 dark:text-gray-300" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            {stepLabel}<span className="font-semibold text-gray-700 dark:text-gray-300">{item.currentStep}/{item.totalSteps}</span>
            {nextLabel}{item.nextStepName}
          </p>
          {item.bottleneckHint && (
            <p className="mt-2 text-xs font-medium text-amber-600 dark:text-amber-400">{item.bottleneckHint}</p>
          )}
        </div>
        <Link
          href={item.href}
          className="shrink-0 rounded-xl border-2 border-gray-200 bg-gray-50 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          {openLabel}
        </Link>
      </div>
    </div>
  )
}

function ScoreHistoryRow({ item, lang }: { item: ScoreHistoryItem; lang: Lang }) {
  const isBn = lang === 'bn'
  const passLabel = isBn ? 'পাস' : 'Pass'
  const failLabel = isBn ? 'ফেইল' : 'Fail'
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200/60 bg-gray-50/50 px-5 py-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800">
      <div className="min-w-0">
        <p className="font-semibold text-gray-900 dark:text-gray-100">{item.quizName}</p>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{item.date}</p>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <span
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${item.passFail === 'pass'
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
            : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
            }`}
        >
          {item.passFail === 'pass' ? passLabel : failLabel}
        </span>
        <span className="min-w-12 text-right text-lg font-bold tabular-nums text-gray-900 dark:text-gray-100">
          {item.score}%
        </span>
      </div>
    </div>
  )
}

export default function ProgressPage() {
  const { language } = useLanguage()
  const lang: Lang = language
  const summary = getProgressSummary()
  const allCourses = useMemo(() => getCourseProgressList(), [])
  const [courseFilter, setCourseFilter] = useState<CourseFilter>('all')
  const courseList = useMemo(() => {
    if (courseFilter === 'all') return allCourses
    return allCourses.filter((c) => c.status === courseFilter)
  }, [allCourses, courseFilter])
  const pathList = useMemo(() => getPathProgressList(), [])
  const scoreHistory = useMemo(() => getScoreHistory(5), [])
  const earnedBadges = useMemo(() => getEarnedBadgesTop3(), [])
  const nextBadgeTeaser = useMemo(() => getNextBadgeTeaser(), [])

  const isBn = lang === 'bn'
  const pageTitle = isBn ? 'আমার অগ্রগতি' : 'My Progress'
  const pageDesc = isBn ? 'আপনার শেখা ট্র্যাক করুন — সম্পন্ন কোর্স, পাথ ও কুইজ স্কোর এক জায়গায়।' : 'Track your learning — completion, courses, paths, and quiz scores in one place.'
  const overviewLabel = isBn ? 'সারসংক্ষেপ' : 'Overview'
  const overallCompletionLabel = isBn ? 'মোট সম্পন্ন' : 'Overall completion'
  const completedCoursesLabel = isBn ? 'সম্পন্ন কোর্স' : 'Completed courses'
  const inProgressLabel = isBn ? 'চলমান' : 'In progress'
  const certificatesLabel = isBn ? 'সার্টিফিকেট' : 'Certificates'
  const lessonsThisWeekLabel = isBn ? 'এই সপ্তাহের লেসন' : 'Lessons this week'
  const badgesHeading = isBn ? 'ব্যাজ' : 'Badges'
  const nextLabel = isBn ? 'পরবর্তী:' : 'Next:'
  const courseProgressHeading = isBn ? 'কোর্স অগ্রগতি' : 'Course progress'
  const filterAll = isBn ? 'সব' : 'All'
  const filterCompleted = isBn ? 'সম্পন্ন' : 'Completed'
  const noCoursesFilter = isBn ? 'এই ফিল্টারে কোনো কোর্স মিলেনি।' : 'No courses match this filter.'
  const pathProgressHeading = isBn ? 'পাথ অগ্রগতি' : 'Path progress'
  const recentQuizResultsHeading = isBn ? 'সাম্প্রতিক কুইজ ফলাফল' : 'Recent quiz results'
  const viewAllResultsLabel = isBn ? 'সব ফলাফল দেখুন' : 'View all results'
  const noQuizResultsLabel = isBn ? 'এখনও কোনো কুইজ ফলাফল নেই।' : 'No quiz results yet.'

  return (
    <div className="min-h-[60vh] w-full bg-gray-50/80 dark:bg-gray-900/50">
      <div className="w-full space-y-8 p-4 pb-16 sm:p-6 lg:p-8">
        {/* Page header */}
        <header className="border-b border-gray-200/80 pb-8 dark:border-gray-700">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
            {pageTitle}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {pageDesc}
          </p>
        </header>

        {/* A) Summary — KPI cards */}
        <section className={SECTION_CARD}>
          <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-700">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <BarChart3 className="size-5" />
            </div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              {overviewLabel}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 lg:grid-cols-5">
            <SummaryCard
              label={overallCompletionLabel}
              value={`${summary.overallCompletionPercent}%`}
              icon={Percent}
              accent
            />
            <SummaryCard label={completedCoursesLabel} value={summary.completedCoursesCount} icon={FileCheck} />
            <SummaryCard label={inProgressLabel} value={summary.inProgressCount} icon={Loader2} />
            <SummaryCard label={certificatesLabel} value={summary.certificatesCount} icon={Award} />
            <SummaryCard label={lessonsThisWeekLabel} value={summary.lessonsThisWeek} icon={BookOpen} />
          </div>
        </section>

        {/* Badges */}
        {(earnedBadges.length > 0 || nextBadgeTeaser) && (
          <section className={SECTION_CARD}>
            <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-700">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                <Sparkles className="size-5" />
              </div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                {badgesHeading}
              </h2>
            </div>
            <div className="p-6">
              {earnedBadges.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {earnedBadges.map((b) => (
                    <span
                      key={b.id}
                      className="inline-flex items-center gap-2 rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200"
                    >
                      <span className="text-base">{b.icon}</span> {b.label}
                    </span>
                  ))}
                </div>
              )}
              {nextBadgeTeaser && (
                <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 dark:border-primary/20 dark:bg-primary/10">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    <span className="text-primary">{nextLabel}</span> {nextBadgeTeaser.message}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* B) Course progress */}
        <section className={SECTION_CARD}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-6 py-4 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Target className="size-5" />
              </div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                {courseProgressHeading}
              </h2>
            </div>
            <div className="flex rounded-xl bg-gray-100 p-1 dark:bg-gray-700">
              {(['all', 'in_progress', 'completed'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCourseFilter(key)}
                  className={`rounded-lg px-4 py-2.5 text-xs font-semibold transition-all ${courseFilter === key
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                >
                  {key === 'all' ? filterAll : key === 'in_progress' ? inProgressLabel : filterCompleted}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-5 p-6 pt-5">
            {courseList.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-14 text-center dark:border-gray-700 dark:bg-gray-800/30">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{noCoursesFilter}</p>
              </div>
            ) : (
              courseList.map((item) => <CourseProgressCard key={item.id} item={item} lang={lang} />)
            )}
          </div>
        </section>

        {/* C) Path progress */}
        {pathList.length > 0 && (
          <section className={SECTION_CARD}>
            <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-700">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
                <Route className="size-5 text-gray-600 dark:text-gray-300" />
              </div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                {pathProgressHeading}
              </h2>
            </div>
            <div className="space-y-5 p-6 pt-5">
              {pathList.map((item) => (
                <PathProgressCard key={item.id} item={item} lang={lang} />
              ))}
            </div>
          </section>
        )}

        {/* D) Score history */}
        <section className={SECTION_CARD}>
          <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-4 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Trophy className="size-5" />
              </div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                {recentQuizResultsHeading}
              </h2>
            </div>
            <Link
              href="/dashboard/learner/quiz"
              className="text-sm font-semibold text-primary hover:underline"
            >
              {viewAllResultsLabel}
            </Link>
          </div>
          <div className="space-y-3 p-6 pt-5">
            {scoreHistory.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-14 text-center dark:border-gray-700 dark:bg-gray-800/30">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{noQuizResultsLabel}</p>
              </div>
            ) : (
              scoreHistory.map((item) => (
                <ScoreHistoryRow key={`${item.quizName}-${item.date}-${item.attemptId}`} item={item} lang={lang} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
