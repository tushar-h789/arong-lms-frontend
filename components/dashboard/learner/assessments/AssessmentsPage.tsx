'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Play, Clock, RotateCcw, ChevronDown, ChevronUp, Calendar } from 'lucide-react'
import {
  getPendingAssessments,
  getInProgressAttempts,
  getCompletedAttempts,
  type PendingAssessment,
  type InProgressAttempt,
  type CompletedAttempt,
} from '@/lib/learner-assessments-data'
import { useLanguage } from '@/components/layout/dashboard/LanguageContext'

type Lang = 'en' | 'bn'

function PendingCard({ item, lang }: { item: PendingAssessment; lang: Lang }) {
  const isBn = lang === 'bn'
  const dueLabel = isBn ? 'জমা' : 'Due'
  const attemptsLabel = isBn ? 'চেষ্টা' : 'Attempts'
  const leftLabel = isBn ? 'বাকি' : 'left'
  const minLabel = isBn ? 'মিনিট' : 'min'
  const startLabel = isBn ? 'শুরু করুন' : 'Start'
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.quizName}</h3>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{item.coursePathName}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {item.dueDate && (
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" /> {dueLabel} {item.dueDate}
              </span>
            )}
            <span className="flex items-center gap-1">
              {attemptsLabel}: {item.attemptsLeft}/{item.maxAttempts} {leftLabel}
            </span>
            {item.timeLimitMinutes != null && (
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" /> {item.timeLimitMinutes} {minLabel}
              </span>
            )}
          </div>
        </div>
        <Link
          href={`/dashboard/learner/quiz/${item.id}`}
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          <Play className="size-4" />
          {startLabel}
        </Link>
      </div>
    </div>
  )
}

function ResumeCard({ item, lang }: { item: InProgressAttempt; lang: Lang }) {
  const isBn = lang === 'bn'
  const lastSaved = isBn ? 'সর্বশেষ সংরক্ষণ' : 'Last saved'
  const resumeLabel = isBn ? 'চালিয়ে যান' : 'Resume'
  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-900/20 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.quizName}</h3>
          <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">{lastSaved} {item.lastSavedAt}</p>
        </div>
        <Link
          href={`/dashboard/learner/quiz/${item.quizId}?resume=${item.attemptId}`}
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-amber-500 bg-amber-100 dark:bg-amber-900/40 px-5 py-3 text-sm font-semibold text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900/60"
        >
          <RotateCcw className="size-4" />
          {resumeLabel}
        </Link>
      </div>
    </div>
  )
}

function CompletedRow({ item, lang }: { item: CompletedAttempt; lang: Lang }) {
  const isBn = lang === 'bn'
  const passLabel = isBn ? 'পাস' : 'Pass'
  const failLabel = isBn ? 'ফেইল' : 'Fail'
  const viewFeedbackLabel = isBn ? 'ফিডব্যাক দেখুন' : 'View feedback'
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
          {item.passFail === 'pass' ? passLabel : failLabel}
        </span>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.score}%</span>
        {item.canViewFeedback && (
          <Link
            href={`/dashboard/learner/quiz/${item.quizId}/feedback?attempt=${item.attemptId}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            {viewFeedbackLabel}
          </Link>
        )}
      </div>
    </div>
  )
}

export default function AssessmentsPage() {
  const { language } = useLanguage()
  const lang: Lang = language
  const pending = getPendingAssessments()
  const inProgress = getInProgressAttempts()
  const completed = getCompletedAttempts()
  const [completedOpen, setCompletedOpen] = useState(false)

  const isBn = lang === 'bn'
  const pageTitle = isBn ? 'অ্যাসেসমেন্ট' : 'Assessments'
  const pageDesc = isBn ? 'কুইজ ও টেস্ট — কী পেন্ডিং আছে আর কী সম্পন্ন করেছেন দেখুন।' : "Quizzes and tests — see what's pending and what you've completed."
  const pendingHeading = isBn ? 'পেন্ডিং — করতে হবে' : 'Pending — to do'
  const noPending = isBn ? 'কোনো পেন্ডিং অ্যাসেসমেন্ট নেই।' : 'No pending assessments.'
  const inProgressHeading = isBn ? 'চলমান — চালিয়ে যান' : 'In progress — resume'
  const completedHeading = isBn ? 'সম্পন্ন' : 'Completed'
  const noCompleted = isBn ? 'এখনও কোনো সম্পন্ন চেষ্টা নেই।' : 'No completed attempts yet.'

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pageTitle}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {pageDesc}
        </p>
      </header>

      {/* A) Pending (top priority) */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {pendingHeading}
        </h2>
        <div className="space-y-3">
          {pending.length === 0 ? (
            <p className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              {noPending}
            </p>
          ) : (
            pending.map((item) => <PendingCard key={item.id} item={item} lang={lang} />)
          )}
        </div>
      </section>

      {/* B) In progress / Resume */}
      {inProgress.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
            {inProgressHeading}
          </h2>
          <div className="space-y-3">
            {inProgress.map((item) => (
              <ResumeCard key={item.attemptId} item={item} lang={lang} />
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
            {completedHeading}
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
                {noCompleted}
              </p>
            ) : (
              completed.map((item) => <CompletedRow key={item.attemptId} item={item} lang={lang} />)
            )}
          </div>
        )}
      </section>
    </div>
  )
}
