'use client'

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { getQuizForAttempt } from '@/lib/learner-assessments-data'

const AUTOSAVE_KEY = (quizId: string, attemptId: string) => `quiz-attempt-${quizId}-${attemptId}`
const AUTOSAVE_INTERVAL_MS = 12000

interface SavedAttempt {
  answers: Record<string, string>
  timerEndsAt?: number
}

function loadSavedAttempt(quizId: string, attemptId: string): SavedAttempt | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(AUTOSAVE_KEY(quizId, attemptId))
    if (!raw) return null
    const data = JSON.parse(raw) as { answers?: Record<string, string>; savedAt?: string; timerEndsAt?: number }
    const answers = data.answers ?? {}
    const timerEndsAt = typeof data.timerEndsAt === 'number' ? data.timerEndsAt : undefined
    return { answers, timerEndsAt }
  } catch {
    return null
  }
}

function saveAttempt(
  quizId: string,
  attemptId: string,
  answers: Record<string, string>,
  timerEndsAt?: number
) {
  if (typeof window === 'undefined') return
  try {
    const payload: { answers: Record<string, string>; savedAt: string; timerEndsAt?: number } = {
      answers,
      savedAt: new Date().toISOString(),
    }
    if (timerEndsAt != null) payload.timerEndsAt = timerEndsAt
    window.localStorage.setItem(AUTOSAVE_KEY(quizId, attemptId), JSON.stringify(payload))
  } catch {
    // ignore
  }
}

