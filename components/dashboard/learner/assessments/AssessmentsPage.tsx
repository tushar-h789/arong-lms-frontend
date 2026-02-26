'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Play, Clock, RotateCcw, ChevronDown, ChevronUp, FileCheck, Calendar } from 'lucide-react'
import {
  getPendingAssessments,
  getInProgressAttempts,
  getCompletedAttempts,
  type PendingAssessment,
  type InProgressAttempt,
  type CompletedAttempt,
} from '@/lib/learner-assessments-data'

function PendingCard({ item }: { item: PendingAssessment }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.quizName}</h3>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{item.coursePathName}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {item.dueDate && (
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" /> Due {item.dueDate}
              </span>
            )}
            <span className="flex items-center gap-1">
              Attempts: {item.attemptsLeft}/{item.maxAttempts} left
            </span>
            {item.timeLimitMinutes != null && (
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" /> {item.timeLimitMinutes} min
              </span>
            )}
          </div>
        </div>
        <Link
          href={`/dashboard/learner/quiz/${item.id}`}
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          <Play className="size-4" />
          Start
        </Link>
      </div>
    </div>
  )
}

function ResumeCard({ item }: { item: InProgressAttempt }) {
  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-900/20 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.quizName}</h3>
          <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">Last saved {item.lastSavedAt}</p>
        </div>
        <Link
          href={`/dashboard/learner/quiz/${item.quizId}?resume=${item.attemptId}`}
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-amber-500 bg-amber-100 dark:bg-amber-900/40 px-5 py-3 text-sm font-semibold text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900/60"
        >
          <RotateCcw className="size-4" />
          Resume
        </Link>
      </div>
    </div>
  )
}

function CompletedRow({ item }: { item: CompletedAttempt }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-3">
      <div className="min-w-0">
        <p className="font-medium text-gray-900 dark:text-gray-100">{item.quizName}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{item.coursePathName} · {item.completedAt}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            item.passFail === 'pass'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
              : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
          }`}
        >
          {item.passFail === 'pass' ? 'Pass' : 'Fail'}
        </span>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.score}%</span>
        {item.canViewFeedback && (
          <Link
            href={`/dashboard/learner/quiz/${item.quizId}/feedback?attempt=${item.attemptId}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            View feedback
          </Link>
        )}
      </div>
    </div>
  )
}

export default function AssessmentsPage() {
  const pending = getPendingAssessments()
  const inProgress = getInProgressAttempts()
  const completed = getCompletedAttempts()
  const [completedOpen, setCompletedOpen] = useState(false)

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Assessments</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Quizzes and tests — see what’s pending and what you’ve completed.
        </p>
      </header>

      {/* A) Pending (top priority) */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Pending — to do
        </h2>
        <div className="space-y-3">
          {pending.length === 0 ? (
            <p className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              No pending assessments.
            </p>
          ) : (
            pending.map((item) => <PendingCard key={item.id} item={item} />)
          )}
        </div>
      </section>

      {/* B) In progress / Resume */}
      {inProgress.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
            In progress — resume
          </h2>
          <div className="space-y-3">
            {inProgress.map((item) => (
              <ResumeCard key={item.attemptId} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* C) Completed (collapse) */}
      <section>
        <button
          type="button"
          onClick={() => setCompletedOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-left"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Completed
          </h2>
          {completedOpen ? (
            <ChevronUp className="size-5 text-gray-500" />
          ) : (
            <ChevronDown className="size-5 text-gray-500" />
          )}
        </button>
        {completedOpen && (
          <div className="mt-3 space-y-2">
            {completed.length === 0 ? (
              <p className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No completed attempts yet.
              </p>
            ) : (
              completed.map((item) => <CompletedRow key={item.attemptId} item={item} />)
            )}
          </div>
        )}
      </section>
    </div>
  )
}
