'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Play,
  Calendar,
  Megaphone,
  Lock,
  Flame,
  FileCheck,
  ChevronRight,
} from 'lucide-react'
import {
  LEARNER_DASHBOARD,
  BADGE_SET,
  type BadgeId,
} from '@/lib/learner-dashboard-data'
import { BadgeEarnOverlay } from './BadgeEarnOverlay'

function getBadge(badgeId: BadgeId) {
  return BADGE_SET.find((b) => b.id === badgeId)
}

export default function LearnerDashboard() {
  const d = LEARNER_DASHBOARD
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<BadgeId[]>(d.badgesEarned)
  const [badgeToCelebrate, setBadgeToCelebrate] = useState<(typeof BADGE_SET)[number] | null>(null)

  const continueData = d.continueLearning
  const earnedBadges = earnedBadgeIds
    .map(getBadge)
    .filter(Boolean) as (typeof BADGE_SET)[number][]
  const lockedTeaser = d.lockedBadgeTeaser
  const lockedBadge = getBadge(lockedTeaser.badgeId)
  const showLockedTeaser = lockedBadge && !earnedBadgeIds.includes(lockedTeaser.badgeId)

  function handleEarnBadge(badge: (typeof BADGE_SET)[number]) {
    setBadgeToCelebrate(badge)
  }

  function handleCloseCelebration() {
    if (badgeToCelebrate && !earnedBadgeIds.includes(badgeToCelebrate.id)) {
      setEarnedBadgeIds((prev) => [...prev, badgeToCelebrate.id])
    }
    setBadgeToCelebrate(null)
  }

  return (
    <div className="space-y-6">
      {/* ─── Top Header ───────────────────────────────────────────────── */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {d.learnerName}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {d.todayFocusLine}
          </p>
        </div>
        {continueData && (
          <Link
            href={continueData.href}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:bg-primary-hover hover:shadow-lg active:scale-[0.98]"
          >
            <Play className="size-4" />
            Continue Learning
          </Link>
        )}
      </header>

      {/* ─── A) Continue Card ────────────────────────────────────────── */}
      {continueData && (
        <section
          className="rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm"
          aria-label="Continue learning"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Continue where you left off
          </h2>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {continueData.title}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Next: {continueData.nextItem}
              </p>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
                  style={{ width: `${continueData.progress}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {continueData.progress}% complete
              </p>
            </div>
            <Link
              href={continueData.href}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03] hover:bg-primary-hover active:scale-[0.98]"
            >
              <Play className="size-4" />
              Continue
            </Link>
          </div>
        </section>
      )}

      {/* ─── B) Due Soon + C) My Progress (two columns) ────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* B) Due Soon — compact list */}
        <section className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Due soon
          </h2>
          <ul className="mt-3 space-y-2">
            {d.dueSoon.slice(0, 4).map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 dark:border-gray-600 p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="size-3.5" />
                    {item.dueDate}
                  </p>
                </div>
                <Link
                  href={item.href}
                  className="shrink-0 rounded-lg bg-primary/10 dark:bg-primary/20 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
                >
                  Start now
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* C) My Progress — mini summary */}
        <section className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            My progress
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {d.myProgress.lessonsThisWeek}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Lessons this week
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {d.myProgress.completionPercent}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Overall complete
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {d.myProgress.timeSpentMinutes}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Min this week
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ─── D) Announcements (one strip) ─────────────────────────────── */}
      <section className="rounded-xl border border-gray-200 dark:border-gray-600 bg-amber-50/80 dark:bg-amber-900/20 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-200/80 dark:bg-amber-800/50 text-amber-800 dark:text-amber-200">
              <Megaphone className="size-4" />
            </span>
            <ul className="min-w-0 space-y-1">
              {d.announcements.slice(0, 2).map((a) => (
                <li key={a.id}>
                  <Link
                    href={a.href}
                    className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary line-clamp-1"
                  >
                    {a.title}
                  </Link>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {a.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="#"
            className="shrink-0 text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1"
          >
            See all
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* ─── E) Badges + F) Streak ────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* E) Badges — top 3 + locked teaser */}
        <section className="min-w-0 flex-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Badges
            </h2>
            <Link
              href="#"
              className="text-sm font-medium text-primary hover:text-primary-hover"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {earnedBadges.slice(0, 3).map((b) => (
              <span
                key={b.id}
                className="flex items-center gap-2 rounded-full border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 text-sm text-amber-800 dark:text-amber-200"
                title={b.label}
              >
                <span aria-hidden>{b.icon}</span>
                {b.label}
              </span>
            ))}
            {showLockedTeaser && lockedBadge && (
              <button
                type="button"
                onClick={() => handleEarnBadge(lockedBadge)}
                className="flex items-center gap-2 rounded-full border border-dashed border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 transition-colors hover:border-amber-400 hover:bg-amber-50/50 hover:text-amber-700 dark:hover:border-amber-600 dark:hover:bg-amber-900/20 dark:hover:text-amber-300"
                title="Click to see badge unlock animation"
              >
                <Lock className="size-3.5" />
                {lockedBadge.icon} {lockedBadge.label}
                <span className="sr-only">{lockedTeaser.message}</span>
              </button>
            )}
          </div>
          {showLockedTeaser && lockedTeaser && lockedBadge && (
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              {lockedTeaser.message}{' '}
              <button
                type="button"
                onClick={() => handleEarnBadge(lockedBadge)}
                className="font-medium text-primary hover:text-primary-hover underline underline-offset-1"
              >
                See unlock animation
              </button>
            </p>
          )}
        </section>

        {/* F) Streak — soft chip */}
        <section className="shrink-0">
          <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              <Flame className="size-4 text-amber-500" />
              You&apos;ve learned for {d.streak.currentDays} days in a row
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {d.streak.nextMilestoneDays} days to unlock &apos;{d.streak.nextMilestoneBadgeLabel}&apos; badge
            </p>
          </div>
        </section>
      </div>

      {/* ─── G) Certificates quick access ─────────────────────────────── */}
      <section className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400">
              <FileCheck className="size-5" />
            </span>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                You have {d.certificates.total} certificate{d.certificates.total !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Latest: {d.certificates.latest.name}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={d.certificates.latest.downloadHref}
              className="rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Download
            </Link>
            <Link
              href="/dashboard/learner/certificates"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
            >
              View all
            </Link>
          </div>
        </div>
      </section>

      {/* Full-screen badge earn celebration (one badge at a time) */}
      {badgeToCelebrate && (
        <BadgeEarnOverlay
          badge={badgeToCelebrate}
          onClose={handleCloseCelebration}
        />
      )}
    </div>
  )
}