function formatTimeLeft(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function QuizTakePage({
  quizId,
  resumeAttemptId,
}: {
  quizId: string
  resumeAttemptId: string | null
}) {
  const quiz = getQuizForAttempt(quizId)
  const [attemptId] = useState(
    () => resumeAttemptId ?? `att-${quizId}-${Date.now()}`
  )

  const [step, setStep] = useState<'intro' | 'quiz' | 'submit_confirm' | 'results'>('intro')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>(() => loadSavedAttempt(quizId, attemptId)?.answers ?? {})
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null)

  const timerEndsAtRef = useRef<number | null>(null)
  const timerInitializedRef = useRef(false)
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null)
  const [autoSubmitTrigger, setAutoSubmitTrigger] = useState(false)

  const questions = useMemo(() => quiz?.questions ?? [], [quiz?.questions])
  const currentQ = questions[currentIndex]
  const unanswered = questions.filter((q) => !answers[q.id]).length
  const hasTimeLimit = (quiz?.timeLimitMinutes ?? 0) > 0

  const persistAnswers = useCallback(
    (next: Record<string, string>, endsAt?: number) => {
      saveAttempt(quizId, attemptId, next, endsAt ?? timerEndsAtRef.current ?? undefined)
      setSavedAt(new Date())
    },
    [quizId, attemptId]
  )

  useEffect(() => {
    if (step !== 'quiz' || !quiz) return
    const id = setInterval(() => {
      persistAnswers(answers)
    }, AUTOSAVE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [step, quiz, answers, persistAnswers])

  // Initialize timer once when entering quiz (with time limit). Use saved deadline on resume, else set new.
  useEffect(() => {
    if (step !== 'quiz' || !quiz?.timeLimitMinutes) {
      if (step !== 'quiz') timerInitializedRef.current = false
      return
    }
    if (timerInitializedRef.current) return
    timerInitializedRef.current = true
    const savedData = loadSavedAttempt(quizId, attemptId)
    const now = Date.now()
    const limitMs = quiz.timeLimitMinutes * 60 * 1000
    if (savedData?.timerEndsAt != null && savedData.timerEndsAt > now) {
      timerEndsAtRef.current = savedData.timerEndsAt
    } else {
      timerEndsAtRef.current = now + limitMs
      saveAttempt(quizId, attemptId, answers, timerEndsAtRef.current)
    }
    const initialRemaining = Math.max(0, Math.ceil((timerEndsAtRef.current - now) / 1000))
    setSecondsRemaining(initialRemaining)
  }, [step, quiz?.id, quiz?.timeLimitMinutes, quizId, attemptId, answers])

  // Countdown: update every second; auto-submit when time reaches 0
  useEffect(() => {
    if (step !== 'quiz' || secondsRemaining === null || !hasTimeLimit) return
    if (secondsRemaining <= 0) {
      queueMicrotask(() => setAutoSubmitTrigger(true))
      return
    }
    const id = setInterval(() => {
      const endsAt = timerEndsAtRef.current
      if (endsAt == null) return
      const rem = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000))
      setSecondsRemaining(rem)
      if (rem <= 0) setAutoSubmitTrigger(true)
    }, 1000)
    return () => clearInterval(id)
  }, [step, secondsRemaining, hasTimeLimit])

  // Auto-submit when timer expired (defer setState to avoid synchronous cascading renders)
  useEffect(() => {
    if (!autoSubmitTrigger || step !== 'quiz' || !quiz) return
    const correct = questions.filter((q) => answers[q.id] === q.correctId).length
    const score = questions.length ? Math.round((correct / questions.length) * 100) : 0
    const passed = score >= (quiz.passScorePercent ?? 60)
    queueMicrotask(() => {
      setResult({ score, passed })
      setStep('results')
      setAutoSubmitTrigger(false)
    })
  }, [autoSubmitTrigger, step, quiz, questions, answers])

  const handleAnswer = (questionId: string, optionId: string) => {
    const next = { ...answers, [questionId]: optionId }
    setAnswers(next)
    persistAnswers(next)
  }

  const handleSubmit = () => {
    setShowSubmitConfirm(true)
  }

  const confirmSubmit = () => {
    setShowSubmitConfirm(false)
    const correct = questions.filter((q) => answers[q.id] === q.correctId).length
    const score = questions.length ? Math.round((correct / questions.length) * 100) : 0
    const passed = score >= (quiz?.passScorePercent ?? 60)
    setResult({ score, passed })
    setStep('results')
  }

  if (!quiz) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-4">
        <p className="text-gray-500 dark:text-gray-400">Quiz not found.</p>
        <Link href="/dashboard/learner/quiz" className="ml-2 text-primary hover:underline">
          Back to Assessments
        </Link>
      </div>
    )
  }

  if (step === 'intro') {
    return (
      <div className="mx-auto max-w-lg space-y-6 p-4">
        <Link
          href="/dashboard/learner/quiz"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary"
        >
          <ArrowLeft className="size-4" /> Back to Assessments
        </Link>
        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{quiz.title}</h1>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{quiz.instructions}</p>
          {quiz.timeLimitMinutes != null && (
            <p className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="size-4" /> Time limit: {quiz.timeLimitMinutes} minutes
            </p>
          )}
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {questions.length} question{questions.length !== 1 ? 's' : ''}
          </p>
          <button
            type="button"
            onClick={() => setStep('quiz')}
            className="mt-6 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            Start
          </button>
        </div>
      </div>
    )
  }

  if (step === 'results' && result) {
    return (
      <div className="mx-auto max-w-lg space-y-6 p-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 text-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{quiz.title}</h1>
          <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">{result.score}%</p>
          <p
            className={`mt-2 flex items-center justify-center gap-2 text-sm font-semibold ${result.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
          >
            {result.passed ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
            {result.passed ? 'Passed' : 'Not passed'}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Pass mark: {quiz.passScorePercent}%
          </p>
          {(quiz.feedbackWhen === 'instant' || quiz.feedbackWhen === 'after_submit') && (
            <Link
              href={`/dashboard/learner/quiz/${quizId}/feedback?attempt=${encodeURIComponent(attemptId)}`}
              className="mt-4 inline-block w-full rounded-xl border border-primary py-3 text-sm font-semibold text-primary hover:bg-primary/10"
            >
              View feedback
            </Link>
          )}
          <Link
            href="/dashboard/learner/quiz"
            className="mt-3 inline-block w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            Back to Assessments
          </Link>
        </div>
      </div>
    )
  }

  if (step === 'quiz' && currentQ) {
    const isLast = currentIndex >= questions.length - 1
    const showInstantFeedback = quiz.feedbackWhen === 'instant' && answers[currentQ.id]
    const timeCritical = secondsRemaining != null && secondsRemaining > 0 && secondsRemaining <= 60

    return (
      <div className="mx-auto max-w-lg space-y-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link
            href="/dashboard/learner/quiz"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
          >
            <ArrowLeft className="size-4" /> Exit
          </Link>
          <div className="flex items-center gap-3">
            {hasTimeLimit && secondsRemaining !== null && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm font-medium tabular-nums ${secondsRemaining === 0
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200'
                  : timeCritical
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                  }`}
              >
                <Clock className="size-4 shrink-0" />
                {secondsRemaining === 0 ? 'Time\'s up' : formatTimeLeft(secondsRemaining)}
              </span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
        </div>

        {savedAt && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400">Saved</p>
        )}

        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-5">
          <p className="font-medium text-gray-900 dark:text-gray-100">{currentQ.question}</p>
          <ul className="mt-4 space-y-2">
            {currentQ.options.map((opt) => {
              const selected = answers[currentQ.id] === opt.id
              const showCorrect = showInstantFeedback && opt.id === currentQ.correctId
              const showWrong = showInstantFeedback && selected && opt.id !== currentQ.correctId
              return (
                <li key={opt.id}>
                  <button
                    type="button"
                    onClick={() => !showInstantFeedback && handleAnswer(currentQ.id, opt.id)}
                    disabled={!!showInstantFeedback}
                    className={`w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${showCorrect
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200'
                      : showWrong
                        ? 'border-rose-400 bg-rose-50 dark:bg-rose-900/30 text-rose-800 dark:text-rose-200'
                        : selected
                          ? 'border-primary bg-primary/10 text-gray-900 dark:text-gray-100'
                          : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
                      }`}
                  >
                    {opt.label}
                  </button>
                </li>
              )
            })}
          </ul>
          {showInstantFeedback && currentQ.explanation && (
            <p className="mt-4 rounded-lg bg-gray-100 dark:bg-gray-700/50 p-3 text-sm text-gray-700 dark:text-gray-300">
              {currentQ.explanation}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm font-semibold disabled:opacity-50"
          >
            Previous
          </button>
          {isLast ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              Submit
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="flex-1 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white hover:bg-primary-hover flex items-center justify-center gap-2"
            >
              Next <ChevronRight className="size-4" />
            </button>
          )}
        </div>
      </div>
    )
  }

  if (showSubmitConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="w-full max-w-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 shadow-lg">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Submit?</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to submit?
          </p>
          {unanswered > 0 && (
            <p className="mt-2 text-sm font-medium text-amber-700 dark:text-amber-400">
              Review unanswered: {unanswered} question{unanswered !== 1 ? 's' : ''} not answered. Submit anyway?
            </p>
          )}
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setShowSubmitConfirm(false)}
              className="flex-1 rounded-lg border border-gray-200 dark:border-gray-600 py-2.5 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmSubmit}
              className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
